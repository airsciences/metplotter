var express = require('express');
var app = express();

/** Set Configurations */
app.set('view engine', 'pug');
app.set('views', './express/views');

/** Static Files */
app.use(express.static('font'));
app.use(express.static('js'));
app.use(express.static('style'));

/** Routing Calls */
app.get('/', function (req, res) {
    var minutes = 60;
    var access = process.env.NWAC_TOKEN;
    var date = new Date();
    var expires = new Date(date.getTime() + minutes*60000);
    
    var data = {
        token: {
            token: access,
            expires: expires
        },
        plotTemplateId: 1
    };
    
    res.render('advanced', data);
});

/** Routing API Calls */
app.get('/template/:plotTemplateId', function(req, res) {
    /** Get a Template */
    var plotTempateId = parseInt(req.params.plotTemplateId);
    var max_datetime = new Date();
    var result = {
        "error": true,
        "message": "No plot template exists."
    };
    
    xVar =  {
        "variable": "datetime", 
        "format": "%Y-%m-%dT%H:%M:%SZ",
        "min": "2016-10-06T00:00:00Z",
        "max": "2016-10-13T00:00:00Z"
    };
    
    if (plotTempateId === 1) {
        result = {"templateData": [
            {
                "pageOrder": 1,
                "type": "station",
                "station": {
                    "station":"White Pass",
                    "region":"White Pass Upper",
                    "elevation":5800.0
                },
                "dataParams": {
                    "data_logger": 42,
                    "max_datetime": "2016-10-13T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "wind_speed_average",
                        "title": "Wind Speed Average",
                        "units": "m/s",
                        "min": 0
                    },
                    "yBand": {
                        "minVariable": "wind_speed_minimum",
                        "maxVariable": "wind_speed_maximum",
                    }
                }
            },
            {
                "pageOrder": 2,
                "type": "station",
                "station": {
                    "station":"White Pass",
                    "region":"White Pass Upper",
                    "elevation":5800.0
                },
                "dataParams": {
                    "data_logger": 42,
                    "max_datetime": "2016-10-13T00:00:00Z",
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
                "pageOrder": 3,
                "type": "station",
                "station": {
                    "station":"White Pass",
                    "region":"White Pass Upper",
                    "elevation":5800.0
                },
                "dataParams": {
                    "data_logger": 42,
                    "max_datetime": "2016-10-13T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "relative_humidity",
                        "title": "Relative Humidity",
                        "units": "%",
                        "min": 0
                    }
                }
            }
        ]};
    } else if (plotTemplateId === 2) {
        result = {"templateData": [
            {
                "pageOrder": 1,
                "type": "parameter",
                "station": {
                    "station":"White Pass",
                    "region":"White Pass Upper",
                    "elevation":5800.0
                },
                "dataParams": {
                    "data_logger": 34,
                    "max_datetime": "2016-10-13T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "line1Color": "rgb(41,128,185)",
                    "line2Color": "rgb(39,174,96)",
                    "x": xVar,
                    "y": {
                        "variable": "wind_speed_average",
                        "title": "Wind Speed Average",
                        "units": "m/s"
                    },
                    "y2": {
                        "variable": "wind_speed_minimum",
                        "title": "Wind Speed Minimum",
                        "units": "m/s"
                    }
                }                    
            },
            {
                "pageOrder": 2,
                "station": {
                    "station":"White Pass",
                    "region":"White Pass Upper",
                    "elevation":5800.0
                },
                "dataParams": {
                    "data_logger": 34,
                    "max_datetime": "2016-10-13T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "line1Color": "rgb(142,68,173)",
                    "x": xVar,
                    "y": {
                        "variable": "temperature",
                        "title": "Temperature",
                        "units": "°F"
                    }
                }
            },
            {
                "pageOrder": 3,
                "station": {
                    "station":"White Pass",
                    "region":"White Pass Upper",
                    "elevation":5800.0
                },
                "dataParams": {
                    "data_logger": 34,
                    "max_datetime": "2016-10-13T00:00:00Z",
                    "limit": 504
                },
                "options": {
                    "line1Color": "rgb(243,156,18)",
                    "x": xVar,
                    "y": {
                        "variable": "solar_pyranometer",
                        "title": "Solar Radiation",
                        "units": "W/sq-m"
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
                    "label": "Olympics",
                    "stations": [
                        {"station": "Hurricane Ridge", "param": "wind_speed", "data_logger": 81}
                    ]
                },
                {
                    "label": "West Slopes North",
                    "stations": [
                        {"station": "Mt. Baker - Heather Meadow", "param": "wind_speed", "data_logger": 355},
                        {"station": "Mt. Baker - Pan Dome", "param": "wind_speed", "data_logger": 356}
                    ]
                },
                {
                    "label": "Stevens Pass",
                    "stations": [
                        {"station": "Schmidt Haus", "param": "wind_speed", "data_logger": 13}
                    ]
                }
            ];
            break;
        default:
            /** Return All Stations */
            result = [
                {
                    "label": "Olympics",
                    "stations": [
                        {"station": "Hurricane Ridge", "param": "wind_speed", "data_logger": 81}
                    ]
                },
                {
                    "label": "West Slopes North",
                    "stations": [
                        {"station": "Mt. Baker - Heather Meadow", "param": "wind_speed", "data_logger": 355},
                        {"station": "Mt. Baker - Pan Dome", "param": "wind_speed", "data_logger": 356}
                    ]
                },
                {
                    "label": "Stevens Pass",
                    "stations": [
                        {"station": "Schmidt Haus", "param": "wind_speed", "data_logger": 13},
                        {"station": "Brook Winds", "param": "wind_speed", "data_logger": 90},
                        {"station": "Grace Lakes", "param": "wind_speed", "data_logger": 21}
                    ]
                }
            ];
    }
    
    res.json(result);
});

app.get('/parameter/:dataLoggerId', function (req, res) {
    console.log("API-Stations", req.params);
    var result;
    
    switch (parseInt(req.params.dataLoggerId)) {
        case 81:
            result = [
                {"title": "Wind Speed", "param": "wind_speed", "data_logger": 81},
                {"title": "Temperature", "param": "temperature", "data_logger": 81},
                {"title": "Snow Depth", "param": "snow_depth", "data_logger": 81},
                {"title": "24Hr Snow Fall", "param": "snowfall_24_hour", "data_logger": 81},
                {"title": "Precipitation", "param": "precip", "data_logger": 81}
            ];
            break;
        case 90:
            result = [
                {"title": "Wind Speed", "param": "wind_speed", "data_logger": 90},
                {"title": "Temperature", "param": "temperature", "data_logger": 90},
                {"title": "Snow Depth", "param": "snow_depth", "data_logger": 90},
                {"title": "24Hr Snow Fall", "param": "snowfall_24_hour", "data_logger": 90},
                {"title": "Precipitation", "param": "precip", "data_logger": 90}
            ];
            break;
        default:
            /** Return All Stations */
            data_logger_id = parseInt(req.params.dataLoggerId);
            result = [
                {"title": "Wind Speed", "param": "wind_speed", "data_logger": data_logger_id},
                {"title": "Temperature", "param": "temperature", "data_logger": data_logger_id},
                {"title": "Snow Depth", "param": "snow_depth", "data_logger": data_logger_id},
                {"title": "24Hr Snow Fall", "param": "snowfall_24_hour", "data_logger": data_logger_id},
                {"title": "Precipitation", "param": "precip", "data_logger": data_logger_id}
            ];
    }
    
    res.json(result);
});

/** Run Server Listen */
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("NWAC Development Emulator Listening (http://localhost:"+port+")...");
});
