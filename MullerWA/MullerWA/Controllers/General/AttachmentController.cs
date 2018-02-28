using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using MullerWA.Models;
using Utilidades;
using System.Web;
using System.IO;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace MullerWA.Controllers
{
    //[TokenValidation]
    public class AttachmentController : ApiController
    {
        static readonly IUploadsRepository repository = new UploadsRepository();

        public HttpResponseMessage Post()
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            var nvc = httpRequest.Form;

            try
            {

                int movId = Convert.ToInt32(nvc["MovId"]);
                string movViaje = nvc["MovViaje"];
                string imagen = nvc["Imagen"];

                string[] strSplit = imagen.Split(',');

                imagen = strSplit[1];
                imagen = imagen.Replace("data:image/jpeg;base64,", "");
                imagen = imagen.Replace("data:image/png;base64,", "");
                imagen = imagen.Replace("data:image/jpg;base64,", "");
                imagen = imagen.Replace("data:image/gif;base64,", "");
                imagen = imagen.Replace(" ", "+");
                imagen = imagen.Replace('-', '+');
                imagen = imagen.Replace('_', '/');

                string filename = movViaje + ".jpg";
                string ext = Path.GetExtension(filename).ToLower();
                string contenttype = "image/jpg";

                byte[] encodedByte = Convert.FromBase64String(imagen);

                string errMsg = "";

                repository.InsertUpdateData(movId, filename, contenttype, encodedByte, ref errMsg);

                object json = new
                {
                    success = true,
                    message = "Successfull"
                };

                result = Request.CreateResponse(HttpStatusCode.Created, json);

            }
            catch (Exception ex)
            {
                LogManager.Write(ex.Message);
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            return result;

        }

        #region old post
        private HttpResponseMessage OldPost()
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            var nvc = httpRequest.Form;

            //LogManager.Write(httpRequest.Params.AllKeys[2].ToString());

            int movId = Convert.ToInt32(nvc["MovId"]);
            string movViaje = nvc["MovViaje"];

            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<string>();
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];

                    string filename = postedFile.FileName;
                    string ext = Path.GetExtension(filename).ToLower();
                    string contenttype = String.Empty;

                    //Set the contenttype based on File Extension
                    switch (ext)
                    {
                        case ".doc":
                            contenttype = "application/vnd.ms-word";
                            break;
                        case ".docx":
                            contenttype = "application/vnd.ms-word";
                            break;
                        case ".xls":
                            contenttype = "application/vnd.ms-excel";
                            break;
                        case ".xlsx":
                            contenttype = "application/vnd.ms-excel";
                            break;
                        case ".jpg":
                            contenttype = "image/jpg";
                            break;
                        case ".png":
                            contenttype = "image/png";
                            break;
                        case ".gif":
                            contenttype = "image/gif";
                            break;
                        case ".pdf":
                            contenttype = "application/pdf";
                            break;
                    }

                    filename = movViaje + ext;

                    Stream fs = postedFile.InputStream;
                    BinaryReader br = new BinaryReader(fs);
                    Byte[] bytes = br.ReadBytes((Int32)fs.Length);

                    string errMsg = "";

                    repository.InsertUpdateData(movId, filename, contenttype, bytes, ref errMsg);
                    //var filePath = HttpContext.Current.Server.MapPath("~/images/" + postedFile.FileName);
                    //postedFile.SaveAs(filePath);

                    //docfiles.Add(filePath);
                }
                object json = new
                {
                    success = true,
                    message = "Successfull"
                };

                result = Request.CreateResponse(HttpStatusCode.Created, json);

                return result;
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return result;
        }
        #endregion old post

        public HttpResponseMessage Get(int id)
        {
            byte[] buffer = null;
            int movId = id;
            string errMsg = "";
            string contentType = "";

            if (movId != 0)
            {
                buffer = repository.GetImage(movId, ref contentType, ref errMsg);
            }

            MemoryStream ms = new MemoryStream(buffer);
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new StreamContent(ms);
            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(contentType);
            return response;
        }

        //private ImageSource GetImage(byte[] imageData, System.Windows.Media.PixelFormat format, int width = 640, int height = 480)
        //{

        //    return System.Windows.Media.Imaging.BitmapSource.Create(width, height, 96, 96, format, null, imageData, width * format.BitsPerPixel / 8);
        //}

        //private ImageSource GetImage(byte[] imageData, PixelFormat format, int width = 640, int height = 480)
        //{
        //    using (MemoryStream memoryStream = new MemoryStream())
        //    {
        //        PngBitmapEncoder encoder = new PngBitmapEncoder();
        //        encoder.Interlace = PngInterlaceOption.On;
        //        encoder.Frames.Add(BitmapFrame.Create(BitmapSource.Create(width, height, 96, 96, format, null, imageData, width * format.BitsPerPixel / 8)));
        //        encoder.Save(memoryStream);
        //        BitmapImage imageSource = new BitmapImage();
        //        imageSource.BeginInit();
        //        imageSource.StreamSource = memoryStream;
        //        imageSource.EndInit();
        //        return imageSource;
        //    }
        //}
    }
}