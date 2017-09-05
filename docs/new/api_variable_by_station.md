 > [Wiki](Home) ▸ [[Data Plotter API]] ▸ **Variable by Station API**
 
### Variable by Station API Methods
A station specific plot allows adding and removing additional variables recorded by that station. The API should return a list of variables, with any required metadata, that are recorded for the specified station.

<a name="json" href="Station-Data-API#json">#</a> **JSON Examples**

The follow example shows a sample JSON result from a Station by Variable API request. The result is grouped by region and includes the stations unique identifier, elevation, and name. 

```json
[
    {
        "variable": "wind_speed", 
        "title": "Wind Speed",
        "units": "mph" 
    }, 
    {
        "variable": "precip", 
        "title": "Precipitation",
        "units": "in" 
    }
]
```

<a name="get" href="Station-Data-API#get">#</a> **Basic Request** `GET`

The endpoint should accept the stations unique identifier and return all variables associated with that station.

```
https://www.nwac.us/api/endpoint?station_id=13
```
