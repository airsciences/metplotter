```sql
SELECT s1.datetime, s1.ws_1, s1.ws_max_1, s1.ws_min_1, s2.ws_2,
s2.ws_max_2, s2.ws_min_2
FROM (
    SELECT datetime, windspeed as ws_1, windspeed_max as ws_max_1,
    windspeed_min as ws_min_1
    FROM data
    WHERE datetime BETWEEN '2015-01-01 00:00:00' AND '2015-02-01 00:00:00'
    AND station_id = 1
) s1
LEFT JOIN (
    SELECT datetime, windspeed as ws_2, windspeed_max as ws_max_2,
    windspeed_min as ws_min_2
    FROM data
    WHERE datetime BETWEEN '2015-01-01 00:00:00' AND '2015-02-01 00:00:00'
    AND station_id = 2
) s2 ON(s1.datetime = s2.datetime)
ORDER BY datetime
```
