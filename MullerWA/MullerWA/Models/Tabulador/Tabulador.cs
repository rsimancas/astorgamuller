using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace MullerWA.Models
{
    public class Tabulador
    {
        public int TabId { get; set; }
        public int CiudadId { get; set; }
        public decimal TabTarifa { get; set; }
        public string x_Ciudad { get; set; }
    }
}