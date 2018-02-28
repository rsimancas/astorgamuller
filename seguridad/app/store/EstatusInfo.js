Ext.define('MyApp.store.EstatusInfo', {
    extend: 'Ext.data.Store',
    alias: 'store.EstatusInfo',
    autoLoad: false,
    //pageSize: 14,

    requires: [
        'MyApp.model.EstatusInfo'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.EstatusInfo',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: '../wa/api/EstatusInfo',
                headers: {
                    'Authorization-Token': Ext.util.Cookies.get('Seguridad.AppAuth')
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'EstaInfoId'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                },

                //clean up handlers
                afterRequest: function (request, success) {

                    if (request.action == 'read') {
                        me.readCallback(request);
                    }

                    else if (request.action == 'create') {
                        me.createCallback(request);
                    }

                    else if (request.action == 'update') {
                        me.updateCallback(request);
                    }

                    else if (request.action == 'destroy') {
                        me.deleteCallback(request);
                    }
                }
            },
            //After Albums fetched

            readCallback: function (request) {
                if (!request.operation.success)
                {
                    //...
                } else {
                    //console.log(request);
                }
            },

            //After A record/Album created

            createCallback: function (request) {
                if (!request.operation.success)
                {
                    //...
                }
            },

            //After Album updated

            updateCallback: function (request) {
                if (!request.operation.success)
                {
                    console.log(request);
                } else {
                    Ext.popupMsg.msg("Informaci\u00F3n","Cambios Guardados Correctamente");
                }
            },

            //After a record deleted

            deleteCallback: function (request) {
                if (!request.operation.success)
                {
                    //...
                }
            }
        }, cfg)]);
    }
});