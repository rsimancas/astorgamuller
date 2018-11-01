using Helpers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Reflection;
using Utilidades;

namespace MullerWA.Models
{
    public class MovsRepository : IMovsRepository
    {
        #region General
        public IList<Movs> GetList(string startDate, string endDate, int security, string tipo, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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
            string where = "1=1";

            if (!string.IsNullOrEmpty(startDate))
            {
                DateTime date = DateTime.ParseExact(startDate, "yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal);
                where += string.Format(" AND CAST(MovFechaAsignado as Date) >= '{0}'", date.ToString("yyyy/MM/dd"));
            }
            if (!string.IsNullOrEmpty(endDate))
            {
                DateTime date = DateTime.ParseExact(endDate, "yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal);
                where += string.Format(" AND CAST(MovFechaAsignado as Date) <= '{0}'", date.ToString("yyyy/MM/dd"));
            }

            where += !string.IsNullOrWhiteSpace(tipo) ? " and a.MovTipo='" + tipo + "'" : "";

            where += (security == 1) ? string.Format(" and a.EstatusId<>{0}", EstatusDistribucion.Completado) : "";

            // Verifica estatus de movimiento para cambios automáticos.
            checkStatus(oConn);

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = @"RTRIM(STR(a.MovId)) + ' | ' + ISNULL(a.MovChofer,'') + ' | ' + a.MovViaje + ' | ' + ISNULL(e.ExpNumBL,'') + ' | ' + 
                                      ISNULL(a.MovPlaca,'') + ' | ' + ISNULL(a.MovCedula,'') + ' | ' + ISNULL(a.MovContenedor,'') + ' | ' + ISNULL(a.MovTipoContenedor,'') + ' | ' + 
                                      ISNULL(a.MovOrigen,'') + ' | ' + ISNULL(Cli.Clientes,'') + ' | ' + ISNULL(Ciu.Ciudades,'') + ' | ' + ISNULL(d.EstatusNombre,'') + ' | ' +
                                      ISNULL(f.EquipoNum,'') + ' | ' + ISNULL(f.EquipoPlaca,'')";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Ordenamiento
            string order = "a.MovViaje";
            string direction = "DESC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;

                switch (order) {
                    case "x_Estatus":
                        order = "d.EstatusOrden";
                        break;
                    case "x_ItemOf":
                        order = "a.MovExpItem "+direction+", e.ExpTotal" ;
                        break;
                    case "x_ExpNumBL":
                        order = "e.ExpNumBL";
                        break;
                    case "x_Equipo":
                        order = "f.EquipoNum,f.EquipoPlaca";
                        break;
                    case "x_Cliente":
                        order = "b.ClienteNombre";
                        break;
                }
            }

            string sql = @"WITH qData
                            AS
                            (
	                            SELECT a.*, ISNULL(Ciu.Ciudades,'') as x_Ciudad, d.EstatusNombre as x_Estatus, d.EstatusOrden as x_EstatusOrden, 
                                    ISNULL(e.ExpNumBL,'') as x_ExpNumBL, (CASE WHEN a.MovTieneRepartos=1 THEN Cli.Clientes ELSE b.ClienteNombre END) as x_Cliente, 
                                    e.ExpTotal as x_ExpTotal, RTRIM(f.EquipoNum)+N' ('+f.EquipoPlaca+N')' as x_Equipo, 
                                    (CASE When a.MovTieneRepartos=1 THEN fac.Facturas ELSE a.MovFacturas END) as x_Facturas 
                                FROM Movimientos a 
                                    LEFT JOIN Expediente e on a.ExpId=e.ExpId 
                                    LEFT JOIN Equipos f on a.EquipoId=f.EquipoId 
                                    LEFT JOIN Clientes b on a.ClienteId=b.ClienteId 
                                    LEFT JOIN Ciudades c on a.CiudadId=c.CiudadId 
                                    INNER JOIN Estatus d on a.EstatusId=d.EstatusId 
                                    OUTER APPLY (SELECT dbo.fn_MovFacturas(a.MovId,a.MovFacturas) as Facturas) as fac
                                    OUTER APPLY (SELECT dbo.fn_MovClientes(a.MovId,'') as Clientes) as Cli
                                    OUTER APPLY (SELECT dbo.fn_MovCiudades(a.MovId,c.CiudadCodigo) as Ciudades) as Ciu
                             WHERE {0}
                            )
                            SELECT *
                              FROM  
                               ( SELECT *
                                    ,ROW_NUMBER() OVER (ORDER BY {2} {3}) as row
                                 FROM qData a
	                                cross apply (select COUNT(*) as TotalRecords FROM qData) as t
                                ) a
                            WHERE {1}
                            ORDER BY row";

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
                return new List<Movs>();
            }

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            IList<Movs> data = new List<Movs>();

            if (totalRecords > 0)
            {
                data = EnumExtension.ToList<Movs>(dt);
                foreach (Movs mov in data)
                {
                    mov.x_Repartos = GetRepartos(mov.MovId, oConn);
                }
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
            }
            
            ConnManager.CloseConn(oConn);
            return data;
        }

        public Movs Get(int id, ref string msgError)
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

            SqlTransaction oTX = oConn.BeginTransaction();

            Movs data = Get(id, oConn, oTX);

            oTX.Commit();

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Movs Add(Movs mov, ref string msgError)
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

            // Si el cliente no existe en la base de datos se crea en la base de datos
            //if (mov.ClienteId == null && !string.IsNullOrWhiteSpace(mov.x_Cliente))
            //{
            //    mov.x_Cliente = mov.x_Cliente.Trim();

            //    int? idNewCli = addCliente(mov.x_Cliente, mov, oConn, 0);
            //    if (idNewCli == null)
            //    {
            //        msgError = "No acepta cliente nulo o vacío";
            //        return null;
            //    }

            //    mov.ClienteId = idNewCli;
            //};


            string sql = "INSERT INTO Movimientos ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            mov.MovFechaCreado = DateTime.Now;
            EnumExtension.setListValues(mov, "MovId", ref sql);

            SqlTransaction oTX = oConn.BeginTransaction();
            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            int keyGenerated = 0;

            try
            {
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
                string strComentario = (String.IsNullOrEmpty(mov.MovComentario)) ? "NULL" : "'" + mov.MovComentario + "'";
                string strComentarioInterno = (String.IsNullOrEmpty(mov.MovComentarioInterno)) ? "NULL" : "'" + mov.MovComentarioInterno + "'";
                string strEstaInfoId = (mov.EstaInfoId == null) ? "NULL" : mov.EstaInfoId.ToString();

                sql = String.Format("INSERT INTO EstaInfoDetalle (MovId,EstaInfoId,EInfoDetalleComentario,EInfoDetalleComentarioInterno,EInfoDetalleUsuario,EstatusId) VALUES ({0},{1},{2},{3},'{4}',{5})", keyGenerated, strEstaInfoId, strComentario, strComentarioInterno, mov.MovCreadoPor, mov.EstatusId);
                cmd.CommandText = sql;
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                try
                {
                    oTX.Rollback();
                }
                catch (Exception exRollBack)
                {
                    LogManager.Write(exRollBack.Source + " : " + exRollBack.Message);
                }

                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            Movs data = Get(keyGenerated, oConn, oTX);

            try
            {
                setNumViaje(data, oConn, oTX);

                if (data.MovTipo == "D" && mov.x_Repartos != null)
                {
                    foreach (Reparto rep in mov.x_Repartos) rep.MovId = data.MovId;
                    setRepartos(mov.x_Repartos, data.MovId, oConn, oTX);
                }
            }
            catch (Exception ex)
            {
                try
                {
                    oTX.Rollback();
                }
                catch (Exception exRollBack)
                {
                    LogManager.Write(exRollBack.Source + " : " + exRollBack.Message);
                }

                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            oTX.Commit();

            data.x_Repartos = GetRepartos(data.MovId, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Movs Update(Movs mov, ref string msgError)
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

            string sql = "UPDATE Movimientos SET {0} WHERE MovId = " + mov.MovId.ToString();

            mov.MovFechaModificado = DateTime.Now;
            EnumExtension.setUpdateValues(mov, "MovId", ref sql);

            SqlTransaction oTX = oConn.BeginTransaction();
            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            Movs data = null;

            try
            {
                cmd.ExecuteNonQuery();
                string strComentario = (String.IsNullOrEmpty(mov.MovComentario)) ? "NULL" : "'" + mov.MovComentario + "'";
                string strComentarioInterno = (String.IsNullOrEmpty(mov.MovComentarioInterno)) ? "NULL" : "'" + mov.MovComentarioInterno + "'";
                string strEstaInfoId = (mov.EstaInfoId == null) ? "NULL" : mov.EstaInfoId.ToString();

                sql = String.Format("INSERT INTO EstaInfoDetalle (MovId,EstaInfoId,EInfoDetalleComentario,EInfoDetalleComentarioInterno,EInfoDetalleUsuario,EstatusId) VALUES ({0},{1},{2},{3},'{4}',{5})", mov.MovId, strEstaInfoId, strComentario, strComentarioInterno, mov.MovModificadoPor, mov.EstatusId);
                cmd.CommandText = sql;
                cmd.ExecuteNonQuery();

                if (mov.MovTipo == "D")
                    setRepartos(mov.x_Repartos, mov.MovId, oConn, oTX);
            }
            catch (Exception ex)
            {
                try
                {
                    oTX.Rollback();
                }
                catch (Exception exRollBack)
                {
                    LogManager.Write(exRollBack.Source + " : " + exRollBack.Message);
                }
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            data = Get(mov.MovId, oConn, oTX);
            oTX.Commit();
            
            data.x_Repartos = GetRepartos(data.MovId, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        private Movs Get(int id, SqlConnection oConn, SqlTransaction oTX)
        {
            string sql = "SELECT a.*," +
                         " ISNULL((select count(*) from Repartos r where a.MovId=r.MovId),0) as x_TotalRepartos, " +
                         " d.EstatusNombre as x_Estatus " +
                         "FROM Movimientos a " +
                         " INNER JOIN Estatus d on a.EstatusId=d.EstatusId " +
                         " WHERE (a.MovId = {0})";

            sql = String.Format(sql, id);
            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            SqlDataReader dr;
            DataTable dt = new DataTable();
            dr = cmd.ExecuteReader();
            dt.Load(dr);

            //SqlDataAdapter da = new SqlDataAdapter(sql, oConn);
            //da.SelectCommand.Transaction = oTX;

            //DataSet ds = new DataSet();

            //da.Fill(ds);

            //DataTable dt;
           // dt = ds.Tables[0];

            Movs data = null;
            if (dt.Rows.Count > 0)
            {
                data = EnumExtension.ToList<Movs>(dt).FirstOrDefault<Movs>();
                data.x_Repartos = GetRepartos(data.MovId, oConn, oTX);
            }

            return data;
        }

        public bool Remove(Movs mov, ref string msgError)
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
                result = Remove(mov, oConn);
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

        private bool Remove(Movs mov, SqlConnection oConn)
        {
            string sql = "DELETE FROM Movimientos " +
                         " WHERE (MovId = {0})";

            sql = String.Format(sql, mov.MovId);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

        public IList<Reparto> GetListRepartos(int movid, ref int totalRecords, ref string errMsg)
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

            IList<Reparto> repartos = GetRepartos(movid, oConn);

            totalRecords = (repartos != null) ? repartos.Count : 0;
                
            ConnManager.CloseConn(oConn);

            return repartos;
        }

        private IList<Reparto> GetRepartos(int id, SqlConnection oConn, SqlTransaction oTX)
        {
            string sql = "SELECT a.*,ISNULL(b.ClienteNombre,'N/A') as x_Cliente, c.CiudadCodigo as x_Ciudad " +
                         " FROM Repartos a LEFT JOIN Clientes b on a.ClienteId=b.ClienteId " +
                         "  LEFT JOIN Ciudades c on a.CiudadId = c.CiudadId " +
                         " WHERE (a.MovId = {0}) ";

            sql = String.Format(sql, id);

            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            SqlDataReader dr;
            DataTable dt = new DataTable();
            dr = cmd.ExecuteReader();
            dt.Load(dr);

            if (dt.Rows.Count > 0)
            {
                IList<Reparto> data = EnumExtension.ToList<Reparto>(dt);
                return data;
            }

            return null;
        }

        private IList<Reparto> GetRepartos(int id, SqlConnection oConn)
        {
            string sql = "SELECT a.*,ISNULL(b.ClienteNombre,'N/A') as x_Cliente, c.CiudadCodigo as x_Ciudad " +
                         " FROM Repartos a LEFT JOIN Clientes b on a.ClienteId=b.ClienteId " +
                         "  LEFT JOIN Ciudades c on a.CiudadId = c.CiudadId " +
                         " WHERE (a.MovId = {0}) ";

            sql = String.Format(sql, id);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            SqlDataReader dr;
            DataTable dt = new DataTable();
            dr = cmd.ExecuteReader();
            dt.Load(dr);

            if (dt.Rows.Count > 0)
            {
                IList<Reparto> data = EnumExtension.ToList<Reparto>(dt);
                return data;
            }

            return null;
        }

        public IList<Chofer> GetChoferes(string query, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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
            string where = "1=1";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "MovChofer";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            string sql = "WITH qChoferes (ChoferNombre)  " +
                         " AS " +
                         "( " +
                         "SELECT DISTINCT MovChofer" +
                         " FROM Movimientos " +
                         "WHERE {0} " +
                         ") " +
                         "SELECT a.*, " +
                         "(select top 1 b.MovPlaca from Movimientos b where a.ChoferNombre=b.MovChofer order by b.MovId desc) as ChoferPlaca, " +
                         "(select top 1 b.MovCedula from Movimientos b where a.ChoferNombre=b.MovChofer order by b.MovId desc) as ChoferCedula " +
                         "FROM qChoferes a " +
                         "ORDER BY ChoferNombre";

            sql = String.Format(sql, where);

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

                IList<Chofer> data = EnumExtension.ToList<Chofer>(dt);
                //totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public IList<Placa> GetPlacas(string query, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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
            string where = "1=1";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "MovPlaca";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            string sql = "SELECT DISTINCT MovPlaca as PlacaNombre " +
                         " FROM Movimientos " +
                         " WHERE {0} " +
                         " ORDER BY PlacaNombre";

            sql = String.Format(sql, where);

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

                IList<Placa> data = EnumExtension.ToList<Placa>(dt);
                //totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public IList<Origen> GetOrigenes(string query, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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
            string where = "1=1";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "MovOrigen";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            string sql = "SELECT DISTINCT MovOrigen as MovOrigen " +
                         " FROM Movimientos " +
                         " WHERE {0} " +
                         " ORDER BY MovOrigen";

            sql = String.Format(sql, where);

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

                IList<Origen> data = EnumExtension.ToList<Origen>(dt);
                //totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        private void checkStatus(SqlConnection oConn)
        {

            int horaExcedido = Convert.ToInt32(ConfigurationManager.AppSettings["horaExcedido"]);
            DateTime now = DateTime.Now;
            DateTime fechaCorte = new DateTime(now.Year, now.Month, now.Day, horaExcedido, 0, 0);

            //if (!(now >= fechaCorte)) return;

            fechaCorte = fechaCorte.ToUniversalTime();

            //TimeSpan ts = fechaCorte - (new DateTime(2014, 5, 13, 15, 0, 0));

            //string fecha = fechaCorte.ToString("dd-MM-yyyy hh:mm:ss tt");

            if (EstatusImportacion.InPlantaGY == null || EstatusImportacion.Descargando == null) return;

            string dateformatted = String.Format("{0:s}", fechaCorte);

            string sql = "SELECT MovFechaAsignado, MovFechaPlantaGY, MovId, EstatusId " +
                         "FROM Movimientos " +
                         "WHERE EstatusId in ({0},{1}) and MovFechaAsignado < '{2}'";

            sql = String.Format(sql, EstatusImportacion.InPlantaGY, EstatusImportacion.Descargando, dateformatted);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return;
            }

            DataTable dt;
            dt = ds.Tables[0];
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = oConn;

            foreach (DataRow row in dt.Rows)
            {
                List<string> optionList = new List<string> { "MovId", "MovFechaAsignado", "MovFechaPlantaGY", "EstatusId"};

                MovEstatus item = EnumExtension.getObject<MovEstatus>(row, optionList);

                if ((item.EstatusId == EstatusImportacion.InPlantaGY || item.EstatusId == EstatusImportacion.Descargando) && item.MovFechaAsignado.Value.Date < fechaCorte.Date)
                {
                    now = DateTime.UtcNow;
                    sql = "UPDATE Movimientos set MovExcedido=1, MovFechaExcedido='{0}' WHERE MovId = {1}";
                    dateformatted = String.Format("{0:s}", now);
                    sql = String.Format(sql, dateformatted, item.MovId);

                    cmd.CommandText = sql;
                    int result = cmd.ExecuteNonQuery();
                }
            }

        }

        private int? addCliente(string strCliente, Movs mov, SqlConnection oConn, int modo)
        {
            DateTime now = DateTime.Now.ToUniversalTime();
            string sql = "INSERT INTO Clientes (ClienteNombre, ClienteRIF, ClienteCreadoPor, ClienteCreado) VALUES ('{0}','','{1}','{2}') " +
                "SELECT SCOPE_IDENTITY()";

            string creadoPor = modo == 0 ? mov.MovCreadoPor : mov.MovModificadoPor;

            sql = String.Format(sql, strCliente.ToUpper(), creadoPor, String.Format("{0:s}", now));

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int keyGenerated = 0;

            try
            {
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return null;
            }

            return keyGenerated;
        }

        private void setNumViaje(Movs mov, SqlConnection oConn, SqlTransaction oTX)
        {
            string secuencia;
            secuencia = (mov.MovTipo=="D") ? "DISTRIBUCION" : "IMPORTACION";

            string sql = String.Format("sp_getnextval '{0}'", secuencia);
            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            Sec sec = new Sec(); 
            SqlDataReader dr;
            DataTable dt = new DataTable();
            dr = cmd.ExecuteReader();
            dt.Load(dr);

            if (dt.Rows.Count > 0)
            {
                IList<Sec> data = EnumExtension.ToList<Sec>(dt);
                sec = data.FirstOrDefault<Sec>();
            }
            
            sql = "update Movimientos set MovViaje='{0}' where MovId={1}";
            string strViaje = sec.SecPrefijo.Trim();
            strViaje += String.Format("{0:00000}", sec.SecValor);
            sql = String.Format(sql, strViaje, mov.MovId);

            cmd.CommandText = sql;
            cmd.ExecuteNonQuery();
        }

        private void setRepartos(IList<Reparto> lista, int movId, SqlConnection oConn, SqlTransaction oTX)
        {
            string sql = "";
            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            // Si la lista viene vacía debemos eliminarla en la base de datos
            if(lista.Count == 0) {
                sql = String.Format("DELETE FROM Repartos WHERE MovId = {0}", movId);
                try
                {
                    cmd.CommandText = sql;
                    cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                    throw;
                }

                return;
            }

            // Verificamos si hay repartos eliminados comparando los repartos actuales comparandolos 
            // con los nuevos cargados a la API
            IList<Reparto> currentRepartos = GetRepartos(movId, oConn, oTX);
            if (currentRepartos != null)
            {
                foreach (Reparto curRep in currentRepartos)
                {
                    int repId = curRep.RepartoId;
                    var query = lista.Where(i => i.RepartoId == repId);

                    if (query.Count() == 0)
                    {
                        sql = String.Format("DELETE FROM Repartos WHERE RepartoId = {0}", repId);
                        try
                        {
                            cmd.CommandText = sql;
                            cmd.ExecuteNonQuery();
                        }
                        catch (Exception ex)
                        {
                            LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                            throw;
                        }
                    }
                }
            }

            // Recorremos la lista de repartos cargados a la API para ser INSERT o UPDATE según sea el caso
            foreach (Reparto rep in lista)
            {
                if (rep.RepartoId == 0)
                {
                    try
                    {
                        rep.MovId = movId;
                        sql = "INSERT INTO Repartos ({0}) VALUES ({1}) ";

                        EnumExtension.setListValues(rep, "RepartoId", ref sql);

                        cmd.CommandText = sql;
                        cmd.ExecuteNonQuery();
                    }
                    catch (Exception ex)
                    {
                        LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                        throw;
                    }
                }
                else
                {
                    try
                    {
                        sql = "UPDATE Repartos SET {0} WHERE RepartoId = " + rep.RepartoId.ToString();

                        rep.RepartoFechaModificado = DateTime.Now;
                        EnumExtension.setUpdateValues(rep, "RepartoId", ref sql);

                        cmd.CommandText = sql;
                        cmd.ExecuteNonQuery();
                    }
                    catch (Exception ex)
                    {
                        LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                        throw;
                    }
                }
            } 
        }
        #endregion General

        #region Data para Visor
        public IList<Movs> GetListVisorDist(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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

            string wherepage = (page != 0) ? String.Format("x_row>{0} and x_row<={1} ", start, limit) : "1=1";
            string where = "1=1";

            // Verifica estatus de movimiento para cambios automáticos.
            checkStatus(oConn);

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "RTRIM(STR(a.MovId))+ISNULL(a.MovChofer,'')+(a.MovViaje)+ISNULL(a.MovPlaca,'')+" +
                    "ISNULL(a.MovCedula,'')+(ISNULL(a.MovContenedor,''))+ISNULL(a.MovTipoContenedor,'')+ISNULL(a.MovOrigen,'')+ISNULL(a.x_Cliente,'')+" +
                    "ISNULL(a.x_Ciudad,'')+ISNULL(a.x_Estatus,'')+(ISNULL(a.x_Equipo,''))+(ISNULL(CAST(a.x_Facturas AS NVARCHAR(MAX)),''))";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Ordenamiento
            string order = "a.MovFechaAsignado DESC,a.MovViaje";
            string direction = "DESC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;

                switch (order)
                {
                    case "x_Estatus":
                        order = "d.EstatusOrden";
                        break;
                    case "x_ItemOf":
                        order = "a.MovExpItem " + direction + ", e.ExpTotal";
                        break;
                    case "x_ExpNumBL":
                        order = "e.ExpNumBL";
                        break;
                    case "x_Equipo":
                        order = "f.EquipoNum,f.EquipoPlaca";
                        break;
                    case "x_Cliente":
                        order = "b.ClienteNombre";
                        break;
                }
            }

            string sql = "SELECT * FROM dbo.fn_GetViewDistribucion() a " +
                         " where {0} AND {1}" +
                         " ORDER BY x_row";

            sql = String.Format(sql, wherepage, where);

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

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            IList <Movs> data = null;

            if (totalRecords > 0)
            {
                data = EnumExtension.ToList<Movs>(dt);

                foreach (Movs mov in data)
                {
                    if(mov.MovTieneRepartos)
                        mov.x_Repartos = GetRepartos(mov.MovId, oConn);
                }
                totalRecords = Convert.ToInt32(dt.Rows[0]["totalRecords"]);
            }

            ConnManager.CloseConn(oConn);
            return data;
        }

        public IList<ResumenGraficoMes> GetDataGraficoResumenMeses(ref int totalRecords, ref string errMsg)
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

            string sql = "exec sp_GetResumenGraficoMeses";

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

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            IList<ResumenGraficoMes> data = null;

            if(totalRecords > 0) 
                data = EnumExtension.ToList<ResumenGraficoMes>(dt);

            ConnManager.CloseConn(oConn);
            return data;
        }

        public IList<ResumenMeses> GetResumenUltimoMes(ref int totalRecords, ref string errMsg)
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

            string sql = "	WITH qData (Mes,Dia,Cantidad) " +
                         " as  " +
                         " (  " +
                         "select MONTH(MovFechaAsignado) as Mes,MovFechaAsignado as Dia,MovCantidadCauchos as Cantidad  " +
                         "from Movimientos   " +
                         " where MovFechaAsignado> DATEADD(MM,-5,CAST(GETDATE() AS DATE))  " +
                         " )  " +
                         " select TOP 1 ISNULL(MAX(b.promedio),0) as PromedioMes, MAX(e.TotCauchos) as TotalCauchos, " +
                         "	MAX(e.TotCauchos) / MAX(d.viajes) as PromedioPorViaje, MAX(f.dia) as DiaMax,MAX(f.cantidad) as CantDiaMax, " +
                         " 	MAX(c.cantidad) as CantMesMax,MAX(c.mes) as MesMax,MAX(d.viajes) as TotalViajes  " +
                         " from qData a left outer join (select ISNULL(SUM(cantidad),0)/6 as promedio from qData) as b on 1=1  " +
                         " 	 left outer join (select TOP 1 a.mes,a.cantidad  " +
                         " 	  from (select SUBSTRING('ENE FEB MAR ABR MAY JUN JUL AGO SEP OCT NOV DIC ', (mes * 4) - 3, 3) as Mes,SUM(cantidad) as cantidad from qData group by mes) as a  " +
                         " 	  order by cantidad desc  " +
                         "      ) as c on 1=1 " +
                         "     left outer join (select COUNT(*) as viajes from qData) as d on 1=1 " +
                         "     left outer join (select SUM(Cantidad) as TotCauchos from qData) as e on 1=1 " +
                         "     left outer join (select top 1 dia,sum(cantidad) as cantidad from qData group by dia order by Cantidad desc) as f on 1=1 " +
                         " group by a.mes";

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

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            IList<ResumenMeses> data = null;

            if (totalRecords > 0)
                data = EnumExtension.ToList<ResumenMeses>(dt);

            ConnManager.CloseConn(oConn);
            return data;
        }

        public IList<ResumenSemanaMeses> GetResumenSemanaMeses(ref int totalRecords, ref string errMsg)
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

            string sql = "exec sp_GetResumenSemanaMeses";
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

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            IList<ResumenSemanaMeses> data = null;

            if (totalRecords > 0)
                data = EnumExtension.ToList<ResumenSemanaMeses>(dt);

            ConnManager.CloseConn(oConn);
            return data;
        }

        public IList<ResumenMapa> GetResumenMapa(ref int totalRecords, ref string errMsg)
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

            //string sql = "WITH qData (Fecha,Cantidad,CiudadCodigo,Estado, Region, MapId) " +
            //             "AS " +
            //             "( " +
            //             "select CAST(a.MovFechaAsignado as DATE) as Fecha,ISNULL(e.RepartoCantidad,a.MovCantidadCauchos) as Cantidad, " +
            //             "  b.CiudadCodigo,c.EstadoNombre as Estado,c.EstadoRegion as Region,c.EstadoMapId as MapId " +
            //             "from Movimientos a " +
            //             "LEFT JOIN Repartos e on a.MovId=e.MovId " +
            //             "INNER JOIN Ciudades b on a.CiudadId=b.CiudadId OR e.CiudadId=b.CiudadId " +
            //             "INNER JOIN Estados c on b.EstadoId=c.EstadoId " +
            //             "WHERE MovTipo='D'  " +
            //             "AND CAST(MovFechaAsignado AS DATE) in (SELECT TOP 1 CAST(MovFechaAsignado AS DATE) as FECHA FROM Movimientos ORDER BY Fecha DESC) " +
            //             ") " +
            //             "select a.Fecha,Estado,SUM(Cantidad) as Cantidad,MAX(MapId) as MapId, " +
            //             "  ROUND((CAST(SUM(Cantidad) AS NUMERIC(18,2))*100/MAX(b.Total)),2) as Porcentaje,MAX(b.Total) as Total " +
            //             "from qData a " +
            //             " inner join (select Fecha,SUM(Cantidad) as Total FROM qData Group by Fecha) as b on a.Fecha=b.Fecha " +
            //             "group by a.Fecha,Estado " +
            //             "order by Fecha Desc";

            string sql = "WITH qData (Fecha,Cantidad,CiudadCodigo,Estado, Region, MapId) " +
                         "AS  " +
                         "(  " +
                         "select CAST(a.MovFechaAsignado as DATE) as Fecha,ISNULL(e.RepartoCantidad,a.MovCantidadCauchos) as Cantidad,  " +
                         " b.CiudadCodigo,c.EstadoNombre as Estado,c.EstadoRegion as Region,c.EstadoMapId as MapId  " +
                         " from dbo.fn_GetViewDistribucion() a  " +
                         " LEFT JOIN Repartos e on a.MovId=e.MovId  " +
                         " INNER JOIN Ciudades b on a.CiudadId=b.CiudadId OR e.CiudadId=b.CiudadId  " +
                         " INNER JOIN Estados c on b.EstadoId=c.EstadoId  " +
                         " )  " +
                         " select Estado,MAX(MapId) as MapId,SUM(Cantidad) as CantidadCauchos, COUNT(*) as CantidadCavas, " +
                         "   ROUND((CAST(SUM(Cantidad) AS NUMERIC(18,2))*100/MAX(b.Total)),2) as PorcentajeCauchos,MAX(b.Total) as TotalCauchos, " +
                         "   ROUND((CAST(COUNT(*) AS NUMERIC(18,2))*100/MAX(c.Total)),2) as PorcentajeCavas,MAX(c.Total) as TotalCavas " +
                         " from qData a  " +
                         "  inner join (select SUM(Cantidad) as Total FROM qData) as b on 1=1 " +
                         "  inner join (select COUNT(*) as Total From qData) as c on 1=1 " +
                         " group by Estado ";

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

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            IList<ResumenMapa> data = null;

            if (totalRecords > 0)
                data = EnumExtension.ToList<ResumenMapa>(dt);

            ConnManager.CloseConn(oConn);
            return data;
        }
        #endregion Datos para Visor

        #region Seguridad
        public MovSeguridad Update(MovSeguridad mov, ref string msgError)
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

            mov.MovModificadoPor = mov.x_UserUpdate;
            mov.MovFechaModificado = DateTime.Now;
            string sql = "UPDATE Movimientos SET {0} WHERE MovId = " + mov.MovId.ToString();

            EnumExtension.setUpdateValues(mov, "MovId", ref sql);

            SqlTransaction oTX = oConn.BeginTransaction();
            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            try
            {
                cmd.ExecuteNonQuery();
                string strComentario = (String.IsNullOrEmpty(mov.MovComentario)) ? "NULL" : "'" + mov.MovComentario + "'";
                string strComentarioInterno = (String.IsNullOrEmpty(mov.MovComentarioInterno)) ? "NULL" : "'" + mov.MovComentarioInterno + "'";
                string strEstaInfoId = (mov.EstaInfoId == null) ? "NULL" : mov.EstaInfoId.ToString();

                sql = String.Format("INSERT INTO EstaInfoDetalle (MovId,EstaInfoId,EInfoDetalleComentario,EInfoDetalleComentarioInterno,EInfoDetalleUsuario,EstatusId) VALUES ({0},{1},{2},{3},'{4}',{5})", mov.MovId, strEstaInfoId, strComentario, strComentarioInterno, mov.x_UserUpdate, mov.EstatusId);
                cmd.CommandText = sql;
                cmd.ExecuteNonQuery();
                oTX.Commit();
            }
            catch (Exception ex)
            {
                try
                {
                    oTX.Rollback();
                }
                catch (Exception exRollBack)
                {
                    LogManager.Write(exRollBack.Source + " : " + exRollBack.Message);
                }

                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            MovSeguridad data = mov;

            ConnManager.CloseConn(oConn);

            return data;
        }

        public IList<Ubicacion> GetListUbicaciones(string query, ref int totalRecords, ref string errMsg)
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

            string where = (!String.IsNullOrEmpty(query)) ? String.Format(" AND MovUbicacion LIKE '{0}%' ", query) : "";
            string sql = "SELECT DISTINCT MovUbicacion as clave, MovUbicacion as name " +
                         " FROM Movimientos" +
                         " WHERE MovTipo='D' and MovTipo is not null "  + where +
                         " ORDER BY clave";

            //sql = String.Format(sql, where, wherepage, order, direction);

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

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            IList<Ubicacion> data = null;

            if (totalRecords > 0)
            {
                data = EnumExtension.ToList<Ubicacion>(dt);
            }

            ConnManager.CloseConn(oConn);
            return data;
        }

        public IList<Ubicacion> GetListUbicacionesTransito(string query, int movId, ref int totalRecords, ref string errMsg)
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

            string wherecli = (!String.IsNullOrEmpty(query)) ? String.Format(" a.MovId={0} AND ISNULL(d.ClienteNombre,b.ClienteNombre) LIKE '{1}%' ", movId, query) : "a.MovId=0";
            string where = (!String.IsNullOrEmpty(query)) ? String.Format(" AND MovUbicacionTransito LIKE '{0}%' ", query) : "";
            string sql = "WITH qData " +
                         " AS " +
                         " ( " +
                         " SELECT DISTINCT 1 as orden, LTRIM(MovUbicacionTransito) as clave, LTRIM(MovUbicacionTransito) as name  " +
                         " FROM Movimientos " +
                         "  WHERE MovTipo='D' and MovTipo is not null  " +
                         "  and MovUbicacionTransito is not null  " +
                         "  and MovUbicacionTransito <> '' " + where +
                         " UNION " +
                         " SELECT 0 as orden, ISNULL(d.ClienteNombre,b.ClienteNombre) as clave, ISNULL(d.ClienteNombre,b.ClienteNombre) as name  " +
                         " FROM Movimientos a  " +
                         " LEFT JOIN Clientes b on a.ClienteId=b.ClienteId " +
                         " LEFT JOIN Repartos c on a.MovId=c.MovId " +
                         " LEFT JOIN Clientes d on c.ClienteId=d.ClienteId " +
                         " WHERE " + wherecli +
                         " ) " +
                         " select * " +
                         " from qData " +
                         " order by orden,clave";

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

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            IList<Ubicacion> data = null;

            if (totalRecords > 0)
            {
                data = EnumExtension.ToList<Ubicacion>(dt);
            }

            ConnManager.CloseConn(oConn);
            return data;
        }

        public Movs GetDistSecurity(int id, ref string errMsg)
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

            string where = String.Format("a.MovId={0}", id);


            string sql = "SELECT * FROM dbo.fn_GetViewDistribucion() a " +
                         " where {0} " +
                         " ORDER BY x_row";


            sql = String.Format(sql, where);

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

            DataTable dt;
            dt = ds.Tables[0];

            int totalRecords = dt.Rows.Count;

            Movs data = null;

            if (totalRecords > 0)
            {
                data = EnumExtension.ToList<Movs>(dt).FirstOrDefault<Movs>();

                if (data.MovTieneRepartos)
                    data.x_Repartos = GetRepartos(data.MovId, oConn);
            }

            ConnManager.CloseConn(oConn);
            return data;
        }

        public Reparto Update(Reparto rep, ref string msgError)
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

            // Seteamos la fecha de actualizaciòn
            rep.RepartoFechaModificado = DateTime.Now;
            string sql = "UPDATE Repartos SET {0} WHERE RepartoId = " + rep.RepartoId.ToString();

            EnumExtension.setUpdateValues(rep, "RepartoId", ref sql);

            SqlTransaction oTX = oConn.BeginTransaction();
            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            try
            {
                cmd.ExecuteNonQuery();

                // Seteamos el Reparto actual en Movimientos
                sql = String.Format("Update Movimientos set MovCurrentRepartoId = {0} WHERE MovId = {1}", rep.RepartoId, rep.MovId);
                cmd.CommandText = sql;
                cmd.ExecuteNonQuery();

                // Obtenemos los Repartos Actualizados
                IList<Reparto> currentRepartos = GetRepartos(rep.MovId, oConn, oTX);
                var repartosNulos = from p in currentRepartos where p.RepartoFechaEntregado == null select p;

                Nullable<DateTime> maxDate = null;
                // Si un reparto no se ha entregado se coloca el movimiento como No entregado de lo contrario se coloca la fecha mayor
                if (repartosNulos.Count() > 0)
                {
                    sql = String.Format("Update Movimientos set MovFechaEntregado = NULL WHERE MovId = {0}", rep.MovId);
                }
                else
                {
                    //Nullable<DateTime> maxDate = currentRepartos.OrderByDescending(x => x.RepartoFechaEntregado).FirstOrDefault<Reparto>().RepartoFechaEntregado;
                    maxDate = currentRepartos.Max(x => x.RepartoFechaEntregado);
                    string dateformatted = String.Format("{0:s}", maxDate);
                    maxDate = Convert.ToDateTime(maxDate).ToLocalTime();
                    sql = String.Format("Update Movimientos set MovFechaEntregado = '{0}' WHERE MovId = {1}", dateformatted, rep.MovId);
                }

                rep.x_MovFechaEntregado = maxDate;
                cmd.CommandText = sql;
                cmd.ExecuteNonQuery();
                oTX.Commit();
            }
            catch (Exception ex)
            {
                try
                {
                    oTX.Rollback();
                }
                catch (Exception exRollBack)
                {
                    LogManager.Write(exRollBack.Source + " : " + exRollBack.Message);
                }

                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }
            finally
            {
                ConnManager.CloseConn(oConn);
            }

            Reparto data = rep;

            return data;
        }
        #endregion Seguridad
    }
}
