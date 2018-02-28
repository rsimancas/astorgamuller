using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IGastosItemsRepository
    {
        //IList<GastosItem> GetList(int page, int start, int limit, ref int totalRecords);
        IList<GastosItem> GetWithQuery(string query, Sort sort, int page, int start, int limit, ref int totalRecords);
        
        GastosItem Get(int id);
        GastosItem Add(GastosItem customer, ref string msgError);
        bool Remove(GastosItem customer, ref string msgError);
        GastosItem Update(GastosItem customer, ref string msgError);
    }
}
