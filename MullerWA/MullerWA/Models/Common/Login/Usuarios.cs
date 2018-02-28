using System;
using System.Linq;
using System.Collections.Generic;
using System.Web;


namespace MullerWA.Models
{
    public class Usuario
    {
        public string UsuarioId { get; set; }
        public string UsuarioNombre { get; set; }
        public string UsuarioApellido { get; set; }
        public string UsuarioNombreCompleto { get; set; }
        public int UsuarioLevel { get; set; }
        public string UsuarioPassword { get; set; }
    }
}