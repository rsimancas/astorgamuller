using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace MullerWA.Models
{
    public class Equipo
    {
        public int EquipoId { get; set; }
        public string EquipoNum { get; set; }
        public string EquipoPlaca { get; set; }
        public string EquipoSerial { get; set; }
        public string EquipoCreadoPor { get; set; }
        public DateTime EquipoFechaCreado { get; set; }
        public string EquipoModificadoPor { get; set; }
        public Nullable<DateTime> EquipoFechaModificado { get; set; }
        public string x_EquipoPlaca { get; set; }
        public string x_Estatus { get; set; }
    }

    public class EquipoVisor
    {
        public string Estatus { get; set; }
        public decimal Cantidad { get; set; }
        public decimal PLANTA { get; set; }
        public decimal FERRARI { get; set; }
    }
}