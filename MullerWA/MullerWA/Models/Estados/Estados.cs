using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace MullerWA.Models
{
    public class Estado
    {
        public int EstadoId { get; set; }
        public Nullable<int> PaisId { get; set; }
        public string EstadoNombre { get; set; }
        public DateTime EstadoCreado { get; set; }
        public Nullable<DateTime> EstadoModificado { get; set; }
        public string EstadoCreadoPor { get; set; }
        public string EstadoModificadoPor { get; set; }
    }
}