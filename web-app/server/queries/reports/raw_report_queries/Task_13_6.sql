SELECT
	ApplianceTypes.applianceType AS ApplianceType
	,ROUND(MIN(COALESCE(app.btu_rating, 0)) ,0) AS MinBTU
	,ROUND(MAX(COALESCE(app.btu_rating, 0)) ,0) AS MaxBTU
	,ROUND(COALESCE(AVG(app.btu_rating), 0),0) AS AvgBTU
FROM (
SELECT 'Air handler' AS applianceType
UNION ALL
SELECT 'Water heater'
) ApplianceTypes
LEFT JOIN Appliance app ON app.applianceType = ApplianceTypes.applianceType
LEFT JOIN Household hh ON app.householdID = hh.householdID
LEFT JOIN publicutilitylinkage pul ON hh.householdID = pul.householdID
WHERE pul.householdID IS NULL 
GROUP BY ApplianceTypes.applianceType;