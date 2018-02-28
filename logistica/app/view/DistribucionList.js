Ext.define('Muller.view.DistribucionList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.distribucionlist',
    title: 'Distribuci\u00F3n',
    layout: 'column',

    initComponent: function () {
        var me = this;

        Ext.require([
            //'Ext.toolbar.Paging',
            //'Ext.ux.SearchField',
            'Muller.view.Distribucion',
            'Muller.view.DistribucionFileUpload'
        ]);

        var storeMovs = Ext.create('Muller.store.Movimientos').load({ params: { tipo: 'D' } });

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    itemId: 'gridmain',
                    minHeight: (screen.height * (65 / 100)).toFixed(0) - 115,
                    maxHeight: (screen.height * (65 / 100)).toFixed(0) - 115,
                    autoScroll: false,
                    scrollable: false,
                    viewConfig: {
                        stripeRows: true,
                        forceFit: false
                    },
                    columnWidth: 1,
                    store: storeMovs,
                    columns: [
                        {
                            xtype: 'rownumberer',
                            width: 60
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 90,
                            dataIndex: 'MovViaje',
                            text: 'Viaje',
                            align: 'center'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 70,
                            dataIndex: 'MovFechaAsignado',
                            text: 'Asig.',
                            renderer: Ext.util.Format.dateRenderer('d/m'),
                            align: 'center'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 70,
                            dataIndex: 'MovFechaCompletado',
                            text: 'Comp.',
                            renderer: Ext.util.Format.dateRenderer('d/m'),
                            align: 'center'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 100,
                            dataIndex: 'MovChofer',
                            text: 'Chofer'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 200,
                            dataIndex: 'x_Cliente',
                            text: 'Cliente'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 200,
                            dataIndex: 'MovComentariosLogistica',
                            text: 'Observaciones'
                        },
                        {
                            xtype: 'numbercolumn',
                            width: 70,
                            dataIndex: 'MovCantidadCauchos',
                            text: 'Cant.',
                            format: '0,000',
                            align: 'right'
                        },
                        {
                            xtype: 'numbercolumn',
                            width: 60,
                            dataIndex: 'MovTotalRepartos',
                            text: 'Rep.',
                            format: '0,000',
                            align: 'right'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 100,
                            dataIndex: 'x_Equipo',
                            text: 'Equipo'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 100,
                            dataIndex: 'x_Ciudad',
                            text: 'Ciu.',
                            align: 'center'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: 100,
                            dataIndex: 'x_Estatus',
                            text: 'Estatus',
                            tdCls: 'x-change-cell',
                            align: 'center'
                        },
						{
                            xtype: 'actioncolumn',
                            width: 25,
                            items: [
                                {
                                    handler: me.onCellDobleClick,
                                    scope: me,
                                    iconCls: 'app-find',
                                    //iconCls: 'x-form-search-trigger',
                                    tooltip: 'Detalle'
                                }]
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 25,
                            items: [
                                {
                                    handler: me.onClickAttach,
                                    scope: me,
                                    iconCls: 'app-attachment',
                                    //iconCls: 'x-form-search-trigger',
                                    tooltip: 'Cargar Imagen'
                                }]
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 25,
                            items: [
                                {
                                    handler: me.onClickCamera,
                                    scope: me,
                                    iconCls: 'app-camera',
                                    //iconCls: 'x-form-search-trigger',
                                    tooltip: 'Tomar Foto'
                                }]
                        },
                        {
                            xtype: 'actioncolumn',
                            width: 25,
                            items: [
                                {
                                    handler: function (view, rowIndex, colIndex, item, e, record) {
                                        var me = view.up('form');
                                        me.onClickPrint(record);
                                    },
                                    iconCls: 'app-print',
                                    tooltip: 'Recibo'
                                }]
                        }
                    ],
                    tbar:
                        [
                            //'Buscar',
                            {
                                xtype: 'combo',
                                name: 'searchField',
                                itemId: 'searchfield',
                                //fieldLabel: 'Buscar',
                                width: '50%',
                                enableKeyEvents: true,
                                emptyText: 'Escriba y pulse enter para buscar',
                                triggerCls: 'x-form-search-trigger',
                                // override onTriggerClick
                                onTriggerClick: function () {
                                    // this.triggerEl.hide(true);
                                    // this.setRawValue('');
                                    // this.focus(true, 200);
                                    // this.fireEvent('change', this);
                                    me.onSearchFieldChange();
                                },
                                listeners: {
                                    keyup: function (field, e, eOpts) {
                                        if (e.getCharCode() == Ext.EventObject.ENTER) {
                                            me.onSearchFieldChange();
                                        }
                                        e.preventDefault();
                                    },
                                    change: function (field, newValue, oldValue) {
                                        var valor = field.getRawValue();
                                        if (String.isNullOrEmpty(valor)) {
                                            me.onSearchFieldChange();
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'component',
                                flex: 1
                            }, {
                                margin: '0 10 0 5',
                                width: 24,
                                xtype: 'button',
                                tooltip: 'Export Excel',
                                iconCls: 'excel',
                                handler: function () {
                                    var me = this.up('form');
                                    me.onExportExcel();
                                }
                            }, {
                                itemId: 'addline',
                                xtype: 'button',
                                text: 'Agregar',
                                tooltip: 'Pulse (Ins)',
                                handler: function () {
                                    var me = this.up('form');
                                    var grid = me.down('gridpanel');

                                    var storeToNavigate = Ext.create('Muller.store.Movimientos');

                                    var form = Ext.widget('distribucion', {
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
                                handler: function () {
                                    var grid = this.up('gridpanel'),
                                        sm = grid.getSelectionModel(),
                                        selection = sm.getSelection();

                                    if (selection) {
                                        var sel = selection[0];
                                        sel.destroy({
                                            success: function () {
                                                grid.store.reload({ callback: function () { sm.select(0); } });
                                            }
                                        });
                                    }
                                },
                                disabled: true
                            }
                        ],
                    selModel: 'rowmodel',
                    dockedItems: [{
                        xtype: 'pagingtoolbar',
                        itemId: 'pagingtoolbar',
                        store: storeMovs,
                        displayInfo: true,
                        dock: 'bottom',
                        displayMsg: 'Mostrando {0} - {1} of {2}',
                        emptyMsg: "No hay registros para mostrar"
                        // listeners: {
                        // change: function(pageTool, pageData, eOpts) {
                        // var me = this.up('form');
                        // me.RecalcTotals();
                        // }
                        // }
                    }],
                    // bbar: new Ext.PagingToolbar({
                    // itemId: 'pagingtoolbar',
                    // store: storeMovs,
                    // displayInfo: true,
                    // displayMsg: 'Mostrando {0} - {1} of {2}',
                    // emptyMsg: "No hay registros para mostrar"
                    // }),
                    listeners: {
                        celldblclick: {
                            fn: me.onCellDobleClick,
                            scope: me
                        },
                        selectionchange: function (view, records) {
                            this.down('#deleteline').setDisabled(!records.length);
                        },
                        validateedit: function (e) {
                            var myTargetRow = 6;

                            if (e.rowIdx == myTargetRow) {
                                e.cancel = true;
                                e.record.data[e.field] = e.value;
                            }
                        },
                        viewready: function (grid) {
                            var view = grid.view;

                            // record the current cellIndex
                            grid.mon(view, {
                                uievent: function (type, view, cell, recordIndex, cellIndex, e) {
                                    grid.cellIndex = cellIndex;
                                    grid.recordIndex = recordIndex;
                                }
                            });

                            grid.tip = Ext.create('Ext.tip.ToolTip', {
                                target: view.el,
                                delegate: '.x-grid-cell',
                                trackMouse: true,
                                renderTo: Ext.getBody(),
                                listeners: {
                                    beforeshow: function updateTipBody(tip) {
                                        if (!Ext.isEmpty(grid.cellIndex) && grid.cellIndex !== -1) {
                                            header = grid.headerCt.getGridColumns()[grid.cellIndex];
                                            tip.update(grid.getStore().getAt(grid.recordIndex).get(header.dataIndex));
                                        }
                                    }
                                }
                            });
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

    onRenderForm: function () {
        var me = this;

        var grid = me.down('#gridmain');

        if (grid.getSelectionModel().selected.length == 0) {
            grid.getSelectionModel().select(0);
        };

        var field = me.down('#searchfield').focus(true, 200);
    },

    registerKeyBindings: function (view, options) {
        var me = this;
        Ext.EventManager.on(view.getEl(), 'keyup', function (evt, t, o) {
            if (evt.keyCode === Ext.EventObject.INSERT) {
                evt.stopEvent();
                var btn = me.down('#addline')
                //console.log(btn); //.click();
                btn.fireHandler();
            };
        },
            this);
    },

    onSearchFieldChange: function () {
        var form = this,
            field = form.down('#searchfield'),
            fieldValue = field.getRawValue(),
            grid = form.down('#gridmain');

        grid.store.removeAll();

        if (!String.isNullOrEmpty(fieldValue)) {
            //field.triggerEl.show();
            grid.store.loadPage(1, {
                params: { query: fieldValue, tipo: 'D' }, callback: function () {
                    form.down('#pagingtoolbar').bindStore(this);
                }
            });
        } else {
            //field.triggerEl.hide(true);
            grid.store.loadPage(1, {
                params: { tipo: 'D' }, callback: function () {
                    form.down('#pagingtoolbar').bindStore(this);
                }
            });
        }
    },

    onCellDobleClick: function () {
        var me = this,
            record = me.down('gridpanel').getSelectionModel().getLastSelected();

        if (Ext.isObject(arguments[5])) record = arguments[5];

        var storeMovs = Ext.create('Muller.store.Movimientos').load({
            params: { id: record.data.MovId },
            callback: function () {
                var form = Ext.widget('distribucion', {
                    storeNavigator: storeMovs,
                    modal: true,
                    width: 700,
                    frameHeader: true,
                    header: true,
                    layout: {
                        type: 'column'
                    },
                    title: 'Distribuci\u00F3n',
                    bodyPadding: 10,
                    closable: true,
                    //constrain: true,
                    stateful: false,
                    floating: true,
                    callerForm: me,
                    forceFit: true,
                    CiudadId: record.data.CiudadId,
                    ClienteId: record.data.ClienteId
                });

                form.down('#FormToolbar').gotoAt(1);

                form.show();
            }
        });
        // var field = form.down('field[name=MovChofer]');
        // //field.setValue(value);
        // field.focus(true, 200);
    },

    onClickActionColumn: function (view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel').up('panel');

        var form = Ext.widget('distribucion', {
            storeNavigator: me.down('gridpanel').store,
            modal: true,
            width: 700,
            frameHeader: true,
            header: true,
            layout: {
                type: 'column'
            },
            title: 'Distribuci\u00F3n',
            bodyPadding: 10,
            closable: true,
            //constrain: true,
            stateful: false,
            floating: true,
            callerForm: me,
            forceFit: true,
            CiudadId: record.data.CiudadId,
            ClienteId: record.data.ClienteId
        });

        form.down('#FormToolbar').gotoAt(record.index + 1);

        form.show();
        // var field = form.down('field[name=MovChofer]');
        // //field.setValue(value);
        // field.focus(true, 200);
    },

    onClickAttach: function (view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel').up('panel');

        var form = Ext.widget('distribucionfileupload', {
            modal: true,
            //width: 200,
            //height: 200,
            frameHeader: true,
            header: true,
            layout: {
                type: 'column'
            },
            //title: 'Distribuci\u00F3n',
            //bodyPadding: 10,
            closable: true,
            //constrain: true,
            stateful: false,
            floating: true,
            callerForm: me,
            forceFit: true,
            title: record.data.MovViaje,
            MovId: record.data.MovId
        });

        form.getForm().setValues({
            MovId: record.data.MovId,
            MovViaje: record.data.MovViaje
        });

        //form.down('#FormToolbar').gotoAt(record.index + 1);

        form.show();
    },

    onClickCamera: function (view, rowIndex, colIndex, item, e, record) {

        window.open('../takephoto?MovId=' + record.data.MovId + "&MovViaje=" + record.data.MovViaje);

        // var me = this.up('panel').up('panel');

        // var form = Ext.widget('distribucionshowimage', {
        //     modal: true,
        //     //width: 400,
        //     //height: 550,
        //     frameHeader: true,
        //     header: true,
        //     layout: {
        //         type: 'column'
        //     },
        //     //title: 'Distribuci\u00F3n',
        //     bodyPadding: 10,
        //     closable: true,
        //     //constrain: true,
        //     stateful: false,
        //     floating: true,
        //     callerForm: me,
        //     forceFit: true,
        //     title: record.data.MovViaje,
        //     MovId: record.data.MovId
        // });

        // //form.down('#FormToolbar').gotoAt(record.index + 1);

        // form.show();
    },

    onClickPrint: function (record) {

        Ext.Msg.wait('Cargando Reporte....', 'Espere por favor');
        Ext.Ajax.request({
            url: '../wa/Reports/ReciboViaje',
            method: 'GET',
            headers: {
                'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
            },
            params: {
                id: record.get('MovId')
            },
            success: function (response) {
                var text = response.responseText;
                //window.open('../wa/Reports/GetPDFReport?_file=' + text, 'Quote Customer','width='+screen.width+',height='+screen.height);
                window.open('../wa/Reports/GetPDF?_file=' + text, 'Recibo Viaje');
                Ext.Msg.hide();
            }
        });

    },

    onExportExcel: function () {
        var me = this,
            grid = me.down('#gridmain');

        Ext.Msg.wait('Loading Report....', 'Wait');
        Ext.Ajax.request({
            url: '../wa/Reports/Export2Excel',
            method: 'GET',
            headers: {
                'Authorization-Token': Ext.util.Cookies.get('MullerAuth')
            },
            params: grid.store.lastOptions.params,
            success: function (response) {
                var text = response.responseText;
                window.open('../wa/Reports/GetExcel?_file=' + text, 'Reporte Movimientos');
                Ext.Msg.hide();
            }
        });
    },
});
