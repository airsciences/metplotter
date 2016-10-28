var express = require('express');
var app = express();

/** Set Configurations */
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');
app.set('views', __dirname + '/express/views');

/** Static Files */
app.use(express.static(__dirname + '/font'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/style'));

/** Routing Calls */
app.get('/', function (req, res) {
    var minutes = 60;
    var access = process.env.NWAC_TOKEN;
    var date = new Date();
    var expires = new Date(date.getTime() + minutes*60000);
    
    var data = {
        title: "White Pass - Upper & Pigtail",
        token: {
            token: access,
            expires: expires
        },
        plotTemplateId: 1
    };
    
    res.render('advanced', data);
});

app.get('/full', function (req, res) {
    var minutes = 60;
    var access = process.env.NWAC_TOKEN;
    var date = new Date();
    var expires = new Date(date.getTime() + minutes*60000);
    
    var data = {
        title: "White Pass - Upper, Base, & Pigtail",
        token: {
            token: access,
            expires: expires
        },
        plotTemplateId: 2
    };
    
    res.render('advanced', data);
});

/** Routing API Calls */
app.get('/template/:plotTemplateId', function(req, res) {
    /** Get a Template */
    var plotTemplateId = parseInt(req.params.plotTemplateId);
    var max_datetime = new Date();
    var result = {
        "error": true,
        "message": "No plot template exists."
    };
    
    xVar =  {
        "variable": "datetime", 
        "format": "%Y-%m-%dT%H:%M:%SZ",
        "min": "2016-02-19T00:00:00Z",
        "max": "2016-02-26T00:00:00Z"
    };
    
    if (plotTemplateId === 1) {
        result = {"templateData": [
            {
                "pageOrder": 1,
                "type": "station",
                "station": {
                    "station":"White Pass Base & Upper",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": {
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "temperature",
                        "title": "Temperature",
                        "units": "°F",
                        "min": 0
                    }
                }
            },
            {
                "pageOrder": 2,
                "type": "station",
                "station": {
                    "station":"White Pass Pigtail",
                    "region":"West Slopes South",
                    "elevation":5970
                },
                "dataParams": {
                    "data_logger": 40,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "wind_speed_average",
                        "title": "Wind Speed",
                        "units": "m/s",
                        "min": 0
                    },
                    "yBand": {
                        "minVariable": "wind_speed_minimum",
                        "maxVariable": "wind_speed_maximum",
                    },
                }
            },
            {
                "pageOrder": 3,
                "type": "station",
                "station": {
                    "station":"White Pass Base",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": {
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "precipitation",
                        "title": "Precipitation",
                        "units": "In.",
                        "min": 0
                    }
                }
            },
            {
                "pageOrder": 4,
                "type": "station",
                "station": {
                    "station":"White Pass Base",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": {
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "snowfall_24_hour",
                        "title": "24-Hour Snow Fall",
                        "units": "In.",
                        "min": 0
                    }
                }
            },
            {
                "pageOrder": 5,
                "type": "station",
                "station": {
                    "station":"White Pass Base",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": {
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "snow_depth",
                        "title": "Total Snow Depth",
                        "units": "In.",
                        "min": 0
                    }
                }
            }
        ]};
    } else if (plotTemplateId === 2) {
        result = {"templateData": [
            {
                "pageOrder": 1,
                "type": "station",
                "station": [
                    {
                        "station":"White Pass Base",
                        "region":"West Slopes South",
                        "elevation":4470
                    },
                    {
                        "station":"White Pass Upper",
                        "region":"West Slopes South",
                        "elevation":5800
                    },
                ],
                "dataParams": [
                    {
                        "data_logger": 43,
                        "max_datetime": "2016-02-28T00:00:00Z",
                        "limit": 504
                    },
                    {
                        "data_logger": 42,
                        "max_datetime": "2016-02-28T00:00:00Z",
                        "limit": 504
                    }
                ],
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "temperature",
                        "title": "Temperature",
                        "units": "°F",
                        "min": 0
                    }
                }
            },
            {
                "pageOrder": 2,
                "type": "station",
                "station": {
                    "station":"White Pass Pigtail",
                    "region":"West Slopes South",
                    "elevation":5970
                },
                "dataParams": {
                    "data_logger": 40,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "wind_speed_average",
                        "title": "Wind Speed",
                        "units": "m/s",
                        "min": 0
                    },
                    "yBand": {
                        "minVariable": "wind_speed_minimum",
                        "maxVariable": "wind_speed_maximum",
                    },
                }
            },
            {
                "pageOrder": 3,
                "type": "station",
                "station": {
                    "station":"White Pass Base",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": {
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "precipitation",
                        "title": "Precipitation",
                        "units": "In.",
                        "min": 0
                    }
                }
            },
            {
                "pageOrder": 4,
                "type": "station",
                "station": {
                    "station":"White Pass Base",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": {
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "snowfall_24_hour",
                        "title": "24-Hour Snow Fall",
                        "units": "In.",
                        "min": 0
                    }
                }
            },
            {
                "pageOrder": 5,
                "type": "station",
                "station": {
                    "station":"White Pass Base",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": {
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "snow_depth",
                        "title": "Total Snow Depth",
                        "units": "In.",
                        "min": 0
                    }
                }
            }
        ]};
    }
    
    res.json(result);
});

app.get('/stations/:parameter', function (req, res) {
    console.log("API-Stations", req.params);
    var result;
    
    switch (req.params.parameter) {
        case 'wind_speed':
            result = [
                {
                    "region": "Alpental", 
                    "stations": [
                        {
                            "dataloggerid": 0, 
                            "elevation": 3100.0, 
                            "name": "Alpental Base"
                        }, 
                        {
                            "dataloggerid": 1, 
                            "elevation": 4350.0, 
                            "name": "Alpental Mid"
                        }, 
                        {
                            "dataloggerid": 2, 
                            "elevation": 5470.0, 
                            "name": "Alpental Summit"
                        }
                    ]
                }, 
                {
                    "region": "Blewett Pass", 
                    "stations": [
                        {
                            "dataloggerid": 3, 
                            "elevation": 4100.0, 
                            "name": "Blewett Pass"
                        }
                    ]
                }, 
                {
                    "region": "Crystal", 
                    "stations": [
                        {
                            "dataloggerid": 6, 
                            "elevation": 4570.0, 
                            "name": "Crystal Base"
                        }, 
                        {
                            "dataloggerid": 7, 
                            "elevation": 6230.0, 
                            "name": "Green Valley"
                        }, 
                        {
                            "dataloggerid": 8, 
                            "elevation": 6830.0, 
                            "name": "Crystal Summit"
                        }
                    ]
                }, 
                {
                    "region": "Mission Ridge", 
                    "stations": [
                        {
                            "dataloggerid": 9, 
                            "elevation": 4610.0, 
                            "name": "Mission Ridge Base"
                        }
                    ]
                }, 
                {
                    "region": "Mt Baker", 
                    "stations": [
                        {
                            "dataloggerid": 12, 
                            "elevation": 4210.0, 
                            "name": "Heather Meadow"
                        }, 
                        {
                            "dataloggerid": 13, 
                            "elevation": 5020.0, 
                            "name": "Pan Dome"
                        }
                    ]
                }, 
                {
                    "region": "Mt Hood Meadows", 
                    "stations": [
                        {
                            "dataloggerid": 14, 
                            "elevation": 5380.0, 
                            "name": "Mt Hood Meadows"
                        }, 
                        {
                            "dataloggerid": 15, 
                            "elevation": 6540.0, 
                            "name": "Mt Hood Meadows Blue"
                        }, 
                        {
                            "dataloggerid": 16, 
                            "elevation": 7300.0, 
                            "name": "Mt Hood Meadows Cascade Express"
                        }
                    ]
                }, 
                {
                    "region": "None", 
                    "stations": [
                        {
                            "dataloggerid": 17, 
                            "elevation": 3260.0, 
                            "name": "Mt St Helens - Coldwater"
                        }, 
                        {
                            "dataloggerid": 18, 
                            "elevation": 4340.0, 
                            "name": "Mt Washington"
                        }
                    ]
                }, 
                {
                    "region": "Olympics", 
                    "stations": [
                        {
                            "dataloggerid": 19, 
                            "elevation": 5250.0, 
                            "name": "Hurricane Ridge"
                        }
                    ]
                }, 
                {
                    "region": "Rainier", 
                    "stations": [
                        {
                            "dataloggerid": 20, 
                            "elevation": 5380.0, 
                            "name": "Paradise Wind"
                        }
                    ]
                }, 
                {
                    "region": "Ski Bowl", 
                    "stations": [
                        {
                            "dataloggerid": 25, 
                            "elevation": 3660.0, 
                            "name": "Ski Bowl Gov't Camp"
                        }, 
                        {
                            "dataloggerid": 26, 
                            "elevation": 5010.0, 
                            "name": "Ski Bowl Summit"
                        }
                    ]
                }, 
                {
                    "region": "Snoqualmie Pass", 
                    "stations": [
                        {
                            "dataloggerid": 27, 
                            "elevation": 3010.0, 
                            "name": "Snoqualmie Pass"
                        }, 
                        {
                            "dataloggerid": 28, 
                            "elevation": 3760.0, 
                            "name": "Dodge Ridge"
                        }, 
                        {
                            "dataloggerid": 29, 
                            "elevation": 3770.0, 
                            "name": "East Shed"
                        }
                    ]
                }, 
                {
                    "region": "Stevens Pass", 
                    "stations": [
                        {
                            "dataloggerid": 30, 
                            "elevation": 3950.0, 
                            "name": "Schmidt Haus"
                        }, 
                        {
                            "dataloggerid": 31, 
                            "elevation": 4800.0, 
                            "name": "Brooks"
                        }, 
                        {
                            "dataloggerid": 32, 
                            "elevation": 4800.0, 
                            "name": "Grace Lakes"
                        }, 
                        {
                            "dataloggerid": 33, 
                            "elevation": 4850.0, 
                            "name": "Brooks Wind"
                        }, 
                        {
                            "dataloggerid": 34, 
                            "elevation": 5180.0, 
                            "name": "Tye Mill"
                        }, 
                        {
                            "dataloggerid": 35, 
                            "elevation": 5250.0, 
                            "name": "Skyline Chair"
                        }
                    ]
                }, 
                {
                    "region": "Stevens Pass East to Leavenworth", 
                    "stations": [
                        {
                            "dataloggerid": 36, 
                            "elevation": 1930.0, 
                            "name": "Lake Wenatchee"
                        }, 
                        {
                            "dataloggerid": 37, 
                            "elevation": 2700.0, 
                            "name": "Berne Snow Camp"
                        }, 
                        {
                            "dataloggerid": 38, 
                            "elevation": 4180.0, 
                            "name": "Tumwater Mtn"
                        }, 
                        {
                            "dataloggerid": 39, 
                            "elevation": 5980.0, 
                            "name": "Dirty Face"
                        }
                    ]
                }, 
                {
                    "region": "Timberline", 
                    "stations": [
                        {
                            "dataloggerid": 40, 
                            "elevation": 5880.0, 
                            "name": "Timberline Lodge"
                        }, 
                        {
                            "dataloggerid": 41, 
                            "elevation": 6990.0, 
                            "name": "Timberline Ski Area - Magic Mile Chair"
                        }
                    ]
                }, 
                {
                    "region": "Washington Pass", 
                    "stations": [
                        {
                            "dataloggerid": 42, 
                            "elevation": 2170.0, 
                            "name": "Mazama"
                        }, 
                        {
                            "dataloggerid": 43, 
                            "elevation": 6680.0, 
                            "name": "Washington Pass Upper"
                        }
                    ]
                }, 
                {
                    "region": "White Pass", 
                    "stations": [
                        {
                            "dataloggerid": 44, 
                            "elevation": 4470.0, 
                            "name": "White Pass Base"
                        }, 
                        {
                            "dataloggerid": 45, 
                            "elevation": 5800.0, 
                            "name": "White Pass Upper"
                        }, 
                        {
                            "dataloggerid": 46, 
                            "elevation": 5970.0, 
                            "name": "Pigtail"
                        }
                    ]
                }
            ];
            break;
        default:
            /** Return All Stations */
            result = [
                {
                    "region": "Alpental", 
                    "stations": [
                        {
                            "dataloggerid": 0, 
                            "elevation": 3100.0, 
                            "name": "Alpental Base"
                        }, 
                        {
                            "dataloggerid": 1, 
                            "elevation": 4350.0, 
                            "name": "Alpental Mid"
                        }, 
                        {
                            "dataloggerid": 2, 
                            "elevation": 5470.0, 
                            "name": "Alpental Summit"
                        }
                    ]
                }, 
                {
                    "region": "Blewett Pass", 
                    "stations": [
                        {
                            "dataloggerid": 3, 
                            "elevation": 4100.0, 
                            "name": "Blewett Pass"
                        }
                    ]
                }, 
                {
                    "region": "Chinook Pass", 
                    "stations": [
                        {
                            "dataloggerid": 4, 
                            "elevation": 5500.0, 
                            "name": "Chinook Pass Base"
                        }, 
                        {
                            "dataloggerid": 5, 
                            "elevation": 6240.0, 
                            "name": "Chinook Pass Summit"
                        }
                    ]
                }, 
                {
                    "region": "Crystal", 
                    "stations": [
                        {
                            "dataloggerid": 6, 
                            "elevation": 4570.0, 
                            "name": "Crystal Base"
                        }, 
                        {
                            "dataloggerid": 7, 
                            "elevation": 6230.0, 
                            "name": "Green Valley"
                        }, 
                        {
                            "dataloggerid": 8, 
                            "elevation": 6830.0, 
                            "name": "Crystal Summit"
                        }
                    ]
                }, 
                {
                    "region": "Mission Ridge", 
                    "stations": [
                        {
                            "dataloggerid": 9, 
                            "elevation": 4610.0, 
                            "name": "Mission Ridge Base"
                        }, 
                        {
                            "dataloggerid": 10, 
                            "elevation": 5160.0, 
                            "name": "Mission Ridge Mid-Mountain"
                        }, 
                        {
                            "dataloggerid": 11, 
                            "elevation": 6730.0, 
                            "name": "Mission Ridge Summit"
                        }
                    ]
                }, 
                {
                    "region": "Mt Baker", 
                    "stations": [
                        {
                            "dataloggerid": 12, 
                            "elevation": 4210.0, 
                            "name": "Heather Meadow"
                        }, 
                        {
                            "dataloggerid": 13, 
                            "elevation": 5020.0, 
                            "name": "Pan Dome"
                        }
                    ]
                }, 
                {
                    "region": "Mt Hood Meadows", 
                    "stations": [
                        {
                            "dataloggerid": 14, 
                            "elevation": 5380.0, 
                            "name": "Mt Hood Meadows"
                        }, 
                        {
                            "dataloggerid": 15, 
                            "elevation": 6540.0, 
                            "name": "Mt Hood Meadows Blue"
                        }, 
                        {
                            "dataloggerid": 16, 
                            "elevation": 7300.0, 
                            "name": "Mt Hood Meadows Cascade Express"
                        }
                    ]
                }, 
                {
                    "region": "None", 
                    "stations": [
                        {
                            "dataloggerid": 17, 
                            "elevation": 3260.0, 
                            "name": "Mt St Helens - Coldwater"
                        }, 
                        {
                            "dataloggerid": 18, 
                            "elevation": 4340.0, 
                            "name": "Mt Washington"
                        }
                    ]
                }, 
                {
                    "region": "Olympics", 
                    "stations": [
                        {
                            "dataloggerid": 19, 
                            "elevation": 5250.0, 
                            "name": "Hurricane Ridge"
                        }
                    ]
                }, 
                {
                    "region": "Rainier", 
                    "stations": [
                        {
                            "dataloggerid": 20, 
                            "elevation": 5380.0, 
                            "name": "Paradise Wind"
                        }, 
                        {
                            "dataloggerid": 21, 
                            "elevation": 5400.0, 
                            "name": "Paradise"
                        }, 
                        {
                            "dataloggerid": 22, 
                            "elevation": 6410.0, 
                            "name": "Sunrise Base"
                        }, 
                        {
                            "dataloggerid": 23, 
                            "elevation": 6880.0, 
                            "name": "Sunrise Upper"
                        }, 
                        {
                            "dataloggerid": 24, 
                            "elevation": 10110.0, 
                            "name": "Camp Muir"
                        }
                    ]
                }, 
                {
                    "region": "Ski Bowl", 
                    "stations": [
                        {
                            "dataloggerid": 25, 
                            "elevation": 3660.0, 
                            "name": "Ski Bowl Gov't Camp"
                        }, 
                        {
                            "dataloggerid": 26, 
                            "elevation": 5010.0, 
                            "name": "Ski Bowl Summit"
                        }
                    ]
                }, 
                {
                    "region": "Snoqualmie Pass", 
                    "stations": [
                        {
                            "dataloggerid": 27, 
                            "elevation": 3010.0, 
                            "name": "Snoqualmie Pass"
                        }, 
                        {
                            "dataloggerid": 28, 
                            "elevation": 3760.0, 
                            "name": "Dodge Ridge"
                        }, 
                        {
                            "dataloggerid": 29, 
                            "elevation": 3770.0, 
                            "name": "East Shed"
                        }
                    ]
                }, 
                {
                    "region": "Stevens Pass", 
                    "stations": [
                        {
                            "dataloggerid": 30, 
                            "elevation": 3950.0, 
                            "name": "Schmidt Haus"
                        }, 
                        {
                            "dataloggerid": 31, 
                            "elevation": 4800.0, 
                            "name": "Brooks"
                        }, 
                        {
                            "dataloggerid": 32, 
                            "elevation": 4800.0, 
                            "name": "Grace Lakes"
                        }, 
                        {
                            "dataloggerid": 33, 
                            "elevation": 4850.0, 
                            "name": "Brooks Wind"
                        }, 
                        {
                            "dataloggerid": 34, 
                            "elevation": 5180.0, 
                            "name": "Tye Mill"
                        }, 
                        {
                            "dataloggerid": 35, 
                            "elevation": 5250.0, 
                            "name": "Skyline Chair"
                        }
                    ]
                }, 
                {
                    "region": "Stevens Pass East to Leavenworth", 
                    "stations": [
                        {
                            "dataloggerid": 36, 
                            "elevation": 1930.0, 
                            "name": "Lake Wenatchee"
                        }, 
                        {
                            "dataloggerid": 37, 
                            "elevation": 2700.0, 
                            "name": "Berne Snow Camp"
                        }, 
                        {
                            "dataloggerid": 38, 
                            "elevation": 4180.0, 
                            "name": "Tumwater Mtn"
                        }, 
                        {
                            "dataloggerid": 39, 
                            "elevation": 5980.0, 
                            "name": "Dirty Face"
                        }
                    ]
                }, 
                {
                    "region": "Timberline", 
                    "stations": [
                        {
                            "dataloggerid": 40, 
                            "elevation": 5880.0, 
                            "name": "Timberline Lodge"
                        }, 
                        {
                            "dataloggerid": 41, 
                            "elevation": 6990.0, 
                            "name": "Timberline Ski Area - Magic Mile Chair"
                        }
                    ]
                }, 
                {
                    "region": "Washington Pass", 
                    "stations": [
                        {
                            "dataloggerid": 42, 
                            "elevation": 2170.0, 
                            "name": "Mazama"
                        }, 
                        {
                            "dataloggerid": 43, 
                            "elevation": 6680.0, 
                            "name": "Washington Pass Upper"
                        }
                    ]
                }, 
                {
                    "region": "White Pass", 
                    "stations": [
                        {
                            "dataloggerid": 44, 
                            "elevation": 4470.0, 
                            "name": "White Pass Base"
                        }, 
                        {
                            "dataloggerid": 45, 
                            "elevation": 5800.0, 
                            "name": "White Pass Upper"
                        }, 
                        {
                            "dataloggerid": 46, 
                            "elevation": 5970.0, 
                            "name": "Pigtail"
                        }
                    ]
                }
            ];
    }
    
    res.json(result);
});

app.get('/parameters/:dataLoggerId', function (req, res) {
    console.log("API-Stations", req.params);
    var data_logger_id = parseInt(req.params.dataLoggerId);
    var result;
    
    switch (data_logger_id) {
        case 1:
            result = [
                {"title": "Windspeed (mph)", "parameter": ["wind_speed_average","wind_speed_maximum","wind_speed_minimum"]},
                {"title": "Precipitation (In.)", "parameter": "precipitation"},
                {"title": "Temperature (F)", "parameter": "temperature"},
                {"title": "Relative Humidity (%)", "parameter": "relative_humidity"}
            ];
            break;
        case 43:
        result = [
                {"title": "Precipitation (In.)", "parameter": "precipitation"},
                {"title": "Temperature (°F)", "parameter": "temperature"},
                {"title": "Relative Humidity (%)", "parameter": "relative_humidity"}
            ];
            break;
        default:
            /** Return All Parameters */
            result = [
                {"title": "Barometric Pressure", "parameter": "barometric_pressure"},
                {"title": "Battery Voltage (V)", "parameter": "battery_voltage"},
                {"title": "Equipment Temperature (°F)", "parameter": "equipment_temperature"},
                {"title": "Windspeed (mph)", "parameter": ["wind_speed_average","wind_speed_maximum","wind_speed_minimum"]},
                {"title": "Precipitation (In.)", "parameter": "precipitation"},
                {"title": "Temperature (°F)", "parameter": "temperature"},
                {"title": "Relative Humidity (%)", "parameter": "relative_humidity"}
            ];
    }
    
    res.json(result);
});

/** Run Server Listen */
var server = app.listen(app.get('port'), function () {
    var port = app.get('port');
    console.log("NWAC Development Emulator Listening (http://localhost:"+port+")...");
});
