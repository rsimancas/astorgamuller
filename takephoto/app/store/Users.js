/**
 * @class Images.store.Images
 * @extends Ext.data.Store
 * @author Crysfel Villa <crysfel@moduscreate.com>
 *
 * The users collection
 */
Ext.define('Images.store.Images', {
    extend: 'Ext.data.Store',
    alias: 'store.users',
    requires: [
        'Images.model.Image'
    ],

    config: {
        model: 'Images.model.Image',
        proxy: {
            type: 'ajax',
            url: '/api/users',
            reader: {
                type: 'json',
                rootProperty: 'users'
            }
        }
    }
});