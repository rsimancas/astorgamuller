using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IGastosGruposItemsRepository
    {
        //IList<GastosGrupoItem> GetList(int page, int start, int limit, ref int totalRecords);
        IList<GastosGrupoItem> GetWithQuery(string query, Sort sort, int page, int start, int limit, ref int totalRecords);
        
        GastosGrupoItem Get(int id);
        GastosGrupoItem Add(GastosGrupoItem customer, ref string msgError);
        bool Remove(GastosGrupoItem customer, ref string msgError);
        GastosGrupoItem Update(GastosGrupoItem customer, ref string msgError);
    }
}
