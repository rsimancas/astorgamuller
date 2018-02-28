Ext.define('Images.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Images.view.ImageForm'
    ],
    config: {
        fullscreen: true,
        layout: 'card',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: getURLParams().MovViaje,
            items: [{
                xtype: 'button',
                text: 'Back',
                action: 'back',
                ui: 'back',
                hidden: true
            }]
        }, 
        {
            xtype: 'imageform'
        }]
    }
});