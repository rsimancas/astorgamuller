using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IEstadosRepository
    {
        Estado Get(int id, ref string errMsg);
        Estado Add(Estado estado, ref string errMsg);
        bool Remove(Estado estado, ref string errMsg);
        Estado Update(Estado estado, ref string errMsg);
        IList<Estado> GetList(string query,int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
