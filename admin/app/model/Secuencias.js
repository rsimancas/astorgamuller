Ext.define('Muller.model.Secuencias', {
    extend: 'Ext.data.Model',
    idProperty: 'SecId',
    autoLoad: false,

    fields: [
    { name:'SecId', type:'int' },
    { name:'SecNombre', type:'string' },
    { name:'SecValor', type:'int' },
    { name:'SecCreado', type:'date' },
    { name:'SecCreadoPor', type:'string' },
    { name:'SecModificado', type:'date', useNull: true },
    { name:'SecModificadoPor', type:'string', useNull: true, defaultValue: null },
    { name:'SecPrefijo', type:'string', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url:'../wa/api/Secuencias',
        headers: {
           'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'SecId'
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