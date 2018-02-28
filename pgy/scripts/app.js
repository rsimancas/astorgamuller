function loadMovs() {
    var sort = { property: 'x_Estatus', direction: 'ASC' };
    var url = "../wa/api/ViewDistribucion?sort="+json_encode(sort);

    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name:'MovId', type:'int' },
            { name:'MovTipo', type:'string' },
            { name:'MovViaje', type:'string' },
            { name:'MovPlaca', type:'string' },
            { name:'MovChofer', type:'string' },
            { name:'MovCedula', type:'string' },
            { name:'MovCantidad', type:'float'},
            { name:'MovContenedor', type:'string'},
            { name:'MovTipoContenedor', type:'string'},
            { name:'MovOrigen', type:'string'},
            { name:'MovElevadora', type:'boolean' },
            { name:'MovComentario', type:'string'},
            { name:'MovFechaAsignado', type:'date'},
            { name:'MovFechaEntregaFactura', type:'date'}, // Se usa como fecha de entrega de facturas para distribucion
            { name:'MovFechaCompletado', type:'date'},
            { name:'MovExcedido', type:'boolean'},
            { name:'MovFechaExcedido', type:'date'}, 
            { name:'MovFechaEstimada', type:'date'},    
            { name:'MovFechaCreado', type:'date' },
            { name:'MovFechaModificado', type:'date' },
            { name:'MovCantidadCauchos', type:'float'},
            { name:'x_Facturas', type:'string'},
            { name:'x_Cliente', type:'string'},
            { name:'x_Ciudad', type:'string'},
            { name:'x_Estatus', type:'string'},
            { name:'x_FechaEstatus', type: 'date', defaultValue: new Date()},
            { name:'x_EstatusOrden', type: 'int'},
            { name:'x_ExpNumBL', type:'string'},
            { name:'x_Equipo', type:'string'},
            { name:'x_EstatusInfo', type:'string'},
            { name:'x_DL', type: 'date'},
            { name:'x_row', type:'int'},
            { name:'x_DaysBetween', type:'int'},
            { name:'MovFechaSalida', type:'date' },
            { name:'MovUbicacionTransito', type:'string' },
            { name:'MovFechaEntregado', type:'date' },
            { name:'x_FechaCreado', type:'string'},
            { name:'x_FechaModificado', type:'string'},
            { name:'x_FechaSalida', type:'string'},
            { name:'x_FechaAsignado', type:'string'},
            { name:'x_FechaEntregaFactura', type:'string'},
            { name:'x_DeadLine', type:'string'},
            { name:'x_Attachments', type:'int'},
            { name:'x_HoraSalida', type:'string'}
        ],
        root: 'data',
        id: 'x_row',
        url: url,
        beforeprocessing: function(data)
        {   
            source.totalrecords = data.total;
        }
    };
    
    var cellsrendererstatus = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        if (rowdata.MovExcedido) {
            return '<span class="estatus-alerta">' + value + '</span>';
        } else  {
            return '<span class="estatus-normal">' + value + '</span>';   
        }
    };

    var cellsrendererfacturas = function (row, columnfield, value, defaultHtml, columnproperties, rowdata) {
        var returnVal = "";
        if (String.isNullOrEmpty(rowdata.MovViaje) && !String.isNullOrEmpty(rowdata.x_Equipo)) {
            returnVal = '<div style="text-align:center; vertical-align:middle; padding-top: 3px;"><span class="estatus-warning">' + 'Esperando Asignación' + '</span></div>';
        } else if(String.isNullOrEmpty(rowdata.x_Facturas)  && !String.isNullOrEmpty(rowdata.x_Equipo)) {
            returnVal = '<div style="text-align:center; vertical-align:middle; padding-top: 3px;"><span class="estatus-alerta">' + 'En Espera de Facturas' + '</span></div>';
        } else if(!String.isNullOrEmpty(rowdata.x_Equipo)) {
            returnVal = '<div style="text-align:center; vertical-align:middle; padding-top: 3px;"><span>' + value + '</span></div>';   
        }

        var element = $(defaultHtml);
        element.css({ 'padding-top': '4px' });
        element.css({ 'padding-bottom': '4px' });
        element.css({ 'margin-top': '0px' });
        element.css({ 'margin-bottom': '0px' });
        element.css({ 'margin-left': '0px' });
        element.css({ 'margin-right': '0px' });
        element.css({ 'text-align': 'center' });
        element.css({'font-size': '11px'});
        element.html(returnVal);
        return element[0].outerHTML;     
    };

    var columnsrenderer = function (value) {
        return '<div style="text-align: center; vertical-align:middle; margin: 4px; font-size:x-small;">' + value + '</div>';
    };

    var cellsrenderer = function (index, datafield, value, defaultHtml, column, rowdata) {
        var element = $(defaultHtml);
        //var color = null;

        //color = (rowdata.x_Estatus === "COMPLETADO") ? '#1db304' : color;
        //color = (rowdata.x_Estatus === "TRANSITO") ? '#de7404' : color;

        //if(!String.isNullOrEmpty(color)) element.css({ 'background-color': color });
        element.css({ 'padding-top': '4px' });
        element.css({ 'padding-bottom': '4px' });
        element.css({ 'margin-top': '0px' });
        element.css({ 'margin-bottom': '0px' });
        element.css({ 'margin-left': '0px' });
        element.css({ 'margin-right': '0px' });
        element.css({'font-size': '12px'});
        //element.css({ 'text-align': 'center' });
        //element.html('<div style="vertical-align:middle; padding:2px;">'+value+'</div>');
        element.text(value);
        return element[0].outerHTML;
    };

    var cellsrenderercliente = function (index, datafield, value, defaultHtml, column, rowdata) {
        var element = $(defaultHtml);

        element.css({ 'padding-top': '4px' });
        element.css({ 'padding-bottom': '4px' });
        element.css({ 'margin-top': '0px' });
        element.css({ 'margin-bottom': '0px' });
        element.css({ 'margin-left': '0px' });
        element.css({ 'margin-right': '0px' });
        element.css({ 'text-align': 'center' });
        element.css({'font-size': '10px'});
        element.html('<div style="vertical-align:middle; padding:2px;">'+value+'</div>');
        return element[0].outerHTML;
    };

    var dataAdapter = new $.jqx.dataAdapter(source,{
        formatData: function (data) {
            data.query = $("#searchField").val();
            return data;
        }
    });

    var urlparams = getURLParams();

    $("#jqxgridMovs").jqxGrid(
    {
        theme: 'black',
        width: '100%',
        source: dataAdapter,
        columnsresize: true,
        altrows: true,
        showemptyrow: true,
        pageable: true,
        autoheight: true,
        sortable: true,
        updatedelay: 1,
        pagermode: 'simple',
        pagesize: (urlparams && urlparams.rows) ? urlparams.rows : 20,
        virtualmode: true,
        autorowheight: false,
        //enabletooltips: true,
        showtoolbar: true,
        rendertoolbar: function (toolbar) {
            var me = this;
            var container = $("<div style='margin: 5px;'></div>");
            var span = $("<span style='float: left; margin-top: 5px; margin-right: 4px;'>Buscar: </span>");
            var input = $("<input class='jqx-input jqx-widget-content jqx-rc-all' id='searchField' type='text' style='height: 23px; float: left; width: 223px; text-transform:uppercase;' placeholder='escriba y pulse buscar'/>");
            var btn = $("<div style='vertical-align:middle; padding-left:5px; padding-top: 1px; width: 25px;'><p><a class='fa fa-search' href='#' onclick='return;'></a></p></div>");
            toolbar.append(container);
            container.append(span);
            container.append(input);
            container.append(btn);
            var theme = "black";
            //if (theme && theme !== "") {
                input.addClass('jqx-widget-content-' + theme);
                input.addClass('jqx-rc-all-' + theme);

                //btn.addClass('jqx-widget-content-' + theme);
                //btn.addClass('jqx-rc-all-' + theme);
            //}
            var oldVal = "";
            btn.on('click', function (event) {
                if (input.val().length >= 2) {
                    if (me.timer) {
                        clearTimeout(me.timer);
                    }
                    if (oldVal != input.val()) {
                        me.timer = setTimeout(function () {
                            $("#jqxgridMovs").jqxGrid('updatebounddata');
                        }, 1000);
                        oldVal = input.val();
                    }
                }
                else {
                    $("#jqxgridMovs").jqxGrid('updatebounddata');
                }
            });

            input.on('keyup', function (event) {
                if (input.val() === "") {
                    if (me.timer) {
                        clearTimeout(me.timer);
                    }
                    $("#jqxgridMovs").jqxGrid('updatebounddata');
                }
            });
        },
        rendergridrows: function()
        {
            return dataAdapter.records;     
        },
        columns: [
            { text: '#', datafield: 'x_row', cellsrenderer: cellsrenderer, cellsalign: 'left', align:'center', cellsformat: 'n', width:'1%'},
            { text: 'Viaje', cellsrenderer: cellsrenderer, datafield: 'MovViaje', align: 'center', width:'4.5%'},
            { text: 'Cava (Placa)', cellsrenderer: cellsrenderer, datafield: 'x_Equipo', align: 'left', width:'7%'},
            { text: 'Asig.', datafield: 'x_FechaAsignado', align: 'center', width: '3%',
                cellsrenderer: function (index, datafield, value, defaultHtml, column, rowdata) {
                    var element = $(defaultHtml);
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'text-align': 'center' });
                    element.css({'font-size': '12px'});
                    //element.text(returnVal)
                    element.text(value);
                    return element[0].outerHTML;
                }
            },
            { text: 'F.E.F', datafield: 'x_FechaEntregaFactura', align: 'center', width: '3%',
                cellsrenderer: function (index, datafield, value, defaultHtml, column, rowdata) {
                    var element = $(defaultHtml);
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'text-align': 'center' });
                    element.css({'font-size': '12px'});
                    element.text(value);
                    return element[0].outerHTML;
                }
            },
            { text: 'D.L', datafield: 'x_DeadLine', align: 'center', width: '3%',
                cellsrenderer: function (index, datafield, value, defaultHtml, column, rowdata) {
                    var element = $(defaultHtml);
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'text-align': 'center' });
                    element.css({'font-size': '12px'});
                    element.text(value);
                    return element[0].outerHTML;
                }
            },
            { text: 'Ent.', datafield: 'MovFechaEntregado', align: 'center', width: '3%',
                cellsrenderer: function (index, datafield, value, defaultHtml, column, rowdata) {
                    var returnVal = getFormattedDateDDMM(value);

                    returnVal = (String.isNullOrEmpty(returnVal)) ? "-" : returnVal;

                    var element = $(defaultHtml);
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'text-align': 'center' });
                    element.css({'font-size': '12px'});
                    element.text(returnVal);
                    return element[0].outerHTML;    
                }
            },
            { text: 'Res.', datafield: 'x_DaysBetween', cellsalign: 'center', align: 'center', width: '2.5%',
                cellsrenderer: function (index, datafield, value, defaultHtml, column, rowdata) {
                    var icon = (value <= 0)  ? 'glyphicon-ok' : 'glyphicon-remove',
                        color = (value <= 0) ? '#1db304' : 'red';

                    var returnVal;

                    if(rowdata.MovFechaEntregado && rowdata.x_DL) {
                        returnVal = '<div style="vertical-align:middle; padding-left:5px; padding-top: 5px; color:'+color+';"><p align="center"><span class="glyphicon ' + icon + '" aria-hidden="false"></span></p></div>';
                    } else {
                        returnVal = '<div style="vertical-align:middle; padding-left:5px; padding-top: 5px;"><p align="center"><span>-</span></p></div>';
                    }

                    var element = $(defaultHtml);
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'text-align': 'center' });
                    element.css({'font-size': '12px'});
                    element.html(returnVal);
                    return element[0].outerHTML;    
                }
            },
            { text: 'Facturas', datafield: 'x_Facturas', cellsrenderer: cellsrendererfacturas, cellsalign: 'center', align: 'center', width:'13%'},
            { text: 'Dest.', datafield: 'x_Ciudad', cellsalign:'center', align:'center', width:'5%', 
                cellsrenderer: function (index, datafield, value, defaultHtml, column, rowdata) {
                    var element = $(defaultHtml);
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'text-align': 'center' });
                    element.css({ 'font-size': '10px'});
                    element.text(value);
                    //element.html('<div style="vertical-align:middle; padding:2px;">'+returnVal+'</div>');
                    return element[0].outerHTML;    
                }
            },
            { text: 'Cliente', datafield: 'x_Cliente', cellsalign: 'center', align: 'center', width:'26%', cellsrenderer: cellsrenderercliente},
            { text: 'E. Info', datafield: 'x_EstatusInfo', cellsalign: 'center', align: 'center', width: '9%',
                cellsrenderer: function(index, datafield, value, defaultHtml, column, rowdata) {
                    var strEstatusInfo = (!String.isNullOrEmpty(rowdata.x_EstatusInfo)) ?  rowdata.x_EstatusInfo : null,
                        //strComentario = (!String.isNullOrEmpty(rowdata.MovComentario)) ? rowdata.MovComentario : null;
                        strComentario = null;

                    strEstatusInfo = (!String.isNullOrEmpty(rowdata.x_EstatusInfo) && !String.isNullOrEmpty(strComentario)) ? strEstatusInfo + ' / ' + strComentario : strEstatusInfo;
                    strEstatusInfo = (String.isNullOrEmpty(rowdata.x_EstatusInfo) && !String.isNullOrEmpty(strComentario)) ? strComentario : strEstatusInfo;
                    strEstatusInfo = (!String.isNullOrEmpty(rowdata.x_EstatusInfo) && String.isNullOrEmpty(strComentario)) ? rowdata.x_EstatusInfo : strEstatusInfo;
                    strEstatusInfo = (String.isNullOrEmpty(rowdata.x_EstatusInfo) && strComentario) ? null : strEstatusInfo;

                    var strDataToolTip = (!String.isNullOrEmpty(strEstatusInfo)) ? '<h4>'+strEstatusInfo+'</h4>' : '';

                    strEstatusInfo = (!String.isNullOrEmpty(strEstatusInfo)) ? '<marquee scrollamount="1">'+strEstatusInfo+'</marquee>' : '-';

                    returnVal = '<p><a id="show-option" href="#" onclick="return false;">'+strEstatusInfo+'</a></p>';

                    var element = $(defaultHtml);
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'text-align': 'center' });
                    element.css({'font-size': '11px'});
                    element.attr('data-tooltip', strDataToolTip);
                    element.html(returnVal);
                    return element[0].outerHTML;    
                }
            },
            { text: 'Cant.', datafield: 'MovCantidadCauchos', cellsalign: 'right', cellsformat: 'n', align: 'center', width:'3%'},
            //{ text: 'Excedido', datafield: 'MovExcedido', columntype: 'checkbox'},
            { text:'Salida', datafield:'x_FechaSalida',  align: 'center', width: '5.5%',
                cellsrenderer: function (index, datafield, value, defaultHtml, column, rowdata) {
                    var returnVal = (String.isNullOrEmpty(value)) ? "-" : value;

                    returnVal = (!String.isNullOrEmpty(rowdata.x_HoraSalida)) ? returnVal + " " + rowdata.x_HoraSalida : value;

                    var element = $(defaultHtml);
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'text-align': 'center' });
                    element.css({ 'font-size': '10px'});
                    element.text(returnVal);
                    return element[0].outerHTML;    
                }
            },
            { text: 'Sta', datafield: 'x_Estatus', cellsalign: 'center', align: 'center', width: '2.5%',
                cellsrenderer: function(index, datafield, value, defaultHtml, column, rowdata) {
                    var color = null;

                    if(rowdata.x_Equipo === "") return "";

                    color = (value === "COMPLETADO" || value === "DISPONIBLE" || String.isNullOrEmpty(value)) ? '#1db304' : color;
                    color = (value === "PROGRAMADO") ? '#AA5585' : color;
                    color = (value === "REPROGRAMADO") ? '#AA5585' : color;
                    color = (value === "RETORNANDO") ? '#de7404' : color;
                    color = (value === "TRANSITO") ? '#DADA00' : color;
                    color = (value === "CLIENTE") ? '#03c3fa' : color;

                    var element = $(defaultHtml);
                    if(!String.isNullOrEmpty(color)) element.css({ 'color': color });
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'text-align': 'center' });
                    element.css({'font-size': '12px'});

                    var iconCls = (value === 'ASIGNADO')  ? 'glyphicon glyphicon-pushpin' : '';
                    iconCls = (value === 'PROGRAMADO')  ? 'glyphicon glyphicon-time' : iconCls;
                    iconCls = (value === 'REPROGRAMADO')  ? 'fa fa-wrench' : iconCls;
                    iconCls = (value === "COMPLETADO" || String.isNullOrEmpty(value)) ? 'glyphicon glyphicon-thumbs-up' : iconCls;
                    iconCls = (value === 'TRANSITO')  ? 'icon-truck' : iconCls;
                    iconCls = (value === 'CLIENTE')  ? 'icon-office' : iconCls;
                    iconCls = (value === 'RETORNANDO')  ? 'fa fa-truck' : iconCls;

                    returnVal = '<div style="vertical-align:middle; padding:2px;"><p align="center"><span class="' + iconCls + '" aria-hidden="false"></span></p></div>';
                    element.html(returnVal);
                    return element[0].outerHTML;
                }
            },
            { text:'Last Up.', datafield:'x_FechaCreado', cellsalign:'center', align:'center', width: '5.5%',
                cellsrenderer: function (index, datafield, value, defaultHtml, column, rowdata) {
                    var lastUpdated = (rowdata.x_FechaModificado === null) ? value : rowdata.x_FechaModificado;
                    returnVal = lastUpdated;

                    var element = $(defaultHtml);
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'font-size': '10px'});
                    element.text(returnVal);
                    return element[0].outerHTML;    
                }
            },
            { text:'Img', datafield:'x_Attachments', cellsalign:'left', align:'left', width: '3%',
                cellsrenderer: function (index, datafield, value, defaultHtml, column, rowdata) {
                    var strViaje = "'" + rowdata.MovViaje + "'",
                        returnVal = "";

                    if(value > 0) 
                        returnVal = '<div style="vertical-align:middle; padding-left:5px; padding-top: 5px; "><p align="left"><a class="fa fa-camera" href="#" onclick="_CreateWindow('+rowdata.MovId+', '+strViaje+');"></a></p></div>';

                    var element = $(defaultHtml);
                    element.css({ 'padding-top': '4px' });
                    element.css({ 'padding-bottom': '4px' });
                    element.css({ 'margin-top': '0px' });
                    element.css({ 'margin-bottom': '0px' });
                    element.css({ 'margin-left': '0px' });
                    element.css({ 'margin-right': '0px' });
                    element.css({ 'text-align': 'center' });
                    element.css({'font-size': '12px'});
                    //element.attr('data-tooltip', strDataToolTip);
                    element.html(returnVal);
                    return element[0].outerHTML;   
                }
            }
        ]
    });

    $("#jqxgridMovs").jqxGrid('autoresizecolumns');

    $("#jqxgridMovs").on("bindingcomplete", function (event) {
        
        var refreshData = function() {
            $('#jqxgridMovs').jqxGrid('updatebounddata', 'cells');
        };

        setInterval(refreshData, 300*1000);

        $('[data-tooltip!=""]').each(function() { // Grab all elements with a title attribute,and set "this"
            $(this).qtip({ // 
                content: {
                    text: $(this).attr('data-tooltip') // WILL work, because .each() sets "this" to refer to each element
                },
                position: {
                    my: 'top center',
                    at: 'bottom center',
                    target: 'event',
                    effect: function(api, pos, viewport) {
                        // "this" refers to the tooltip
                        $(this).animate(pos, {
                            duration: 600,
                            easing: 'linear',
                            queue: false // Set this to false so it doesn't interfere with the show/hide animations
                        });
                    }
                },
                style: {
                    classes: 'qtip-blue qtip-shadow'
                }
            });
        });
    });  
}

function loadEquipos() {
    var url = "../wa/api/ViewResumenEquipos";

    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name:'Estatus', type:'string' },
            { name:'Cantidad', type:'float' },
            { name:'PLANTA', type:'float' },
            { name:'FERRARI', type:'float' }
        ],
        root: 'data',
        id: 'Estatus',
        url: url,
        beforeprocessing: function(data)
        {   
            source.totalrecords = data.total;
        }
    };
    
    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        var color = null,
        element = $('<span aria-hidden="false"></span>');

        color = (value === "COMPLETADO" || value === "DISPONIBLE") ? '#1db304' : color;
        color = (value === "PROGRAMADO") ? '#AA5585' : color;
        color = (value === "REPROGRAMADO") ? '#8A458A' : color;
        color = (value === "RETORNANDO") ? '#de7404' : color;
        color = (value === "TRANSITO") ? '#DADA00' : color;
        color = (value === "CLIENTE") ? '#03c3fa' : color;
        color = (value === "MANTENIMIENTO") ? '#804515' : color;

        if(!String.isNullOrEmpty(color)) element.css({ 'color': color });

        if(value === "ASIGNADO") element.addClass("glyphicon glyphicon-pushpin");
        if(value === "PROGRAMADO") element.addClass("glyphicon glyphicon-time");
        if(value === "REPROGRAMADO") element.addClass("fa fa-wrench");
        if(value === "COMPLETADO" || value === "DISPONIBLE") element.addClass("glyphicon glyphicon-thumbs-up");
        if(value === "RETORNANDO") element.addClass("fa fa-truck");
        if(value === "TRANSITO") element.addClass("icon-truck");
        if(value === "CLIENTE") element.addClass("icon-office");
        if(value === "MANTENIMIENTO") element.addClass("fa fa-wrench");

        element.css({ 'padding-top': '0px' });
        element.css({ 'padding-bottom': '0px' });
        element.css({ 'margin-top': '0px' });
        element.css({ 'margin-bottom': '0px' });
        element.css({ 'margin-left': '0px' });
        element.css({ 'margin-right': '0px' });
        element.css({ 'text-align': 'center' });
        element.css({ 'vertical-align': 'middle' });
        element.css({ 'font-size': '12px' });
        element.css({ 'font-weight': 'bold' });
        element.text("="+value);
        return element[0].outerHTML;
    };

    var cellsubirenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        //var color = null,
        var element = $(defaulthtml);

        element.text("");

        if((rowdata.Estatus === "MANTENIMIENTO" || rowdata.Estatus === "ASIGNADO" || rowdata.Estatus=== "PROGRAMADO" || rowdata.Estatus === "REPROGRAMADO" || rowdata.Estatus === "COMPLETADO" || rowdata.Estatus === "DISPONIBLE") && value !== 0) 
            element.text(value);

        return element[0].outerHTML;
    };

    var columnsrenderer = function (value) {
        return '<div style="text-align: center; margin: 4px;">' + value + '</div>';
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    $("#jqxgridEquipos").jqxGrid(
    {
        theme: 'black',
        width: '100%',
        source: dataAdapter,
        columnsresize: true,
        altrows: true,
        showemptyrow: true,
        //pageable: true,
        autoheight: true,
        sortable: true,
        updatedelay: 5,
        pagermode: 'simple',
        //pagesize: 10,
        //virtualmode: true,
        autorowheight: false,
        height: 200,
        rendergridrows: function()
        {
            return dataAdapter.records;     
        },
        columns: [
            { text: 'Status', datafield: 'Estatus', cellsrenderer: cellsrenderer, cellsalign: 'center', width:'40%'},
            { text: 'Cavas.', datafield: 'Cantidad', cellsalign: 'right', cellsformat: 'n', align: 'center', width:'20%'},
            { text: 'HdPLANTA', datafield: 'PLANTA', cellsrenderer: cellsubirenderer, cellsalign: 'right', cellsformat: 'n', align: 'center', width:'20%'},
            { text: 'HdFERRARI', datafield: 'FERRARI', cellsrenderer: cellsubirenderer, cellsalign: 'right', cellsformat: 'n', align: 'center', width:'20%'}
        ]
    });

    $("#jqxgridEquipos").on("bindingcomplete", function (event) {
        //$('[text="PLANTA"]').text="RONY";
        $("span:contains('HdPLANTA')").each(function() {
            $(this).text("");
            $(this).append($("<img>").attr("src", "../resources/images/logo-gy-24x24.png"));
        });

        $("span:contains('HdFERRARI')").each(function() {
            $(this).text("");
            $(this).append($("<img>").attr("src", "../resources/images/logo-iam-24x24.png"));
        });
        
    });
}

function loadResumen() {
    var url = "../wa/api/ViewResumenMeses";
    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name:'PromedioMes', type:'float'},
            { name:'TotalCauchos', type:'float' },
            { name:'PromedioPorViaje', type:'float'},
            { name:'DiaMax', type:'date'},
            { name:'CantDiaMax', type:'float'},
            { name:'CantMesMax', type:'float'},
            { name:'MesMax', type:'string'},
            { name:'TotalViajes', type:'float'}
        ],
        root: 'data',
        url: url
    };
    
    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        if (rowdata.Estatus === 'EN USO') {
            return '<span class="estatus-alerta">' + value + '</span>';
        } else  {
            return '<span class="estatus-normal">' + value + '</span>';   
        }
    };

    var columnsrenderer = function (value) {
        return '<div style="text-align: center; margin: 4px;">' + value + '</div>';
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    $("#jqxgridResumen").jqxGrid(
    {
        theme: 'black',
        width: '100%',
        source: dataAdapter,
        columnsresize: true,
        altrows: true,
        showemptyrow: true,
        //pageable: true,
        autoheight: true,
        sortable: true,
        updatedelay: 5,
        pagermode: 'simple',
        //pagesize: 10,
        //virtualmode: true,
        autorowheight: true,
        rendergridrows: function()
        {
            return dataAdapter.records;     
        },
        columns: [
            { text: 'Promedio', datafield: 'PromedioMes', cellsalign: 'right', cellsformat: 'n', align: 'center'},
            { text: 'Total Cauchos', dataField:'TotalCauchos', cellsalign: 'right', cellsformat: 'n', align: 'center'},
            { text: 'Promedio x Viaje', dataField:'PromedioPorViaje', cellsalign: 'right', cellsformat: 'n', align: 'center'},
            { text: 'Fecha M&aacute;x.', dataField:'DiaMax', cellsalign: 'center', width: 70,
                cellsrenderer: function (index, datafield, value, defaultHtml, column, rowdata) {
                    parsed = Date.parse(value);
                    var valor = parsed ? new Date(parsed + 12 * 3600 * 1000) : null; 
                    returnVal = valor ? valor.format('dd/mm/yyyy').trim() : "";
                    return '<div style="text-align: center; margin: 4px;vertical-align: middle;">' + returnVal  + '</div>';
                }
            },
            { text: 'Cant.D&iacute;a M&aacute;x.', dataField:'CantDiaMax', cellsalign: 'right', cellsformat: 'n', align: 'center'},
            { text: 'Cant.Mes M&aacute;x.', dataField:'CantMesMax', cellsalign: 'right', cellsformat: 'n', align: 'center'},
            { text: 'Mes M&aacute;x.', dataField:'MesMax', cellsrenderer: cellsrenderer,cellsalign: 'left'}
            //{ text: 'Equipos', datafield: 'Estatus', cellsrenderer: cellsrenderer,cellsalign: 'left'},
        ]
    });
}

function loadResumenSemanaMeses() {
    var url = "../wa/api/ViewResumenSemanaMeses";
    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name:'Descripcion', type:'float'},
            { name:'Cantidad', type:'float' },
            { name:'Promedio', type:'float'},
            { name:'Cavas', type:'float'}
        ],
        root: 'data',
        url: url
    };
    
    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        if (rowdata.Estatus === 'EN USO') {
            return '<span class="estatus-alerta">' + value + '</span>';
        } else  {
            return '<span class="estatus-normal">' + value + '</span>';   
        }
    };

    var columnsrenderer = function (value) {
        return '<div style="text-align: center; margin: 4px;">' + value + '</div>';
    };

    var dataAdapter = new $.jqx.dataAdapter(source, {
        beforeLoadComplete: function (records) {
            loadVUMeter(records[7],records[0]);
        }
    });

    $("#jqxgridResumenSemanaMeses").jqxGrid(
    {
        theme: 'black',
        width: '100%',
        source: dataAdapter,
        columnsresize: true,
        altrows: true,
        showemptyrow: true,
        //pageable: true,
        autoheight: false,
        sortable: true,
        updatedelay: 5,
        pagermode: 'simple',
        //pagesize: 10,
        //virtualmode: true,
        autorowheight: false,
        height: 202,
        rendergridrows: function()
        {
            return dataAdapter.records;     
        },
        columns: [
            { text: 'Per&iacute;odo', dataField:'Descripcion', cellsalign: 'left'},
            { text: 'Cauchos', datafield: 'Cantidad', cellsalign: 'right', cellsformat: 'n', align: 'center'},
            { text: 'Promedio', dataField:'Promedio', cellsalign: 'right', cellsformat: 'n', align: 'center'},
            { text: 'Cavas', dataField:'Cavas', cellsalign: 'right', cellsformat: 'n', align: 'center'}
        ]
    });
}

function loadResumenMeses() {
    // prepare chart data as an array            
    var url = "../wa/api/ViewResumenGraficoMeses";
    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name:'Mes', type:'string' },
            { name:'Cantidad', type:'float' }
        ],
        root: 'data',
        id: 'Mes',
        url: url
    };
    
    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        if (rowdata.Estatus === 'EN USO') {
            return '<span class="estatus-alerta">' + value + '</span>';
        } else  {
            return '<span class="estatus-normal">DISP.</span>';   
        }
    };

    var columnsrenderer = function (value) {
        return '<div style="text-align: center; margin: 4px;">' + value + '</div>';
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    $("#jqxgridResumenSemanaMeses").jqxGrid(
    {
        theme: 'black',
        width: '100%',
        source: dataAdapter,
        columnsresize: true,
        altrows: true,
        showemptyrow: true,
        //pageable: true,
        autoheight: true,
        sortable: true,
        updatedelay: 5,
        pagermode: 'simple',
        //pagesize: 10,
        //virtualmode: true,
        autorowheight: true,
        rendergridrows: function()
        {
            return dataAdapter.records;     
        },
        columns: [
            { text: 'Per&iacuteodo', dataField:'Descripcion', cellsalign: 'left'},
            { text: 'Cauchos', datafield: 'Cantidad', cellsalign: 'right', cellsformat: 'n', align: 'center'},
            { text: 'Promedio', dataField:'Promedio', cellsalign: 'right', cellsformat: 'n', align: 'center'},
        ]
    });
}

function loadChart() {

    var fecha = new Date();
    var month = [];
    var titulos = [];
    var datos = [];
    month[0] = "ENE";
    month[1] = "FEB";
    month[2] = "MAR";
    month[3] = "ABR";
    month[4] = "MAY";
    month[5] = "JUN";
    month[6] = "JUL";
    month[7] = "AGO";
    month[8] = "SEP";
    month[9] = "OCT";
    month[10] = "NOV";
    month[11] = "DIC";

    var mes;

    //fecha = new Date();
    //mes = fecha.getMonth();
    //titulos.push(month[mes]);

    $.ajax({
        url: '../wa/api/ViewResumenGraficoMeses',
        type: "GET",
        dataType: "json",
        success: function (data) {

            var record = data.data;

            for(i=0 ; i<record.length; i++) {
                //mes = (new Date(fecha.getYear(),fecha.getMonth() - i)).getMonth();
                //titulos.push(month[mes]);
                titulos.push(record[i].Mes);
                datos.push(record[i].Cantidad);
            }

            $('#charContainer').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Ultimos 6 Meses'
                },
                xAxis: {
                    //categories: [titulos[0], titulos[1], titulos[2], titulos[3], titulos[4]],
                    categories: titulos,
                    title: {
                        //text: 'Meses'
                    }                
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Cauchos',
                        align: 'high'
                    }
                },
                tooltip: {
                    valueSuffix: 'Cauchos'
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    //x: -10,
                    y: 10,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    //data: [record[0]["Cantidad"], record[1]["Cantidad"], record[2]["Cantidad"], record[3]["Cantidad"], record[4]["Cantidad"]],
                    data: datos,
                    title: {
                        text: 'Meses'
                    }
                }],
                plotOptions: {
                    series: {
                        pointWidth: 15, //width of the column bars irrespective of the chart size
                        showInLegend: false,
                        dataLabels: {
                            enabled: true,
                            inside: true,
                            align: 'center',
                            color: 'white',
                            style: {
                               'font-weight' : 'bold', 
                               'font-size' : '8px'
                            }
                        }
                    }
                }
            });
        },
        failure: function() {
            console.log('Failed');
        }
    });
}

function loadVUMeter(recordLeft, recordRight) {

    var promLeft = recordLeft.Promedio,
        promRight = recordRight.Promedio;

    $('#charContainer2').highcharts({
        chart: {
            type: 'gauge',
            plotBorderWidth: 1,
            plotBackgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [500, '#000000'],
                    [900, '#000000'],
                    [1100, '#000000']
                ]
            },
            plotBackgroundImage: null,
            height: 200
        },

        title: {
            text: 'Capacidad de Carga'
        },

        pane: [{
            startAngle: -60,
            endAngle: 60,
            background: null,
            center: ['50%', '100%'],
            size: 180
        }],

        yAxis: [{
            min: 500,
            max: 1000,
            minorTickPosition: 'outside',
            tickPosition: 'outside',
            labels: {
                rotation: 'auto',
                distance: 12,
                style: {
                    color: 'white'
                    //fontWeight: 'bold'
                }
            },
            plotBands: [{
                from: 500,
                to: 600,
                color: 'red', // red
                innerRadius: '100%',
                outerRadius: '105%'
            },
            {
                from: 601,
                to: 750,
                color: '#FFE43D', // orange
                innerRadius: '100%',
                outerRadius: '105%'
            },
            {
                from: 751,
                to: 1000,
                color: '#4DDC36', // green
                innerRadius: '100%',
                outerRadius: '105%'
            }],
            pane: 0,
            title: {
                text: '<span style="font-size:12px;">'+recordRight.Descripcion+': <span style="font-size:11px;">'+promRight+'</span></span><br>' +
                    '<span style="font-size:12px;color: red;">'+recordLeft.Descripcion+': <span style="font-size:11px; color:red;">'+promLeft+'</span></span>',
                y: 10,
                style: {
                    'color': 'white'
                }
            }
        }],

        plotOptions: {
            gauge: {
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        textShadow: '0px 0px 3px black'
                    }
                },
                dial: {
                    radius: '100%',
                    backgroundColor: 'white',
                    baseLength: '70%', // of radius
                    rearLength: '10%'
                },
                pivot: {
                    backgroundColor: 'white'
                }
            }
        },

        series: [{
            data: [promRight],
            yAxis: 0
        }]

    },

    // Let the music play
    function (chart) {
        setInterval(function () {
            var left = chart.series[0].points[0],
                leftVal,
                inc = Math.floor(((Math.random() * 10) + 1) * 100);

            leftVal =  (inc>=(promRight-100) && inc<=(promRight+100)) ? inc : promRight ;

            left.update(leftVal, false);

            chart.redraw();

        }, 500);
    });
}

function timerIncrement () {
	window.location.reload();
	// $('#jqxgridMovs').jqxGrid('refreshdata');
	// $('#jqxgridMovs').jqxGrid('refresh');
}

$(document).ready(function () {
	 //Increment the idle time counter every minute.
   	var idleInterval = setInterval(timerIncrement, 1800*1000); // 1 minute

    loadCSS("../resources/css/app.css");
    
    loadMovs();
    loadResumenSemanaMeses();
    loadChart();
    loadEquipos();

    //$.getScript('scripts/loadMapa.js');

    htmlLeyenda = '<p>' +
        '<span class="glyphicon glyphicon-pushpin" aria-hidden="false">=ASIGNADO</span><br>' +
        '<span class="glyphicon glyphicon-time" aria-hidden="false" style="color:#AA5585">=PROGRAMADO</span><br>' +
        '<span class="icon-truck" style="color:#DADA00;">=TRANSITO</span><br>' +
        '<span class="icon-office" aria-hidden="false"  style="color:#03c3fa;">=CLIENTE</span><br>' +
        '<i class="fa fa-truck" style="color:#de7404;"></i><span style="color:#de7404;">=RETORNANDO</span><br>' +
        '<span class="glyphicon glyphicon-thumbs-up" aria-hidden="false" style="color:#1db304;">=DISPONIBLE</span><br>' +
        '<span class="fa fa-wrench" aria-hidden="false"  style="color:#8A458A;">=REPROGRAMADO</span><br>' +
        '</p>';

    $("#leyenda").html(htmlLeyenda);

    // $( "#show-option" ).tooltip({
    //   show: {
    //     effect: "slideDown",
    //     delay: 250
    //   }
    // });
});

function _CreateWindow(movId, movViaje) {
    var today = new Date();

    var strHtml = '<div id="window"><div id="windowHeader">'+movViaje+'</div><div style="overflow: hidden; vertical-align:middle;padding:10px;" id="windowContent"><p align="center"><img src="../wa/api/attachment/'+movId + '?_dc='+ today.getTime() +'" height="370" width="400"/><br><br></p></div></div>';

    $("#windowContainer").html(strHtml);

    $("#window").jqxWindow({
        theme: 'black',
        showCollapseButton: false, 
        maxHeight: 420, 
        maxWidth: 420, 
        // minHeight: 200, 
        // minWidth: 200, 
        height: 420, 
        width: 420
    });
}

/*function loadVUMeterOld(recordLeft, recordRight) {

    var promLeft = recordLeft["Promedio"] / 100,
        promRight = recordRight["Promedio"] / 100;

    $('#charContainer2').highcharts({
        chart: {
            type: 'gauge',
            plotBorderWidth: 1,
            plotBackgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [3, '#000000'],
                    [7, '#000000'],
                    [8, '#000000']
                ]
            },
            plotBackgroundImage: null,
            height: 200
        },

        title: {
            text: 'Maximo dia / Ultimo dia'
        },

        pane: [{
            startAngle: -45,
            endAngle: 45,
            background: null,
            center: ['25%', '100%'],
            size: 200
        }, {
            startAngle: -45,
            endAngle: 45,
            background: null,
            center: ['75%', '100%'],
            size: 200
        }],

        yAxis: [{
            min: 3,
            max: 10,
            minorTickPosition: 'outside',
            tickPosition: 'outside',
            labels: {
                rotation: 'auto',
                distance: promLeft
            },
            plotBands: [{
                from: 8,
                to: 10,
                color: '#C02316',
                innerRadius: '100%',
                outerRadius: '105%'
            }],
            pane: 0,
            title: {
                text: '<span style="font-size:12px; font-weight: bold;">'+recordLeft["Descripcion"]+'</span><br><span style="font-size:11px;">'+promLeft*100+'</span>',
                y: 5
            }
        }, {
            min: 5,
            max: 10,
            minorTickPosition: 'outside',
            tickPosition: 'outside',
            labels: {
                rotation: 'auto',
                distance: promRight
            },
            plotBands: [{
                from: 8,
                to: 10,
                color: '#C02316',
                innerRadius: '100%',
                outerRadius: '105%'
            }],
            pane: 1,
            title: {
                text: '<span style="font-size:12px; font-weight: bold;">'+recordRight["Descripcion"]+'</span><br><span style="font-size:11px;">'+promRight*100+'</span>',
                y: 5
            }
        }],

        plotOptions: {
            gauge: {
                dataLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold'
                    },
                    verticalAlign: 'top'
                },
                dial: {
                    radius: '100%',
                    backgroundColor: 'white',
                    baseLength: '70%', // of radius
                    rearLength: '10%'
                },
                pivot: {
                    backgroundColor: 'white'
                }
            }
        },


        series: [{
            data: [4],
            yAxis: 0
        }, {
            data: [7],
            yAxis: 1
        }]

    },

    // Let the music play
    function (chart) {
        setInterval(function () {
            var left = chart.series[0].points[0],
                right = chart.series[1].points[0],
                leftVal,
                rightVal,
                inc = Math.floor((Math.random() * 10) + 1),
                inc2 = Math.floor((Math.random() * 10) + 1);

            leftVal =  (inc>=(promLeft-1) && inc<=(promLeft+1)) ? inc : promLeft ;
            rightVal = (inc2>=(promRight-1) && inc2<=(promRight+1)) ? inc2 : promRight ;

            left.update(leftVal, false);
            right.update(rightVal, false);

            chart.redraw();

        }, 500);
    });
}*/
