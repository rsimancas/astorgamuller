using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace MullerWA.Models
{
    public class Ciudad
    {
        public int CiudadId { get; set; }
        public int? EstadoId { get; set; }
        public string CiudadNombre { get; set; }
        public string CiudadMunicipio { get; set; }
        public string CiudadCodigo { get; set; }
        public DateTime CiudadCreado { get; set; }
        public Nullable<DateTime> CiudadModificado { get; set; }
        public string CiudadCreadoPor { get; set; }
        public string CiudadModificadoPor { get; set; }
        public int? CiudadDeadLine { get; set; }
        public string x_Estado { get; set; }
        public string x_CodigoNombre { get; set; }
    }
}