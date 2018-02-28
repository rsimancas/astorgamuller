Ext.define('Muller.controller.Logon', {
    extend: 'Ext.app.Controller',

    models: [
    'Usuarios'
    ],

    stores: [
    'Usuarios'
    ],

    views: [
    'Logon'
    ],

    init: function() {
        this.control({
            'logon button[text="Submit"]': {
                click: this.onSubmitLogon
            },
            'logon textfield[fieldLabel="Password"]': {
                keypress: this.onLogonTextFieldKeypress
            }
        });
    },

    passport: function(application) {
        viewport = Ext.create('Ext.Viewport',{cls:'custom-viewport',renderTo: Ext.getBody()})
        view = Ext.create('Muller.view.Logon',{
            autoRender: true,
            autoShow: true
        });

        viewport.add(view);
    },

    onLogonTextFieldKeypress: function(textfield, e, eOpts) {
        if (e.getCharCode() == Ext.EventObject.ENTER) {
            var but = textfield.up('form').down('toolbar').down('button');
            but.fireEvent("click", but);
        }
    },

    onSubmitLogon: function(button, e, eOpts) {

        var currentForm = button.up('form').getForm();

        record = Ext.create('Muller.model.Usuarios');

        currentForm.updateRecord(record);

        Ext.Msg.wait('Iniciando Sesion...','Login');


        Ext.Ajax.request({ 
            url:'../wa/api/auth',
            jsonData: Ext.JSON.encode(record),
            timeout: 120000,

            success:function(response, opts){
                var d = new Date();
                //var expiry = new Date(now.getTime()+(24*3600*1000)); // Ten minutes
                var expiry = new Date(d.setHours(23,59,59,999)); // at end of day
                var result = Ext.JSON.decode(response.responseText);

                Ext.util.Cookies.set('CurrentUser',Ext.JSON.encode(result.data),expiry);
                Ext.util.Cookies.set('MullerAuth',result.security,expiry);

                Ext.Msg.hide();
                var url = location.href;
                url = url.split('#');
                location.href = url[0];
            },

            failure: function(response, opts){ 
                Ext.Msg.alert('Alerta', 'Fallo el inicio de sesion, intente de nuevo'); 
                //currentForm.reset(); 
            } 
        });
    }
});
