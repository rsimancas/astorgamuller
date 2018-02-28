using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IEstatusRepository
    {
        //List<tblJobHeader> GetAll();
        Estatus Get(int id, ref string errMsg);
        Estatus Add(Estatus estatus, ref string errMsg);
        bool Remove(Estatus estatus, ref string errMsg);
        Estatus Update(Estatus estatus, ref string errMsg);
        IList<Estatus> GetList(bool fallido, string query, Sort sort, string tipo, int orden,int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
