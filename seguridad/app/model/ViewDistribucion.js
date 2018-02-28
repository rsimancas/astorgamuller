Ext.define('MyApp.model.ViewDistribucion', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: 'MovId',
        autoLoad: false,

        requires:[
        'Ext.util.Cookies'
        ],
        
        fields: [
        { name:'MovId', type:'int' },
        { name:'EstatusId', type:'int' },
        { name:'ExpId', type:'int', useNull: true },
        { name:'ClienteId', type:'int', useNull: true },
        { name:'CiudadId', type:'int', useNull: true },
        { name:'EquipoId', type:'int', useNull: true },
        { name:'TabId', type:'int', useNull: true },
        { name:'EstaInfoId', type:'int', useNull: true },
        { name:'MovTipo', type:'string' },
        { name:'MovFactura', type:'string', useNull: true, defaultValue: null },
        { name:'MovViaje', type:'string' },
        { name:'MovPlaca', type:'string', useNull: true, defaultValue: null },
        { name:'MovChofer', type:'string', useNull: true, defaultValue: null },
        { name:'MovCedula', type:'string', useNull: true, defaultValue: null },
        { name:'MovCantidad', type:'float', useNull: true },
        { name:'MovContenedor', type:'string', useNull: true, defaultValue: null },
        { name:'MovTipoContenedor', type:'string', useNull: true, defaultValue: null },
        { name:'MovOrigen', type:'string', useNull: true, defaultValue: null },
        { name:'MovElevadora', type:'boolean' },
        { name:'MovFechaAsignado', type:'date', useNull: true },
        { name:'MovFechaPlantaGY', type:'date', useNull: true },
        { name:'MovFechaVacio', type:'date', useNull: true },
        { name:'MovComentario', type:'string', useNull: true, defaultValue: null },
        { name:'MovExcedido', type:'boolean', useNull: true },
        { name:'MovFechaExcedido', type:'date', useNull: true },
        { name:'MovFechaCreado', type:'date' },
        { name:'MovCreadoPor', type:'string', 
            defaultValue: Ext.util.Cookies.get("Seguridad.CurrentUser") ? Ext.JSON.decode(Ext.util.Cookies.get("Seguridad.CurrentUser")).UsuarioId : null},
        { name:'MovFechaModificado', type:'date', useNull: true },
        { name:'MovModificadoPor', type:'string', useNull: true, defaultValue: null },
        { name:'MovExpItem', type:'int', useNull: true },
        { name:'MovLavadoQuimico', type:'boolean', useNull: true },
        { name:'MovCondicion', type:'string', useNull: true, defaultValue: null },
        { name:'MovUbicacion', type:'string', useNull: true, defaultValue: null },
        { name:'MovCantidadCauchos', type:'int', useNull: true },
        { name:'MovCostoFlete', type:'numeric', useNull: true },
        { name:'MovMontoEscolta', type:'numeric', useNull: true },
        { name:'MovFechaCarga', type:'date', useNull: true },
        { name:'MovFechaDescarga', type:'date', useNull: true },
        { name:'MovAcarreo', type:'boolean', useNull: true },
        { name:'MovAcarreoMonto', type:'numeric', useNull: true },
        { name:'x_Facturas', type:'string', useNull: true, defaultValue: null },
        { name:'x_Cliente', type:'string'},
        { name:'x_Ciudad', type:'string'},
        { name:'x_Estatus', type:'string'},
        { name:'x_EstatusInfo', type:'string'},
        { name:'x_FechaEstatus', type: 'date', useNull: true},
        { name:'x_EstatusOrden', type: 'int'},
        { name:'x_ExpTotal', type: 'int', useNull: true},
        { name:'x_ExpNumBL', type:'string'},
        { name:'x_Equipo', type:'string'},
        { name:'x_ItemOf', type: 'string', convert: function (newValue, model) {
                returnValue = (model.get('MovExpItem') != null) ? model.get('MovExpItem') : "";
                returnValue +=  (model.get('x_ExpTotal') != null) ? "/"+model.get('x_ExpTotal') : "";
                return returnValue;
            }
        },
        { name:'MovFechaCompletado', type:'date', useNull: true },
        { name:'x_Repartos', persist: true},
        { name:'MovTotalRepartos', type:'int', useNull: true},
        { name:'MovTieneRepartos', type:'boolean'},
        { name:'MovFechaEstimada', type:'date', useNull: true },
        { name:'MovFechaSalida', type:'date', useNull: true },
        { name:'MovUbicacionTransito', type:'string', useNull: true},
        { name:'MovComentarioInterno', type:'string', useNull: true, defaultValue: null },
        { name:'MovFechaEntregado', type:'date', useNull: true },
        { name:'MovHoraSalida', type:'date', useNull: true },
        { name:'x_FechaCreado', type:'string', useNull: true },
        { name:'x_FechaModificado', type:'string', useNull: true },
        { name:'x_FechaSalida', type:'string', useNull: true },
        { name:'x_FechaAsignado', type:'string', useNull: true },
        { name:'x_FechaEntregaFactura', type:'string', useNull: true },
        { name:'x_DeadLine', type:'string', useNull: true },
        { name:'x_HoraSalida', type:'string', useNull: true },
        { name:'MovMedidaRestoEquipo', type:'float', useNull: true },
        { name:'MovMedidaRestoEquipoUnd', type:'string', useNull: true},
        { name:'x_FechaCompletado', type:'string', useNull: true },
        { name:'MovCurrentRepartoId', type:'int', useNull: true}
        ],

        proxy:{
            type:'rest',
            url:'../wa/api/ViewDistribucion',
            headers: {
                'Authorization-Token': Ext.util.Cookies.get('Seguridad.AppAuth')
            },
            reader:{
                type:'json',
                rootProperty:'data',
                totalProperty: 'total',
                successProperty: 'success',
                messageProperty: 'message',
                idProperty: 'MovId'
            },
            writer:{
                type:'json',
                writeAllFields: true
            },
            afterRequest: function (request, success) {
                if (request.action == 'read') {
                    //this.readCallback(request);
                }
                else if (request.action == 'create') {
                    if (!request.operation.success)
                    {
                        Ext.popupMsg.msg("Alerta", "El Registro no se cre\u00F3 correctamente");
                        Ext.global.console.warn(request.proxy.reader.jsonData.message);
                    } else {
                        Ext.popupMsg.msg("Informaci\u00F3n","Creado correctamente");
                    }
                }
                else if (request.action == 'update') {
                    if (!request.operation.success)
                    {
                        Ext.popupMsg.msg("Alerta", "Error al grabar el registro");
                        Ext.global.console.warn(request.proxy.reader.jsonData.message);
                    } else {
                        Ext.popupMsg.msg("Informaci\u00F3n","Actualizado Correctamente");
                    }
                }
                else if (request.action == 'destroy') {
                    if (!request.operation.success)
                    {
                        Ext.popupMsg.msg("Alerta", "Error al eliminar el registro");
                    } else {
                        Ext.popupMsg.msg("Informaci\u00F3n","Eliminado Correctamente");
                    }
                }
            }
        }
    } 
});