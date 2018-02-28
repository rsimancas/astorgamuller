namespace MullerWA.Models
{
    using System;
    using System.Collections.Generic;

    public class Movs
    {
        public int MovId { get; set; }
        public int EstatusId { get; set; }
        public int? ExpId { get; set; }
        public int? ClienteId { get; set; }
        public int? CiudadId { get; set; }
        public int? EquipoId { get; set; }
        public int? TabId { get; set; }
        public int? EstaInfoId { get; set; }
        public string MovTipo { get; set; }
        public string MovViaje { get; set; }
        public string MovPlaca { get; set; }
        public string MovChofer { get; set; }
        public string MovCedula { get; set; }
        public Nullable<decimal> MovCantidad { get; set; }
        public string MovContenedor { get; set; }
        public string MovTipoContenedor { get; set; }
        public string MovOrigen { get; set; }
        public bool MovElevadora { get; set; }
        public Nullable<DateTime> MovFechaAsignado { get; set; }
        public Nullable<DateTime> MovFechaPlantaGY { get; set; }
        public Nullable<DateTime> MovFechaVacio { get; set; }
        public string MovComentario { get; set; }
        public Nullable<bool> MovExcedido { get; set; }
        public Nullable<DateTime> MovFechaExcedido { get; set; }
        public DateTime MovFechaCreado { get; set; }
        public string MovCreadoPor { get; set; }
        public Nullable<DateTime> MovFechaModificado { get; set; }
        public string MovModificadoPor { get; set; }
        public int? MovExpItem { get; set; }
        public Nullable<bool> MovLavadoQuimico { get; set; }
        public string MovCondicion { get; set; }
        public string MovUbicacion { get; set; }
        public int? MovCantidadCauchos { get; set; }
        public Nullable<decimal> MovCostoFlete { get; set; }
        public Nullable<decimal> MovMontoEscolta { get; set; }
        public Nullable<DateTime> MovFechaCarga { get; set; }
        public Nullable<DateTime> MovFechaDescarga { get; set; }
        public Nullable<bool> MovAcarreo { get; set; }
        public Nullable<decimal> MovAcarreoMonto { get; set; }
        public string MovFacturas { get; set; }
        public int? MovTotalRepartos { get; set; }
        public bool MovTieneRepartos { get; set; }
        public Nullable<DateTime> MovFechaEstimada { get; set; }
        public Nullable<DateTime> MovFechaEntregaFactura { get; set; }
        public Nullable<DateTime> MovFechaCompletado { get; set; }
        public string x_Cliente { get; set; }
        public string x_Ciudad { get; set; }
        public string x_Estatus { get; set; }
        public Nullable<DateTime> x_FechaEstatus { get; set; }
        public int x_EstatusOrden { get; set; }
        public int x_ExpTotal { get; set; }
        public string x_ExpNumBL { get; set; }
        public string x_EstatusInfo { get; set; }
        public string x_Equipo { get; set; }
        public IList<Reparto> x_Repartos { get; set; }
        public int x_row { get; set; }
        public string x_Facturas { get; set; }
        public Nullable<DateTime> x_DL { get; set; }
        public int? x_DaysBetween { get; set; }
        public Nullable<DateTime> MovFechaSalida { get; set; } // 08/01/2015 Hora de Salida Solicitado por Yovanny Arias
        public string MovUbicacionTransito { get; set; }
        public string MovComentarioInterno { get; set; }
        public Nullable<DateTime> MovFechaEntregado { get; set; }
        public Nullable<DateTime> MovHoraSalida { get; set; }
        public Nullable<decimal> MovMedidaRestoEquipo { get; set; } // 09/02/2015 Solicitado por Jorge Astorga para Controlar espacio vacío en contenedor
        public string MovMedidaRestoEquipoUnd { get; set; } // 09/02/2015 Solicitado por Jorge Astorga para Controlar espacio vacío en contenedor
        public string x_FechaSalida { get; set; }
        public string x_FechaModificado { get; set; }
        public string x_FechaCreado { get; set; }
        public string x_FechaAsignado { get; set; }
        public string x_FechaEntregaFactura { get; set; }
        public string x_DeadLine { get; set; }
        public int? x_Attachments { get; set; }
        public string x_HoraSalida { get; set; }
        public string x_FechaCompletado { get; set; }
        public int? ChoferId { get; set; }
        public int? MovTurno { get; set; }
        public int? MovCurrentRepartoId { get; set; }
        public string MovComentarioLogistica { get; set; }
    }

    public class MovSeguridad
    {
        public int MovId { get; set; }
        public int? EstaInfoId { get; set; }
        public int EstatusId { get; set; }
        public string MovComentario { get; set; }
        public string x_UserUpdate { get; set; }
        public Nullable<DateTime> MovFechaSalida { get; set; } // 08/01/2015 Hora de Salida Solicitado por Yovanny Arias
        public string MovUbicacion { get; set; }
        public string MovUbicacionTransito { get; set; }
        public Nullable<DateTime> MovFechaCompletado { get; set; }
        public string MovComentarioInterno { get; set; }
        public Nullable<DateTime> MovFechaEntregado { get; set; }
        public string MovModificadoPor { get; set; }
        public Nullable<DateTime> MovFechaModificado { get; set; }
        public Nullable<DateTime> MovHoraSalida { get; set; }
        public string x_FechaSalida { get; set; }
        public string x_FechaModificado { get; set; }
        public string x_FechaCreado { get; set; }
        public string x_FechaAsignado { get; set; }
        public string x_FechaEntregaFactura { get; set; }
        public string x_DeadLine { get; set; }
        public int? x_Attachments { get; set; }
        public string x_HoraSalida { get; set; }
    }

    public class Ubicacion
    {
        public string clave { get; set; }
        public string name { get; set; }
    }

    public class MovEstatus
    {
        public int MovId { get; set; }
        public int EstatusId { get; set; }
        public Nullable<DateTime> MovFechaAsignado { get; set; }
        public Nullable<DateTime> MovFechaPlantaGY { get; set; }
    }

    public class Placa
    {
        public string PlacaNombre { get; set; }
    }

    public class ChoferMov
    {
        public string ChoferNombre { get; set; }
        public string ChoferCedula { get; set; }
        public string ChoferPlaca { get; set; }
    }

    public class Origen
    {
        public string MovOrigen { get; set; }
    }

    public class Reparto
    {
        public int RepartoId { get; set; }
        public int MovId { get; set; }
        public int? CiudadId { get; set; }
        public int? ClienteId { get; set; }
        public string RepartoFacturas { get; set; }
        public int? RepartoCantidad { get; set; }
        public Nullable<decimal> RepartoTarifa { get; set; }
        public Nullable<DateTime> RepartoFechaEntregado { get; set; }
        public string RepartoModificadoPor { get; set; }
        public Nullable<DateTime> RepartoFechaModificado { get; set; }
        public string RepartoComentarios { get; set; }
        public string x_Ciudad { get; set; }
        public string x_Cliente { get; set; }
        public Nullable<DateTime> x_MovFechaEntregado { get; set; }

    }

    public class ResumenGraficoMes
    {
        public string Mes { get; set; }
        public decimal Cantidad { get; set; }
    }

    public class ResumenMeses
    {
        public decimal PromedioMes { get; set; }
        public decimal TotalCauchos { get; set; }
        public decimal PromedioPorViaje { get; set; }
        public DateTime DiaMax { get; set; }
        public decimal CantDiaMax { get; set; }
        public decimal CantMesMax { get; set; }
        public string MesMax { get; set; }
        public decimal TotalViajes { get; set; }
    }

    public class ResumenSemanaMeses
    {
        public string Descripcion { get; set; }
        public decimal Cantidad { get; set; }
        public decimal Promedio { get; set; }
        public decimal Cavas { get; set; }
    }

    public class ResumenMapa
    {
        public string Estado { get; set; }
        public decimal CantidadCavas { get; set; }
        public decimal CantidadCauchos { get; set; }
        public decimal PorcentajeCavas { get; set; }
        public decimal PorcentajeCauchos { get; set; }
        public string MapId { get; set; }
        public decimal TotalCauchos { get; set; }
        public decimal TotalCavas { get; set; }
    }
}