 Ext.define('MyApp.view.Logon', {
    extend: 'Ext.form.Panel',
    alias: 'widget.logon',
    requires: [
        'Ext.field.Password',
        'Ext.field.Text'
    ],
    config: {
        fullscreen: true,
        layout: {
            type: 'hbox',
            //animation: 'flip',
            pack: 'center'
        },
        items: [
        {
            xtype: 'titlebar',
            title: 'Inicio de Sesión',
            docked: 'top'
        }, 
        {
            xtype: 'fieldset',
            layout: {
                type: 'vbox',
                //animation: 'flip',
                pack: 'center'
            },
            width: Ext.os.is.Phone ? 300 : 400,
            height: Ext.os.is.Phone ? 200 : 200,
            defaults: {
                margin: '5 5 5 5'
            },
            items: [
            {
                xtype: 'textfield',
                name: 'usuario',
                placeHolder: 'Usuario:',
                flex: 1
            }, 
            {
                xtype: 'passwordfield',
                name: 'password',
                placeHolder: 'Contraseña:',
                flex: 1,
            },
            {
                xtype: 'button',
                text: 'Iniciar',
                ui: 'action',
                margin: '20 40 20 40',
                flex: 1,
                handler: function (btn, evt) {
                    var me = this.up('panel');
                    me.onSubmitLogin();
                } // handler
            }] // items
        } //, 
        // {
        //     xtype: 'toolbar',
        //     docked: 'bottom',
        //     layout: {
        //         pack: 'center'
        //     }, // layout
        //     ui: 'plain',
        //     items: [
        //     {
        //         xtype: 'button',
        //         text: 'Iniciar',
        //         ui: 'action',
        //         padding: '10px',
        //         handler: function (btn, evt) {
        //             var me = this.up('panel');
        //             me.onSubmitLogin();
        //         } // handler
        //     }] // items (toolbar)
        // }
        ] // items (formpanel)
    },

    onSubmitLogin: function() {
        var me = this;

        var values = me.getValues();

        record = Ext.create('MyApp.model.Usuarios');
        
        record.set('UsuarioId',values.usuario);
        record.set('UsuarioNombre',values.usuario);
        record.set('UsuarioPassword',values.password);

        //Ext.Msg.wait('Espere','Iniciando Sesion');

        Ext.Ajax.request({ 
            url:'../wa/api/auth',
            jsonData: Ext.JSON.encode(record),
            timeout: 120000,

            // Functions that fire (success or failure) when the server responds. 
            // The one that executes is determined by the 
            // response that comes from login.asp as seen below. The server would 
            // actually respond with valid JSON, 
            // something like: response.write "{ success: true}" or 
            // response.write "{ success: false, errors: { reason: 'Login failed. Try again.' }}" 
            // depending on the logic contained within your server script.
            // If a success occurs, the user is notified with an alert messagebox, 
            // and when they click "OK", they are redirected to whatever page
            // you define as redirect. 

            success:function(response, opts){
                var d = new Date();
                //var expiry = new Date(now.getTime()+(24*3600*1000)); // Ten minutes
                var expiry = new Date(d.setHours(23,59,59,999)); // at end of day
                var result = Ext.JSON.decode(response.responseText);

                //Ext.Msg.alert('Bienvenido, '+result.data.UsuarioNombreCompleto);
                Ext.util.Cookies.set('Seguridad.CurrentUser',Ext.JSON.encode(result.data),expiry);
                Ext.util.Cookies.set('Seguridad.AppAuth',result.security,expiry);
                //MyApp.cookie.set('MullerAuth', result.security);

                //MyApp.app.apiToken = result.security;
                //MyApp.app.currentUser = result.data;

                //var main = Ext.create('MyApp.view.Main');
                //MyApp.app.loadDist()
                //Ext.Viewport.add(main);
                //main.show();

                //Ext.Msg.hide();
                //var url = location.href;
                //url = url.split('#');
                //location.href = url[0];
                window.location.reload();
            },

            // Failure function, see comment above re: success and failure. 
            // You can see here, if login fails, it throws a messagebox
            // at the user telling him / her as much.  

            failure: function(response, opts){ 
                Ext.Msg.alert('Alerta', 'Usuario y/o Contraseña incorrecta, Intente de nuevo'); 
                //currentForm.reset(); 
            } 
        });
    }
});