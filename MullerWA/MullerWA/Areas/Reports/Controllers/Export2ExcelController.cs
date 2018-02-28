using Helpers;
using MullerWA.Models;
using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;
using Utilidades;

namespace MullerWA.Areas.Reports.Controllers
{
    public class Export2ExcelController : Controller
    {
        static readonly IUsuariosRepository userRepository = new UsuariosRepository();
        static readonly IMovsRepository movsRepository = new MovsRepository();
        static NameValueCollection queryValues = null;
        static Usuario currentUser = null;

        //
        // GET: /Reports/QuoteCustomer/
        public ActionResult Index()
        {
            if (!CheckToken(Request.Headers))
            {
                LogManager.Write("ERROR TOKEN");
                return RedirectToAction("Error");
            }

            queryValues = Request.QueryString;

            try
            {
                int security = Convert.ToInt32(queryValues["security"]);
                int page = Convert.ToInt32(queryValues["page"]);
                int start = Convert.ToInt32(queryValues["start"]);
                int limit = Convert.ToInt32(queryValues["limit"]);
                int id = Convert.ToInt32(queryValues["id"]);
                string tipo = !string.IsNullOrEmpty(queryValues["tipo"]) ? queryValues["tipo"] : "";

                string query = !string.IsNullOrWhiteSpace(queryValues["query"]) ? queryValues["query"] : "";

                #region Configuramos el orden de la consulta si se obtuvo como parametro
                string strOrder = !string.IsNullOrWhiteSpace(queryValues["sort"]) ? queryValues["sort"] : "";
                strOrder = strOrder.Replace('[', ' ');
                strOrder = strOrder.Replace(']', ' ');

                Sort sort;

                if (!string.IsNullOrWhiteSpace(strOrder))
                {
                    sort = JsonConvert.DeserializeObject<Sort>(strOrder);
                }
                else
                {
                    sort = new Sort();
                }
                #endregion

                int totalRecords = 0;
                string errMsg = "";

                var lista = movsRepository.GetList(security, tipo, query, sort, page, start, limit, ref totalRecords, ref errMsg);
                
                LocalReport lr = new LocalReport();

                lr.DataSources.Clear();
                lr.DataSources.Add(new ReportDataSource("dsMovimientos", lista));
                lr.ReportPath = "bin/Areas/Reports/ReportDesign/ReporteMovimientos.rdlc";

                string reportType = "EXCELOPENXML";
                string mimeType;
                string encoding;
                string fileNameExtension;

                string deviceInfo =
                "<DeviceInfo>" +
                "  <OutputFormat>" + id + "</OutputFormat>" +
                "  <PageWidth>8.5in</PageWidth>" +
                "  <PageHeight>11in</PageHeight>" +
                "  <MarginTop>0.2in</MarginTop>" +
                "  <MarginLeft>0.2in</MarginLeft>" +
                "  <MarginRight>0.2in</MarginRight>" +
                "  <MarginBottom>0.2in</MarginBottom>" +
                "</DeviceInfo>";

                Warning[] warnings;
                string[] streams;
                byte[] bytes;

                bytes = lr.Render(
                    reportType,
                    deviceInfo,
                    out mimeType,
                    out encoding,
                    out fileNameExtension,
                    out streams,
                    out warnings);

                string fileName = Utils.GetTempFileNameWithExt("xlsx");
                FileStream fs = new FileStream(fileName, FileMode.OpenOrCreate);
                fs.Write(bytes, 0, bytes.Length);
                fs.Close();

                return Content(Path.GetFileNameWithoutExtension(fileName));
                //return File(bytes, "application/vnd.ms-excel", "Movimientos.xlsx");
            }
            catch (Exception ex)
            {
                LogManager.Write(ex.Message);
                return RedirectToAction("Error");
            }
        }

        public ActionResult Error()
        {
            return View();
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

                currentUser = userLogged;
            }
            catch (Exception ex)
            {
                LogManager.Write(ex.Message);
                return false;
            }

            return true;
        }

    }
}

