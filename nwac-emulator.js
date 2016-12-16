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
        templateId: 1
    };

    res.render('advanced', data);
});

app.get('/plots/:templateId', function (req, res) {
    var templateId = parseInt(req.params.templateId);
    var minutes = 60;
    var access = process.env.NWAC_TOKEN;
    var date = new Date();
    var expires = new Date(date.getTime() + minutes*60000);

    var data = {
        title: "Testing Dev Template ID: " + templateId,
        token: {
            token: access,
            expires: expires
        },
        templateId: templateId
    };

    res.render('advanced', data);
});

/** Routing API Calls */
app.get('/template/:templateId', function(req, res) {
    /** Get a Template */
    var plotTemplateId = parseInt(req.params.templateId);
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
                "type": "parameter",
                "station": {
                    "station":"White Pass Base & Upper",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": [{
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                }],
                "options": {
                    "x": xVar,
                    "y": {
                        "dataLoggerId": 43,
                        "variable": "temperature",
                        "title": "Temperature",
                        "units": "°F"
                    }
                }
            },
            {
                "pageOrder": 2,
                "type": "parameter",
                "station": {
                    "station":"White Pass Pigtail",
                    "region":"West Slopes South",
                    "elevation":5970
                },
                "dataParams": [{
                    "data_logger": 40,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                }],
                "options": {
                    "x": xVar,
                    "y": {
                        "dataLoggerId": 40,
                        "variable": "wind_speed_average",
                        "title": "Wind Speed",
                        "units": "mph"
                    },
                    "yBand": {
                        "minVariable": "wind_speed_minimum",
                        "maxVariable": "wind_speed_maximum",
                    }
                }
            },
            {
                "pageOrder": 3,
                "type": "parameter",
                "station": {
                    "station":"White Pass Base & Upper",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": [{
                    "data_logger": 42,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                }],
                "options": {
                    "x": xVar,
                    "y": {
                        "dataLoggerId": 42,
                        "variable": "wind_direction",
                        "title": "Wind Direction",
                        "units": "°"
                    }
                }
            }
        ]};
    } else if (plotTemplateId === 2) {
        result = {"templateData": [
            {
                "pageOrder": 1,
                "type": "parameter",
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
                        "units": "°F"
                    },
                    "y2": {
                        "variable": "temperature",
                        "title": "Temperature",
                        "units": "°F"
                    }
                }
            },
            {
                "pageOrder": 2,
                "type": "parameter",
                "station": {
                    "station":"White Pass Pigtail",
                    "region":"West Slopes South",
                    "elevation":5970
                },
                "dataParams": [{
                    "data_logger": 40,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                }],
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "wind_speed_average",
                        "title": "Wind Speed",
                        "units": "mph"
                    },
                    "yBand": {
                        "minVariable": "wind_speed_minimum",
                        "maxVariable": "wind_speed_maximum",
                    },
                }
            },
            {
                "pageOrder": 3,
                "type": "parameter",
                "station": {
                    "station":"White Pass Base",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": [{
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                }],
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "precipitation",
                        "title": "Precipitation",
                        "units": "In."
                    }
                }
            },
            {
                "pageOrder": 4,
                "type": "parameter",
                "station": {
                    "station":"White Pass Base",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": [{
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                }],
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "snowfall_24_hour",
                        "title": "24-Hour Snow Fall",
                        "units": "In."
                    }
                }
            },
            {
                "pageOrder": 5,
                "type": "parameter",
                "station": {
                    "station":"White Pass Base",
                    "region":"West Slopes South",
                    "elevation":4470
                },
                "dataParams": [{
                    "data_logger": 43,
                    "max_datetime": "2016-02-28T00:00:00Z",
                    "limit": 504
                }],
                "options": {
                    "x": xVar,
                    "y": {
                        "variable": "snow_depth",
                        "title": "Total Snow Depth",
                        "units": "In."
                    }
                }
            }
        ]};
    }

    res.json(result);
});

/** Run Server Listen */
var server = app.listen(app.get('port'), function () {
    var port = app.get('port');
    console.log("NWAC Development Emulator Listening (http://localhost:"+port+")...");
    console.log("Dir: ", __dirname);
});
