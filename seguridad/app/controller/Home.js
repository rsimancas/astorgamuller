Ext.define('MyApp.controller.Home', {
    extend: 'Ext.app.Controller',

    config: {
        stores: ['ViewDistribucion','EstatusInfo','Estatus','Repartos'],

        views: ['Logon','Main'],

        models: ['ViewDistribucion','Repartos','EstatusInfo','Estatus'],

        refs: {
        //     stationsList: 'stationslist',
        //     newStationSelect: 'newstation'
            'searchFieldList': '#searchfieldlist'
        },

        control: {
        //     stationsList: {
        //         select: 'onStationSelect'
        //     },
        //     newStationSelect: {
        //         change: 'onNewStationSelect'
        //     }
            searchFieldList: {
                clearicontap: 'onSearchClearIconTap',
                keyup: 'onSearchKeyUp'
            }
        }
    },

    launch: function() {
    	var me = this;

        var auth = Ext.util.Cookies.get('Seguridad.AppAuth');

        if (!auth  || auth === null) {
            var form = Ext.widget('logon');
            Ext.Viewport.add(form);
        } else {
            var main = Ext.create('MyApp.view.Main');
            main.loadDist();
            Ext.Viewport.add(main);
        }
        
    },

    /**
     * Called when the search field has a keyup event.
     *
     * This will filter the store based on the fields content.
     */
    onSearchKeyUp: function(field) {
        //get the store and the value of the field
        var value = field.getValue(),
            navview = field.up('navigationview'),
            lista = navview.down('#listaDist'), 
            //record = lista.getStore().getAt(navview.lastSelectedIndex),
            store = lista.getStore();

        //first clear any current filters on thes tore
        store.clearFilter();

        //check if a value is set first, as if it isnt we dont have to do anything
        if (value) {
            //the user could have entered spaces, so we must split them so we can loop through them all
            var searches = value.split(' '),
                regexps = [],
                i;

            //loop them all
            for (i = 0; i < searches.length; i++) {
                //if it is nothing, continue
                if (!searches[i]) continue;

                //if found, create a new regular expression which is case insenstive
                regexps.push(new RegExp(searches[i], 'i'));
            }

            //now filter the store by passing a method
            //the passed method will be called for each record in the store
            store.filter(function(record) {
                var matched = [];

                //loop through each of the regular expressions
                for (i = 0; i < regexps.length; i++) {
                    var search = regexps[i],
                        didMatch = record.get('MovViaje')!==null && (record.get('MovViaje').match(search) || record.get('x_Cliente').match(search) || record.get('x_Estatus').match(search) || record.get('x_Equipo').match(search));

                    //if it matched the first or last name, push it into the matches array
                    matched.push(didMatch);
                }

                //if nothing was found, return false (dont so in the store)
                if (regexps.length > 1 && matched.indexOf(false) != -1) {
                    return false;
                } else {
                    //else true true (show in the store)
                    return matched[0];
                }
            });
        }
    },

    /**
     * Called when the user taps on the clear icon in the search field.
     * It simply removes the filter form the store
     */
    onSearchClearIconTap: function(field) {
        var value = field.getValue(),
            navview = field.up('navigationview'),
            lista = navview.down('#listaDist'), 
            //record = lista.getStore().getAt(navview.lastSelectedIndex),
            store = lista.getStore();


        //call the clearFilter method on the store instance
        store.clearFilter();
    }


});