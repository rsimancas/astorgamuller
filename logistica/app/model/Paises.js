Ext.define('Muller.model.Paises', {
    extend: 'Ext.data.Model',
    idProperty: 'PaisId',
    autoLoad: false,

    fields: [
    { name:'PaisId', type:'int' },
    { name:'PaisCodigo', type:'string', useNull: true, defaultValue: null },
    { name:'PaisNombre', type:'string' },
    { name:'PaisCreado', type:'date', defaultValue: new Date() },
    { name:'PaisModificado', type:'date', useNull: true },
    { name:'PaisCreadoPor', type:'string', defaultValue: Ext.JSON.decode(Ext.util.Cookies.get("CurrentUser")).UsuarioId },
    { name:'PaisModificadoPor', type:'string', useNull: true, defaultValue: null },
    ],

    proxy:{
        type:'rest',
        url:'../wa/api/Paises',
        headers: {
           'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'PaisId'
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