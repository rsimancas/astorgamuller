-- ================================================
-- Template generated from Template Explorer using:
-- Create Inline Function (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the function.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Rony Simancas
-- Create date: 09/02/2015
-- Description:	Obtiene Datos para recibo
-- =============================================
ALTER FUNCTION dbo.fn_GetDatosRecibo
(	
	@id INTEGER
)
RETURNS TABLE 
AS
RETURN 
(
	WITH qData
	AS
	( 
	select a.*, dbo.fn_MovCiudades(a.MovId,d.CiudadCodigo) as x_Ciudad, 
	  e.EstatusNombre as x_Estatus, e.EstatusOrden as x_EstatusOrden, 
	  (CASE WHEN a.MovTieneRepartos=1 THEN dbo.fn_MovClientes(a.MovId,'') ELSE c.ClienteNombre END) as x_Cliente,
	  (CASE e.EstatusNombre WHEN 'COMPLETADO' THEN 99 ELSE (CASE WHEN e.EstatusOrden IS NULL THEN 999 ELSE e.EstatusOrden END) END) as x_order,
	  (CASE e.EstatusNombre WHEN 'COMPLETADO' THEN -CAST(MovFechaAsignado as INTEGER) ELSE CAST(dbo.fAddWorkingDay(a.MovFechaEntregaFactura, dbo.fn_GetDeadLine(a.MovId)) AS INTEGER) END) as x_order2,   
	  RTRIM(b.EquipoNum)+N' ('+b.EquipoPlaca+N')' as x_Equipo, 
	  (CASE When a.MovTieneRepartos=1 THEN dbo.fn_MovFacturas(a.MovId,a.MovFacturas) ELSE a.MovFacturas END) as x_Facturas, 
	  dbo.fAddWorkingDay(a.MovFechaEntregaFactura, dbo.fn_GetDeadLine(a.MovId)) as x_DL,
	  f.EstaInfoNombre as x_EstatusInfo
	 from Movimientos a 
	  LEFT JOIN Equipos b on b.EquipoId=a.EquipoId 
	  LEFT JOIN Clientes c on a.ClienteId=c.ClienteId  
	  LEFT JOIN Ciudades d on a.CiudadId=d.CiudadId  
	  LEFT JOIN Estatus e on a.EstatusId=e.EstatusId
	  LEFT JOIN EstatusInformativo f on a.EstaInfoId=f.EstaInfoId  
	 ) 
	 select a.*,ROW_NUMBER() OVER(ORDER BY x_order,x_order2) as x_row,
	 (select count(*) from qData) as totalRecords,
	 dbo.fWorkingDaysBetween(x_DL, MovFechaCompletado) as x_DaysBetween,
	 '' as x_FechaCreado, dbo.fn_GetTimeStampEscrito(ISNULL(MovFechaModificado,MovFechaCreado)) as x_FechaModificado,
	 dbo.fn_GetShortDate(MovFechaSalida) as x_FechaSalida, 
	 left(dbo.fn_GetShortDate(x_DL),5) as x_DeadLine,
	 left(dbo.fn_GetShortDate(MovFechaAsignado),5) as x_FechaAsignado,
	 left(dbo.fn_GetShortDate(MovFechaEntregaFactura),5) as x_FechaEntregaFactura,
	 ISNULL((select COUNT(*) from Attachments b where a.MovId=b.MovId), 0) as x_Attachments, 
	 ISNULL(b.Cantidad, a.MovCantidadCauchos) as Cauchos, 
	 ISNULL(b.CiudadCodigo, x_Ciudad) as Ciudad,
	 ISNULL(b.ClienteNombre, x_Cliente) as Cliente   
	FROM qData a 
	LEFT OUTER JOIN (
		SELECT a.MovId,a.RepartoCantidad as Cantidad, c.CiudadCodigo, b.ClienteNombre
		FROM Repartos a left join Clientes b on a.ClienteId=b.ClienteId
		left join Ciudades c on a.CiudadId = c.CiudadId
		WHERE a.MovId = @id
	) as b ON b.MovId = a.MovId 
	WHERE a.MovId = @id
)
GO
