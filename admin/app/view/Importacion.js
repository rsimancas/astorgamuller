Ext.define('Muller.view.Importacion', {
    extend: 'Ext.form.Panel',
    alias: 'widget.importacion',
    title: 'Importaci\u00F3n',

    layout: {
        type: 'column'
    },
    padding: '0 0 0 0',
    frameHeader: false,
    header: false,

    requires: [
        'Ext.ux.form.NumericField',
        'Ext.ux.form.Toolbar'
    ],

    storeNavigator: null,

    CiudadId: 0,
    ClienteId: 0,

    initComponent: function() {
        var me = this;

        storeClientes = Ext.create('Muller.store.Clientes').load({params:{page:0, start:0, limit:0}});
        storeCiudades = Ext.create('Muller.store.Ciudades').load({params:{page:0, start:0, limit:0}});
        storeEstatus = Ext.create('Muller.store.Estatus').load({params:{tipo:'I', page:0, start:0, limit:0}});
        storeChoferes = Ext.create('Muller.store.Choferes').load({params:{page:0, start:0, limit:0}});
        storePlacas = Ext.create('Muller.store.Placas').load({params:{page:0, start:0, limit:0}});
        storeOrigenes = Ext.create('Muller.store.Origenes').load({params:{page:0, start:0, limit:0}});
        storeTipos = Ext.create('Ext.data.Store', {
            fields: ['name'],
            data : [
                {"name":"20"},
                {"name":"40"}
            ]
        });
        storeAMPM = Ext.create('Ext.data.Store', {
            fields: ['name'],
            data : [
                {"name":"AM"},
                {"name":"PM"}
            ]
        });

        storeExp = null;

        var dataHH = [];

        for(i=0; i<=12; i++) {
            dataHH.push({"name": Ext.String.leftPad(i,2,'0')});
        }

        storeHH = Ext.create('Ext.data.Store', {
            fields: ['name'],
            data : dataHH
        });

        var dataMM = [];

        for(i=0; i<=59; i++) {
            dataMM.push({"name": Ext.String.leftPad(i,2,'0')});
        }

        storeMM = Ext.create('Ext.data.Store', {
            fields: ['name'],
            data : dataMM
        });

        var curDate = new Date(),
            curHour = curDate.getHours(),
            curMinute = curDate.getMinutes();

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side',
                fieldStyle: 'font-size:11px',
                labelStyle: 'font-size:11px'
            },
            items: [
            {
                xtype: 'textfield',
                columnWidth: 0.2,
                name: 'MovViaje',
                fieldLabel: 'N° Viaje',
                selectOnFocus : true,
                margin: '0 0 5 0',
                readOnly: true,
                editable: false,
                enableKeyEvents: true
            },
            {
                margin: '0 0 0 5',
                columnWidth: 0.6,
                fieldLabel: 'Chofer',
                xtype:'combo',
                displayField: 'ChoferNombre',
                valueField: 'ChoferNombre',
                name: 'MovChofer',
                queryMode: 'local',
                //typeAhead: true,
                minChars: 2,
                allowBlank: false,
                forceSelection: false,
                emptyText: 'Seleccionar',
                matchFieldWidth: true,
                listConfig: {
                    width: 150
                },
                selectOnFocus: true,
                listeners: {
                    select: function (field, records, eOpts) {
                        if(records[0]) {
                            field.next('field[name=MovCedula]').setValue(records[0].data.ChoferCedula);
                            field.next('field[name=MovPlaca]').setValue(records[0].data.ChoferPlaca);
                        }
                    },
                    blur: function(field) {
                        if(field.value === null) {
                            var rawValue = field.getRawValue();
                            field.setRawValue(rawValue.toUpperCase());
                        }
                    }
                },
                store:storeChoferes
            },
            {
                xtype: 'textfield',
                columnWidth: 0.2,
                name: 'MovCedula',
                fieldLabel: 'Cédula',
                allowBlank: false,
                selectOnFocus : true,
                margin: '0 0 5 5',
                vtype:'rif'
            },
            {
                columnWidth: 0.5,
                xtype:'combo',
                fieldLabel: 'Placa',
                displayField: 'PlacaNombre',
                valueField: 'PlacaNombre',
                name: 'MovPlaca',
                queryMode: 'local',
                typeAhead: true,
                minChars: 2,
                allowBlank: false,
                forceSelection: false,
                emptyText: 'Seleccionar',
                autoSelect:false,
                matchFieldWidth: true,
                listConfig: {
                    width: 150
                },
                selectOnFocus: true,
                listeners: {
                    blur: function(field) {
                        if(field.value === null) {
                            var rawValue = field.getRawValue();
                            field.setRawValue(rawValue.toUpperCase());
                        }
                    },
                    beforequery: function(record){  
                        record.query = new RegExp(record.query, 'i');
                        record.forceAll = true;
                    }
                },
                store:storePlacas
            },
            {
                columnWidth: 0.5,
                margin: '0 0 0 5',
                xtype:'combo',
                fieldLabel: 'Tipo Contenedor',
                displayField: 'name',
                valueField: 'name',
                name: 'MovTipoContenedor',
                queryMode: 'local',
                minChars: 2,
                allowBlank: false,
                forceSelection: true,
                emptyText: 'Seleccionar',
                //enableKeyEvents: true,
                autoSelect:true,
                matchFieldWidth: true,
                listConfig: {
                    width: 150
                },
                selectOnFocus: true,
                store:storeTipos
            },
            {
                columnWidth: 0.5,
                margin: '0 0 0 0',
                xtype:'combo',
                fieldLabel: 'Expediente / N° B.L',
                displayField: 'ExpNumBL',
                valueField: 'ExpId',
                name: 'ExpId',
                queryMode: 'local',
                typeAhead: true,
                minChars: 2,
                allowBlank: true,
                forceSelection: false,
                emptyText: 'Seleccionar',
                autoSelect:true,
                matchFieldWidth: true,
                listConfig: {
                    width: 150
                },
                selectOnFocus: true,
                store:storeExp,
                listeners: {
                    select: function (field, records, eOpts) {
                        curRec = field.up('form').down('#FormToolbar').getCurrentRecord();
                        if(records.length > 0 && curRec.phantom) {
                            selRecord = records[0].data;
                            field.next().setValue((selRecord.ExpCargados+1)+"/"+selRecord.ExpTotal);
                            field.focus(true, 200);
                        }
                    },
                    beforequery: function(record){  
                        record.query = new RegExp(record.query, 'i');
                        record.forceAll = true;
                    }
                }
            },
            {
                columnWidth: 0.5,
                margin: '0 0 0 5',
                xtype: 'textfield',
                name: 'x_ItemOf',
                fieldLabel: 'Item / Total',
                readOnly: true,
                editable: false
            },
            {
                columnWidth: 0.3,
                margin: '0 0 5 0',
                xtype: 'textfield',
                fieldLabel: 'Contenedor N°',
                name: 'MovContenedor',
                allowBlank: true,
                enableKeyEvents: true,
                listeners: {
                    blur: function(field) {
                        if(field.value !== null) {
                            var rawValue = field.getRawValue();
                            field.setRawValue(rawValue.toUpperCase());
                        }
                    }
                }
            },
            {
                columnWidth: 0.3,
                margin: '0 0 0 5',
                xtype:'combo',
                fieldLabel: 'Origen',
                displayField: 'MovOrigen',
                valueField: 'MovOrigen',
                name: 'MovOrigen',
                queryMode: 'local',
                minChars: 1,
                allowBlank: false,
                forceSelection: false,
                emptyText: 'Seleccionar',
                autoSelect:false,
                matchFieldWidth: true,
                listConfig: {
                    width: 150
                },
                selectOnFocus: true,
                listeners: {
                    blur: function(field) {
                        if(field.value === null) {
                            var rawValue = field.getRawValue();
                            field.setRawValue(rawValue.toUpperCase());
                        }
                    },
                    beforequery: function(record){  
                        record.query = new RegExp(record.query, 'i');
                        record.forceAll = true;
                    }
                },
                store:storeOrigenes
            },
            {
                columnWidth: 0.4,
                margin: '0 0 0 5',
                xtype:'combo',
                fieldLabel: 'Destino (Ciudad)',
                displayField: 'x_CodigoNombre',
                valueField: 'CiudadId',
                name: 'CiudadId',
                queryMode: 'local',
                typeAhead: true,
                minChars: 2,
                allowBlank: false,
                forceSelection: true,
                emptyText: 'Seleccionar',
                matchFieldWidth: true,
                listConfig: {
                    width: 200
                },
                selectOnFocus: true,
                store:storeCiudades,
                listeners: {
                    beforequery: function(record){  
                        record.query = new RegExp(record.query, 'i');
                        record.forceAll = true;
                    }
                }
            },
            {
                columnWidth: 1,
                xtype:'combo',
                fieldLabel: 'Cliente',
                displayField: 'ClienteNombre',
                valueField: 'ClienteId',
                name: 'ClienteId',
                queryMode: 'local',
                minChars: 2,
                allowBlank: false,
                forceSelection: false,
                selectOnFocus: true,
                emptyText: 'Seleccionar',
                matchFieldWidth: true,
                listConfig: {
                    width: 200
                },
                store:storeClientes,
                listeners: {
                    blur: function(field) {
                        if(field.value === null) {
                            var rawValue = field.getRawValue();
                            field.setRawValue(rawValue.toUpperCase());
                        }
                    },
                    beforequery: function(record){  
                        record.query = new RegExp(record.query, 'i');
                        record.forceAll = true;
                    }
                }
            },
            {
                columnWidth: 0.5,
                margin: '0 0 5 0',
                fieldLabel: 'Estatus',
                name: 'EstatusId',
                xtype:'combo',
                displayField: 'EstatusNombre',
                valueField: 'EstatusId',
                queryMode: 'local',
                typeAhead: true,
                minChars: 2,
                allowBlank: false,
                forceSelection: true,
                selectOnFocus: true,
                emptyText: 'Seleccionar',
                store:storeEstatus,
                listeners: {
                    select: function(field) {
                        var me = field.up('form'),
                            rawValue = field.getRawValue();

                        if(rawValue !== "ASIGNADO") {
                            me.down('field[name=fecha]').setVisible(false);
                            me.down('field[name=hora]').setVisible(false);
                            me.down('field[name=minutos]').setVisible(false);
                            me.down('field[name=ampm]').setVisible(false);
                        } else {
                            me.down('field[name=fecha]').setVisible(true);
                            me.down('field[name=hora]').setVisible(true);
                            me.down('field[name=minutos]').setVisible(true);
                            me.down('field[name=ampm]').setVisible(true);
                        }
                    },
                    beforequery: function(record){  
                        record.query = new RegExp(record.query, 'i');
                        record.forceAll = true;
                    }
                }
            },
            {
                margin: '0 0 0 5',
                columnWidth: 0.2,
                name: 'fecha',
                fieldLabel: 'Fecha',
                xtype: 'datefield',
                //disabledDays:  [0, 6]
                format: 'd/m/Y'
            },
            {
                columnWidth: 0.1,
                margin: '0 0 0 5',
                xtype:'combo',
                fieldLabel: 'Hora',
                displayField: 'name',
                valueField: 'name',
                name: 'hora',
                queryMode: 'local',
                allowBlank: true,
                forceSelection: true,
                enableKeyEvents: true,
                autoSelect:true,
                selectOnFocus: true,
                store:storeHH,
                value: (curHour >= 13 ) ? Ext.String.leftPad(curHour-12, 2, '0') : Ext.String.leftPad(curHour,2,'0')
            },
            {
                columnWidth: 0.1,
                margin: '0 0 0 5',
                xtype:'combo',
                fieldLabel: 'Minutos',
                displayField: 'name',
                valueField: 'name',
                name: 'minutos',
                queryMode: 'local',
                allowBlank: true,
                forceSelection: true,
                enableKeyEvents: true,
                autoSelect:true,
                selectOnFocus: true,
                store:storeMM,
                value: Ext.String.leftPad(curMinute,2,'0')
            },
            {
                columnWidth: 0.1,
                margin: '0 0 0 5',
                xtype:'combo',
                fieldLabel: 'AM/PM',
                displayField: 'name',
                valueField: 'name',
                name: 'ampm',
                queryMode: 'local',
                allowBlank: true,
                forceSelection: true,
                enableKeyEvents: true,
                autoSelect:true,
                selectOnFocus: true,
                store:storeAMPM,
                value: (curHour >= 12) ? 'PM' : 'AM'
            },
            {
                xtype: 'component',
                columnWidth: 0.1
            },
            {
                columnWidth: 0.2,
                margin: '20 0 0 5',
                xtype: 'checkbox',
                name: 'MovElevadora',
                labelSeparator: '',
                hideLabel: true,
                boxLabel: 'Usa Elevadora',
            },
            {
                columnWidth: 0.2,
                margin: '20 0 0 5',
                xtype: 'checkbox',
                name: 'MovLavadoQuimico',
                labelSeparator: '',
                hideLabel: true,
                boxLabel: 'Lav. Quimico',
            },
            {
                columnWidth: 1,
                xtype: 'textfield',
                name: 'MovComentario',
                fieldLabel: 'Comentario'
            }
            ],
            dockedItems: [
            {
                xtype: 'formtoolbar',
                itemId: 'FormToolbar',
                dock: 'top',
                store: me.storeNavigator,
                listeners: {
                    addrecord : {
                        fn: me.onAddClick,
                        scope: me
                    },
                    savechanges: {
                        fn: me.onSaveClick,
                        scope: me
                    },
                    deleterecord: {
                        fn: me.onDeleteClick,
                        scope: me
                    },
                    afterloadrecord: {
                        fn: me.onAfterLoadRecord,
                        scope: me
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
                close: {
                    fn: me.onCloseForm,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onAfterLoadRecord: function(tool, record) {
        var me = this;

        me.getFechaEstatus(record.data);

        var currentId = record.data.MovId, 
            curorden = record.data.x_EstatusOrden;

        curRec = record;

        var esFallido = (curRec.data.x_Estatus == "FALLIDO") ? 1 : 0;

        Ext.Msg.wait('Cargando','Espere');
        storeEstatus = Ext.create('Muller.store.Estatus').load({params:{tipo:'I', orden: curorden, fallido: esFallido, page:0, start: 0, limit: 0}, 
            callback: function() {
                var fieldEstatus = me.down('field[name=EstatusId]');
                fieldEstatus.bindStore(this);

                var curEstatusId = curRec.data.EstatusId;
                if(record.phantom) {
                    curEstatusId = this.getAt(this.find("EstatusOrden",1)).data.EstatusId;
                }

                fieldEstatus.setValue(curEstatusId);

                if(fieldEstatus.rawValue == "FALLIDO") {
                    this.filter([
                        Ext.create('Ext.util.Filter', {
                            filterFn: function(item) { 
                                return item.get("EstatusNombre") == "FALLIDO" || item.get("EstatusNombre")=="ASIGNADO" ; 
                            }, 
                            root: 'data'
                        })
                    ]);
                }

                var soloPendientes = 1,
                    expId = 0;
                
                if(!curRec.phantom) {
                    //soloPendientes = 1;
                    expId = (curRec.data.ExpId !== null) ? curRec.data.ExpId : 0;
                }

                storeExp = Ext.create('Muller.store.Expediente').load({
                    params:{pendientes:soloPendientes, id: expId, page:0, start:0, limit:0},
                    callback: function() {
                        
                        Ext.Msg.hide();
                        totExp = storeExp.getCount();
                        if(totExp === 0) {
                            Ext.Msg.alert('Alerta','No hay Expedientes Disponibles\nDebe Crear uno Nuevo', function() {
                                me.down('field[name=MovChofer]').focus(true, 200);  
                            });
                        }
                        me.down('field[name=ExpId]').bindStore(this);

                        if(!curRec.phantom) {
                            me.down('field[name=ExpId]').setValue(curRec.data.ExpId);
                        }

                        me.down('field[name=MovChofer]').focus(true, 200);
                    }
                });
            }
        });

        
    },

    onRenderForm: function() {
        var me = this;
        //console.log(me.down('field[name=MovViaje]').editable);
    },

    onCloseForm: function() {
        var me = this,
            grid = me.callerForm.down('gridpanel'),
            lastOpt = grid.store.lastOptions;
            grid.store.reload({params: lastOpt.params});
    },

    registerKeyBindings: function(view, options){
        var me = this;
        Ext.EventManager.on(view.getEl(), 'keyup', function(evt, t, o) {
            if (evt.keyCode === Ext.EventObject.F8) {
                evt.stopEvent();
                me.onSaveClick();
            }
        }, 
        this);
    },

    onAddClick: function(tool, record) {
        var me = this;

        // r = Ext.create('Muller.model.Movimientos', {
        //     MovOrigen: 'PBL',
        //     CiudadId: 325,
        //     ClienteId: 1,
        //     MovTipo: 'I',
        //     x_EstatusOrden: 1
        // });

        record.data.MovOrigen = 'PBL';
        record.data.CiudadId = 325;
        record.data.ClienteId = 1;
        record.data.MovTipo = 'I';
        record.data.x_EstatusOrden = 1;

        //me.down('#FormToolbar').bindStore(Ext.create('Muller.store.Movimientos'));
        //me.down('#FormToolbar').store.add(r);

        //me.down('#FormToolbar').gotoAt(1);
        //btn = me.down('#FormToolbar').down('#edit'); 
        //btn.fireEvent('click', btn);

        //me.down('field[name=MovChofer]').focus(true, 200);
    },

    onSaveClick: function(button, e, eOpts) {
        var me = this;
        var editform = me.getForm();

        if(!editform.isValid())  { 
            Ext.Msg.wait("Alerta","Datos Inv\u00F1lidos o Incompletos");
            return;
        }

        editform.updateRecord();

        var record = editform.getRecord(),
            isNewRecord = true;

        if(!record.phantom) {
            record.data.MovModificadoPor = Ext.JSON.decode(Ext.util.Cookies.get("CurrentUser")).UsuarioId;
            isNewRecord = false;
        }

        me.setFechaStatus(record);
        
        Ext.Msg.wait("Espere","Grabando registro!!!");

        record.save({ 
            success: function(e) { 
                Ext.Msg.hide();
                if(!isNewRecord) {
                    //me.loadRecord(record);
                    //me.down('field[name=MovViaje]').setValue(record.data.MovViaje);
                    me.down('#FormToolbar').doRefresh();
                    me.down('field[name=MovChofer]').focus(true, 200);
                } else {
                    var grid = me.callerForm.down('gridpanel'),
                    lastOpt = grid.store.lastOptions;
                    grid.store.reload({params: lastOpt.params});
                    me.down('#FormToolbar').down('#add').fireEvent('click');
                    me.down('field[name=MovChofer]').focus(true, 200);
                }
            },
            failure: function() {
                Ext.Msg.hide();
            }
        });
    },

    onDeleteClick: function(pageTool, record) {
        
        if(record){
            var curRec = record.index - 1;
            curPage = pageTool.store.currentPage;
            prevRec = (curRec <= 0) ? 1 : curRec;

            record.destroy({
                success: function() {
                    pageTool.store.reload();
                    pageTool.gotoAt(prevRec);
                }
            });
        }
    },

    getFechaEstatus: function(record) {
        var me = this,
            fecha = new Date(),
            hora = fecha.getHours(),
            hora12 = hora >= 13 ? hora - 12 : hora,
            minutos = fecha.getMinutes(),
            ampm = 'AM';

        switch (record.x_Estatus) {
            case "ASIGNADO":
                fecha = record.MovFechaAsignado;
                hora = fecha.getHours();
                hora12 = hora >= 13 ? hora - 12 : hora;
                minutos = fecha.getMinutes();
                ampm = fecha.getHours() >= 12 ? 'PM' : 'AM';
                break;

            // case "CARGANDO":
            //     fecha = record.MovFechaCargando;
            //     hora = fecha.getHours();
            //     hora12 = hora >= 13 ? hora - 12 : hora;
            //     minutos = fecha.getMinutes()
            //     ampm = fecha.getHours() >= 12 ? 'PM' : 'AM';
            //     break;

            // case "PLANTA GY":
            //     fecha = record.MovFechaPlantaGY;
            //     hora = fecha.getHours();
            //     hora12 = hora >= 13 ? hora - 12 : hora;
            //     minutos = fecha.getMinutes()
            //     ampm = fecha.getHours() >= 12 ? 'PM' : 'AM';
            //     break;
        }

        hora12 = Ext.String.leftPad(hora12,2,'0');
        minutos = Ext.String.leftPad(minutos,2,'0');

        me.down('field[name=fecha]').setValue(fecha);
        me.down('field[name=hora]').setValue(hora12);
        me.down('field[name=minutos]').setValue(minutos);
        me.down('field[name=ampm]').setValue(ampm);

        returnDate = "{0} {1}:{2} {3}".format(Ext.Date.format(fecha,"d/m/Y"), hora12, minutos, ampm);

        //console.log(Ext.Date.parse(returnDate, "d/m/Y h:i A"));
    },

    setFechaStatus: function(record) {
        var me = this,
            fecha = me.down('field[name=fecha]').getValue(),
            hora = me.down('field[name=hora]').getValue(),
            minutos = me.down('field[name=minutos]').getValue(),
            ampm = me.down('field[name=ampm]').getValue(),
            estatus = me.down('field[name=EstatusId]').getRawValue(),
            strfechaEstatus = "{0} {1}:{2} {3}".format(Ext.Date.format(fecha,"d-m-Y"), hora, minutos, ampm);

        var fechaEstatus = new Date();


        switch (estatus) {
            case "ASIGNADO":
                fechaEstatus = Ext.Date.parse(strfechaEstatus, 'd-m-Y h:i A');
                record.data.MovFechaAsignado = fechaEstatus;
                break;

            case "VACIO":
                record.data.MovFechaVacio = fechaEstatus;
                break;

            case "PLANTA GY":
                record.data.MovFechaPlantaGY = fechaEstatus;
                break;
        }

    }

});