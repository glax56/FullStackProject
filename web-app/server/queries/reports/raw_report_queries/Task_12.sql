SELECT
     MIN(wh.tank_size) 				AS MinTankSize
    ,MAX(wh.tank_size) 				AS MaxTankSize
    ,ROUND(AVG(wh.tank_size),2) 	AS AvgTankSize
    ,MIN(wh.temp_setting) 			AS MinTempSetting
    ,MAX(wh.temp_setting) 			AS MaxTempSetting
	,ROUND(AVG(wh.temp_setting),2) 	AS AvgTempSetting
FROM
    WaterHeater wh
JOIN Appliance app
	ON wh.householdID = app.householdID
    AND wh.applianceID = app.applianceID
JOIN Household hh
    ON app.householdID = hh.householdID
JOIN PostalCode pc
    ON hh.postalCode = pc.postalCode
    AND pc.state = '$State';