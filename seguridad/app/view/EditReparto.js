Ext.define('MyApp.view.EditReparto',{
	extend: 'Ext.form.Panel',
	alias: 'widget.editreparto',

	requires: [
		'Ext.form.FieldSet',
		'Ext.field.DatePicker'
	],
	id: 'editreparto',
	config: {
		//modal: true,
    hideOnMaskTap: false,
    //centered: true,
    width: '100%',
    height: '100%',
		items: [
		{
			xtype: 'fieldset',
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
          name: 'RepartoId'
      },
      {
        xtype: 'datepickerfield-ux',
        name: 'RepartoFechaEntregado',
        label: 'Entregado',
        //value: new Date(),
        dateFormat: 'd/m/Y',
        //readOnly: true,
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
        label: 'Comentarios',
        maxRows: 2,
        name: 'RepartoComentarios'
      },
	    ]
		}
		]
	},

  initialize: function() {
    //var that = this;
    //that.down('field[name=MovUbicacionTransito]').config.config.proxy.url += "?id="+that.config.MovId;
  },

	onGrabar: function() {
		var me = this,
			datos = me.getValues(),
      navView = me.up('navigationview'),
      editform = navView.down('editform'); 

    // seteamos la fecha de entregado si esta vacía o nula
    if(datos.RepartoFechaEntregado !== null && datos.RepartoFechaEntregado.getFullYear() <= 1901)
      datos.RepartoFechaEntregado = null;

    if(!me.validDatos(datos)) return;

    me.mainRecord.set('RepartoFechaEntregado', datos.RepartoFechaEntregado);
    me.mainRecord.set('RepartoModificadoPor', Ext.JSON.decode(Ext.util.Cookies.get("Seguridad.CurrentUser")).UsuarioId);
    me.mainRecord.set('RepartoComentarios', datos.RepartoComentarios);

    var dataUpload = me.mainRecord.data;

		Ext.Viewport.setMasked({
      xtype: 'loadmask',
      message: 'Espere por favor...'
    });

		Ext.Ajax.request({
			method:'POST',
			url:'../wa/api/Repartos',
			jsonData: Ext.encode(dataUpload),
			headers: {
				'Authorization-Token': Ext.util.Cookies.get('Seguridad.AppAuth')
			},
			success: function(response, opts) {
				var btn = navView.down('button'),
          editform = navView.down('#editform');

        var jsonData = Ext.decode(response.responseText);

        var movFechaEntregado = jsonData.data.x_MovFechaEntregado ? getLocalDate(new Date(jsonData.data.x_MovFechaEntregado)) : null;

        editform.down('field[name=MovFechaEntregado]').setValue(movFechaEntregado);

        var listaRepartos = navView.down('#listaRepartos');
        listaRepartos.refresh();

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
    return true;
  }
});