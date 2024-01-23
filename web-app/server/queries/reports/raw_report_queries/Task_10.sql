-- AirConditioners
WITH hh_types AS (
SELECT 1 AS hh_type_id, 'Apartment' AS htype
UNION ALL
SELECT 2, 'Condo'
UNION ALL
SELECT 3, 'House'
UNION ALL
SELECT 4, 'Townhome'
UNION ALL
SELECT 5, 'Modular Home'
UNION ALL
SELECT 6, 'Tiny House')
SELECT
    DISTINCT ht.htype		        			AS HouseHoldType
    ,COUNT(app.applianceID)         			AS TotalAirConditioners
    ,COALESCE(ROUND(AVG(app.btu_rating),0),0) 	AS Average_BTU
    ,COALESCE(ROUND(AVG(ah.rpm),1),0) 			AS Average_RPM
    ,COALESCE(ROUND(AVG(ac.eer),1),0) 			AS Average_EER
FROM
	hh_types ht
LEFT JOIN Household hh
	ON ht.htype = hh.household_type
LEFT JOIN Appliance app
    ON hh.householdID = app.householdID
LEFT JOIN AirHandler ah 
    ON ah.householdID = app.householdID 
    AND ah.applianceID = app.applianceID
LEFT JOIN AirConditioner ac 
    ON ac.householdID = app.householdID 
    AND ac.applianceID = app.applianceID
GROUP BY
    ht.htype
ORDER BY ht.htype ASC;

#---------------------Heaters--------------------------------------
WITH hh_types AS (
SELECT 1 AS hh_type_id, 'Apartment' AS htype
UNION ALL
SELECT 2, 'Condo'
UNION ALL
SELECT 3, 'House'
UNION ALL
SELECT 4, 'Townhome'
UNION ALL
SELECT 5, 'Modular Home'
UNION ALL
SELECT 6, 'Tiny House')
SELECT
	ht.htype		        					AS HouseHoldType
	,COUNT(h.applianceID)	        			AS Total_Heaters
	,COALESCE(ROUND(AVG(app.btu_rating),0),0)	AS Average_BTU
	,COALESCE(ROUND(AVG(ah.rpm),1),0)  			AS Average_RPM
	,CASE
		WHEN stc.source IS NULL THEN 'N/A'
		ELSE stc.source
	END AS Most_Used_Energy_Source
FROM
	hh_types ht
LEFT JOIN Household hh
	ON ht.htype = hh.household_type
LEFT JOIN Appliance app
    ON hh.householdID = app.householdID
LEFT JOIN AirHandler ah
    ON ah.householdID = app.householdID 
    AND ah.applianceID = app.applianceID   
LEFT JOIN Heater h
    ON h.householdID = ah.householdID 
    AND h.applianceID = ah.applianceID   
LEFT JOIN
	(
	SELECT
		t1.household_type,
		t1.source,
		t1.source_type_count,
		t1.R
	FROM (
		SELECT
			h.household_type,
			t.source,
			COUNT(t.source) AS source_type_count,
			ROW_NUMBER() OVER (PARTITION BY h.household_type ORDER BY COUNT(t.source) DESC) AS R
		FROM 
			Household h
		LEFT JOIN Appliance a 
			ON h.householdid = a.householdid
		LEFT JOIN Heater t 
			ON t.householdID = a.householdID
			AND t.applianceid = a.applianceid
		GROUP BY
			h.household_type,
			t.source) t1
	) AS stc
ON ht.htype = stc.household_type 
AND stc.R = 1
GROUP BY ht.htype, stc.source;

#-----------------------HeatPumps------------------------------------
WITH hh_types AS (
SELECT 1 AS hh_type_id, 'Apartment' AS htype
UNION ALL
SELECT 2, 'Condo'
UNION ALL
SELECT 3, 'House'
UNION ALL
SELECT 4, 'Townhome'
UNION ALL
SELECT 5, 'Modular Home'
UNION ALL
SELECT 6, 'Tiny House')
SELECT
	DISTINCT ht.htype		   					AS HouseHoldType
	,COALESCE(COUNT(app.applianceID),0)			AS TotalHeatPumps
	,COALESCE(ROUND(AVG(app.btu_rating),0),0)	AS Average_BTU
	,COALESCE(ROUND(AVG(ah.rpm),1),0)			AS Average_RPM
	,COALESCE(ROUND(AVG(hp.seer),1),0)			AS Average_SEER
	,COALESCE(ROUND(AVG(hp.hspf),1),0) 			AS Average_HPSF
FROM
	hh_types ht
LEFT JOIN Household hh
	ON ht.htype = hh.household_type
LEFT JOIN Appliance app
    ON hh.householdID = app.applianceID
LEFT JOIN AirHandler ah 
    ON ah.householdID = app.householdID 
    AND ah.applianceID = app.applianceID
LEFT JOIN HeatPump hp 
    ON hp.householdID = app.householdID 
    AND hp.applianceID = app.applianceID
GROUP BY 
	ht.htype
ORDER BY
	ht.htype;