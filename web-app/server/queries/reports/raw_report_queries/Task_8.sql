SELECT
     m.manufacturer_name		AS Manufacturer
    ,COUNT(app.applianceID) 	AS TotalAppliances
FROM
    Manufacturer m
JOIN Appliance app
	ON m.manufacturerID = app.manufacturerID
GROUP BY
    m.manufacturer_name
ORDER BY
    TotalAppliances DESC
LIMIT 25;

SELECT
     a.appType	AS ApplianceType
	,SUM(CASE
		WHEN app.ApplianceType IS NOT NULL THEN 1
        ELSE 0
	 END) 		AS TotalAppliances
FROM
    Manufacturer m
CROSS JOIN
    (SELECT 'AirHandler' AS appType
     UNION
     SELECT 'WaterHeater' AS appType) a
LEFT JOIN Appliance app 
	ON m.manufacturerID = app.manufacturerID 
    AND a.appType = app.applianceType
WHERE m.manufacturer_name = '$Manufacturer_Name'
GROUP BY
	a.appType;