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
    public class ViewDistribucionController : ApiController
    {
        static readonly IMovsRepository repository = new MovsRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int page = Convert.ToInt32(queryValues["pagenum"]);
            //int start = Convert.ToInt32(queryValues["recordstartindex"]);
            int limit = Convert.ToInt32(queryValues["pagesize"]);
            int start = page * limit;

            if(!String.IsNullOrEmpty(queryValues["pagenum"]))
                page += 1;

            int id = Convert.ToInt32(queryValues["id"]);

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

            try
            {
                if (id == 0)
                {
                    object json;
                    IList<Movs> lista;

                    lista = repository.GetListVisorDist(query, sort, page, start, limit, ref totalRecords, ref errMsg);
                   
                    json = new
                    {
                        total = totalRecords,
                        data = lista,
                        success = true
                    };

                    return json;
                }
                else
                {
                    Movs mov = repository.GetDistSecurity(id, ref errMsg);
                    object json;

                    if (mov != null)
                    {
                        json = new
                        {
                            total = 1,
                            data = mov,
                            success = true
                        };
                    }
                    else
                    {
                        throw new Exception(errMsg);
                    }

                    return json;
                }
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