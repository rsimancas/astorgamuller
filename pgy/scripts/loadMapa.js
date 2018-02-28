$.getJSON('../resources/maps/ve-all.geo.json', function (mapGeoJSON) {

    $.ajax({
        url: '../wa/api/ViewResumenMapa',
        type: "GET",
        dataType: "json",
        success: function (data) {
            var record = data.data;

            var data = [];

            // Generate non-random data for the map
            $.each(mapGeoJSON.features, function (index, feature) {
                data.push({
                    key: feature.properties['hc-key'],
                    //value: parseInt(((Math.random() * 10) + 1) * 10)
                    value:0,
                    id: feature.id,
                    cauchos: 0,
                    percent: 0
                });
            });

            $.each(data,function(index, item) {
                $.each(record,function(indexR, itemR) {
                    if(item.id === itemR.MapId) {
                        item.value = itemR.CantidadCavas;
                        item.cauchos =  itemR.CantidadCauchos;
                        item.percent = itemR.PorcentajeCavas;
                    }
                    //if(item.id === 'VE.DF') item.value = 58.72
                });
            });

            // Instantiate chart
            $("#container").highcharts('Map', {

                // chart: {
                //     //backgroundColor: 'black',
                //     plotBackgroundColor: '#ffffff',
                //     plotBorderWidth: 1,
                //     plotBorderColor: '#000000',
                //     plotShadow: true
                // },

                title: {
                    text: 'Distribución de Carga'
                },

                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        align:'right',
                        theme: {
                            fill: 'white',
                            'stroke-width': 1,
                            stroke: 'silver',
                            r: 0,
                            states: {
                                hover: {
                                    fill: '#bada55'
                                },
                                select: {
                                    stroke: '#039',
                                    fill: '#bada55'
                                }
                            }
                        },
                        verticalAlign: 'bottom'
                    }
                },

                //colors: ['rgba(175,0,0,1)','rgba(175,0,0,0.9)','rgba(175,0,0,0.8)','rgba(175,0,0,0.7)','rgba(175,0,0,0.6)','rgba(175,0,0,0.5)','rgba(175,0,0,0.4)','rgba(175,0,0,0.3)','rgba(175,0,0,0.2)','rgba(175,0,0,0.1)'],

                // colorAxis: {
                //     dataClassColor: 'category',
                //     dataClasses: [
                //     {
                //         from: 10,
                //         name: '>10%',
                //         color: '#af0000'
                //     },
                //     {
                //         from: 8.01,
                //         to: 9,
                //         name: '9%',
                //         color: '#b51818'
                //     },
                //     {
                //         from: 7.01,
                //         to: 8,
                //         name: '8%',
                //         color: '#be3232'
                //     },
                //     {
                //         from: 6.01,
                //         to: 7,
                //         name: '7%',
                //         color: '#c64b4b'
                //     },
                //     {
                //         from: 5.01,
                //         to: 6,
                //         name: '6%',
                //         color: '#ce6565'
                //     }, 
                //     {
                //         from: 4.01,
                //         to: 5,
                //         name: '5%',
                //         color: '#d67f7f'
                //     }, 
                //     {
                //         from: 3.01,
                //         to: 4,
                //         name: '4%',
                //         color: '#dd9797'
                //     }, 
                //     {
                //         from: 2.01,
                //         to: 3,
                //         name: '3%',
                //         color: '#e5b1b1'
                //     },
                //     {
                //         from: 1.01,
                //         to: 2,
                //         name: '2%',
                //         color: '#edcaca'
                //     },
                //     {
                //         from: 0.1,
                //         to: 1,
                //         name: '1%',
                //         color: '#f5e4e4'
                //     },
                //     {
                //         to: 0,
                //         name: '0%',
                //         color: '#ffffff'
                //     }
                //     ]
                // },

                colorAxis: {
                    dataClassColor: 'category',
                    dataClasses: [
                    {
                        from: 10,
                        name: '10+',
                        color: '#af0000'
                    },
                    {
                        from: 9,
                        to: 9,
                        name: '9',
                        color: '#b51818'
                    },
                    {
                        from: 8,
                        to: 8,
                        name: '8',
                        color: '#be3232'
                    },
                    {
                        from: 7,
                        to: 7,
                        name: '7',
                        color: '#c64b4b'
                    },
                    {
                        from: 6,
                        to: 6,
                        name: '6',
                        color: '#ce6565'
                    }, 
                    {
                        from: 5,
                        to: 5,
                        name: '5',
                        color: '#d67f7f'
                    }, 
                    {
                        from: 4,
                        to: 4,
                        name: '4',
                        color: '#dd9797'
                    }, 
                    {
                        from: 3,
                        to: 3,
                        name: '3',
                        color: '#e5b1b1'
                    },
                    {
                        from: 2,
                        to: 2,
                        name: '2',
                        color: '#edcaca'
                    },
                    {
                        from: 1,
                        to: 1,
                        name: '1',
                        color: '#f5e4e4'
                    },
                    {
                        to: 0,
                        name: '0',
                        color: '#ffffff'
                    }
                    ]
                },

                legend: {
                    layout: 'vertical',
                    align: 'left',
                    borderWidth: 0,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    floating: true,
                    verticalAlign: 'bottom',
                    itemStyle: {
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        fontSize: '12px',
                        color: '#ffffff',
                        textDecoration: 'none'
                    },
                },

                series: [
                {
                    data: data,
                    mapData: mapGeoJSON,
                    joinBy: ['hc-key', 'key'],
                    name: 'Cavas',
                    states: {
                        hover: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        formatter: function () {
                            return this.point.name;
                        }
                    },
                    tooltip: {
                        //valueSuffix: '%',
                        pointFormat: '({point.name}) cavas:{point.value}, cauchos:{point.cauchos}, %:{point.percent}'
                    } //,
                    // point: {
                    //     events: {
                    //         // On click, look for a detailed map
                    //         click: function () {
                    //             var key = this.key;
                    //             $('#mapDropdown option').each(function () {
                    //                 if (this.value === 'countries/' + key.substr(0, 2) + '/' + key + '-all.js') {
                    //                     $('#mapDropdown').val(this.value).change();
                    //                 }
                    //             });
                    //         }
                    //     }
                    // }
                }]
            });


        },
        failure: function() {
            console.log('Failed');
        }
    });
});