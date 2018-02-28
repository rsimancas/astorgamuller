using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MullerWA.Models
{
    public class GastosItem
    {
        public int GItemId { get; set; }
        public int GGrupoItemId { get; set; }
        public string GItemNombre { get; set; }
        public Nullable<decimal> GItemCosto { get; set; }
        public string GItemCreadoPor { get; set; }
        public DateTime GItemCreado { get; set; }
        public string GItemModificadoPor { get; set; }
        public Nullable<DateTime> GItemModificado { get; set; }
    }
}