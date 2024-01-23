SELECT COALESCE(round(on_the_grid_avg_waterheater_size,1), 0) as avg_on_grid_water_heater_size, 
COALESCE(round(off_the_grid_avg_waterheater_size,1), 0) as avg_off_grid_water_heater_size
FROM 
(
SELECT AVG(wh.tank_size) AS on_the_grid_avg_waterheater_size
FROM WaterHeater wh, Household h
WHERE wh.householdID = h.householdID
AND wh.householdID IN (SELECT householdID FROM PublicUtilityLinkage)
) ongrid,
(
SELECT AVG(wh.tank_size) AS off_the_grid_avg_waterheater_size
FROM WaterHeater wh, Household h
WHERE wh.householdID = h.householdID
AND wh.householdID NOT IN (SELECT householdID FROM PublicUtilityLinkage)
) offgrid