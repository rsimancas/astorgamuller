Ext.define('MyApp.store.Repartos', {
    extend: 'Ext.data.Store',
    alias: 'store.repartos',

    //pageSize: 14,

    // requires: [
    //     'MyApp.model.Repartos'
    // ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'MyApp.model.Repartos',
            remoteSort: true,
            requires: ['Ext.util.Cookies'],
            proxy: {
                type: 'rest',
                url: '../wa/api/Repartos',
                headers: {
                    'Authorization-Token': Ext.util.Cookies.get('Seguridad.AppAuth')
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'RepartoId'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                },

                afterRequest: function(request, success) {

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
                    Ext.popupMsg.msg("Informaci\u00F3n","Cambios guardados correctamente!!!");
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