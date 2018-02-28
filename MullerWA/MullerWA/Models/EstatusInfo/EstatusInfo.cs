using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace MullerWA.Models
{
    public class EstatusInfo
    {
        public int EstaInfoId { get; set; }
        public string EstaInfoNombre { get; set; }
        public int EstaInfoOrden { get; set; }
        public DateTime EstaInfoCreado { get; set; }
        public string EstaInfoCreadoPor { get; set; }
        public Nullable<DateTime> EstaInfoModificado { get; set; }
        public string EstaInfoModificadoPor { get; set; }
    }
}