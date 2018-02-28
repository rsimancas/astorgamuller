//using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using MullerWA.Models;
using Utilidades;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Specialized;
using System.Web.Security;
using System.IO;

namespace MullerWA.Areas.Reports.Controllers
{
    public class GetPDFController : Controller
    {
        static readonly IUsuariosRepository userRepository = new UsuariosRepository();
        static NameValueCollection queryValues = null;
        static string currentUser = "";

        //
        // GET: /Reports/QuoteCustomer/
        public ActionResult Index()
        {

            //dynamic objPB = Activator.CreateInstance(Type.GetTypeFromProgID("XStandard.MD5"));
            //string key = "que clave tan hija de puta ?";
            //LogManager.Write(Utils.GetMd5Hash(key));
            //Utils.ReadDBFUsingOdbc();
            //if (!CheckToken(Request.Headers))
            //{
            //    return RedirectToAction("Error");
            //}
            //return RedirectToAction("GetPDF");

            queryValues = Request.QueryString;
            string pdfFile = Path.Combine(Path.GetTempPath(), queryValues["_file"] + ".pdf");

            byte[] b = new byte[1024];

            // Open the stream and read it back. 
            try
            {
                b = Utils.ReadFile(pdfFile);
                System.IO.File.Delete(pdfFile);
            }
            catch (Exception ex)
            {
                LogManager.Write(ex.Message);
                return RedirectToAction("Error");
            }

            return File(b, "application/pdf");

        }

        private bool CheckToken(NameValueCollection headers)
        {
            string token;

            try
            {
                token = headers.GetValues("Authorization-Token").First();
            }
            catch (Exception)
            {
                return false;
            }

            try
            {
                string[] split = token.Split(',');

                string usrName = Utils.Decrypt(split[0]);
                string usrPwd = Utils.Decrypt(split[1]);

                var userLogged = userRepository.ValidLogon(usrName, usrPwd);

                if (userLogged == null)
                {
                    return false;
                };

                currentUser = userLogged.UsuarioId;
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public ActionResult Error()
        {
            return View();
        }

    }
}

