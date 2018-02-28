using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Utilidades;
using Helpers;
using System.Reflection;

namespace MullerWA.Models
{
    public class EquiposRepository : IEquiposRepository
    {

        #region General
        public IList<Equipo> GetList(string query, Sort sort, int noAsignado, int page, int start, int limit, ref int totalRecords, ref string errMsg)
        {
            limit = limit + start;

            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            string wherepage = (page != 0) ? String.Format("row>{0} and row<={1} ", start, limit) : "1=1";
            string where = (noAsignado == 1) ? "dbo.fn_EstatusEquipo(EquipoId) IN ('COMPLETADO','FALLIDO','DISPONIBLE')" : "1=1";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "EquipoNum+ISNULL(EquipoPlaca,'')+ISNULL(EquipoSerial,'')";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Ordenamiento
            string order = "EquipoNum";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = "SELECT * FROM ( " +
                         "SELECT *, RTRIM(EquipoNum) + ' (' + RTRIM(EquipoPlaca) + ')' as x_EquipoPlaca, " +
                         "  dbo.fn_EstatusEquipo(EquipoId) as x_Estatus, " +
                         "  ROW_NUMBER() OVER (ORDER BY {2} {3}) as row,  " +
                         "  IsNull((select count(*) from Equipos WHERE {0}),0)  as TotalRecords   " +
                         " FROM Equipos WHERE {0}) a  " +
                         " WHERE {1} " +
                         " ORDER BY row";

            sql = String.Format(sql, where, wherepage, order, direction);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                errMsg = ex.Message;
                return null;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            if (totalRecords > 0)
            {

                IList<Equipo> data = EnumExtension.ToList<Equipo>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public Equipo Get(int id, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            };

            Equipo data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Equipo Add(Equipo equipo, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            string sql = "INSERT INTO Equipos ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(equipo, "EquipoId", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int keyGenerated = 0;

            try
            {
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            Equipo data = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Equipo Update(Equipo equipo, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            string sql = "UPDATE Equipos SET {0} WHERE EquipoId = " + equipo.EquipoId.ToString();

            equipo.EquipoFechaModificado = DateTime.Now;
            EnumExtension.setUpdateValues(equipo, "EquipoId", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            Equipo data = Get(equipo.EquipoId, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        private Equipo Get(int id, SqlConnection oConn)
        {
            string sql = "SELECT * FROM Equipos " +
                         " WHERE (EquipoId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<Equipo> data = EnumExtension.ToList<Equipo>(dt);
                return data.FirstOrDefault<Equipo>();
            }

            return null;
        }

        public bool Remove(Equipo equipo, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return false;
            };

            bool result;
            try
            {
                result = Remove(equipo, oConn);
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return false;
            }

            ConnManager.CloseConn(oConn);

            return result;
        }

        private bool Remove(Equipo equipo, SqlConnection oConn)
        {
            string sql = "DELETE FROM Equipos " +
                         " WHERE (EquipoId = {0})";

            sql = String.Format(sql, equipo.EquipoId);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }
        #endregion General

        #region VISOR
        public IList<EquipoVisor> GetListVisor(ref int totalRecords, ref string errMsg)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            //string sql ="with qDatos " +
            //            " AS " +
            //            "( " +
            //            " select dbo.fn_EstatusEquipo(EquipoId) as Estatus, " +
            //            "  dbo.fn_UbicacionEquipo(EquipoId) as Ubicacion " +
            //            " from Equipos " +
            //            " Where EquipoSerial<>'INACTIVO' " +
            //            ") " +
            //            "select (CASE a.EstatusNombre WHEN 'COMPLETADO' THEN 'DISPONIBLE' ELSE a.EstatusNombre END) as Estatus," +
            //            "       ISNULL(b.Cantidad,0) as Cantidad, " +
            //            "       (CASE a.EstatusNombre WHEN 'COMPLETADO' THEN 0 ELSE a.EstatusOrden END) as orden  " +
            //            "from Estatus a " +
            //            "left outer join (select Estatus,COUNT(*) as cantidad from qDatos group by Estatus) as b on a.EstatusNombre=b.Estatus " +
            //            "where a.EstatusTipo='D' " +
            //            "order by orden";

            string sql = "with qDatos " +
                        " AS  " +
                        " (  " +
                        " select dbo.fn_EstatusEquipo(EquipoId) as Estatus,  " +
                        "   dbo.fn_UbicacionEquipo(EquipoId) as Ubicacion  " +
                        "  from Equipos  " +
                        "  Where EquipoSerial<>'INACTIVO'  " +
                        " )  " +
                        " select (CASE a.EstatusNombre WHEN 'COMPLETADO' THEN 'DISPONIBLE' ELSE a.EstatusNombre END) as Estatus, " +
                        "        ISNULL(b.Cantidad,0) as Cantidad,  " +
                        "        (CASE a.EstatusNombre WHEN 'COMPLETADO' THEN 0 ELSE a.EstatusOrden END) as orden, " +
                        "        (SELECT COUNT(*) from qDatos p where p.Estatus=a.EstatusNombre and p.Ubicacion='PLANTA' ) as PLANTA, " +
                        "        (SELECT COUNT(*) from qDatos f where f.Estatus=a.EstatusNombre and f.Ubicacion<>'PLANTA' ) as FERRARI   " +
                        " from Estatus a  " +
                        " left outer join (select Estatus,COUNT(*) as cantidad from qDatos group by Estatus) as b on a.EstatusNombre=b.Estatus  " +
                        " where a.EstatusTipo='D'  " +
                        " order by orden";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                errMsg = ex.Message;
                return null;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            if (totalRecords > 0)
            {

                IList<EquipoVisor> data = EnumExtension.ToList<EquipoVisor>(dt);
                totalRecords = Convert.ToInt32(dt.Rows.Count);
                return data;
            }
            else
            {
                return null;
            }
        }
        #endregion VISOR

    }
}