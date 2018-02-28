using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IExpedienteRepository
    {
        IList<Expediente> GetList(string query, Sort sort, int id, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
        IList<Expediente> GetPendientes(int id, ref int totalRecords, ref string msgError);
        Expediente Get(int id, ref string errMsg);
        Expediente Add(Expediente estatus, ref string errMsg);
        bool Remove(Expediente estatus, ref string errMsg);
        Expediente Update(Expediente estatus, ref string errMsg);
    }
}
