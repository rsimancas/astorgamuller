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
    public class GetPreviousDateController : ApiController
    {
        static readonly IResourcesRepository repository = new ResourcesRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int daysAgo = Convert.ToInt32(queryValues["daysAgo"]);

            daysAgo = (daysAgo == 0) ? 1 : daysAgo;

            string errMsg = "";

            try
            {
                    Nullable<DateTime> previousDate = repository.GetPreviousDate(daysAgo, ref errMsg);
                   
                    object json = new
                    {
                        total = 1,
                        data = previousDate,
                        success = previousDate == null ? false : true,
                        message = errMsg
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