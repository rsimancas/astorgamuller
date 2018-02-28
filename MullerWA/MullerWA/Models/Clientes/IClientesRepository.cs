using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IClientesRepository
    {
        //IList<Cliente> GetList(int page, int start, int limit, ref int totalRecords);
        IList<Cliente> GetWithQuery(string query, Sort sort, int page, int start, int limit, ref int totalRecords);
        
        Cliente Get(int id);
        Cliente Add(Cliente customer, ref string msgError);
        bool Remove(Cliente customer, ref string msgError);
        Cliente Update(Cliente customer, ref string msgError);
    }
}
