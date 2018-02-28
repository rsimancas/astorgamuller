using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IRolesRepository
    {
        //List<tblJobHeader> GetAll();
        Roles Get(int id, ref string errMsg);
        Roles Add(Roles role, ref string errMsg);
        bool Remove(Roles role, ref string errMsg);
        Roles Update(Roles role, ref string errMsg);
        IList<Roles> GetList(string query, Sort sort, int orden,int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
