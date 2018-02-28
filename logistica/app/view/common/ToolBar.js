Ext.define('Muller.view.common.ToolBar', {
	extend: 'Ext.toolbar.Toolbar',
	xtype: 'app_toolbar',
    style: 'background-color:transparent;',

    requires: [
        'Muller.view.EstatusList',
        'Muller.view.ClientesList',
        'Muller.view.CiudadesList', 
        'Muller.view.ExpedienteList',
        'Muller.view.ImportacionList',
        'Muller.view.EquiposList',
        'Muller.view.TabuladorList',
        'Muller.view.EstatusInfoList',
        'Muller.view.SecuenciasList',
        'Muller.view.HolidaysList',
        'Muller.view.ChoferesList'
    ],

	initComponent: function() {

		var auth = Ext.util.Cookies.get("CurrentUser");
        
		var currentUser = Ext.JSON.decode(auth);
        var tipo = typeof currentUser.UsuarioNombreCompleto;
        
        var fullName = ("string" == tipo)  ? currentUser.UsuarioNombreCompleto : '';

		Ext.apply(this, {
            items: [
            {
                xtype: 'component',
                flex: 1
            },
            {
                xtype: 'button',
                text: 'Distribuci\u00F3n',
                cls:'x-btn-toolbar-small-cus',
                handler: function() {

                    var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Espere por favor..."});

                    myMask.show();

                    var form = Ext.widget('distribucionlist', {});

                    var panel = Ext.getCmp('content-panel');

                    panel.removeAll();
                    panel.add(form);

                    form.getEl().slideIn('r', {
                        easing: 'backOut',
                        duration: 1000,
                        listeners: {
                            afteranimate: function() {
                                form.down("field[name=searchField]").focus(true, 200);
                                myMask.destroy();
                            }
                        }
                    });
                }
            },'-',
            {
                xtype: 'button',
                text: 'Importaci\u00F3n',
                cls:'x-btn-toolbar-small-cus',
                handler: function() {
                    var form = Ext.widget('importacionlist', {});

                    var panel = Ext.getCmp('content-panel');

                    panel.removeAll();
                    panel.add(form);

                    form.getEl().slideIn('r', {
                        easing: 'backOut',
                        duration: 1000,
                        listeners: {
                            afteranimate: function() {
                                form.down("field[name=searchField]").focus(true, 200);
                            }
                        }
                    });
                }
            },'-',
            {
                xtype: 'button',
                text: 'Expedientes',
                cls:'x-btn-toolbar-small-cus',
                handler: function() {
                    var form = Ext.widget('expedientelist', {});

                    var panel = Ext.getCmp('content-panel');

                    panel.removeAll();
                    panel.add(form);

                    form.getEl().slideIn('r', {
                        easing: 'backOut',
                        duration: 1000,
                        listeners: {
                            afteranimate: function() {
                                form.down("field[name=searchField]").focus(true, 200);
                            }
                        }
                    });
                }
            },'-',
            {
                xtype:'splitbutton',
                text: 'Fichas',
                menu: [
                {
                    text: 'Clientes',
                    handler: function() {
                        var form = Ext.widget('clienteslist', {});

                        var panel = Ext.getCmp('content-panel');

                        panel.removeAll();
                        panel.add(form);

                        form.getEl().slideIn('r', {
                            easing: 'backOut',
                            duration: 1000,
                            listeners: {
                                afteranimate: function() {
                                    form.down("field[name=searchField]").focus(true, 200);
                                }
                            }
                        });
                    }
                },
                {
                    text: 'Ciudades',
                    handler: function() {
                        var form = Ext.widget('ciudadeslist', {});

                        var panel = Ext.getCmp('content-panel');

                        panel.removeAll();
                        panel.add(form);

                        form.getEl().slideIn('r', {
                            easing: 'backOut',
                            duration: 1000,
                            listeners: {
                                afteranimate: function() {
                                    form.down("field[name=searchField]").focus(true, 200);
                                }
                            }
                        });
                    }
                },
                {
                    text: 'Equipos',
                    handler: function() {
                        var form = Ext.widget('equiposlist', {});

                        var panel = Ext.getCmp('content-panel');

                        panel.removeAll();
                        panel.add(form);

                        form.getEl().slideIn('r', {
                            easing: 'backOut',
                            duration: 1000,
                            listeners: {
                                afteranimate: function() {
                                    form.down("field[name=searchField]").focus(true, 200);
                                }
                            }
                        });
                    }
                },
                {
                    text: 'Tabulador (Varemo)',
                    handler: function() {
                        var form = Ext.widget('tabuladorlist', {});

                        var panel = Ext.getCmp('content-panel');

                        panel.removeAll();
                        panel.add(form);

                        form.getEl().slideIn('r', {
                            easing: 'backOut',
                            duration: 1000,
                            listeners: {
                                afteranimate: function() {
                                    form.down("field[name=searchField]").focus(true, 200);
                                }
                            }
                        });
                    }
                },
                {
                    text: 'Estatus',
                    handler: function() {
                        var form = Ext.widget('estatuslist', {});

                        var panel = Ext.getCmp('content-panel');

                        panel.down('panel').close();

                        // panel.down('form').getEl().slideOut('r', {
                        //     easing: 'easeOut',
                        //     duration: 2000,
                        //     remove: true,
                        //     useDisplay: true
                        // });
                        
                        panel.removeAll();
                        panel.add(form);

                        form.getEl().slideIn('r', {
                            easing: 'backOut',
                            duration: 1000,
                            listeners: {
                                afteranimate: function() {
                                    form.down("field[name=searchField]").focus(true, 200);
                                }
                            }
                        });
                    }
                },
                {
                    text: 'Estatus Informativo',
                    handler: function() {
                        var form = Ext.widget('estatusinfolist', {});

                        var panel = Ext.getCmp('content-panel');

                        panel.removeAll();
                        panel.add(form);

                        form.getEl().slideIn('r', {
                            easing: 'backOut',
                            duration: 1000,
                            listeners: {
                                afteranimate: function() {
                                    form.down("field[name=searchField]").focus(true, 200);
                                }
                            }
                        });
                    }
                },
                {
                    text: 'Secuencias',
                    handler: function() {
                        var form = Ext.widget('secuenciaslist', {});

                        var panel = Ext.getCmp('content-panel');

                        panel.removeAll();
                        panel.add(form);

                        form.getEl().slideIn('r', {
                            easing: 'backOut',
                            duration: 1000,
                            listeners: {
                                afteranimate: function() {
                                    form.down("field[name=searchField]").focus(true, 200);
                                }
                            }
                        });
                    }
                },
                {
                    text: 'Calendario',
                    handler: function() {
                        var form = Ext.widget('holidayslist', {});

                        var panel = Ext.getCmp('content-panel');

                        panel.removeAll();
                        panel.add(form);

                        form.getEl().slideIn('r', {
                            easing: 'backOut',
                            duration: 1000,
                            listeners: {
                                afteranimate: function() {
                                    form.down("field[name=searchField]").focus(true, 200);
                                }
                            }
                        });
                    }
                },
                {
                    text: 'Choferes',
                    handler: function() {
                        var form = Ext.widget('chofereslist', {});

                        var panel = Ext.getCmp('content-panel');

                        panel.removeAll();
                        panel.add(form);

                        form.getEl().slideIn('r', {
                            easing: 'backOut',
                            duration: 1000,
                            listeners: {
                                afteranimate: function() {
                                    form.down("field[name=searchField]").focus(true, 200);
                                }
                            }
                        });
                    }
                }
                ]                
            },'-',
            {
            	xtype:'splitbutton',
                iconCls: 'app-user',
            	text: fullName,
            	menu:[{
                    iconCls: 'app-logout',
                    text: 'Logout',
        			handler: function(){
            			Ext.util.Cookies.clear("MullerAuth");
                        Ext.util.Cookies.clear("CurrentUser");
            			Ext.MessageBox.wait('Cerrando','Cerrando Sesion...');
            			var url = location.href;
                        url = url.split('#');
                        location.href = url[0];
            		}
                }]
            }]
        });

		this.callParent(arguments);
	}
});