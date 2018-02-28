Ext.define('Muller.view.TabuladorList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.tabuladorlist',
    title: 'Tabulador',

    initComponent: function() {
        var me = this;

        var storeTabulador = Ext.create('Muller.store.Tabulador').load();
        storeCiudades = Ext.create('Muller.store.Ciudades').load({params:{iata:1,page:0, start:0, limit:0}});

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
                            grid.up('panel').down('#searchfield').focus(true, 200);
                        }
                    }
                },
                edit: {
                    fn: function (editor, context) {
                        var grid = this.editor.up('gridpanel'),
                            record = context.record,
                            fromEdit = true,
                            isPhantom = record.phantom;
                        //console.log(this.editor.form.isValid());
                        
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
                itemId: 'gridmain',
                autoScroll: true,
                columnWidth: 1,
                viewConfig: {
                    stripeRows: true
                },
                minHeight: 450,
                forceFit: true,
                store: storeTabulador,
                columns: [
                {
                    xtype: 'rownumberer',
                    width:30
                },
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'x_Ciudad',
                    text: 'Ciudad',
                    editor: {
                        xtype:'combo',
                        displayField: 'x_CodigoNombre',
                        valueField: 'CiudadId',
                        name: 'CiudadId',
                        queryMode: 'local',
                        typeAhead: true,
                        minChars: 1,
                        allowBlank: false,
                        forceSelection: true,
                        emptyText: 'Seleccionar',
                        enableKeyEvents: true,
                        autoSelect:true,
                        matchFieldWidth: true,
                        listConfig: {
                            width: 150
                        },
                        selectOnFocus: true,
                        listeners: {
                            change: function(field) {
                                var form = field.up('panel');
                                form.onFieldChange();
                            },
                            select: function(field, records, eOpts){
                                var form = field.up('panel'),
                                    record = form.context.record,
                                    ciudadDesc = (records[0]) ? records[0].data.x_CodigoNombre : null;
                                record.set("x_Ciudad", ciudadDesc);
                            },
                            beforequery: function(record){  
                                record.query = new RegExp(record.query, 'i');
                                record.forceAll = true;
                            }
                        },
                        store:storeCiudades
                    }
                },
                {
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 120,
                    dataIndex: 'TabTarifa',
                    text: 'Tarifa',
                    align: 'right',
                    format: '00,000.00',
                    editor: {
                        xtype:'numericfield',
                        name: 'TabTarifa',
                        //fieldLabel: 'Tarifa',
                        minValue: 0,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        decimalPrecision: 2,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        alwaysDecimals: false,
                        thousandSeparator: ',',
                        fieldStyle: 'text-align: right;',
                        listeners: {
                            change: function(field) {
                                var form = field.up('panel');
                                form.onFieldChange();
                            },
                            blur: function(field, The, eOpts ) {
                                if(field.value !== null) {
                                    if(field.value<=0) {
                                        field.focus(true, 200);
                                        return;
                                    }
                                }
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
                        rowEditing.cancelEdit();

                        var grid = this.up("gridpanel");
                        
                        var count = grid.store.getCount();

                        // Create a model instance
                        var r = Ext.create('Muller.model.Tabulador');

                        grid.store.insert(count, r);
                        rowEditing.startEdit(r, 1);
                        rowEditing.editor.down('field[name=CiudadId]').focus(true, 200);
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
                    itemId: 'pagingtoolbar',
                    store: storeTabulador,
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

        var grid = me.down('#gridmain');

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
                //console.log(btn); //.click();
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

    onClickActionColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel').up('panel');

        rowEditing.startEdit(record, 1);
        this.up('panel').editingPlugin.editor.down('field[name=CiudadId]').focus(true, 200);
    }

});