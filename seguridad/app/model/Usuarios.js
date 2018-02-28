Ext.define('MyApp.model.Usuarios', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
	    { name:'UsuarioId', type:'string' },
	    { name:'UsuarioNombre', type:'string' },
	    { name:'UsuarioApellido', type:'string' },
	    { name:'UsuarioNombreCompleto', type:'string', useNull: true, defaultValue: null },
	    { name:'UsuarioLevel', type:'int' },
	    { name:'UsuarioPassword', type:'string' }
	    ]
	}
});