using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MullerWA.Models
{
    public class Cliente
    {
        public int ClienteId { get; set; }
        public string ClienteNombre { get; set; }
        public string ClienteRIF { get; set; }
        public DateTime ClienteCreado { get; set; }
        public Nullable<DateTime> ClienteModificado { get; set; }
        public string ClienteCreadoPor { get; set; }
        public string ClienteModificadoPor { get; set; }
    }
}