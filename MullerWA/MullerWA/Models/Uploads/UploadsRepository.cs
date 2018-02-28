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
    public class UploadsRepository : IUploadsRepository
    {
        public bool InsertUpdateData(int movId, string filename, string contenttype, Byte[] bytes, ref string errMsg)
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

            string strQuery = String.Format("DELETE FROM Attachments WHERE MovId = {0}", movId);
            SqlCommand cmd = new SqlCommand(strQuery, oConn);

            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                errMsg = ex.Message;
                return false;
            }

            //insert the file into database
            strQuery = "insert into Attachments (MovId, AttachName, AttachContentType, AttachData)" +
               " values (@MovId, @name, @ContentType, @Data)";

            cmd.CommandText = strQuery;
            cmd.Parameters.Add("@MovId", SqlDbType.Int).Value = movId;
            cmd.Parameters.Add("@Name", SqlDbType.VarChar).Value = filename;
            cmd.Parameters.Add("@ContentType", SqlDbType.VarChar).Value = contenttype;
            cmd.Parameters.Add("@Data", SqlDbType.Binary).Value = bytes;

            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                errMsg = ex.Message;
                return false;
            }

            ConnManager.CloseConn(oConn);

            return true;
        }

        public byte[] GetImage(int movId, ref string contenttype, ref string errMsg)
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

            string strQuery = String.Format("SELECT AttachData,AttachContentType FROM Attachments WHERE MovId = {0}", movId);
            SqlCommand cmd = new SqlCommand(strQuery, oConn);

            byte[] buffer = null;
            SqlDataReader dr;

            try
            {
                 dr = cmd.ExecuteReader();

                 while (dr.Read())
                 {
                     contenttype = dr["AttachContentType"].ToString();
                     buffer = (byte[])dr["AttachData"];
                 }
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                errMsg = ex.Message;
                return null;
            }
            finally
            {
                ConnManager.CloseConn(oConn);
            }

            return buffer;
        }        
    }
}