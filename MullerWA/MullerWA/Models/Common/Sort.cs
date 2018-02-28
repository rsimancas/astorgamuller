using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Utilidades;
using Helpers;

namespace MullerWA.Models
{
    public class Sort
    {
        public string property { get; set; }
        public string direction { get; set; }
    }
}