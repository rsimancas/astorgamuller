Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': 'ux',
        'Overrides' : 'overrides' //,
        //'Ext.device': 'device'
    }
});

Ext.grid.RowEditor.prototype.cancelBtnText = "Cancelar";
Ext.grid.RowEditor.prototype.saveBtnText = "Guardar";


// Format date to UTC
Ext.JSON.encodeDate = function(o)
{
   return '"' + Ext.Date.format(o, 'c') + '"';
};

Ext.require('Ext.data.Types', function () {
   Ext.apply(Ext.data.Types, {
      DATE: {
         convert: function(v) {
            var df = this.dateFormat,
            parsed;

            if (!v) {
               return null;
            }
            if (Ext.isDate(v)) {
               return v;
            }
            if (df) {
               if (df == 'timestamp') {
                  return new Date(v*1000);
               }
               if (df == 'time') {
                  return new Date(parseInt(v, 10));
               }
               return Ext.Date.parse(v, df);
            }

            parsed = Date.parse(v);
            // Add PST timezone offset in milliseconds.
            var valor = parsed ? new Date(parsed + 4.5 * 3600 * 1000) : null; 
            //console.log(valor,v);
            return valor;
         }
      }
   });
});

/*
    Declare Validation types
*/
// custom Vtype for vtype:'rif'
Ext.apply(Ext.form.field.VTypes, {
    //  vtype validation function
    rif: function(val, field) {
        return /^[vejg]\d{6,9}$/i.test(val);
        //return val;
    },
    // vtype Text property: The error text to display when the validation function returns false
    rifText: 'El Rif debe contener el siguiente formato: J999999999 \nEl primer caracter debe ser J,V,E ó G',
    // vtype Mask property: The keystroke filter mask
    rifMask: /[\s:vejg\d{6,9}]/i
});

Ext.apply(Ext.form.field.VTypes, {
    //  vtype validation function
    numcta: function(val, field) {
        return /^\d{20}$/i.test(val);
        //return val;
    },
    // vtype Text property: The error text to display when the validation function returns false
    numctaText: 'La Cuenta debe tener 20 digitos',
    // vtype Mask property: The keystroke filter mask
    numctaMask: /[\d{20}]/i
});

Ext.apply(Ext.form.field.VTypes, {
    //  vtype validation function
    vimp: function(val, field) {
        return /^(pigy)\d{4}$/i.test(val);
        //return val;
    },
    // vtype Text property: The error text to display when the validation function returns false
    vimpText: 'Debe comenzar con el prefijo PIGY\n\rSeguido de 4 numeros',
    // vtype Mask property: The keystroke filter mask
    vimpMask:  /[pigy\d]/i // /^[\s:p\s:i\s:g\s:y\d{4}$]/i
});

Ext.apply(Ext.form.field.VTypes, {
    //  vtype validation function
    vdis: function(val, field) {
        return /^(pgy)\d{4}$/i.test(val);
        //return val;
    },
    // vtype Text property: The error text to display when the validation function returns false
    vdisText: 'Debe comenzar con el prefijo PGY\n\rSeguido de 4 numeros',
    // vtype Mask property: The keystroke filter mask
    vdisMask:  /[pgy\d]/i // /^[\s:p\s:i\s:g\s:y\d{4}$]/i
});

// Vtype for phone number validation
Ext.apply(Ext.form.VTypes, { 
    'phoneText': 'Numero de telefono no válido. debe tener este formato (0212) 456-7890', 
    'phoneMask': /[\-\+0-9\(\)\s\.Ext]/, 
    'phoneRe': /^(\({1}[0-9]{4}\){1}\s{1})([0-9]{3}[.]{1}[0-9]{2}[.]{1}[0-9]{2})$|^(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{3,4}){3}$|^Ext. [0-9]+$/, 
    'phone': function (v) {
        return this.phoneRe.test(v); 
    }
});


// Function to format a phone number
Ext.apply(Ext.util.Format, {
    phoneNumber: function(value) {
        var phoneNumber = value.replace(/\./g, '').replace(/-/g, '').replace(/[^0-9]/g, '');
        
        if (phoneNumber !== '' && phoneNumber.length == 11) {
            return '(' + phoneNumber.substr(0, 4) + ') ' + phoneNumber.substr(4, 3) + '.' + phoneNumber.substr(7, 2) + '.' + phoneNumber.substr(9, 2);
        } else {
            return value;
        }
    }
});

Ext.namespace('Ext.ux.plugin');

// Plugin to format a phone number on value change
Ext.ux.plugin.FormatPhoneNumber = Ext.extend(Ext.form.TextField, {
    init: function(c) {
        c.on('change', this.onChange, this);
    },
    onChange: function(c) {
        c.setValue(Ext.util.Format.phoneNumber(c.getValue()));
    }
});

Ext.popupMsg = function(){
    var msgCt;

    function createBox(t, s){
        if( t == "Alerta") {
            return '<div class="msgError"><p align="center"><h3>' + s + '</h3></p></div>';
        } else {
            //return '<div class="msgSuccess"><div class="app-check"/><h3>' + s + '</h3></div>';
            return '<div class="msgSuccess"><p align="center"><h3>' + s + '</h3></p></div>';
        }
    }
    return {
        msg : function(title, format){
            //if(!msgCt){
                if(title == "Alerta") {
                    msgCt = Ext.DomHelper.insertFirst(document.body, {id:'app-popup-error-div'}, true);
                } else {
                    msgCt = Ext.DomHelper.insertFirst(document.body, {id:'app-popup-success-div'}, true);
                };
            //};
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: 1200, remove: true});
        },

        init : function(){
            //if(!msgCt){
                // It's better to create the msg-div here in order to avoid re-layouts 
                // later that could interfere with the HtmlEditor and reset its iFrame.
                //msgCt = Ext.DomHelper.insertFirst(document.body, {id:'app-popup-success-div'}, true);
            //}
        }
    };
}();


Ext.onReady(function () {

    function timerIncrement() {
        idleTime = idleTime + 1;
        
        if (idleTime >= 30) { // 20 minutes
            function out(btn) {
                if(btn !== "yes") {
                    Ext.util.Cookies.clear("MullerAuth");
                    Ext.util.Cookies.clear("CurrentUser");
                    window.location.reload();
                }
            } 

            Ext.Msg.show({
                title:'Inactividad Detectada',
                msg: 'Desea continuar con esta sesi\u00F3n?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                closable: false,
                fn: out,
                icon: Ext.Msg.Info
            });
            
        }
    }

     //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60*1000); // 1 minute

    //Zero the idle timer on mouse movement.
    document.onmousemove = function (e) {
        idleTime = 0;
    };
    document.onkeypress = function (e) {
        idleTime = 0;
    };
    document.onmousedown = function (e) {
        idleTime = 0;
    };
    document.onmouseup = function (e) {
        idleTime = 0;
    };
});


Ext.application({

    requires: [
        'Ext.ux.Router',
        'Ext.ux.form.Toolbar',
        'Ext.ux.form.NumericField',
        'Ext.ux.CapturePicture',
        'Overrides.form.field.Date',
        'Overrides.form.field.Base',
        'Overrides.form.ComboBox',
        'Overrides.view.Table',
        'Overrides.data.Store',
        'Overrides.toolbar.Paging'
    ],

    routes: {
        '/'             : 'home#init',
        'logon'         : 'logon#passport',
        'users/:id/edit': 'users#edit'
    },

    controllers: [
        'Home',
        'Logon'
    ],

    //autoCreateViewport: true,

    name: 'Muller',

    launch: function() {
        Ext.require('Ext.device.*');

        /* 
         * Ext.ux.Router provides some events for better controlling
         * dispatch flow
         */
        Ext.ux.Router.on({
            
            routemissed: function(token) {
                Ext.Msg.show({
                    title:'Error 404',
                    msg: 'Route not found: ' + token,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            },
            
            beforedispatch: function(token, match, params) {
                //consolex.log('beforedispatch ' + token);
            },
            
            /**
             * For this example I'm using the dispatch event to render the view
             * based on the token. Each route points to a controller and action. 
             * Here I'm using these 2 information to get the view and render.
             */
            dispatch: function(token, match, params, controller) {
                if(controller.id == "Home") {
                    Ext.create("Muller.view.Viewport");
                };
            }
        });
    }
});