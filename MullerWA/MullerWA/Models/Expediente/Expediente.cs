using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace MullerWA.Models
{
    public class Expediente
    {
        public int ExpId { get; set; }
        public string ExpNumBL { get; set; }
        public int ExpTotal { get; set; }
        public int ExpCargados { get; set; }
    }
}