SELECT
     pc.State	 											AS State
    ,COALESCE(ROUND(AVG(wh.tank_size),0),0)							AS Average_Tank_Size
    ,COALESCE(ROUND(AVG(app.btu_rating),0),0)						AS Average_BTU
    ,COALESCE(ROUND(AVG(wh.temp_setting),1),0)						AS Average_Temperature_Setting
    ,SUM(CASE
		WHEN wh.temp_setting IS NOT NULL and app.householdID IS NOT NULL THEN 1
		ELSE 0
	 END) 													AS Count_With_Temperature_Settings
    ,SUM(CASE
		WHEN wh.temp_setting IS NULL and app.householdID IS NOT NULL THEN 1
		ELSE 0
	 END) 													AS Count_Without_Temperature_Settings
FROM
    PostalCode pc
LEFT JOIN HouseHold hh 
	ON hh.postalCode = pc.postalCode
LEFT JOIN Appliance app
	ON hh.householdID = app.householdID
LEFT JOIN WaterHeater wh
	ON app.householdID = wh.householdID
    AND app.applianceID = wh.applianceID
GROUP BY
    pc.State
ORDER BY
	pc.State ASC;