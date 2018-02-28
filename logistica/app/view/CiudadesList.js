Ext.define('Muller.view.CiudadesList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ciudadeslist',
    title: 'Ciudades',

    initComponent: function() {
        var me = this;

        Ext.require([
            'Ext.toolbar.Paging',
        ]);

        storeCiudades = Ext.create('Muller.store.Ciudades').load();
        storeEstados = Ext.create('Muller.store.Estados').load({params:{page:0, start:0, limit:0}});

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
                        var grid = rowEditing.editor.up("gridpanel");
                        // Canceling editing of a locally added, unsaved record: remove it
                        if (context.record.phantom) {
                            grid.store.remove(context.record);
                        }
                    }
                },
                edit: {
                    fn: function (rowEditing, context) {
                        var grid = rowEditing.editor.up('gridpanel'),
                            record = context.record,
                            fields = record.fields;

                        Ext.each(fields.items, function(el, index, items) {
                            var item = items[index],
                                itemValue = record.get(item.name);

                            if(item.useNull && item.type.type==="string" && item.defaultValue===null && String.isNullOrEmpty(itemValue)) {
                                itemValue = null;
                                record.set(item.name, itemValue);
                            }

                            var field = rowEditing.editor.down('field[name='+item.name+']');

                            if(field !== null && field.fieldStyle === "text-transform:uppercase" && !String.isNullOrEmpty(itemValue) ) {
                                record.set(item.name, itemValue.toUpperCase());
                            }
                        });

                        record.save({callback: function() {grid.store.reload();}});
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
                store: storeCiudades,
                columns: [
                {
                    xtype: 'rownumberer',
                    width:50
                },
                {
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 80,
                    dataIndex: 'CiudadId',
                    text: 'ID',
                    format: '0,000'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'CiudadNombre',
                    text: 'Nombre',
                    editor: {
                        xtype:'textfield',
                        name: 'CiudadNombre',
                        fieldStyle:'text-transform:uppercase',
                        allowBlank: false,
                        listeners: {
                            blur: function (field, e, eOpts) {
                                var form = field.up('panel');
                                form.onFieldChange();
                            },
                            change: function(field, newValue, oldValue) {
                                var form = field.up('panel');
                                form.onFieldChange();
                            }
                        }
                    }
                },
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'CiudadMunicipio',
                    text: 'Municipio',
                    editor: {
                        xtype:'textfield',
                        name: 'CiudadMunicipio',
                        fieldStyle:'text-transform:uppercase',
                        allowBlank: true,
                        listeners: {
                            blur: function (field, e, eOpts) {
                                var form = field.up('panel');
                                form.onFieldChange();
                            },
                            change: function(field, newValue, oldValue) {
                                var form = field.up('panel');
                                form.onFieldChange();
                            }
                        }
                    }
                },
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'x_Estado',
                    text: 'Estado',
                    editor: {
                        xtype:'combo',
                        displayField: 'EstadoNombre',
                        fieldStyle:'text-transform:uppercase',
                        valueField: 'EstadoId',
                        name: 'EstadoId',
                        queryMode: 'local',
                        typeAhead: true,
                        minChars: 1,
                        allowBlank: false,
                        forceSelection: true,
                        emptyText: 'Seleccionar',
                        enableKeyEvents: true,
                        autoSelect:false,
                        matchFieldWidth: false,
                        listConfig: {
                            width: 150
                        },
                        selectOnFocus: true,
                        listeners: {
                            change: function(field, newValue, oldValue, eOpts) {
                                var form = field.up('panel');
                                form.onFieldChange();
                            },
                            select: function(field, records, eOpts){
                                var form = field.up('panel'),
                                    record = form.context.record;

                                if(records[0]) 
                                record.set('x_Estado', records[0].data.EstadoNombre);
                            }
                        },
                        store:storeEstados
                    }
                },
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'CiudadCodigo',
                    text: 'Codigo IATA',
                    editor: {
                        xtype:'textfield',
                        name: 'CiudadCodigo',
                        fieldStyle:'text-transform:uppercase',
                        allowBlank: true,
                        listeners: {
                            blur: function (field, records, eOpts) {
                                var form = field.up('panel');
                                form.onFieldChange();
                            },
                            change: function(field, newValue, oldValue, eOpts) {
                                var form = field.up('panel');
                                form.onFieldChange();
                            }
                        }
                    }
                },
                {
                    xtype:'numbercolumn',
                    flex: 1,
                    dataIndex:'CiudadDeadLine',
                    text: 'Dead Line',
                    align: 'right',
                    format: '00,000',
                    editor: {
                        xtype:'numericfield',
                        name: 'CiudadDeadLine',
                        minValue: 1,
                        hideTrigger: false,
                        useThousandSeparator: true,
                        decimalPrecision: 0,
                        alwaysDisplayDecimals: false,
                        allowNegative: false,
                        alwaysDecimals: false,
                        thousandSeparator: ',',
                        fieldStyle: 'text-align: right;',
                        listeners: {
                            change: function(field) {
                                var form = field.up('panel');
                                form.onFieldChange();
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
                        change: function (field, newValue, oldValue, eOpts) {
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
                        var r = Ext.create('Muller.model.Ciudades');

                        grid.store.insert(count, r);
                        rowEditing.startEdit(count, 0);
                        rowEditing.editor.down('field[name=CiudadNombre]').focus(true, 200);
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
                                    grid.store.reload();
                                    // grid.store.remove(sm.getSelection());
                                    // if (grid.store.getCount() > 0) {
                                    //     sm.select(0);
                                    // }
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
                    store: storeCiudades,
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
        this.up('panel').editingPlugin.editor.down('field[name=CiudadNombre]').focus(true, 200);
    }

});