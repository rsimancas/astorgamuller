Ext.define('Muller.model.Estatus', {
    extend: 'Ext.data.Model',
    idProperty: 'EstatusId',
    autoLoad: false,

    fields: [
    { name:'EstatusId', type:'int' },
    { name:'EstatusNombre', type:'string' },
    { name:'EstatusCreado', type:'date', defaultValue: new Date() },
    { name:'EstatusModificado', type:'date', useNull: true },
    { name:'EstatusCreadoPor', type:'string', defaultValue: Ext.JSON.decode(Ext.util.Cookies.get("CurrentUser")).UsuarioId },
    { name:'EstatusModificadoPor', type:'string', useNull: true, defaultValue: null },
    { name:'EstatusTipo', type:'string' },
    { name:'EstatusOrden', type:'int' },
    { name:'x_Estatus', type:'string'}
    ],

    proxy:{
        type:'rest',
        url:'../wa/api/Estatus',
        headers: {
           'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'EstatusId'
        },
        afterRequest: function (request, success) {
            if (request.action == 'read') {
                //this.readCallback(request);
            }
            else if (request.action == 'create') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Alerta", "Error al grabar el registro");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Informaci\u00F3n","Cambios grabados correctamente");
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
                    Ext.popupMsg.msg("Alerta", "El registro no se elimin\u00F3 correctamente");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Informaci\u00F3n","Eliminado Correctamente");
                }
            }
        }
    },


});