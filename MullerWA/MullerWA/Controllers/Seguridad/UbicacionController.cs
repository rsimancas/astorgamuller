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
using System.Reflection;

namespace MullerWA.Controllers
{

    [TokenValidation]
    public class UbicacionController : ApiController
    {
        static readonly IMovsRepository repository = new MovsRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int page = Convert.ToInt32(queryValues["page"]);
            int limit = Convert.ToInt32(queryValues["limit"]);
            int start = page * limit;
            string query = queryValues["query"];

            int totalRecords = 0;
            string errMsg = "";

            try
            {
                
                object json;
                IList<Ubicacion> lista;

                lista = repository.GetListUbicaciones(query, ref totalRecords, ref errMsg);
                   
                json = new
                {
                    total = totalRecords,
                    data = lista,
                    success = true
                };

                return json;
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                object error = new { message = ex.Message };

                object json = new
                {
                    message = ex.Message,
                    success = false
                };

                return json;
            }
        }

    }
}