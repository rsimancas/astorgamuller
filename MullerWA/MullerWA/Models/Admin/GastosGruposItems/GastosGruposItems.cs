using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MullerWA.Models
{
    public class GastosGrupoItem
    {
        public int GGrupoItemId { get; set; }
        public string GGrupoItemNombre { get; set; }
        public DateTime GGrupoItemCreado { get; set; }
        public string GGrupoItemCreadoPor { get; set; }
        public Nullable<DateTime> GGrupoItemModificado { get; set; }
        public string GGrupoItemModificadoPor { get; set; }
    }
}