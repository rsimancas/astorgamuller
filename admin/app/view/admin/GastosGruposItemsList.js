Ext.define('Muller.view.admin.GastosGruposItemsList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.gastosgrupositemslist',
    title: 'Clasificación de Gastos',
    // //width: 760,
    // //height: 300,
    // forceFit: true,
    // bodyPadding: 10,
    // layout: {
    //     type: 'column'
    // },
    //frameHeader: false,

    initComponent: function() {
        var me = this;

        var storeGastosGruposItems = Ext.create('Muller.store.admin.GastosGruposItems').load();

        rowEditing = new Ext.grid.plugin.RowEditing({
            clicksToMoveEditor: 2,
            autoCancel: false,
            errorSummary: false,
            listeners: {
                beforeedit: {
                    delay: 100,
                    fn: function (item, e) {
                        this.getEditor().onFieldChange();
                    }
                },
                cancelEdit: { 
                    fn: function (rowEditing, context) {
                        var grid = this.editor.up("gridpanel");
                        // Canceling editing of a locally added, unsaved record: remove it
                        if (context.record.phantom) {
                            grid.store.remove(context.record);
                            grid.up('panel').down('searchfield').focus(true, 200);
                        }
                    }
                },
                edit: {
                    fn: function (editor, context) {
                        var grid = this.editor.up('gridpanel'),
                            record = context.record,
                            fromEdit = true,
                            isPhantom = record.phantom;
                        
                        record.save({
                            callback: function() {
                                grid.store.reload({
                                    callback: function(){
                                        if(fromEdit && isPhantom)
                                        grid.up('panel').down("#addline").fireHandler();
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });

        Ext.applyIf(me, {
            items:[
            {
                xtype: 'gridpanel',
                itemId:'gridmain',
                autoScroll: true,
                columnWidth: 1,
                viewConfig: {
                    stripeRows: true
                },
                minHeight: 450,
                forceFit: true,
                store: storeGastosGruposItems,
                columns: [
                {
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 80,
                    dataIndex: 'GGrupoItemId',
                    text: 'ID',
                    format: '000'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'GGrupoItemNombre',
                    text: 'Nombre',
                    editor: {
                        itemId: 'gastosgrupositemsnombre',
                        xtype:'textfield',
                        name: 'GGrupoItemNombre',
                        fieldStyle:'text-transform:uppercase',
                        allowBlank: false,
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                var form = field.up('panel');
                                form.onFieldChange();
                                
                                if(!String.isNullOrEmpty(newValue)) field.setValue(newValue.toUpperCase());
                            }
                        }
                    }
                },
                {
                    xtype: 'actioncolumn',
                    width: 35,
                    items: [
                    {
                        handler: me.onClickActionColumn,
                        iconCls: 'app-grid-edit',
                        //iconCls: 'x-form-search-trigger',
                        tooltip: 'Editar'
                    }]
                }
                ],
                tbar:
                [
                {
                    xtype: 'combo',
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
                        rowEditing.cancelEdit();

                        var grid = this.up("gridpanel");
                        
                        var count = grid.store.getCount();

                        // Create a model instance
                        var r = Ext.create('Muller.model.admin.GastosGruposItems');

                        grid.store.insert(count, r);
                        rowEditing.startEdit(count, 0);
                        rowEditing.editor.down('field[name=GGrupoItemNombre]').focus(true, 200);
                    }
                }, 
                {
                    itemId: 'deleteline',
                    text: 'Eliminar',
                    handler: function() {
                        var grid = this.up('gridpanel');
                        var sm = grid.getSelectionModel();

                        rowEditing.cancelEdit();

                        selection = sm.getSelection();

                        if(selection){
                            selection[0].destroy({
                                success: function() {
                                    grid.store.reload({callback: function(){ sm.select(0); } });
                                }
                            });
                        }
                    },
                    disabled: true
                }
                ],
                selType: 'rowmodel',
                plugins: [rowEditing],
                bbar: new Ext.PagingToolbar({
                    itemId:'pagingtoolbar',
                    store: storeGastosGruposItems,
                    displayInfo: true,
                    displayMsg: 'Mostrando {0} - {1} of {2}',
                    emptyMsg: "No hay registros para mostrar"
                }),
                listeners: {
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
                },
            }

        });

        me.callParent(arguments);
    },

    onRenderForm: function() {
        var me = this;

        var grid = me.down('gridpanel');

        if(grid.getSelectionModel().selected.length === 0) {
            grid.getSelectionModel().select(0);
        }
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
            grid = form.down('gridpanel');
        
        grid.store.removeAll();

        if(!String.isNullOrEmpty(fieldValue)) {
            grid.store.loadPage(1, {params:{query:fieldValue}, callback: function() {
                form.down('#pagingtoolbar').bindStore(this);
            }});
        } else {
            grid.store.loadPage(1, {callback: function() {
                form.down('#pagingtoolbar').bindStore(this);
            }});
        }
    },

    onClickActionColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel').up('panel');

        rowEditing.startEdit(record, 1);
        this.up('panel').editingPlugin.editor.down('field[name=GGrupoItemNombre]').focus(true, 200);
    }

});