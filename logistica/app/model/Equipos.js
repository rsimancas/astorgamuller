Ext.define('Muller.model.Equipos', {
    extend: 'Ext.data.Model',
    idProperty: 'EquipoId',
    autoLoad: false,

    fields: [
    { name:'EquipoId', type:'int' },
    { name:'EquipoNum', type:'string' },
    { name:'EquipoPlaca', type:'string' },
    { name:'EquipoSerial', type:'string' },
    { name:'EquipoCreadoPor', type:'string', defaultValue: Ext.JSON.decode(Ext.util.Cookies.get("CurrentUser")).UsuarioId },
    { name:'EquipoFechaCreado', type:'date', defaultValue: new Date() },
    { name:'EquipoModificadoPor', type:'string', useNull: true, defaultValue: null },
    { name:'EquipoFechaModificado', type:'date', useNull: true },
    { name:'x_EquipoPlaca', type:'string'},
    { name:'x_Estatus', type:'string'}
    ],

    proxy:{
        type:'rest',
        url:'../wa/api/Equipos',
        headers: {
           'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'EquipoId'
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