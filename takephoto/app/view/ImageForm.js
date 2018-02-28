/**
 * @class Images.view.ImageForm
 * @extends Ext.form.Panel
 * @author Crysfel Villa <crysfel@moduscreate.com>
 *
 * The form to add new users
 */
Ext.define('Images.view.ImageForm', {
    extend: 'Ext.form.Panel',
    xtype: 'imageform',
    requires: [
        'Images.view.CapturePicture',
        'Ext.field.Email'
    ],

    config: {
        cls: 'user-form',
        items: [{
            xtype: 'capturepicture'
        },
        {
            xtype: 'textfield',
            name: 'MovViaje',
            label: 'Name',
            margin: '0 20',
            hidden: true,
            value: getURLParams().MovViaje
        },
        {
            xtype: 'numberfield',
            name: 'MovId',
            label: 'Name',
            margin: '0 20',
            hidden: true,
            value: getURLParams().MovId
        }, {
            xtype: 'button',
            action: 'save',
            id: 'saveButton',
            ui: 'action',
            text: 'Guardar',
            disabled: true,
            margin: Ext.os.is.Phone ? '10 20' : '10 20 10 20',
            //width: 300,
        }]
    },

    reset: function() {
        this.callParent(arguments);
        this.down('capturepicture').reset();
    }
});