using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface ICiudadesRepository
    {
        Ciudad Get(int id, ref string errMsg);
        Ciudad Add(Ciudad ciudad, ref string errMsg);
        bool Remove(Ciudad ciudad, ref string errMsg);
        Ciudad Update(Ciudad ciudad, ref string errMsg);
        IList<Ciudad> GetList(string query, Sort sort, bool iata, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
