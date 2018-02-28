Ext.define('Muller.model.Ciudades', {
    extend: 'Ext.data.Model',
    idProperty: 'CiudadId',
    autoLoad: false,

    fields: [
    { name:'CiudadId', type:'int' },
    { name:'EstadoId', type:'int', useNull: true },
    { name:'CiudadNombre', type:'string' },
    { name:'CiudadMunicipio', type:'string', useNull: true, defaultValue: null },
    { name:'CiudadCodigo', type:'string', useNull: true, defaultValue: null },
    { name:'CiudadCreado', type:'date', defaultValue: new Date() },
    { name:'CiudadModificado', type:'date', useNull: true },
    { name:'CiudadCreadoPor', type:'string', defaultValue: Ext.JSON.decode(Ext.util.Cookies.get("CurrentUser")).UsuarioId },
    { name:'CiudadModificadoPor', type:'string', useNull: true, defaultValue: null },
    { name:'CiudadDeadLine', type:'int', useNull:true, defaultValue: null},
    { name:'x_Estado', type:'string', useNull: true},
    { name:'x_CodigoNombre', type:'string', useNull: true}
    ],

    proxy:{
        type:'rest',
        url:'../wa/api/Ciudades',
        headers: {
           'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'CiudadId'
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