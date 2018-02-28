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

    //[TokenValidation]
    public class ViewResumenEquiposController : ApiController
    {
        static readonly IEquiposRepository repository = new EquiposRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int totalRecords = 0;

            try
            {
                object json;
                string msgError = "";
                IList<EquipoVisor> lista;

                lista = repository.GetListVisor(ref totalRecords, ref msgError);

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