Ext.define('Muller.model.Search', {
    extend: 'Ext.data.Model',
    autoLoad: false,

    fields: ['id', 'query'],

    proxy: {
        type: 'localstorage',
        id  : 'twitter-Searches'
    }
})
