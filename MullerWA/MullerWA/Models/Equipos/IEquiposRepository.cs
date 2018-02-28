using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IEquiposRepository
    {
        Equipo Get(int id, ref string errMsg);
        Equipo Add(Equipo estatus, ref string errMsg);
        bool Remove(Equipo estatus, ref string errMsg);
        Equipo Update(Equipo estatus, ref string errMsg);
        IList<Equipo> GetList(string query, Sort sort, int noAsignado, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
        IList<EquipoVisor> GetListVisor(ref int totalRecords, ref string errorMsg);
    }
}
