/**
 * @class Images.view.ImagesList
 * @extends Ext.dataview.List
 * @author Crysfel Villa <crysfel@moduscreate.com>
 *
 * The users list
 */
Ext.define('Images.view.ImagesList', {
    extend: 'Ext.dataview.List',
    xtype: 'userslist',
    requires: [
        'Images.store.Images'
    ],
    config: {
        cls: 'user-list',
        itemTpl: '<img src="{image}" /> {name}<br><small>{email}</small></p>',
        store: {
            type: 'users',
            autoLoad: true
        }
    }
});