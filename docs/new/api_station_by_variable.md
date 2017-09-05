 > [Wiki](Home) ▸ [[Data Plotter API]] ▸ **Stations by Variable API**
 
### Station by Variable API Methods
A variable specific plot allows adding and removing stations that also record the specified variable. The API should provide a list of stations with any group or station metadata that's desired in the dropdown and map display.

<a name="json" href="Station-Data-API#json">#</a> **JSON Examples**

The follow example shows a sample JSON result from a Station by Variable API request. The result is grouped by region and includes the stations unique identifier, elevation, and name. 

```json
[
    {
        "region": "Alpental", 
        "stations": [
            {
                "dataLoggerId": 0, 
                "elevation": 3100.0, 
                "name": "Alpental Base"
            }, 
            {
                "dataLoggerId": 1, 
                "elevation": 4350.0, 
                "name": "Alpental Mid"
            }, 
            {
                "dataLoggerId": 2, 
                "elevation": 5470.0, 
                "name": "Alpental Summit"
            }
        ]
    }, 
    {
        "region": "Blewett Pass", 
        "stations": [
            {
                "dataLoggerId": 3, 
                "elevation": 4100.0, 
                "name": "Blewett Pass"
            }
        ]
    }
]
```

<a name="get" href="Station-Data-API#get">#</a> **Basic Request** `GET`

The endpoint should accept the specified variable and return all station information.

```
https://www.nwac.us/api/endpoint?variable=wind_speed
```
