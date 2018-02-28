Ext.define('MyApp.view.Edit',{
	extend: 'Ext.form.Panel',
	alias: 'widget.editform',

	requires: [
		'Ext.form.FieldSet',
		'Ext.field.DatePicker',
    'MyApp.view.RepartosLista'
	],
	id: 'editform',
  Repartos: null,
	config: {
		//modal: true,
    autoDestroy: true,
    hideOnMaskTap: false,
    //centered: true,
    width: '100%',
    height: '100%',
		items: [
	// {
  //           xtype: 'toolbar',
  //           ui: 'neutral',
  //           docked: 'bottom',
  //           scrollable: null,
  //           //items: [{iconCls: 'compose'}, {iconCls: 'refresh'}],
  //           items: [
  //           {
  //           	xtype:'button',
  //           	ui: 'normal',
  //           	text: 'Grabar',
  //           	listeners: {
  //           		tap: function(btn) {
  //           			var me = btn.up('panel');
  //           			me.onGrabar();
  //           		}
  //           	}
  //           }
  //           ],
  //           layout: {
  //               pack: 'right',
  //               align: 'right'
  //           }
  //       },
		{
			xtype: 'fieldset',
			//title: 'Datos',
			defaults: {
				labelWidth: '25%',
				style: {
					fontSize: '1em'
				},
				labelAlign: Ext.os.is.Phone ? 'top' : 'left'
			},
			items: [
      {
          xtype: 'hiddenfield',
          name: 'MovId'
      },
      {
          xtype: 'hiddenfield',
          name: 'x_Facturas'
      },
      {
          xtype: 'autocompletefield',
          name: 'MovUbicacion',
          label: 'Ubicacion Salida',
          //value: '',
          config: {
              proxy: {
                  method: 'GET',
                  type: 'ajax',
                  url: '../wa/api/ubicacion',
                  params: {
                    id:0
                  },
                  headers: {
                      'Authorization-Token': Ext.util.Cookies.get('Seguridad.AppAuth')
                  },
                  reader: {
                      type: 'json',
                      rootProperty: 'data'
                  }
              },
              resultsHeight: 100,
              needleKey: 'clave',
              labelKey: 'name'
          }
      },
      {
        xtype: 'datepickerfield-ux',
        name: 'MovFechaSalida',
        label: 'Fecha Salida',
        value: new Date(),
        dateFormat: 'd/m/Y',
        readOnly: true,
        usePicker: true,
        picker: {
          yearFrom: new Date().getFullYear(),
          doneButton : 'Listo',
          cancelButton : 'Cancelar',
          listeners: {
            show: function(component, eOpts) {
              var date = this.getValue();
              if (!date) {
                  this.setValue(new Date());
              }
            }
          }
        },
        listeners: {
          'select': function(field, newDate, oldDate, eOpts) {

            // return;

            // //var navview = Ext.getCmp('navMain'),
            // var me = Ext.getCmp('editform');

            // if(newDate !== null) {
            //   me.down("field[name=x_HoraSalida]").show(true);
            // } else {
            //   me.down("field[name=x_HoraSalida]").hide(true);
            // }
          },
          'change': function(field, newDate, oldDate, eOpts) {

            // return;

            // var fieldNext = Ext.ComponentQuery.query("timepickerfield[name=x_HoraSalida]")[0];

            // if(!fieldNext) return;

            // if(newDate !== null) {
            //   fieldNext.show(true);
            // } else {
            //   fieldNext.hide(true);
            // }
          }
        }
      },
      {
          xtype: 'timepickerfield',
          label: 'Hora de Salida',
          name: 'MovHoraSalida',
          defaultTime: null,
          //hidden: true,
          picker: {
          	minuteIncrement: 1,
          	doneButton: 'Listo',
          	cancelButton: 'Cancelar'
          }
      },
      {
        xtype: 'selectfield',
        label: 'Estatus',
        placeHolder:  'Seleccionar',
        name: 'EstatusId',
        usePicker: true,
        defaultPhonePickerConfig : {
          doneButton : 'Listo',
          cancelButton : 'Cancelar'
        },
        listeners: {
          'change': function(field, newValue, oldValue, eOpts) {
            //var navview = Ext.getCmp('navMain'),
            var me = Ext.getCmp('editform'),
              estatus = field.getRecord().data.text,
              fieldCompletado = null;

            fieldCompletado = Ext.ComponentQuery.query("datepickerfield-ux[name=MovFechaCompletado]")[0];

            if(!fieldCompletado) return;

            if(estatus === "COMPLETADO") {
              fieldCompletado.show(true);
            } else {
              fieldCompletado.hide(true);
            }

            var btnRepartos = null;

            btnRepartos = Ext.ComponentQuery.query("button[name=btnRepartos]")[0];

            if(estatus === "CLIENTE") {
              btnRepartos.show(true);
            } else {
              btnRepartos.hide(true);
            }
          }
        }
      },
      {
        xtype: 'button',
        text: 'Ver Repartos',
        name: 'btnRepartos',
        hidden: true,
        listeners: {
          tap: function() {
            var me = Ext.getCmp('editform'),
              view = Ext.getCmp('navMain');

            // se cargan los repartos y se pasa como parametro el callback
            // me.loadRepartos(me.Repartos, function(repartosArray) {
            //   var repartosLista = Ext.widget('repartoslista',{
            //     items: repartosArray
            //   });

            //   view.push({
            //     title: 'Repartos',
            //     items: [repartosLista]
            //   });                    
            // });
            
            var repartoslista = Ext.widget('repartoslista');

            repartoslista.loadLista(me.Repartos);

            view.push({
              title: 'Repartos',
              items:[repartoslista]
            });
          }
        }
      },
      {
        xtype: 'datepickerfield-ux',
        name: 'MovFechaEntregado',
        label: 'Fecha Entregado',
        dateFormat: 'd/m/Y',
        usePicker: true,
        readOnly: true,
        //hidden: true,
        picker: {
          yearFrom: new Date().getFullYear(),
          doneButton : 'Listo',
          cancelButton : 'Cancelar',
          listeners: {
            show: function(component, eOpts) {
              var date = this.getValue();
              if (!date) {
                  this.setValue(new Date());
              }
            }
          }
        }
      },
      {
        xtype: 'selectfield',
        label: 'Estatus Informativo',
        placeHolder:  'Seleccionar',
        name: 'EstaInfoId',
        usePicker: true,
        defaultPhonePickerConfig : {
            doneButton : 'Listo',
            cancelButton : 'Cancelar'
        }
        //valueField: 'EstaInfoId',
        //displayField: 'EstaInfoNombre'
      },
      {
        xtype: 'autocompletefield',
        name: 'MovUbicacionTransito',
        label: 'Ubicacion Tránsito',
        config: {
          proxy: {
              method: 'GET',
              type: 'ajax',
              url: '../wa/api/ubicaciontransito',
              headers: {
                  'Authorization-Token': Ext.util.Cookies.get('Seguridad.AppAuth')
              },
              reader: {
                  type: 'json',
                  rootProperty: 'data'
              }
          },
          resultsHeight: 100,
          needleKey: 'clave',
          labelKey: 'name'
        }
      },
      {
        xtype: 'datepickerfield-ux',
        name: 'MovFechaCompletado',
        label: 'Fecha Completado',
        value: new Date(),
        hidden: true,
        dateFormat: 'd/m/Y',
        usePicker: true,
        picker: {
          yearFrom: new Date().getFullYear(),
          doneButton : 'Listo',
          cancelButton : 'Cancelar',
          listeners: {
            show: function(component, eOpts) {
              var date = this.getValue();
              if (!date) {
                  this.setValue(new Date());
              }
            }
          }
        }
      },
      {
        xtype: 'textareafield',
        label: 'Comentarios (USO INTERNO)',
        maxRows: 2,
        name: 'MovComentarioInterno'
      },
      {
        xtype: 'textareafield',
        label: 'Comentarios (VISOR)',
        maxRows: 2,
        name: 'MovComentario'
      }
	    ]
		}
		]
	},

  initialize: function() {
    var that = this;

    // configuramos el proxy del selector para filtrar por la ubicacion del MovId seleccionado
    // para que nos devuelva dentro de la ubicacion de transito el cliente actual
    that.down('field[name=MovUbicacionTransito]').config.config.proxy.url += "?id="+that.config.MovId;
  },

	onGrabar: function() {
		var me = this,
			datos = me.getValues();

    // Seteamos el usuario que actualiza el registro
		datos.x_UserUpdate = Ext.JSON.decode(Ext.util.Cookies.get("Seguridad.CurrentUser")).UsuarioId;

    // validamos los datos cargados
    if(!me.validDatos(datos)) return false;

    // Obtenemos la fecha de salida y seteamos la hora registrada
    if (Ext.isDate(datos.MovFechaSalida)) {
      var fechaSalida = datos.MovFechaSalida,
        hora = datos.MovHoraSalida.getHours(),
        hora12 = hora >= 13 ? hora - 12 : hora,
        minutos = datos.MovHoraSalida.getMinutes(),
        ampm = datos.MovHoraSalida.getHours() >= 12 ? 'PM' : 'AM';

      var newFechaSalida = new Date();
      hora12 = Ext.String.leftPad(hora12,2,'0');
      minutos = Ext.String.leftPad(minutos,2,'0');

      //console.log(new Date(fechaSalida.getFullYear(), fechaSalida.getMonth(), fechaSalida.getDay(), hora12, minutos, 0));
      var strFechaSalida = "{0} {1}:{2} {3}".format(Ext.Date.format(fechaSalida,"d-m-Y"), hora12, minutos, ampm);
      newFechaSalida = Ext.Date.parse(strFechaSalida, 'd-m-Y h:i A', true);
      datos.MovFechaSalida = newFechaSalida;
      datos.MovHoraSalida = newFechaSalida;
    }

    // obtenemos el nombre de los estatus seleccionados
    var estaInfoNombre = me.down('field[name=EstaInfoId]').getRecord(),
    estatusNombre = me.down('field[name=EstatusId]').getRecord();

    estaInfoNombre = (estaInfoNombre) ? estaInfoNombre.data.text : null;
    estatusNombre = (estatusNombre) ? estatusNombre.data.text : null;

    // si el estatus es completado seteamos la fecha completado de lo contrario se coloca nula
    datos.MovFechaCompletado = (!String.isNullOrEmpty(estatusNombre) && estatusNombre !== "COMPLETADO") ? null : datos.MovFechaCompletado;

    // seteamos la fecha de entregado si esta vacía o nula
    if(datos.MovFechaEntregado !== null && datos.MovFechaEntregado.getFullYear() <= 1901)
      datos.MovFechaEntregado = null;


  	Ext.Viewport.setMasked({
      xtype: 'loadmask',
      message: 'Espere por favor...'
    });

    // subimos los datos a la API
		Ext.Ajax.request({
			method:'POST',
			url:'../wa/api/Seguridad',
			jsonData: Ext.encode(datos),
			headers: {
				'Authorization-Token': Ext.util.Cookies.get('Seguridad.AppAuth')
			},
			success: function(response, opts) {
				var navview = me.up('navigationview'),
					btn = navview.down('button'),
					lista = navview.down('#listaDist'), 
					record = lista.getStore().getAt(navview.lastSelectedIndex); 

				record.set('MovComentario', datos.MovComentario);
				record.set('EstaInfoId', datos.EstaInfoId);
				record.set('x_EstatusInfo', estaInfoNombre);
        record.set('x_Estatus', estatusNombre);
        record.set('EstatusId', datos.EstatusId);
        record.set('MovUbicacion', datos.MovUbicacion);
        record.set('MovUbicacionTransito', datos.MovUbicacionTransito);
        record.set('MovFechaSalida', datos.MovFechaSalida);
        record.set('MovHoraSalida', datos.MovFechaSalida);
        record.set('MovFechaCompletado', datos.MovFechaCompletado);
        record.set('MovFechaEntregado', datos.MovFechaEntregado);

        Ext.Viewport.setMasked(false);
				btn.fireEvent('tap', btn);
				//console.log();
			},
      failure: function(response, opts) {
        console.log('server-side failure with status code ' + response.status);
        Ext.Viewport.setMasked(false);
      }
		});
	},

  validDatos: function(datos) {
    var me = this,
      navView = me.up('navigationview'),
      lista = navView.down('#listaDist'),
      record = lista.getStore().getAt(navView.lastSelectedIndex), 
      selectedEstatus = me.down("field[name=EstatusId]").getRecord().data.text;

    // Si el viaje no es fallido y no se han cargado facturas se evita la grabación
    if(String.isNullOrEmpty(record.get('x_Facturas')) && selectedEstatus !== "FALLIDO") {
      Ext.Msg.alert('Validación', 'No se han cargado facturas', Ext.emptyFn);
      return false;
    }

    // Si se cargo fecha de salida y no se cargo hora de salida se evita la grabaciòn
    if(Ext.isDate(datos.MovFechaSalida) && !Ext.isDate(datos.MovHoraSalida)) {
      Ext.Msg.alert('Validación', 'Debe ingresar hora de salida', Ext.emptyFn);
      return false;  
    }

    // Si no hay fecha de salida se evita la grabación
    if(!Ext.isDate(datos.MovFechaSalida) && Ext.isDate(datos.MovHoraSalida)) {
      Ext.Msg.alert('Validación', 'Debe ingresar fecha de salida', Ext.emptyFn);
      return false;  
    }

    //console.log(me.down("field[name=EstatusId]").getRecord().data.text);
    // Si está programado y no se ha cargado fecha y hora de salida se evita la grabación
    if((selectedEstatus === "PROGRAMADO" || selectedEstatus === "REPROGRAMADO") && !Ext.isDate(datos.MovFechaSalida)) {
      Ext.Msg.alert('Validación', 'Debe ingresar fecha de salida', Ext.emptyFn);
      return false;  
    }

    // Si el estatus es COMPLETADO y no se ha registrado la fecha de Entregado se evita la grabación
    if(selectedEstatus === "COMPLETADO" && !Ext.isDate(datos.MovFechaEntregado)) {
      Ext.Msg.alert('Validación', 'Debe ingresar fecha de entregado antes de completar', Ext.emptyFn);
      return false;  
    }

    // Si el estatus es COMPLETADO y no se ha registrado la fecha de COMPLETADO se evita la grabación
    if(selectedEstatus === "COMPLETADO" && !Ext.isDate(datos.MovFechaCompletado)) {
      Ext.Msg.alert('Validación', 'Debe ingresar fecha de completado', Ext.emptyFn);
      return false;  
    }

    //Si el estatus seleccionado es RETORNANDO y No hay fecha de Entregado se aborta el evento
    if(selectedEstatus === "RETORNANDO" && !Ext.isDate(datos.MovFechaEntregado)) {
      Ext.Msg.alert('Validación', 'Debe completar los repartos', Ext.emptyFn);
      return false;  
    }

    //devolvemos true si no se cumple ninguna de las condiciones previas
    return true;
  },

  // Se cargan las opciones del radio Button de repartos
  loadRepartos: function(repartos, callback) {
    var that = this,
        mainRecord = that.mainRecord,
        movId = (repartos && repartos[0]) ? repartos[0].MovId : 0;

    Ext.Viewport.setMasked({
        xtype: 'loadmask',
        message: 'Espere por favor...'
    });

    var repartosArray = [];

    var storeRepartos = Ext.create('MyApp.store.Repartos').load({
        scope: storeRepartos,
        params: {MovId: movId},
        callback: function() {

          storeRepartos.each(function(record) {
            var isChecked = (mainRecord.data.MovCurrentRepartoId === record.raw.RepartoId) ? true : false;

            repartosArray.push({
              xtype:'radiofield',
              name:'MovCurrentRepartoId',
              labelWidth: '80%',
              value: record.raw.RepartoId,
              label: record.raw.x_Cliente,
              checked: isChecked,
              fechaEntregado: record.raw.RepartoFechaEntregado,
              listeners: {
                check: that.onCheckReparto
              }
            });
          });

          callback(repartosArray);

          Ext.Viewport.setMasked(false);
        }
    });

    return repartosArray;
  },

  onCheckReparto: function(rbutton, e, eOpts) {
    var navView = Ext.getCmp('navMain'),
      editform = Ext.getCmp('editform'),
      repartoId = rbutton.getValue();

    var editReparto = Ext.widget('editreparto', {
        RepartoId: repartoId
    });
    
    Ext.Viewport.setMasked({
        xtype: 'loadmask',
        message: 'Espere por favor...'
    });

    editform.Repartos.forEach(function(element, index, array) {
      if(element.RepartoId === repartoId) editReparto.mainRecord = element;
    });

    editReparto.setValues({
        RepartoId: repartoId,
        RepartoFechaEntregado: editReparto.mainRecord.RepartoFechaEntregado
    });

    navView.push({
        title: editReparto.mainRecord.x_Cliente,
        items: [editReparto]
    });

    Ext.Viewport.setMasked(false);
  }
});