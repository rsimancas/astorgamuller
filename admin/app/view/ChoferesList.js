Ext.define('Muller.view.ChoferesList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.chofereslist',
    title: 'Choferes',

    initComponent: function() {
        var me = this;

        Ext.require([
            'Muller.view.Choferes',
        ]);

        storeChoferes = Ext.create('Muller.store.Choferes').load();

        Ext.applyIf(me, {
            items:[
            {
                xtype: 'gridpanel',
                itemId: 'gridmain',
                autoScroll: true,
                columnWidth: 1,
                viewConfig: {
                    stripeRows: true
                },
                minHeight: 450,
                forceFit: true,
                store: storeChoferes,
                columns: [
                {
                    xtype: 'rownumberer',
                    width:50
                },
                {
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 80,
                    dataIndex: 'ChoferId',
                    text: 'ID',
                    format: '000'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'ChoferNombreCompleto',
                    text: 'Nombre y Apellido'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'ChoferCedula',
                    text: 'Cédula'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'ChoferTelefono',
                    text: 'Telefono'
                },
                {
                    xtype: 'actioncolumn',
                    width: 35,
                    items: [
                    {
                        handler: me.onCellDobleClick,
                        scope: me,
                        iconCls: 'app-find',
                        //iconCls: 'x-form-search-trigger',
                        tooltip: 'Editar'
                    }]
                }
                ],
                tbar:
                [
                {
                    xtype: 'combo',
                    name: 'searchField',
                    itemId: 'searchfield',
                    width: '50%',
                    enableKeyEvents: true,
                    emptyText: 'Escriba y pulse enter para buscar',
                    triggerCls: 'x-form-search-trigger',
                    // override onTriggerClick
                    onTriggerClick: function() {
                        me.onSearchFieldChange();
                    },
                    listeners: {
                        keyup: function(field, e, eOpts) {
                            if (e.getCharCode() == Ext.EventObject.ENTER) {
                                me.onSearchFieldChange();
                            }
                            e.preventDefault();
                        },
                        change: function (field, newValue, oldValue) {
                            var valor = field.getRawValue();
                            if(String.isNullOrEmpty(valor)) {
                                me.onSearchFieldChange();
                            }
                        }
                    }
                },
                {
                    xtype: 'component',
                    flex: 1
                },
                {
                    itemId: 'addline',
                    xtype: 'button',
                    text: 'Agregar',
                    handler : function() {
                        var me = this.up('form');
                        var grid = me.down('gridpanel');

                        var storeToNavigate =  Ext.create('Muller.store.Choferes');

                        var form = Ext.widget('choferes', {
                            storeNavigator: storeToNavigate,
                            modal: true,
                            width: 700,
                            frameHeader: true,
                            header: true,
                            layout: {
                                type: 'column'
                            },
                            bodyPadding: 10,
                            closable: true,
                            stateful: false,
                            floating: true,
                            callerForm: me,
                            forceFit: true
                        });

                        form.show();
                        var btn = form.down('#FormToolbar').down('#add');
                        btn.fireEvent('click', btn);
                    }
                }, 
                {
                    itemId: 'deleteline',
                    text: 'Eliminar',
                    handler: function() {
                        var grid = this.up('gridpanel');
                        var sm = grid.getSelectionModel();

                        var selection = sm.getSelection();

                        if(selection){
                            selection[0].destroy({
                                success: function() {
                                    grid.store.reload();
                                }
                            });
                        }
                    },
                    disabled: true
                }
                ],
                selType: 'rowmodel',
                bbar: new Ext.PagingToolbar({
                    itemId: 'pagingtoolbar',
                    store: storeChoferes,
                    displayInfo: true,
                    displayMsg: 'Mostrando {0} - {1} de {2}',
                    emptyMsg: "No hay registros para mostrar"
                }),
                listeners: {
                    celldblclick: {
                        fn: me.onCellDobleClick,
                        scope: me
                    },
                    selectionchange : function(view, records) {
                        this.down('#deleteline').setDisabled(!records.length);
                    },
                    validateedit: function(e) {
                        var myTargetRow = 6;

                        if (e.rowIdx == myTargetRow) {
                            e.cancel = true;
                            e.record.data[e.field] = e.value;
                        }
                    }
                }
            }],
            listeners: {
                render: {
                    fn: me.onRenderForm,
                    scope: me
                },
                afterrender: {
                    fn: me.registerKeyBindings,
                    scope: me
                }
            }

        });

        me.callParent(arguments);
    },

    onRenderForm: function() {
        var me = this;

        var grid = me.down('#gridmain');

        if(grid.getSelectionModel().selected.length === 0) {
            grid.getSelectionModel().select(0);
        }

        var field = me.down('#searchfield').focus(true, 200);
    },

    registerKeyBindings: function(view, options){
        var me = this;
        Ext.EventManager.on(view.getEl(), 'keyup', function(evt, t, o) {
            if (evt.keyCode === Ext.EventObject.INSERT) {
                evt.stopEvent();
                var btn = me.down('#addline');
                btn.fireHandler();
            }
        }, 
        this);
    },

    onSearchFieldChange: function() {
        var form = this,
            field = form.down('#searchfield'),
            fieldValue = field.getRawValue(),
            grid = form.down('#gridmain');
        
        grid.store.removeAll();

        if(!String.isNullOrEmpty(fieldValue)) {
            //field.triggerEl.show();
            grid.store.loadPage(1, {params:{query:fieldValue,tipo:'D'}, callback: function() {
                form.down('#pagingtoolbar').bindStore(this);
            }});
        } else {
            //field.triggerEl.hide(true);
            grid.store.loadPage(1, {params:{tipo:'D'},callback: function() {
                form.down('#pagingtoolbar').bindStore(this);
            }});
        }
    },

    onCellDobleClick: function() {
        var me = this,
            record = me.down('gridpanel').getSelectionModel().getLastSelected();

        if(Ext.isObject(arguments[5])) record = arguments[5];

        var storeChoferes = Ext.create('Muller.store.Choferes').load({
            params:{id: record.data.ChoferId}, 
            callback: function() {
                var form = Ext.widget('choferes', {
                    storeNavigator: storeChoferes,
                    modal: true,
                    width: 700,
                    frameHeader: true,
                    header: true,
                    layout: {
                        type: 'column'
                    },
                    bodyPadding: 10,
                    closable: true,
                    //constrain: true,
                    stateful: false,
                    floating: true,
                    callerForm: me,
                    forceFit: true
                });

                form.down('#FormToolbar').gotoAt(1);

                form.show();
            }
        });
        // var field = form.down('field[name=MovChofer]');
        // //field.setValue(value);
        // field.focus(true, 200);
    }

});