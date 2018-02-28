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

namespace MullerWA.Controllers
{

    [TokenValidation]
    public class PlacasController : ApiController
    {
        static readonly IMovsRepository repository = new MovsRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int page = Convert.ToInt32(queryValues["page"]);
            int start = Convert.ToInt32(queryValues["start"]);
            int limit = Convert.ToInt32(queryValues["limit"]);
            int id = Convert.ToInt32(queryValues["id"]);

            string query = !string.IsNullOrWhiteSpace(queryValues["query"]) ? queryValues["query"] : "";

            int totalRecords = 0;
            string errMsg = "";

            object json;
            IList<Placa> lista;

            lista = repository.GetPlacas(query, page, start, limit, ref totalRecords, ref errMsg);

            json = new
            {
                total = totalRecords,
                data = lista,
                success = true
            };

            return json;

        }
    }
}