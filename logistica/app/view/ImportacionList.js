Ext.define('Muller.view.ImportacionList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.importacionlist',
    title: 'Importaci\u00F3n',

    initComponent: function() {
        var me = this;

        Ext.require([
            'Ext.toolbar.Paging',
            'Muller.view.Importacion'
        ]);

        var storeImportacion = Ext.create('Muller.store.Movimientos').load({params:{tipo:'I'}});

        Ext.applyIf(me, {
            items:[
            {
                xtype: 'gridpanel',
                itemId:'gridmain',
                autoScroll: true,
                viewConfig: {
                    stripeRows: true,
                    getRowClass: function(record, index) {
                        var c = record.get('MovExcedido');
                        if (c) {
                            return 'estatus-alerta';
                        } else {
                            return 'estatus-normal';
                        }
                    }
                },
                minHeight: 450,
                forceFit: true,
                store: storeImportacion,
                columns: [
                {
                    xtype: 'rownumberer',
                    width:30
                },
                {
                    sortable: true,
                    width: 120,
                    dataIndex: 'MovFechaAsignado',
                    text: 'Fecha Asignado',
                    renderer: Ext.util.Format.dateRenderer('d/m/Y h:i A')
                },
                {
                    sortable: true,
                    dataIndex: 'MovID',
                    text: 'ID',
                    hidden: true,
                    format: '000'
                },
                {
                    xtype: 'gridcolumn',
                    width: 120,
                    dataIndex: 'MovChofer',
                    text: 'Chofer'
                },
                {
                    xtype: 'gridcolumn',
                    width: 100,
                    dataIndex: 'MovCedula',
                    text: 'Cédula'
                },
                {
                    xtype: 'gridcolumn',
                    width: 80,
                    dataIndex: 'MovViaje',
                    text: 'N° Viaje'
                },
                {
                    xtype: 'gridcolumn',
                    width: 80,
                    dataIndex: 'MovPlaca',
                    text: 'Placa'
                },
                {
                    xtype: 'gridcolumn',
                    width: 100,
                    dataIndex: 'x_Ciudad',
                    text: 'Destino'
                },
                {
                    xtype: 'gridcolumn',
                    width: 100,
                    dataIndex: 'x_ExpNumBL',
                    text: 'Expediente / B.L'
                },
                {
                    xtype: 'gridcolumn',
                    width: 50,
                    dataIndex: 'x_ItemOf',
                    text: 'Item/Total'
                },
                {
                    width: 50,
                    text: 'Tipo Cont.',
                    dataIndex: 'MovTipoContenedor'
                },
                {
                    width: 80,
                    text: 'Contenedor #',
                    dataIndex: 'MovContenedor'
                },
                {
                    xtype: 'gridcolumn',
                    width: 80,
                    dataIndex: 'x_Estatus',
                    text: 'Estatus',
                    tdCls: 'x-change-cell',
                },
                {
                    xtype: 'checkcolumn',
                    width: 50,
                    text: 'Elev.',
                    dataIndex: 'MovElevadora',
                    processEvent: function () { return false; } 
                },
                {
                    xtype: 'checkcolumn',
                    width: 50,
                    text: 'L.Q',
                    dataIndex: 'MovLavadoQuimico',
                    processEvent: function () { return false; } 
                },
                {
                    xtype: 'actioncolumn',
                    width: 35,
                    items: [
                    {
                        handler: function(view, rowIndex, colIndex, item, e, record, row) {
                            var me = this.up('form');
                            me.onCellDobleClick(record);
                        },
                        iconCls: 'app-find',
                        tooltip: 'Detalle'
                    }]
                }
                ],
                tbar:
                [
                {
                    xtype: 'combo',
                    itemId:'searchfield',
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
                    tooltip: 'Pulse (Ins)',
                    handler : function() {
                        var me = this.up('form');
                        var grid = me.down('gridpanel');

                        storeToNavigate =  Ext.create('Muller.store.Movimientos');
                        // storeToNavigate.add(new Muller.model.Movimientos({
                        //     MovOrigen: 'PBL',
                        //     CiudadId: 325,
                        //     ClienteId: 1,
                        //     MovTipo: 'I',
                        //     x_EstatusOrden: 1
                        // })); 

                        var form = Ext.widget('importacion', {
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
                        if(btn)
                        btn.fireEvent('click', btn);
                    }
                }, 
                {
                    itemId: 'deleteline',
                    text: 'Eliminar',
                    handler: function() {
                        var grid = this.up('gridpanel'),
                            sm = grid.getSelectionModel(),
                            selection = sm.getSelection();

                        if(selection){
                            var sel = selection[0];
                            sel.destroy({
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
                bbar: new Ext.PagingToolbar({
                    itemId:'pagingtoolbar',
                    store: storeImportacion,
                    displayInfo: true,
                    displayMsg: 'Mostrando {0} - {1} of {2}',
                    emptyMsg: "No hay registros para mostrar"
                }),
                listeners: {
                    celldblclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                        var me = this.up('form');
                        me.onCellDobleClick(record);
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
            grid.store.loadPage(1, {params:{query:fieldValue,tipo:'I'}, callback: function() {
                form.down('#pagingtoolbar').bindStore(this);
            }});
        } else {
            grid.store.loadPage(1, {params:{tipo:'I'},callback: function() {
                form.down('#pagingtoolbar').bindStore(this);
            }});
        }
    },

    onCellDobleClick: function(record) {
        var me = this;

        var form = Ext.widget('importacion', {
            storeNavigator: me.down('gridpanel').store,
            modal: true,
            width: 700,
            frameHeader: true,
            header: true,
            layout: {
                type: 'column'
            },
            title: 'Importaci\u00F3n',
            bodyPadding: 10,
            closable: true,
            stateful: false,
            floating: true,
            callerForm: me,
            forceFit: true,
            CiudadId: record.data.CiudadId,
            ClienteId: record.data.ClienteId
        });

        form.down('#FormToolbar').gotoAt(record.index + 1);
        form.show();
    }
});