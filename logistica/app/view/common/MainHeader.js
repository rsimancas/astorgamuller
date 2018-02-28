 Ext.define('Muller.view.common.MainHeader', {
 	extend: 'Ext.container.Container',

 	xtype: 'app_header',
 	autorRender: true,
 	autoShow: true,
 	frame: true,
 	split: false,
 	//height: 70,
 	layout: {
 		type: 'hbox'
 	},

 	requires: [
 		'Muller.view.common.ToolBar'
 	],

 	initComponent: function() {
 		var me = this;

 		Ext.applyIf(me, {
 			
 			items: [
 			{
 				xtype: 'container',
 				html: '<div><img src="images/logo_header.png" height="40"/>',
 				flex: 1
 			},
			{ 
 				xtype: 'app_toolbar',
 				border: 0,
 				margin: '0 0 0 0',
 			}
 			]
 		});

 		me.callParent(arguments);
 	}

 });