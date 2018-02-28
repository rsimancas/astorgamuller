using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IHolidaysRepository
    {
        Holiday Get(int id, ref string errMsg);
        Holiday Add(Holiday estatus, ref string errMsg);
        bool Remove(Holiday estatus, ref string errMsg);
        Holiday Update(Holiday estatus, ref string errMsg);
        IList<Holiday> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
