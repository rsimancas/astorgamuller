Ext.define('Muller.store.Holidays', {
    extend: 'Ext.data.Store',
    alias: 'store.holidays',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'Muller.model.Holidays'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Muller.model.Holidays',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: '../wa/api/Holidays',
                headers: {
                    'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'HolidayId'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                },

                //clean up handlers
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
            }
        }, cfg)]);
    }
});