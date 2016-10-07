

***Initialize on a Template/Page***

The D3 plot handler needs a single `<div>` type element. 

```html
<div id='d3-plot-target'></div>

<script src='jquery.min.js'></script>
<script src='bootstrap.min.js'></script>
<script src='d3.min.js'></script>
<script src='plotting.js'></script>
<script>
var options = {
    "target": "#d3-plot-target",
    "plotHandlerId": 1
};

var access = {
    "token": "#{token.token}"
};

var plotter = new Plotting.Handler(access, options)
plotter.initialize();
</script>
```

The sample above uses `plotHandlerId = 1`. This would be associated with the 
template key. Intent is to pull the template key from the URI.

The sample template `JSON`

```js
{"templateData": [
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
```

* `pageOrder` - Plot ordering within target div.
* `station` - Basic station and titling inforation. Will be used for selectors.
* `dataParams` - Specify the API request for getting initial data for the plot
* `options` - A specific JSON object that is passed to the D3 plot
