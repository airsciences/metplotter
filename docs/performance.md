
## Plotter Performance (Options)

```json
var options = {
    "target": "#d3-plot-target",
    "templateId": templateId,
    "refresh": 1000,
    "futureWait": 180000,
    "initialLength": 168,
    "requestPaddingInterval": 10,
    "newDataInterval": 50,
    "updateLength": 24,
    "minUpdateLength": 10,
    "updateLimit": 6
};
```

* **refresh** `[milliseconds]` - The overall refresh rate for how quickly the plots can request more data when zooming.
* **futureWait** `[milliseconds]` - The time interval to wait for requesting future data. Only operates within `newDataInterval` `[hours]` of current time.
* **initialLength** `[hours]` - The length of the initial data request when the plotter is loaded. This must complete to draw the plot data lines, therefore a larger value will take longer. However, a larger value will decrease the need to run zoom data updates.
* **requestPaddingInterval** `[hours]` - This is the number of hours to the left and right of the currently visible x-axis range that the plotter will continuously try and fill with zoom update API calls.
* **newDataInterval** `[hours]` - This is the time interval from current that the plotter will use the `futureWait`. This can be set to the maximum reasonable missing data expected from a site.
* **updateLength** `[hours]` - This is the data length each update API call requests.
* **minUpdateLength** `[hours]` - The minimum data length the API can request. This only comes into play when getting most recent data.
* **updateLimit** `[threads]` - The number of concurrent API requests allowed in each direction.
