Ext.define('Muller.view.Choferes', {
    extend: 'Ext.form.Panel',
    alias: 'widget.choferes',
    title: 'Choferes',

    layout: {
        type: 'column'
    },
    //bodyPadding: 10,
    padding: '0 0 0 0',
    frameHeader: false,
    header: false,

    storeNavigator: null,

    requires: [
    'Ext.ux.form.Toolbar',
    'Ext.ux.form.NumericField'
    ],

    previousDate: new Date(),

    initComponent: function() {
        var me = this;

        storeChoferes = Ext.create('Muller.store.Choferes').load({params:{page:0, start:0, limit:0}});

        var curDate = new Date();

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                msgTarget: 'side',
                fieldStyle: 'font-size:11px',
                labelStyle: 'font-size:11px'
            },
            items:[
            // Datos Generales
            {
                xtype: 'fieldset',
                title: 'Datos Generales',
                itemId: 'fsgeneral',
                padding: '0 10 10 10',
                columnWidth: 1,
                layout: {
                    type: 'column'
                },
                items: [
                // primera linea
                {
                    xtype: 'textfield',
                    columnWidth: 0.25,
                    name: 'ChoferId',
                    fieldLabel: 'ID',
                    selectOnFocus : true,
                    readOnly: true,
                    editable: false,
                    enableKeyEvents: true
                },
                {
                    margin: '0 0 0 5',
                    columnWidth: 0.375,
                    xtype: 'textfield',
                    name: 'ChoferNombre',
                    fieldLabel: 'Nombre',
                    fieldStyle:'text-transform:uppercase',
                    allowBlank: false,
                    listeners:{
                        blur: function(field){
                            field.setValue(field.value.toUpperCase());
                        }
                    }
                },
                {
                    margin: '0 0 0 5',
                    columnWidth: 0.375,
                    xtype: 'textfield',
                    name: 'ChoferApellido',
                    fieldLabel: 'Apellido',
                    fieldStyle:'text-transform:uppercase',
                    allowBlank: false,
                    listeners:{
                        blur: function(field){
                            field.setValue(field.value.toUpperCase());
                        }
                    }
                },
                // Segunda linea 
                {
                    xtype: 'textfield',
                    columnWidth: 0.25,
                    name: 'ChoferCedula',
                    fieldLabel: 'Cédula',
                    allowBlank: true,
                    selectOnFocus : true,
                    vtype:'rif',
                    enableKeyEvents: true,
                    listeners:{
                        blur: function(field){
                            field.setValue(field.value.toUpperCase());
                        }
                    }
                },
                {
                    margin: '0 0 0 5',                    
                    xtype:'textfield',
                    columnWidth: 0.25,
                    fieldLabel: 'Nº de Telefono',
                    name: 'ChoferTelefono',
                    vtype: 'phone',
                    selectOnFocus : true,
                    plugins: new Ext.ux.plugin.FormatPhoneNumber()
                },
                {
                    margin: '0 0 0 5',
                    columnWidth: 0.25,
                    name: 'ChoferLicenciaExpira',
                    fieldLabel: 'Licencia Vence',
                    xtype: 'datefield',
                    format: 'd/m/Y'//,
                    //disabledDays:  [0]
                },
                {
                    margin: '0 0 0 5',
                    columnWidth: 0.25,
                    name: 'ChoferExpiraCertificado',
                    fieldLabel: 'Cert. Medico Vence',
                    xtype: 'datefield',
                    format: 'd/m/Y'//,
                    //disabledDays:  [0]
                }
                ]
            },
            // Datos Bancarios
            {
                xtype: 'fieldset',
                title: 'Datos Bancarios',
                itemId: 'fsbancarios',
                margin: '5 0 0 0',
                padding: '0 10 10 10',
                columnWidth: 1,
                layout: {
                    type: 'column'
                },
                items: [
                // primera linea
                {
                    columnWidth: 0.75,
                    xtype: 'textfield',
                    name: 'ChoferTitularCuenta',
                    fieldLabel: 'Titular',
                    fieldStyle:'text-transform:uppercase',
                    allowBlank: true,
                    listeners:{
                        blur: function(field){
                            field.setValue(field.value.toUpperCase());
                        }
                    }
                },
                {
                    margin: '0 0 0 5', 
                    xtype: 'textfield',
                    columnWidth: 0.25,
                    name: 'ChoferCedulaTitular',
                    fieldLabel: 'Cédula Titular',
                    allowBlank: true,
                    selectOnFocus : true,
                    vtype:'rif',
                    enableKeyEvents: true,
                    listeners:{
                        blur: function(field){
                            field.setValue(field.value.toUpperCase());
                        }
                    }
                },
                // Segunda Linea datos bancarios
                {
                    xtype: 'textfield',
                    columnWidth: 0.50,
                    name: 'ChoferBanco',
                    fieldLabel: 'Banco'
                },
                {
                    xtype: 'textfield',
                    margin: '0 0 0 5',
                    name: 'ChoferCuentaBanco',
                    columnWidth: 0.25,
                    fieldLabel: 'Nº de Cuenta',
                    vtype: 'numcta'
                },
                {
                    margin: '0 0 0 10',
                    xtype      : 'fieldcontainer',
                    fieldLabel : 'Tipo de Cuenta',
                    defaultType: 'radiofield',
                    columnWidth: 0.25,
                    defaults: {
                        flex: 1
                    },
                    layout: 'hbox',
                    items: [
                        {
                            boxLabel  : 'Ahorro',
                            name      : 'ChoferTipoCuenta',
                            inputValue: 0,
                            id        : 'radio1'
                        }, 
                        {
                            boxLabel  : 'Corriente',
                            name      : 'ChoferTipoCuenta',
                            inputValue: 1,
                            id        : 'radio2'
                        }
                    ]
                },
                // Tercera Linea
                {
                    xtype:'textfield',
                    columnWidth: 0.5,
                    fieldLabel: 'Correo Electronico',
                    name: 'ChoferEmailTitular',
                    vtype: 'email'
                },
                {
                    margin: '0 0 0 5',                    
                    xtype:'textfield',
                    columnWidth: 0.25,
                    fieldLabel: 'Nº de Telefono Titular',
                    name: 'ChoferTelefonoTitular',
                    vtype: 'phone',
                    plugins: new Ext.ux.plugin.FormatPhoneNumber()
                },
                ]
            }
            ],
            dockedItems: [
            {
                xtype: 'formtoolbar',
                itemId: 'FormToolbar',
                dock: 'top',
                store: me.storeNavigator,
                navigationEnabled: true,
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

    onRenderForm: function() {
        
    },

    onAfterLoadRecord: function(tool, record) {
        var me = this;

        var curRec = record;
    },

    onCloseForm: function() {
        var me = this,
            grid = me.callerForm.down('gridpanel');
        
        grid.store.reload();
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
        var me = this, 
            toolbar = me.down('#FormToolbar');
    },

    onSaveClick: function(button, e, eOpts) {
        
        var me = this,
            editform = me.getForm();

        if(!editform.isValid())  { 
            Ext.Msg.alert("Alerta",'Faltan datos obligatorios');
            return false;
        }

        editform.updateRecord();

        var record = editform.getRecord(),
            isNewRecord = true;

        if(!record.phantom) {
            record.data.ChoferModificadoPor = Ext.JSON.decode(Ext.util.Cookies.get("CurrentUser")).UsuarioId;
            isNewRecord = false;
        }

        Ext.Msg.wait("Espere","Grabando registro!!!");

        record.save({ 
            success: function(e) { 
                var toolbar = me.down('#FormToolbar');
                Ext.Msg.hide();
                if(!isNewRecord) {
                    toolbar.doRefresh();
                } else {
                    var grid = me.callerForm.down('gridpanel'),
                    lastOpt = grid.store.lastOptions;
                    grid.store.reload({params: lastOpt.params});
                    var btn = toolbar.down('#add');
                    btn.fireEvent('click', btn);
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

            Ext.Msg.show({
                title:'Eliminar',
                msg: 'Desea borrar el registro actual?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if(btn === "yes") {
                        record.destroy({
                            success: function() {
                                pageTool.store.reload();
                                pageTool.gotoAt(prevRec);
                            }
                        });
                    }
                }
            });
        }
    }
});