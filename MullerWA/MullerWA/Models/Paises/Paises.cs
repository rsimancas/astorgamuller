using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace MullerWA.Models
{
    public class Pais
    {
        public int PaisId { get; set; }
        public string PaisCodigo { get; set; }
        public string PaisNombre { get; set; }
        public DateTime PaisCreado { get; set; }
        public Nullable<DateTime> PaisModificado { get; set; }
        public string PaisCreadoPor { get; set; }
        public string PaisModificadoPor { get; set; }
    }
}