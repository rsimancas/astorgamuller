Ext.define('Muller.model.admin.Gastos', {
    extend: 'Ext.data.Model',
    autoLoad: false,

    fields: [
    { name:'GastoId', type:'int', defaultValue: null },
    { name:'GastoCreadoPor', type:'string' },
    { name:'GastoCreado', type:'date', defaultValue: null },
    { name:'GastoModificadoPor', type:'string', useNull: true, defaultValue: null },
    { name:'GastoModificado', type:'date', useNull: true, defaultValue: null },
    { name:'GastoPeriodo', type:'date', defaultValue: null },
    { name:'GastoComentario', type:'string', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url:'../wa/api/Gastos',
        headers: {
           'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'GastoId'
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