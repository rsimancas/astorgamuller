Ext.define('Images.model.Image', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            { name: 'name', type: 'string' },
            { name: 'email', type: 'string' },
            { name: 'image', type: 'string' }

        ]
    }
});
