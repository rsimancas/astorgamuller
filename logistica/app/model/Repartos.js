Ext.define('Muller.model.Repartos', {
    extend: 'Ext.data.Model',
    idProperty: 'RepartoId',
    autoLoad: false,
    
    fields: [
    { name:'RepartoId', type:'int', defaultValue: null },
    { name:'MovId', type:'int', useNull: true, defaultValue: null },
    { name:'CiudadId', type:'int', useNull: true, defaultValue: null },
    { name:'ClienteId', type:'int', useNull: true, defaultValue: null },
    { name:'RepartoFacturas', type:'string', useNull: true, defaultValue: null },
    { name:'RepartoCantidad', type:'int', useNull: true, defaultValue: null },
    { name:'RepartoTarifa', type:'numeric', useNull: true, defaultValue: null },
    { name:'RepartoFechaEntregado', type:'date', useNull: true, defaultValue: null },
    { name:'RepartoModificadoPor', type:'string', useNull: true, defaultValue: null },
    { name:'RepartoFechaModificado', type:'date', useNull: true, defaultValue: null },
    { name:'RepartoComentarios', type:'string', useNull: true, defaultValue: null },
    { name:'x_Ciudad', type:'string'},
    { name:'x_Cliente', type:'string'}
    ],

    belongsTo: 'Muller.model.Movimientos'
    
    
});