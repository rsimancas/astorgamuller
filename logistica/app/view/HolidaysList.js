Ext.define('Muller.view.HolidaysList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.holidayslist',
    title: 'Holidays',

    initComponent: function() {
        var me = this;

        var storeHolidays = Ext.create('Muller.store.Holidays').load();

        rowEditing = new Ext.grid.plugin.RowEditing({
            clicksToMoveEditor: 2,
            autoCancel: false,
            errorSummary: false,
            listeners: {
                beforeedit: {
                    //delay: 200,
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
                            me = grid.up('form'),
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
                },
                validateedit:{
                    fn: function(editor, context) {
                        var me = this.editor.up('form'),
                            record = this.editor.getValues();

                        if(!me.validRecord(record)) {
                            context.cancel=true;
                            return false;
                        }

                        return true;
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
                store: storeHolidays,
                columns: [
                {
                    xtype: 'rownumberer',
                    width:30
                },
                {
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 80,
                    dataIndex: 'HolidayId',
                    text: 'ID',
                    format: '000'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'HolidayName',
                    text: 'Se Celebra',
                    editor: {
                        xtype:'textfield',
                        displayField: 'HolidayName',
                        name: 'HolidayName',
                        minChars: 1,
                        allowBlank: false,
                        selectOnFocus: true,
                        listeners: {
                            change: function(field) {
                                var form = field.up('panel');
                                form.onFieldChange();
                            }
                        }
                    }
                },
                {
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 120,
                    dataIndex: 'HolidayYear',
                    text: 'Año',
                    align: 'right',
                    format: '0000',
                    editor: {
                        xtype:'numericfield',
                        name: 'HolidayYear',
                        minValue: 2013,
                        hideTrigger: false,
                        useThousandSeparator: false,
                        decimalPrecision: 0,
                        alwaysDisplayDecimals: false,
                        allowNegative: false,
                        alwaysDecimals: false,
                        //thousandSeparator: ',',
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
                                    };
                                }
                            }
                        }
                    }
                },
                {
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 120,
                    dataIndex: 'HolidayMonth',
                    text: 'Mes',
                    align: 'right',
                    format: '00',
                    editor: {
                        xtype:'numericfield',
                        name: 'HolidayMonth',
                        minValue: 1,
                        maxValue: 12,
                        hideTrigger: false,
                        useThousandSeparator: false,
                        decimalPrecision: 0,
                        alwaysDisplayDecimals: false,
                        allowNegative: false,
                        alwaysDecimals: false,
                        //thousandSeparator: ',',
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
                                    };
                                }
                            }
                        }
                    }
                },
                {
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 120,
                    dataIndex: 'HolidayDay',
                    text: 'Dia',
                    align: 'right',
                    format: '00',
                    editor: {
                        xtype:'numericfield',
                        name: 'HolidayDay',
                        minValue: 1,
                        maxValue: 31,
                        hideTrigger: false,
                        useThousandSeparator: false,
                        decimalPrecision: 0,
                        alwaysDisplayDecimals: false,
                        allowNegative: false,
                        alwaysDecimals: false,
                        //thousandSeparator: ',',
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
                                    };
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
                        var r = Ext.create('Muller.model.Holidays');

                        grid.store.insert(count, r);
                        rowEditing.startEdit(r, 1);
                        rowEditing.editor.down('field[name=HolidayName]').focus(true, 200);
                    }
                }, 
                {
                    itemId: 'deleteline',
                    text: 'Eliminar',
                    handler: function() {
                        var grid = this.up('gridpanel');
                        var sm = grid.getSelectionModel();

                        rowEditing.cancelEdit();

                        selection = sm.getSelection()

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
                    store: storeHolidays,
                    displayInfo: true,
                    displayMsg: 'Mostrando {0} - {1} of {2}',
                    emptyMsg: "No hay registros para mostrar"
                }),
                listeners: {
                    selectionchange : function(view, records) {
                        this.down('#deleteline').setDisabled(!records.length);
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

        if(grid.getSelectionModel().selected.length == 0) {
            grid.getSelectionModel().select(0);
        };
    },

    registerKeyBindings: function(view, options){
        var me = this;
        Ext.EventManager.on(view.getEl(), 'keyup', function(evt, t, o) {
            if (evt.keyCode === Ext.EventObject.INSERT) {
                evt.stopEvent();
                var btn = me.down('#addline')
                //console.log(btn); //.click();
                btn.fireHandler();
            };
        }, 
        this);
    },

    onSearchFieldChange: function() {
        var form = this,
            field = form.down('searchfield'),
            fieldValue = field.getRawValue(),
            grid = form.down('#gridmain');
        
        grid.store.removeAll();

        if(!String.isNullOrEmpty(fieldValue)) {
            grid.store.loadPage(1, {params:{query:fieldValue}, callback: function() {
                form.down('pagingtoolbar').bindStore(this);
            }});
        } else {
            grid.store.loadPage(1, {callback: function() {
                form.down('pagingtoolbar').bindStore(this);
            }});
        }
    },

    onClickActionColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel').up('panel');

        rowEditing.startEdit(record, 1);
        this.up('panel').editingPlugin.editor.down('field[name=CiudadId]').focus(true, 200);
    },

    validRecord: function(record) {
        var me = this;

        var fecha = me.getFechaCalendario(record);

        if(!isValidDate(fecha)) return false;

        return true;
    },

    getFechaCalendario: function(record) {
        var me = this,
            year = record.HolidayYear,
            month = record.HolidayMonth,
            day = record.HolidayDay;

        
        month = Ext.String.leftPad(month, 2, '0');
        day = Ext.String.leftPad(day, 2, '0');

        var returnDate = "{0}/{1}/{2}".format(day, month, year);

        return returnDate;
    }

});