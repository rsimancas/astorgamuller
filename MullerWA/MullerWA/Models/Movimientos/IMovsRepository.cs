using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IMovsRepository
    {
        //List<tblJobHeader> GetAll();
        Movs Get(int id, ref string errMsg);
        Movs Add(Movs mov, ref string errMsg);
        bool Remove(Movs mov, ref string errMsg);
        Movs Update(Movs mov, ref string errMsg);
        IList<Movs> GetList(int security, string tipo, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
        IList<Chofer> GetChoferes(string query, int page, int start, int limit, ref int totalRecords, ref string errMsg);
        IList<Placa> GetPlacas(string query, int page, int start, int limit, ref int totalRecords, ref string errMsg);
        IList<Origen> GetOrigenes(string query, int page, int start, int limit, ref int totalRecords, ref string errMsg);

        MovSeguridad Update(MovSeguridad mov, ref string errMsg);
        IList<Ubicacion> GetListUbicaciones(string query, ref int totalRecords, ref string errMsg);
        IList<Ubicacion> GetListUbicacionesTransito(string query, int movId, ref int totalRecords, ref string errMsg);

        IList<Movs> GetListVisorDist(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
        IList<ResumenGraficoMes> GetDataGraficoResumenMeses(ref int totalRecords, ref string errorMsg);
        IList<ResumenMeses> GetResumenUltimoMes(ref int totalRecords, ref string errorMsg);
        IList<ResumenSemanaMeses> GetResumenSemanaMeses(ref int totalRecords, ref string errorMsg);
        IList<ResumenMapa> GetResumenMapa(ref int totalRecords, ref string errorMsg);
        Movs GetDistSecurity(int id, ref string errMsg);

        IList<Reparto> GetListRepartos(int movId, ref int totalRecords, ref string errMsg);
        Reparto Update(Reparto rep, ref string errMsg);
    }
}
