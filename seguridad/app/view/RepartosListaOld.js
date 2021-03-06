Ext.define('MyApp.view.RepartosListaOld', {
    extend: 'Ext.form.Panel',
    alias: 'widget.repartoslistaold',
    id: 'repartoslista',
    requires: [
        //'Ext.TitleBar',
        'Ext.dataview.List',
        'MyApp.view.EditReparto'
    ],
    lastSelectedIndex: 0,
    editReparto: null,
    config: {
        //modal: true,
        hideOnMaskTap: false,
        padding: 0,
        //centered: true,
        width: '100%',
        height: '100%',
        items: [
        {
            style: {
                fontSize: '15'
            },

            styleHtmlContent: true,
            scrollable: true,
            scrollToTopOnRefresh: false,
            striped: true,
            width: '100%',
            //fullscreen: true,
            
            xtype: 'list',
            height: 400,
            itemId: 'listaRepartos',
            itemTpl: '<div><strong>{x_Cliente}</strong></div>',
            listeners: {
                itemsingletap: function(item, index, target, record, e, eOpts ) {
                    // use the push() method to push another view. It works much like
                    // add() or setActiveItem(). it accepts a view instance, or you can give it
                    // a view config.

                    var view = Ext.getCmp('navMain');

                    view.down('#searchfieldlist').hide();
                    view.down('#logoutButton').hide();
                    view.down('#saveButton').show();

                    view.lastSelectedIndex = index;

                    var editReparto = Ext.widget('editreparto', {
                        RepartoId: record.get('RepartoId')
                    });
                    
                    editReparto.mainRecord = record;

                    Ext.Viewport.setMasked({
                        xtype: 'loadmask',
                        message: 'Espere por favor...'
                    });

                    var rep = record.data;
                    editReparto.setValues({
                        RepartoId: rep.RecordId,
                        RepartoFechaEntregado: rep.RepartoFechaEntregado
                    });

                    view.push({
                        title: rep.x_Cliente,
                        items: [editReparto]
                    });

                    Ext.Viewport.setMasked(false);  
                }
            }
        }
        ]
    },

    loadLista: function(repartos) {
        var that = this,
            movId = (repartos && repartos[0]) ? repartos[0].MovId : 0;

        var listaRepartos = that.down('#listaRepartos');

        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Espere por favor...'
        });

        var storeRepartos = Ext.create('MyApp.store.Repartos').load({
            scope: storeRepartos,
            params: {MovId: movId},
            callback: function() {
                listaRepartos.setStore(storeRepartos);
                listaRepartos.refresh();
                listaRepartos.select(0, true);

                Ext.Viewport.setMasked(false);
            }
        });

        // if(repartos && repartos.length > 0) {
        //     repartos.forEach(function(element, index, array) {
        //         var model = Ext.create('MyApp.model.Repartos',{
        //             RepartoId: element.RepartoId,
        //             x_Cliente: element.x_Cliente
        //         });

        //         store.add(model);
        //     });
        // }
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
