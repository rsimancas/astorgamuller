/**
 * @class Guestbook.view.picture.Capture
 * @extends Ext.Component
 * @author Crysfel Villa <crysfel@bleext.com>
 *
 * Component to capture an image using the device camera
 */
Ext.define('Images.view.CapturePicture', {
    extend: 'Ext.Component',
    xtype: 'capturepicture',

    config: {
        captured: false,
        width: Ext.os.is.Phone ? 140 : 400,
        height: Ext.os.is.Phone ? 100 : 350,
        cls: 'picture-capture',
        html: [
            '<div class="icon" style="vertical-align: middle;"><i class="icon-camera"></i>Tomar Foto</div>',
            '<img id="show-img" class="image-tns" />',
            '<input id="postFile" type="file" accept="image/*" capture="camera"/>'
        ].join('')
    },

    initialize: function() {
        var today = new Date();

        this.callParent(arguments);

        this.file = this.element.down('input[type=file]');
        this.ShowImg = this.element.down('img[id=show-img]');
        this.fakeImg = this.element.down('img[id=fake-img]');

        //console.log(this.ShowImg);
        //console.log(this.fakeImg);

        // this.ShowImg.setStyle('display', 'block');
        // this.ShowImg.set({
        //     src : '../wa/api/attachment/' + getURLParams().MovId + '?_dc='+ today.getTime()
        // });

        this.file.on('change', this.setPicture, this);

        this.ShowImg.dom.onload = function() { 
            var button = Ext.getCmp('saveButton');
            button.setDisabled(false);
            Ext.Viewport.setMasked(false);
        };

        //FIX for webkit
        window.URL = window.URL || window.webkitURL;
    },

    setPicture: function(event) {
        if (event.target.files.length === 1 && event.target.files[0].type.indexOf("image/") === 0) {

            var that = this,
                img = new Image(),
                url = window.URL ? window.URL : window.webkitURL;
                
            img.src = url.createObjectURL(event.target.files[0]);

            Ext.Viewport.setMasked({
                xtype: 'loadmask',
                message: 'Espere por favor...'
            });

            img.onload = function () {
                that.ShowImg.setStyle('display', 'block');
                that.ShowImg.set({
                    src: jic.compress(this, 70).src
                });
            };

            this.setCaptured(true);
        }
    },

    setCaptured: function(captured) {
        this.captured = captured;
    },

    reset: function() {
        // this.ShowImg.set({
        //     src: ''
        // });
        // this.ShowImg.setStyle('display', 'none');
        // this.setCaptured(false);
    },

    getImageDataUrl: function() {
        var img = this.ShowImg.dom,
            imgCanvas = document.createElement("canvas"),
            imgContext = imgCanvas.getContext("2d");

        if (this.getCaptured()) {
            // Make sure canvas is as big as the picture
            imgCanvas.width = img.width;
            imgCanvas.height = img.height;

            // Draw image into canvas element
            imgContext.drawImage(img, 0, 0, img.width, img.height);

            // Return the image as a data URL
            return imgCanvas.toDataURL("image/png");
        }
    }
});