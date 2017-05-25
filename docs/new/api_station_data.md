 > [Wiki](Home) ▸ [[Data Plotter API]] ▸ **Station Data API**

### Station Data API Methods
Plots are drawn using data collected through the Station Data API. This requires retrieval of time referenced data values.

<a name="json" href="Station-Data-API#json">#</a> **JSON Examples**

The follow example shows a sample JSON result from a Station Data API request. The request ultimately needs to include an array of objects. Each object within the array should include the `datetime` and a selection of or all data values associated with that timestamp. Additional station info can also be provided, though isn't essential.

```json
{
  "station_id": 1,
  "data": [
    {"datetime": "2017-01-01 00:00:00", "wind_speed": 1.234, "wind_speed_max": 1.543, "wind_speed_min": 0.123, "precip": 0, "snow_depth": 0},
    {"datetime": "2017-01-01 00:01:00", "wind_speed": 1.245, "wind_speed_max": 1.532, "wind_speed_min": 0.134, "precip": 0.2, "snow_depth": 0.1},
    {"datetime": "2017-01-01 00:02:00", "wind_speed": 1.267, "wind_speed_max": 1.521, "wind_speed_min": 0.145, "precip": 0, "snow_depth": 0.1}
  ]
}
```

<a name="get" href="Station-Data-API#get">#</a> **Basic Request** `GET`

There are several ways to request a block of timeseries data. Northwest Avalanche Center (NWAC) uses the following method:

```
https://www.nwac.us/api/endpoint?station_id=1&max_datetime=2017-01-01%2000:00:00&limit=500
```

The system returns the 500 data records before and including the max_datetime using an XHR `GET` request.

<a name="alt" href="Station-Data-API#alt">#</a> **Alternate Request** `GET`

```
https://www.nwac.us/api/endpoint?station_id=1&start=2017-01-01%2000:00:00&end=2017-01-01%2003:00:00
```

This example demonstrates a starting and ending datetime to bound the request, versus a max and record limit. This would also be requested using an XHR `GET` method request.
