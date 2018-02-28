Ext.define('Images.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main',
            backBtn: 'main > toolbar button[action=back]'
        },
        control: {
            'main > toolbar button[action=newuser]': {
                tap: 'showImageForm'
            },
            'main > toolbar button[action=back]': {
                tap: 'showMainView'
            },
            'main imageform button[action=save]': {
                tap: 'saveImage'
            }
        }
    },

    saveImage: function() {
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Espere por favor...'
        });

        var form = this.getMain().down('imageform'),
            capture = form.down('capturepicture'),
            values = form.getValues(),
            formPost = new FormData(),
            file = Ext.get('postFile').dom.files[0]; //form.getContentEl().down('input[type=file]')

        // Create an image
        var img = new Image();

        img = Ext.get('show-img').dom;

        var canvas = document.createElement("canvas");
        //var canvas = $("<canvas>", {"id":"testing"})[0];
        var ctx = canvas.getContext("2d");

        var width = img.naturalWidth;
        var height = img.naturalHeight;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        var dataurl = canvas.toDataURL("image/jpeg");
        
        Ext.get('postFile').dom.files.val = '';     

        formPost.append("MovId", values.MovId);
        formPost.append("MovViaje", values.MovViaje);
        formPost.append("Imagen", dataurl);

        var http = new XMLHttpRequest();

        //if (http.upload && http.upload.addEventListener) {
        
            // Uploading progress handler
            http.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    var percentComplete = (e.loaded / e.total) * 100; 
                    //console.log(percentComplete.toFixed(0) + '%');
                }
            };
            
            // Response handler
            http.onreadystatechange = function (e) {
                if (this.readyState === 4) {
                    //console.log(e);
                    Ext.Viewport.setMasked(false);
                    window.close();
                }
            };
            
            // Error handler
            http.upload.onerror = function(e) {
                Ext.Viewport.setMasked(false);
            };
        //}

        // Send form with file using XMLHttpRequest POST request
        http.open('POST', '../wa/api/attachment');
        
        http.send(formPost);
    },

    showMessage: function(response, options) {
        if (response.status === 200) {
            var form = this.getMain().down('imageform'),
                capture = form.down('capturepicture');

            this.showMainView();
            this.getMain().down('userslist').getStore().load();
            form.reset();
        } else {
            Ext.Msg.alert('Error', 'There was an error while saving this user.');
        }
    },

    showImageForm: function() {
        this.getMain().animateActiveItem(this.getMain().down('imageform'), {
            type: 'slide',
            direction: 'left'
        });
        this.getBackBtn().show();
    },

    showMainView: function() {
        this.getMain().animateActiveItem(this.getMain().down('userslist'), {
            type: 'slide',
            direction: 'right'
        });
        this.getBackBtn().hide();
    }
});