using MullerWA.Models;
//using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using Utilidades;

namespace MullerWA.Areas.Reports.Controllers
{
    public class GetExcelController : Controller
    {
        static readonly IUsuariosRepository userRepository = new UsuariosRepository();
        static NameValueCollection queryValues = null;
        static string currentUser = "";

        //
        // GET: /Reports/QuoteCustomer/
        public ActionResult Index()
        {

            queryValues = Request.QueryString;
            //string pdfFile = Path.Combine(Path.GetTempPath(), queryValues["_file"] + ".xlsx");
            string file = Path.Combine(Request.MapPath("~/App_Data/Temp/"), queryValues["_file"] + ".xlsx");

            byte[] b = new byte[1024];

            // Open the stream and read it back. 
            try
            {
                b = Utils.ReadFile(file);
                System.IO.File.Delete(file);
            }
            catch (Exception ex)
            {
                LogManager.Write(ex.Message);
                return RedirectToAction("Error");
            }

            Response.ClearContent();
            Response.Buffer = true;

            return File(b, "application/ms-excel", "ReporteMovimientos.xlsx");

        }

        public ActionResult Error()
        {
            return View();
        }

    }
}

