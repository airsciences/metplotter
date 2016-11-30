
## The Station by Parameter API Endpoint Sample

**`GET Request`**

The Plotter prototype will send a parameter e.g. `windspeed`, the app requests 
all stations that have that parameter grouped by region. The following example 
shows an array of many regions with many stations. Latitude and longitude will
be used by the map based stations selector

The order of both the regions and 
stations within each region is important as it will dictate the order in the 
dropdown.  Within each region the stations should be ordered from lowest elevation
to highest elevation.  The regions should be ordered generally north to south: 

1. Olympics	1
2. Mt Baker	2
3. Stevens Pass	3
4. Alpental	4
5. Snoqualmie Pass	5
6. Crystal	6
7. Rainier	7
8. Chinook Pass	8
8. White Pass	9
9. Mt St Helens	10
10. Washington Pass	11
11. Lake Wenatchee to Leavenworth	12
12. Blewett Pass	13
13. Mission Ridge	14
14. Mt Hood Meadows	15
16. Timberline	16
17. Ski Bowl	17

Example Request

```
http://nwac.us/api/v5/stations?parameter=windspeed
```

***

```json
[
    {
        "region": "Alpental", 
        "stations": [
            {
                "dataLoggerId": 0, 
                "elevation": 3100.0, 
                "name": "Alpental Base",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 1, 
                "elevation": 4350.0, 
                "name": "Alpental Mid",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 2, 
                "elevation": 5470.0, 
                "name": "Alpental Summit",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Blewett Pass", 
        "stations": [
            {
                "dataLoggerId": 3, 
                "elevation": 4100.0, 
                "name": "Blewett Pass",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Chinook Pass", 
        "stations": [
            {
                "dataLoggerId": 4, 
                "elevation": 5500.0, 
                "name": "Chinook Pass Base",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 5, 
                "elevation": 6240.0, 
                "name": "Chinook Pass Summit"
            }
        ]
    }, 
    {
        "region": "Crystal", 
        "stations": [
            {
                "dataLoggerId": 6, 
                "elevation": 4570.0, 
                "name": "Crystal Base",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 7, 
                "elevation": 6230.0, 
                "name": "Green Valley",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 8, 
                "elevation": 6830.0, 
                "name": "Crystal Summit",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Mission Ridge", 
        "stations": [
            {
                "dataLoggerId": 9, 
                "elevation": 4610.0, 
                "name": "Mission Ridge Base",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 10, 
                "elevation": 5160.0, 
                "name": "Mission Ridge Mid-Mountain",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 11, 
                "elevation": 6730.0, 
                "name": "Mission Ridge Summit",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Mt Baker", 
        "stations": [
            {
                "dataLoggerId": 12, 
                "elevation": 4210.0, 
                "name": "Heather Meadow",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 13, 
                "elevation": 5020.0, 
                "name": "Pan Dome",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Mt Hood Meadows", 
        "stations": [
            {
                "dataLoggerId": 14, 
                "elevation": 5380.0, 
                "name": "Mt Hood Meadows",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 15, 
                "elevation": 6540.0, 
                "name": "Mt Hood Meadows Blue",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 16, 
                "elevation": 7300.0, 
                "name": "Mt Hood Meadows Cascade Express",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "None", 
        "stations": [
            {
                "dataLoggerId": 17, 
                "elevation": 3260.0, 
                "name": "Mt St Helens - Coldwater",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 18, 
                "elevation": 4340.0, 
                "name": "Mt Washington",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Olympics", 
        "stations": [
            {
                "dataLoggerId": 19, 
                "elevation": 5250.0, 
                "name": "Hurricane Ridge",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Rainier", 
        "stations": [
            {
                "dataLoggerId": 20, 
                "elevation": 5380.0, 
                "name": "Paradise Wind",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 21, 
                "elevation": 5400.0, 
                "name": "Paradise",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 22, 
                "elevation": 6410.0, 
                "name": "Sunrise Base",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 23, 
                "elevation": 6880.0, 
                "name": "Sunrise Upper",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 24, 
                "elevation": 10110.0, 
                "name": "Camp Muir",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Ski Bowl", 
        "stations": [
            {
                "dataLoggerId": 25, 
                "elevation": 3660.0, 
                "name": "Ski Bowl Gov't Camp",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 26, 
                "elevation": 5010.0, 
                "name": "Ski Bowl Summit",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Snoqualmie Pass", 
        "stations": [
            {
                "dataLoggerId": 27, 
                "elevation": 3010.0, 
                "name": "Snoqualmie Pass",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 28, 
                "elevation": 3760.0, 
                "name": "Dodge Ridge",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 29, 
                "elevation": 3770.0, 
                "name": "East Shed",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Stevens Pass", 
        "stations": [
            {
                "dataLoggerId": 30, 
                "elevation": 3950.0, 
                "name": "Schmidt Haus",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 31, 
                "elevation": 4800.0, 
                "name": "Brooks",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 32, 
                "elevation": 4800.0, 
                "name": "Grace Lakes",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 33, 
                "elevation": 4850.0, 
                "name": "Brooks Wind",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 34, 
                "elevation": 5180.0, 
                "name": "Tye Mill",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 35, 
                "elevation": 5250.0, 
                "name": "Skyline Chair",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Stevens Pass East to Leavenworth", 
        "stations": [
            {
                "dataLoggerId": 36, 
                "elevation": 1930.0, 
                "name": "Lake Wenatchee",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 37, 
                "elevation": 2700.0, 
                "name": "Berne Snow Camp",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 38, 
                "elevation": 4180.0, 
                "name": "Tumwater Mtn",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 39, 
                "elevation": 5980.0, 
                "name": "Dirty Face",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Timberline", 
        "stations": [
            {
                "dataLoggerId": 40, 
                "elevation": 5880.0, 
                "name": "Timberline Lodge",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 41, 
                "elevation": 6990.0, 
                "name": "Timberline Ski Area - Magic Mile Chair",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "Washington Pass", 
        "stations": [
            {
                "dataLoggerId": 42, 
                "elevation": 2170.0, 
                "name": "Mazama",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 43, 
                "elevation": 6680.0, 
                "name": "Washington Pass Upper",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }, 
    {
        "region": "White Pass", 
        "stations": [
            {
                "dataLoggerId": 44, 
                "elevation": 4470.0, 
                "name": "White Pass Base",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 45, 
                "elevation": 5800.0, 
                "name": "White Pass Upper",
                "lat": 47.606209,
                "lon": -122.332071
            }, 
            {
                "dataLoggerId": 46, 
                "elevation": 5970.0, 
                "name": "Pigtail",
                "lat": 47.606209,
                "lon": -122.332071
            }
        ]
    }
]
```
