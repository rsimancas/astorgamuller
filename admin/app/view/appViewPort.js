Ext.define('Muller.view.appViewPort', {
    extend: 'Ext.container.Viewport',
    id: 'app-viewport',

    layout: {
        type: 'border'
    },

    requires: [
    'Muller.view.common.ContentPanel',
    'Muller.view.common.MainHeader',
    'Muller.view.DistribucionList'
    ],

    initComponent: function() {
        var me = this;

        //var storeTreeView = Ext.create('Muller.store.NavTree');


        Ext.applyIf(me, {
            items: [
            {
                region: 'north',
                xtype: 'app_header'
            },
            {
                region: 'west',
                hidden: true
            },
            {
                region: 'center',
                xtype: 'app_ContentPanel',
                forceFit: true,
                items:[Ext.widget('distribucionlist')]
            },
            {
                region: 'east',
                hidden: true
            },
            {
                region: 'south',
                hidden: true
            }
            ]
        });

        me.callParent(arguments);
    }
});