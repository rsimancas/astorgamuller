Ext.define('Muller.model.Estados', {
    extend: 'Ext.data.Model',
    idProperty: 'EstadoId',
    autoLoad: false,

    fields: [
    { name:'EstadoId', type:'int' },
    { name:'PaisId', type:'int', useNull: true },
    { name:'EstadoNombre', type:'string' },
    { name:'EstadoCreado', type:'date' },
    { name:'EstadoModificado', type:'date', useNull: true },
    { name:'EstadoCreadoPor', type:'string' },
    { name:'EstadoModificadoPor', type:'string', useNull: true, defaultValue: null },
    //{ name:'rowguid', type:'string' },
    ],

    proxy:{
        type:'rest',
        url:'../wa/api/Estados',
        headers: {
           'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'EstadoId'
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