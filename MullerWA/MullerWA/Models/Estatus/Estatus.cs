using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace MullerWA.Models
{
    public class Estatus
    {
        public int EstatusId { get; set; }
        public string EstatusNombre { get; set; }
        public DateTime EstatusCreado { get; set; }
        public string EstatusCreadoPor { get; set; }
        public Nullable<DateTime> EstatusModificado { get; set; }
        public string EstatusModificadoPor { get; set; }
        public string EstatusTipo { get; set; }
        public int EstatusOrden { get; set; }
        public string x_Estatus { get; set; }
    }
}