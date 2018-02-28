Ext.define('Muller.store.Search', {
    extend: 'Ext.data.Store',
    alias: 'store.Search',
    autoLoad: false,
    pageSize: 8,

    requires: [
        'Muller.model.Search'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Muller.model.Search',
            //storeId: 'Paisestore',
            proxy: {
                type: 'localstorage',
                id: 'twitter-search'
            },
        }, cfg)]);
    }
});