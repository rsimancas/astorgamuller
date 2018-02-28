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
    public class CiudadesRepository : ICiudadesRepository
    {
        public IList<Ciudad> GetList(string query, Sort sort, bool iata, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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
            string where = (iata) ? "(a.CiudadCodigo IS NOT NULL AND a.CiudadCodigo<>'')" : "1=1";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "RTRIM(STR(a.CiudadId))+a.CiudadNombre+ISNULL(a.CiudadMunicipio,'')+ISNULL(a.CiudadCodigo,'')" + 
                    "+ISNULL(b.EstadoNombre,'')";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Ordenamiento
            //string order = (iata) ? "(CASE WHEN a.CiudadCodigo IS NULL THEN 1 ELSE 0 END),a.CiudadCodigo,a.CiudadNombre" : "a.CiudadNombre" ;
            string order = "(CASE WHEN a.CiudadCodigo IS NULL THEN 1 ELSE 0 END),a.CiudadCodigo,a.CiudadNombre";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;

                order = (order == "x_Estado") ? "b.EstadoNombre" : order;
                order = (order == "x_CodigoNombre") ? "(CASE WHEN a.CiudadCodigo IS NULL THEN 1 ELSE 0 END)" : order;

            }

            string sql = "SELECT * FROM ( " +
                         "SELECT a.*,b.EstadoNombre as x_Estado, " +
                         "  RTRIM(a.CiudadCodigo)+' ('+RTRIM(a.CiudadNombre)+')' as x_CodigoNombre, " +
                         "  ROW_NUMBER() OVER (ORDER BY {2} {3}) as row,  " +
                         "  IsNull((select count(*) from Ciudades a LEFT JOIN Estados b ON a.EstadoId=b.EstadoId WHERE {0}),0)  as TotalRecords   " +
                         " FROM Ciudades a LEFT JOIN Estados b ON a.EstadoId=b.EstadoId WHERE {0}) a  " +
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

                IList<Ciudad> data = EnumExtension.ToList<Ciudad>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public Ciudad Get(int id, ref string msgError)
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

            Ciudad data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Ciudad Add(Ciudad ciudad, ref string msgError)
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

            string sql = "INSERT INTO Ciudades ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(ciudad, "CiudadId", ref sql);

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

            Ciudad data = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Ciudad Update(Ciudad ciudad, ref string msgError)
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

            string sql = "UPDATE Ciudades SET {0} WHERE CiudadId = " + ciudad.CiudadId.ToString();

            EnumExtension.setUpdateValues(ciudad, "CiudadId", ref sql);

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

            Ciudad data = Get(ciudad.CiudadId, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        private Ciudad Get(int id, SqlConnection oConn)
        {
            string sql = "SELECT * FROM Ciudades " +
                         " WHERE (CiudadId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<Ciudad> data = EnumExtension.ToList<Ciudad>(dt);
                return data.FirstOrDefault<Ciudad>();
            }

            return null;
        }

        public bool Remove(Ciudad ciudad, ref string msgError)
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
                result = Remove(ciudad, oConn);
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

        private bool Remove(Ciudad ciudad, SqlConnection oConn)
        {
            string sql = "DELETE FROM Ciudades " +
                         " WHERE (CiudadId = {0})";

            sql = String.Format(sql, ciudad.CiudadId);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

    }
}