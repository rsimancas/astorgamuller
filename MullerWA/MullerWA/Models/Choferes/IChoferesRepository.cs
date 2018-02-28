using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IChoferesRepository
    {
        //IList<Chofer> GetList(int page, int start, int limit, ref int totalRecords);
        IList<Chofer> GetWithQuery(string query, Sort sort, int page, int start, int limit, ref int totalRecords);
        
        Chofer Get(int id);
        Chofer Add(Chofer chofer, ref string msgError);
        bool Remove(Chofer chofer, ref string msgError);
        Chofer Update(Chofer chofer, ref string msgError);
    }
}
