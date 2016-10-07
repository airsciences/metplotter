var express = require('express');
var app = express();

/** Set Configurations */
app.set('view engine', 'pug');
app.set('views', './express/views');

/** Static Files */
app.use(express.static('fonts'));
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
    console.log("API-Template: req.params", req.params);
    var result = {
        "error": true,
        "message": "No plot template exists."
    };
    if (parseInt(req.params.plotTemplateId) === 1) {
        result = {"templateData": [
            {
                "pageOrder": 1,
                "station": {
                    "station":"White Pass",
                    "region":"White Pass Upper",
                    "elevation":5800.0
                },
                "dataParams": {
                    "data_logger": 34,
                    "max_datetime": "2016-10-05T17:00:00Z",
                    "limit": 50
                },
                "options": {
                    "line1Color": "rgb(41,128,185)",
                    "line2Color": "rgb(39,174,96)",
                    "y": {
                        "variable": "wind_speed_average"
                    },
                    "y2": {
                        "variable": "wind_speed_minumum"
                    }
                }                    
            },
            {
                "pageOrder": 2,
                "station": {
                    "station":"White Pass",
                    "region":"White Pass Lower",
                    "elevation":5300.0
                },
                "dataParams": {
                    "field": "precipitation",
                    "data_logger": 32,
                    "max_datetime": "2016-10-05T17:00:00Z",
                    "limit": 50
                },
                "options": {
                    "line1Color": "rgb(142,68,173)",
                    "line2Color": "rgb(243,156,18)"
                }
            }
        ]};
    }
    
    res.json(result);
});

/** Run Server Listen */
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("NWAC Development Emulator Listening (http://localhost:"+port+")...");
});
