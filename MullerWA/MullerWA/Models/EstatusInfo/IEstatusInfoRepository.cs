using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IEstatusInfoRepository
    {
        EstatusInfo Get(int id, ref string errMsg);
        EstatusInfo Add(EstatusInfo estatus, ref string errMsg);
        bool Remove(EstatusInfo estatus, ref string errMsg);
        EstatusInfo Update(EstatusInfo estatus, ref string errMsg);
        IList<EstatusInfo> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
