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
    public class MovsController : ApiController
    {
        static readonly IMovsRepository repository = new MovsRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int security = Convert.ToInt32(queryValues["security"]);
            int page = Convert.ToInt32(queryValues["page"]);
            int start = Convert.ToInt32(queryValues["start"]);
            int limit = Convert.ToInt32(queryValues["limit"]);
            int id = Convert.ToInt32(queryValues["id"]);
            string tipo = !string.IsNullOrEmpty(queryValues["tipo"]) ? queryValues["tipo"] : "";

            string query = !string.IsNullOrWhiteSpace(queryValues["query"]) ? queryValues["query"] : "";

            string startDate = queryValues["startDate"];
            string endDate = queryValues["endDate"];

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

                    lista = repository.GetList(startDate, endDate, security, tipo, query, sort, page, start, limit, ref totalRecords, ref errMsg);

                    json = new
                    {
                        total = totalRecords,
                        data = lista,
                        success = lista == null ? false : true,
                        message = errMsg
                    };

                    return json;
                }
                else
                {
                    Movs mov = repository.Get(id, ref errMsg);
                    object json;

                    if (mov != null)
                    {
                        json = new
                        {
                            total = totalRecords,
                            data = mov,
                            success = true
                        };
                    }
                    else
                    {
                        json = new
                        {
                            success = false,
                            message = errMsg
                        };
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

        public object Post(Movs mov)
        {
            object json;
            string messageError = "";

            try
            {
                Movs posted = repository.Add(mov, ref messageError);

                if (posted != null)
                {
                    json = new
                    {
                        total = 1,
                        data = posted,
                        success = true
                    };
                }
                else
                {
                    json = new
                    {
                        message = messageError,
                        success = false
                    };
                };
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                object error = new { message = ex.Message };

                json = new
                {
                    message = ex.Message,
                    success = false
                };
            };

            return json;
        }

        public object Put(Movs mov)
        {
            object json;

            try
            {
                string messageError = "";
                mov.MovFechaModificado = DateTime.Now;
                Movs putting = repository.Update(mov, ref messageError);

                if (putting != null)
                {
                    json = new
                    {
                        total = 1,
                        data = putting,
                        success = true
                    };
                }
                else
                {
                    json = new
                    {
                        message = messageError,
                        success = false
                    };
                }
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                json = new
                {
                    message = ex.Message,
                    success = false
                };
            };

            return json;
        }

        public object Delete(Movs mov)
        {
            string errMsg = "";

            bool result = repository.Remove(mov, ref errMsg);

            object json = new
            {
                success = result,
                message = errMsg
            };

            return json;
        }
    }
}