WITH HAV
AS
(SELECT
     T4.SecondPostal
FROM (
    SELECT
         T3.MainPostal
        ,T3.SecondPostal
        ,3958.75 * T3.c as Distance
        ,T3.DistanceVariable
    FROM (
        SELECT
             T2.MainPostal
            ,T2.SecondPostal
            ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c
            ,T2.DistanceVariable
        FROM (
            SELECT
                 T1.MainPostal
                ,T1.SecondPostal
                ,SIN(RADIANS(T1.DeltaLat) / 2) * 
				 SIN(RADIANS(T1.DeltaLat) / 2) + 
				 COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * 
				 SIN(RADIANS(T1.DeltaLon) / 2) * 
				 SIN(RADIANS(T1.DeltaLon) / 2) AS a
				,T1.DistanceVariable
            FROM
                (SELECT
                     p1.PostalCode 							AS MainPostal
                    ,p2.PostalCode 							AS SecondPostal
                    ,p1.latitude 							AS lat1
                    ,p2.latitude 							AS lat2
                    ,p2.latitude-p1.latitude 				AS DeltaLat
                    ,p1.longitude 							AS lon1
                    ,p2.longitude 							AS lon2
                    ,p2.longitude-p1.longitude 				AS DeltaLon
                    ,$Distance 								AS DistanceVariable
                FROM PostalCode p1
                CROSS JOIN PostalCode p2
                    ON p2.PostalCode != p1.PostalCode
                    AND p1.PostalCode = $PostalCode
                    
				UNION
                
                SELECT
                     p1.PostalCode 				AS MainPostal
                    ,p1.PostalCode 				AS SecondPostal
                    ,p1.latitude 				AS lat1
                    ,p1.latitude 				AS lat2
                    ,p1.latitude-p1.latitude 	AS DeltaLat
                    ,p1.longitude 				AS lon1
                    ,p1.longitude 				AS lon2
                    ,p1.longitude-p1.longitude 	AS DeltaLon
                    ,0 							AS DistanceVariable
                FROM PostalCode p1
				WHERE p1.PostalCode = $PostalCode
                )AS T1
            )AS T2
        )AS T3
)AS T4
WHERE Distance <= T4.DistanceVariable
)
-- Average monthly power generation per household (as a whole number, rounded)
SELECT ROUND(AVG(pg_per_household), 0) AS avg_monthly_power_gen_per_household
FROM 
(
SELECT SUM(pg.monthly_kilowatt) AS pg_per_household
FROM Household h, HAV hav, PowerGenerator pg 
WHERE h.postalCode = hav.SecondPostal
AND h.householdID = pg.householdID
GROUP BY h.householdID
) f;
