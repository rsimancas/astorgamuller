using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace MullerWA.Models
{
    public class Secuencias
    {
        public int SecId { get; set; }
        public string SecNombre { get; set; }
        public int SecValor { get; set; }
        public DateTime SecCreado { get; set; }
        public string SecCreadoPor { get; set; }
        public Nullable<DateTime> SecModificado { get; set; }
        public string SecModificadoPor { get; set; }
        public string SecPrefijo { get; set; }
    }
}