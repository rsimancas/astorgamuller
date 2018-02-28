using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MullerWA.Models
{
    public class Chofer
    {
        public int ChoferId { get; set; }
        public string ChoferApellido { get; set; }
        public string ChoferNombre { get; set; }
        public string ChoferNombreCompleto { get; set; }
        public string ChoferCedula { get; set; }
        public Nullable<DateTime> ChoferLicenciaExpira { get; set; }
        public Nullable<DateTime> ChoferExpiraCertificado { get; set; }
        public string ChoferTelefono { get; set; }
        public string ChoferEmail { get; set; }
        public string ChoferTitularCuenta { get; set; }
        public int ChoferTipoCuenta { get; set; }
        public string ChoferBanco { get; set; }
        public string ChoferCedulaTitular { get; set; }
        public string ChoferTelefonoTitular { get; set; }
        public string ChoferEmailTitular { get; set; }
        public string ChoferCreadoPor { get; set; }
        public DateTime ChoferFechaCreado { get; set; }
        public string ChoferModificadoPor { get; set; }
        public Nullable<DateTime> ChoferFechaModificado { get; set; }
        public string ChoferCuentaBanco { get; set; }
    }
}