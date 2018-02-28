Ext.define('Muller.model.Choferes', {
    extend: 'Ext.data.Model',
    autoLoad: false,

    fields: [
    { name:'ChoferId', type:'int'},
    { name:'ChoferApellido', type:'string' },
    { name:'ChoferNombre', type:'string' },
    { name:'ChoferNombreCompleto', type:'string', useNull: true, defaultValue: null },
    { name:'ChoferCedula', type:'string' },
    { name:'ChoferLicenciaExpira', type:'date', useNull: true, defaultValue: null },
    { name:'ChoferExpiraCertificado', type:'date', useNull: true, defaultValue: null },
    { name:'ChoferTelefono', type:'string', useNull: true, defaultValue: null },
    { name:'ChoferEmail', type:'string', useNull: true, defaultValue: null },
    { name:'ChoferTitularCuenta', type:'string', useNull: true, defaultValue: null },
    { name:'ChoferTipoCuenta', type:'int', defaultValue: null },
    { name:'ChoferBanco', type:'string', useNull: true, defaultValue: null },
    { name:'ChoferCedulaTitular', type:'string', useNull: true, defaultValue: null },
    { name:'ChoferTelefonoTitular', type:'string', useNull: true, defaultValue: null },
    { name:'ChoferEmailTitular', type:'string', useNull: true, defaultValue: null },
    { name:'ChoferCreadoPor', type:'string' },
    { name:'ChoferFechaCreado', type:'date', defaultValue: null },
    { name:'ChoferModificadoPor', type:'string', useNull: true, defaultValue: null },
    { name:'ChoferFechaModificado', type:'date', useNull: true, defaultValue: null },
    { name:'ChoferCuentaBanco', type:'string', useNull: true, defaultValue: null },
    ],

    proxy:{
        type:'rest',
        url:'../wa/api/Choferes',
        headers: {
           'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'ChoferId'
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