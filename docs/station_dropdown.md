
## The Parameter by Station API Endpoint Sample

**`GET Request`**

The Plotter prototype will send a data_logger e.g. `34`, the app requests 
all parameters registered for that data logger. The following example 
shows an array example.

Example Request

```
http://nwac.us/api/v5/parameters?data_logger=34
```

***

```json
[
    {"title": "Windspeed (mph)", "parameter": ["windspeed","windspeed_max","windspeed_min"]},
    {"title": "Precipitation (In.)", "parameter": "precipitation"},
    {"title": "Temperature (F)", "parameter": "temperature"}
]
```
