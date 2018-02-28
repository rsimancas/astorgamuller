using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface ISecuenciasRepository
    {
        Secuencias Get(int id, ref string errMsg);
        Secuencias Add(Secuencias data, ref string errMsg);
        bool Remove(Secuencias data, ref string errMsg);
        Secuencias Update(Secuencias data, ref string errMsg);
        IList<Secuencias> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
