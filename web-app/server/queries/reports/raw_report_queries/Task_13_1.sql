SELECT 
	pc.state 						AS State
    ,COUNT(*) 						AS OffGridHouseholds 
    ,ROUND(AVG(pg.battery_storage)) AS AverageBatteryStorage
FROM Household h
JOIN PostalCode pc
	ON h.postalCode = pc.postalCode
JOIN PowerGenerator pg 
	ON h.householdID = pg.householdID
LEFT JOIN publicutilitylinkage pul
	ON h.householdID = pul.householdID
WHERE 
	pul.householdID IS NULL -- off-the-grid check
GROUP BY 
	pc.state
ORDER BY OffGridHouseholds DESC
LIMIT 1;