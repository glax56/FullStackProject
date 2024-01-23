-- (Just for our reference - this is how to find off-the-grid households )
-- SELECT householdId 
-- FROM Household
-- WHERE householdId NOT IN (SELECT householdID FROM PublicUtilityLinkage);

SELECT 
CASE WHEN count_solar = 0 THEN '0.0%' ELSE CONCAT(ROUND(100 * count_solar / (count_solar + count_windturbine + count_mixed), 1), '%') END AS Solar,
CASE WHEN count_windturbine = 0 THEN '0.0%' ELSE CONCAT(ROUND(100 * count_windturbine / (count_solar + count_windturbine + count_mixed), 1), '%') END AS Windturbine,
CASE WHEN count_mixed = 0 THEN '0.0%' ELSE CONCAT(ROUND(100 * count_mixed / (count_solar + count_windturbine + count_mixed), 1), '%') END AS Mixed
FROM 
(
-- Exclusively solar 
SELECT COUNT(DISTINCT pg.householdID) AS count_solar
FROM PowerGenerator pg, Household h
WHERE pg.householdId = h.householdId 
AND pg.householdId NOT IN (SELECT householdID FROM PublicUtilityLinkage) -- Off the Grid
AND pg.householdId IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID = 1) -- Solar
AND pg.householdId NOT IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID != 1) -- Doesn't have any other type of Power Gen besides Solar
) s,
(
-- Only Wind-turbine
SELECT COUNT(DISTINCT pg.householdID) AS count_windturbine
FROM PowerGenerator pg, Household h
WHERE pg.householdId = h.householdId 
AND pg.householdId NOT IN (SELECT householdID FROM PublicUtilityLinkage) -- Off the Grid
AND pg.householdId IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID = 2) -- Wind-turbine
AND pg.householdId NOT IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID != 2) -- Doesn't have any other type of Power Gen besides Wind-turbine
) wt,
(
-- BOTH Solar and Wind Turbine
SELECT COUNT(DISTINCT pg.householdID) AS count_mixed
FROM PowerGenerator pg, Household h
WHERE pg.householdId = h.householdId 
AND pg.householdId NOT IN (SELECT householdID FROM PublicUtilityLinkage) -- Off the Grid
AND pg.householdId IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID = 1) -- Solar
AND pg.householdId IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID = 2) -- Wind-turbine
) m