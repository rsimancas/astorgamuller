Ext.define('MyApp.view.Main', {
    extend: 'Ext.NavigationView',
    id: 'navMain',
    xtype: 'main',
    requires: [
        //'Ext.TitleBar',
        'Ext.dataview.List',
        'MyApp.view.Edit'
    ],
    lastSelectedIndex: 0,
    editForm: null,
    currentForm: "",
    config: {
        autoDestroy: false,
        //fullscreen: true,
        showAnimation:  'fadeIn',
        defaultBackButtonText: 'Volver',

        navigationBar: {
            //ui: 'sencha',
            items: [
                { xtype: 'spacer' },
                {
                    xtype: 'searchfield',
                    id: 'searchfieldlist',
                    placeHolder: 'Buscar...'
                },
                {
                    xtype: 'button',
                    id: 'logoutButton',
                    text: 'Salir',
                    align: 'right',
                    hidden: false,
                    hideAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeOut',
                        duration: 200
                    },
                    showAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeIn',
                        duration: 200
                    },
                    listeners: {
                        tap: function(btn) {
                            Ext.util.Cookies.clear("Seguridad.CurrentUser");
                            Ext.util.Cookies.clear("Seguridad.AppAuth");
                            window.location.reload();
                        }
                    }
                },
                {
                    xtype: 'button',
                    id: 'saveButton',
                    text: 'Grabar',
                    //ui: 'sencha',
                    align: 'right',
                    hidden: true,
                    hideAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeOut',
                        duration: 200
                    },
                    showAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeIn',
                        duration: 200
                    },
                    listeners: {
                        tap: function(btn) {
                            // obtenemos el form actual y llamamos el metodo grabar.
                            var navView = btn.up('navigationview');
                            navView.currentForm.onGrabar();
                        }
                    }
                }
            ]
        },

        items: [
        {
            //title: 'Distribución',
            //iconCls: 'home',
            style: {
                fontSize: '15'
            },

            styleHtmlContent: true,
            scrollable: true,
            scrollToTopOnRefresh: false,
            striped: true,
            
            xtype: 'list',
            //title: 'sample',
            itemId: 'listaDist',
            itemTpl: '<div><strong>{x_Cliente}</strong></div><div> Viaje: <strong>{MovViaje}</strong> Equipo:<strong>{x_Equipo}</strong></div>' +
            '<div>Asig.: <strong>{x_FechaAsignado}</strong> Destino: <strong>{[(!String.isNullOrEmpty(values.x_Ciudad)) ? values.x_Ciudad : "" ]}</strong></div>' +
            '<div>Facturas: <strong>{[(!String.isNullOrEmpty(values.x_Facturas)) ? values.x_Facturas : getEsperandoFacturas()]}</strong></div>' +
            '<div>Ubicación Salida: <strong>{MovUbicacion}</strong>  Fecha Salida: <strong>{x_FechaSalida}</strong> Hora: <strong>{[(values.MovHoraSalida != null) ? getFormattedDateSalida(values.MovHoraSalida) : "-"]}</strong></div>' +
            '<div>Estatus: {[getEstatusDistribucionColor(values.x_Estatus)]} Cauchos: <strong>{[addCommas(values.MovCantidadCauchos)]}</strong> {[(values.x_Estatus === "TRANSITO") ? "Ubicación Transito: <strong>"+values.MovUbicacionTransito+"</strong>" : ""]}</div>' +
            '{[(!String.isNullOrEmpty(values.x_EstatusInfo)) ? "<div>Estatus Informativo: <strong>"+values.x_EstatusInfo+"</strong></div>" : ""]}' +
            '{[(!String.isNullOrEmpty(values.MovComentario)) ? "<div>Comentarios (Visor): <strong>"+values.MovComentario+"</strong></div>" : ""]}' +
            '{[(values.x_Estatus==="COMPLETADO" && values.x_FechaCompletado !== null) ? "<div>Fecha Completado: " + values.x_FechaCompletado+"</div>" : ""]}' +
            '{[(!String.isNullOrEmpty(values.MovComentarioInterno)) ? "<div>Comentarios (Interno): <strong>"+values.MovComentarioInterno+"</strong></div>" : ""]}',
            listeners: {
                itemsingletap: function(item, index, target, record, e, eOpts ) {
                    // use the push() method to push another view. It works much like
                    // add() or setActiveItem(). it accepts a view instance, or you can give it
                    // a view config.

                    var navView = Ext.getCmp('navMain');

                    navView.lastSelectedIndex = index;

                    var edit = Ext.widget('editform', { MovId: record.get('MovId') });
                    
                    edit.mainRecord = record;

                    Ext.Viewport.setMasked({
                        xtype: 'loadmask',
                        message: 'Espere por favor...'
                    });

                    var curorden = record.get("x_EstatusOrden");

                    var storeMov = Ext.create('MyApp.store.ViewDistribucion').load({
                        params:{id: record.get('MovId')},
                        callback: function() {
                            var storeEstatus =  Ext.create('MyApp.store.Estatus',{remoteSort: false}).load({
                                params:{tipo:'D', page:0, limit:0, start:0},
                                callback: function() {
                                    var options = [];

                                    storeEstatus.sort([
                                        {
                                            property : 'EstatusOrden',
                                            direction: 'ASC'
                                        },
                                        {
                                            property : 'EstatusNombre',
                                            direction: 'ASC'
                                        }
                                    ]);

                                    storeEstatus.filter([Ext.create('Ext.util.Filter', {
                                        filterFn: function(item) { 
                                            return item.get("EstatusNombre") !== "COMPLETADO" ||
                                            item.get("EstatusId") === edit.mainRecord.data.EstatusId  ||
                                            item.get("EstatusOrden") === (curorden + 1);
                                        }
                                    })]);

                                    storeEstatus.each(function(record) {
                                        //if(record.raw.EstatusNombre === "FALLIDO" || record.raw.EstatusNombre === "COMPLETADO" || record.raw.EstatusOrden === curorden  || record.raw.EstatusOrden === (curorden + 1)) {
                                            options.push({value:record.raw.EstatusId, text: record.raw.EstatusNombre});
                                        //}
                                    });

                                    edit.down('field[name=EstatusId]').setOptions(options);

                                    var storeEstaInfo =  Ext.create('MyApp.store.EstatusInfo').load({
                                        params:{page:0,limit:0,start:0},
                                        callback: function() {
                                            var options = [];

                                            options.push({value:null, text: ""});

                                            // storeEstaInfo.data.items.forEach(function(element, index, array) {
                                            //     options.push({value: element.raw.EstaInfoId, text: element.raw.EstaInfoNombre});
                                            // });

                                            storeEstaInfo.each(function(record) {
                                                options.push({value:record.raw.EstaInfoId, text: record.raw.EstaInfoNombre});
                                            });

                                            edit.down('field[name=EstaInfoId]').setOptions(options);

                                            Ext.Viewport.setMasked(false);

                                            navView.push({
                                                title: record.get('MovViaje'),
                                                items: [edit]
                                            });

                                            //var horaSalida = record.get('MovFechaSalida') ? record.get('MovFechaSalida') : '';
                                            //horaSalida = (horaSalida!=null) ? view.getFormattedDate(horaSalida) : '';
                                            var mov = storeMov.getAt(0);
                                            edit.Repartos = mov.data.x_Repartos;

                                            edit.setValues({
                                                EstatusId: mov.data.EstatusId,
                                                EstaInfoId: mov.data.EstaInfoId,
                                                MovComentario: mov.data.MovComentario,
                                                MovId: mov.data.MovId,
                                                MovFechaSalida: mov.data.MovFechaSalida ? getLocalDate(mov.data.MovFechaSalida) : null,
                                                MovHoraSalida: mov.data.MovHoraSalida ? getLocalDate(mov.data.MovHoraSalida) : null,
                                                x_Facturas: mov.data.x_Facturas,
                                                MovUbicacion: mov.data.MovUbicacion,
                                                MovUbicacionTransito: mov.data.MovUbicacionTransito,
                                                MovFechaCompletado: mov.data.MovFechaCompletado ? getLocalDate(mov.data.MovFechaCompletado) : null,
                                                MovFechaEntregado: mov.data.MovFechaEntregado ? getLocalDate(mov.data.MovFechaEntregado) : null,
                                                MovComentarioInterno: mov.data.MovComentarioInterno
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
        ],
        listeners: {
            back: function(view, eOpts) {
                var me = this,
                    currentId = Ext.isObject(view.currentForm) ? view.currentForm.id : null,
                    panelsArray = Ext.ComponentQuery.query('formpanel');


                if(panelsArray.length > 0)  {
                    var index = panelsArray.length - 1;
                    //console.log('back', panelsArray[index].id);
                    panelsArray[index].destroy();

                    if(index > 0) {
                        view.currentForm = panelsArray[index - 1];
                    } else {
                        view.currentForm = null;
                    }
                }

                view.down('#logoutButton').hide();
                view.down('#searchfieldlist').hide();
                view.down('#saveButton').hide();

                if (view.currentForm === null) {
                    view.down('#logoutButton').show();
                    view.down('#searchfieldlist').show();
                    //view.down('#saveButton').hide();
                    view.loadDist();
                }

                if(view.currentForm.id === 'editform' || view.currentForm === 'editreparto') {
                    view.down('#saveButton').show();
                } 
            },
            push: function( navView, view, eOpts ) {
                var panelsArray = Ext.ComponentQuery.query('formpanel'),
                    form = null;

                if(panelsArray.length === 0) {
                    navView.currentForm = null;
                } else {
                    var index = panelsArray.length - 1;
                    form = panelsArray[index];
                }

                navView.currentForm = form;

                navView.down('#saveButton').hide();
                
                if(form === null) {
                    navView.down('#logoutButton').show();
                    navView.down('#searchfieldlist').show();
                    return;
                }

                //console.log('push', form.id);

                if (form.id === "editform" || form.id === "editreparto") {
                    navView.down('#logoutButton').hide();
                    navView.down('#searchfieldlist').hide();
                    navView.down('#saveButton').show();
                }

            }
        }
    },

    loadDist: function() {
        var me = this;

        var lista = me.down('#listaDist');

        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Espere por favor...'
        });

        var storeMain = Ext.create('MyApp.store.ViewDistribucion').load({
            params:{tipo:'D',security:1,page:0,limit:0,start:0},
            callback: function() {
                storeMain.filter([Ext.create('Ext.util.Filter', {filterFn: function(item) { return item.get("x_Estatus") !== 'ASIGNADO' && !String.isNullOrEmpty(item.get("MovViaje")); }})]);

                lista.setStore(storeMain);
                lista.refresh();
                lista.select(me.lastSelectedIndex, true);
                Ext.Viewport.setMasked(false);

                searchBox = me.down("#searchfieldlist");

                if(!String.isNullOrEmpty(searchBox.getValue())) {
                    searchBox.fireEvent('keyup', searchBox);
                }
                //lista.getSelectionModel().select(me.lastSelectedIndex, false, true); 
            }
        });
        
        //return store;

        // var list = Ext.create('Ext.List', {
        //     fullscreen: true,
        //     //cls: 'dataview-basic',
        //     //itemTpl: '{MovViaje}',
        //     // layout: Ext.os.deviceType == 'Phone' ? 'fit' : {
        //     //     type: 'vbox',
        //     //     align: 'center',
        //     //     pack: 'center'
        //     // },
        //     // width: Ext.os.deviceType == 'Phone' ? null : '50%',
        //     // height: Ext.os.deviceType == 'Phone' ? null : '80%', 
        //     itemTpl: '<div class="content"><h2>{x_Cliente}</h2>{MovViaje} {x_Estatus}</div>',
        //     store: store
        // });

        // Ext.Viewport.add(list);
        // list.show();
    },

    getFormattedDate: function(date) {
        var offset = new Date().getTimezoneOffset(); // obtenemos la zona horaria y se la agregamos para mostrar la fecha exacta
        offset = offset/60;
        parsed = Date.parse(date);
        if(date) {
            parsed = Date.parse(date.toUTCString());
        }
        var valor = parsed ? new Date(parsed + offset * 3600 * 1000) : null; 
        //returnVal = valor ? valor.format('dd/mm').trim() : "";
        //return returnVal;

        return valor;
    }
});
