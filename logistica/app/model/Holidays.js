Ext.define('Muller.model.Holidays', {
    extend: 'Ext.data.Model',
    idProperty: 'HolidayId',
    autoLoad: false,

    fields: [
    { name:'HolidayId', type:'int'},
    { name:'HolidayName', type:'string' },
    { name:'HolidayYear', type:'int', defaultValue: null },
    { name:'HolidayMonth', type:'int', defaultValue: null },
    { name:'HolidayDay', type:'int', defaultValue: null },
    { name:'HolidayIsWorkDay', type:'boolean', useNull: true, defaultValue: null },
    { name:'x_HolidayDate', type:'date'}
    ],

    proxy:{
        type:'rest',
        url:'../wa/api/Holidays',
        headers: {
           'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'HolidayId'
        },
        afterRequest: function (request, success) {
            if (request.action == 'read') {
                //this.readCallback(request);
            }
            else if (request.action == 'create') {
                if (!request.operation.success)
                {
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                    Ext.popupMsg.msg("Alerta", "Error al grabar el registro");
                } else {
                    Ext.popupMsg.msg("Informaci\u00F3n","Cambios grabados correctamente");
                }
            }
            else if (request.action == 'update') {
                if (!request.operation.success)
                {
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                    Ext.popupMsg.msg("Alerta", "Error al grabar el registro");
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