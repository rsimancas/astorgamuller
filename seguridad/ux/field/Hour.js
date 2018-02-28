Ext.define('Ext.ux.field.Hour', {
    extend : 'Ext.field.Text',
    xtype  : 'hourfield',

    initialize: function() {
        var me    = this,
            input = me.getInput().element.down('input');

        input.set({
            pattern: '/^(\d{1,2}):(\d{2})([ap]m)?$/'
        });

        me.callParent(arguments);
    }
});