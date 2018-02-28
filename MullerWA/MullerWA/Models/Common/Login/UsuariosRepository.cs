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
    public class UsuariosRepository : IUsuariosRepository
    {
        //DBContext dbcontext;
        public UsuariosRepository()
        {
            //dbcontext = new DBContext();
        }

        public IList<Usuario> GetAll(int page, int start, int limit, ref int totalRecords)
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

            string where = (page != 0) ? " WHERE row>@start and row<=@limit " : "";

            string sql = "SELECT * FROM ( " +
                         "SELECT EmployeeLogin as UsuarioNombre,EmployeePassword as UsuarioPassword, EmployeeKey, " +
                         "  RTRIM(EmployeeLastName)+' '+RTRIM(EmployeeFirstName) as UsuarioNombreCompleto, " +
                         "  ROW_NUMBER() OVER (ORDER BY FileCreatedDate DESC) as row,  " +
                         "  IsNull((select count(*) from tblEmployees),0)  as TotalRecords   " +
                         " FROM tblEmployees) a  " +
                         where +
                         " ORDER BY UsuarioNombre DESC";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            if (page != 0)
            {
                da.SelectCommand.Parameters.Add("@start", SqlDbType.Int).Value = Convert.ToInt32(start);
                da.SelectCommand.Parameters.Add("@limit", SqlDbType.Int).Value = Convert.ToInt32(limit);
            };

            DataSet ds = new DataSet();

            da.Fill(ds);

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = (int)dt.Rows[0]["TotalRecords"];

            IList<Usuario> data = dt.AsEnumerable()
                          .Select(row => new Usuario
                          {
                              UsuarioNombre = Convert.ToString(row["UsuarioNombre"]),
                              UsuarioNombreCompleto = Convert.ToString(row["UsuarioNombreCompleto"])
                          }).ToList<Usuario>();

            return data;
        }

        public Usuario Get(string id)
        {
            //dbcontext.Configuration.ProxyCreationEnabled = false;
            //var languages = dbcontext.Usuario.Where(x => x.UsuarioCode == id);
            //if (languages.Count() > 0)
            //{
            //    return languages.Single();
            //}
            //else
            //{
            return null;
            //}
        }

        public Usuario Add(Usuario Usuario)
        {
            //dbcontext.Configuration.ProxyCreationEnabled = false;
            //if (Usuario == null)
            //{
            //    throw new ArgumentNullException("item");
            //}
            //dbcontext.Usuario.Add(Usuario);
            //dbcontext.SaveChanges();
            return Usuario;
        }

        public void Remove(Usuario usuario)
        {
            //Usuario Usuario = Get(id);
            //if (Usuario != null)
            //{
            //    dbcontext.Usuario.Remove(Usuario);
            //    dbcontext.SaveChanges();
            //}
        }

        public bool Update(Usuario Usuario)
        {
            //if (Usuario == null)
            //{
            //    throw new ArgumentNullException("Usuario");
            //}

            //Usuario UsuarioInDB = Get(Usuario.UsuarioCode);

            //if (UsuarioInDB == null)
            //{
            //    return false;
            //}

            //dbcontext.Usuario.Remove(UsuarioInDB);
            //dbcontext.SaveChanges();

            //dbcontext.Usuario.Add(Usuario);
            //dbcontext.SaveChanges();

            return true;
        }

        public Usuario ValidLogon(string userName, string userPassword)
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


            string sql = "select * "  + 
                         " from Usuarios where UsuarioId=@uid and UsuarioPassword=@pwd";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@uid", SqlDbType.NVarChar, 100).Value = userName;
            da.SelectCommand.Parameters.Add("@pwd", SqlDbType.NVarChar,50).Value = userPassword;

            DataSet ds = new DataSet();

            da.Fill(ds);

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            
            IList<Usuario> data = EnumExtension.ToList<Usuario>(dt);
            
            if (data.Count != 0) 
                return data.FirstOrDefault<Usuario>();

            return null;
        }

        public string GenToken(Usuario usr)
        {

            string id = Utils.Encrypt(usr.UsuarioId),
                   password = Utils.Encrypt(usr.UsuarioPassword);

            return String.Format("{0},{1}", id, password);
        }
    }
}