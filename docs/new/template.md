 > [Wiki](Home) ▸ [[Data Plotter API]] ▸ **Template API**

### Template API Methods
The template is used by the plotter to draw pre-selected plots when the user browses to a URL or page intended to display an existing set of plots. The template is saved in the database as JSON and referenced with an identifier.

<a name="database" href="Template-API#database">#</a> **Database Definition**

```sql
template_id int PRIMARY KEY,
template json (can be text)
```

 <a name="get" href="Template-API#get">#</a> **Retreive Method** `GET`

The `GET` method is used to retrieve the id and json for an existing template. The plotter will call the API endpoint using a standard authorized `GET` type XHR request.

```coffeescript
  get: (uri, args, callback) ->
    ###
    # XHR Request Callback Actions
    ###

    # Create a 'GET' formatted argument string
    args = @encodeArgs 'GET', args

    try
      xhr.open 'GET', uri + args, @async
      xhr.setRequestHeader "Authorization", @getAccessTokenValue()
      xhr.send null
    catch error
      throw new Error(preError + ", " + error)

    return
```

This request is similar to the URL request:

```
https://www.nwac.us/api/template?template_id=1
```

and should return the template data and id information:

```json
{
    "templateData": [{
        "pageOrder": 1,
        "type": "parameter",
        "station": {
            "station": "White Pass Base & Upper",
            "region": "West Slopes South",
            "elevation": 4470
        },
        "dataParams": [{
            "data_logger": 43,
            "max_datetime": "2016-02-28T00:00:00Z",
            "limit": 504
        }],
        "options": {
            "x": {
                "variable": "datetime",
                "format": "%Y-%m-%dT%H:%M:%S-08:00",
                "min": "2016-02-19T00:00:00Z",
                "max": "2016-02-26T00:00:00Z"
            },
            "y": {
                "dataLoggerId": 43,
                "variable": "temperature",
                "title": "Temperature",
                "units": "°F"
            }
        }
    }, {
        "pageOrder": 2,
        "type": "parameter",
        "station": {
            "station": "White Pass Pigtail",
            "region": "West Slopes South",
            "elevation": 5970
        },
        "dataParams": [{
            "data_logger": 40,
            "max_datetime": "2016-02-28T00:00:00Z",
            "limit": 504
        }],
        "options": {
            "x": {
                "variable": "datetime",
                "format": "%Y-%m-%dT%H:%M:%S-08:00",
                "min": "2016-02-19T00:00:00Z",
                "max": "2016-02-26T00:00:00Z"
            },
            "y": {
                "dataLoggerId": 40,
                "variable": "wind_speed_average",
                "title": "Wind Speed",
                "units": "mph"
            },
            "yBand": {
                "minVariable": "wind_speed_minimum",
                "maxVariable": "wind_speed_maximum"
            }
        }
    }, {
        "pageOrder": 3,
        "type": "parameter",
        "station": {
            "station": "White Pass Base & Upper",
            "region": "West Slopes South",
            "elevation": 4470
        },
        "dataParams": [{
            "data_logger": 42,
            "max_datetime": "2016-02-28T00:00:00Z",
            "limit": 504
        }],
        "options": {
            "x": {
                "variable": "datetime",
                "format": "%Y-%m-%dT%H:%M:%S-08:00",
                "min": "2016-02-19T00:00:00Z",
                "max": "2016-02-26T00:00:00Z"
            },
            "y": {
                "dataLoggerId": 42,
                "variable": "wind_direction",
                "title": "Wind Direction",
                "units": "°"
            }
        }
    }]
}
```

***IMPORTANT***

The system only needs to allow the Plotter to store and retrieve a text json field referenced to the template's identifier. The JSON does not need to be manipulated in any way.

******

 <a name="put" href="Template-API#put">#</a> **Save Method** `PUT`

 The save method uses a put request to submit the current plotter template JSON to the database with the associated template identifier.

 ```coffeescript
 arguments =
   template_id: 1
   template: "{{TEMPLATE_JSON_STRING}}"
   
 api.put("https://www.nwac.us/api/endpoint", arguments, callback)
 ```
