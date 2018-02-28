using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IPaisesRepository
    {
        Pais Get(int id, ref string errMsg);
        Pais Add(Pais pais, ref string errMsg);
        bool Remove(Pais pais, ref string errMsg);
        Pais Update(Pais pais, ref string errMsg);
        IList<Pais> GetList(string query,int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
