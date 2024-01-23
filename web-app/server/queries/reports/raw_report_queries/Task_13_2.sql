-- Get avaerage battery stroage per battery for all off-grid-households
select COALESCE(round(avg(battery_storage),0), 0) from  PowerGenerator
where  PowerGenerator.householdID not in (select householdID from PublicUtilityLinkage);

-- SELECT 
-- 	pgt.generator_type 						AS GeneratorType
--     ,COUNT(*) 								AS OffGridHouseholds
--     ,ROUND(SUM(pg.battery_storage)/
-- 		(SELECT SUM(pg2.battery_storage)
--         FROM PowerGenerator pg2) * 100,2) 	AS ProportionOfBatteryStorage
-- FROM Household h
-- JOIN PowerGenerator pg 
-- 	ON h.householdID = pg.householdID
-- JOIN powergeneratortype pgt 
-- 	ON  pg.generatorTypeID = pgt.generatorTypeID
-- LEFT JOIN publicutilitylinkage pul
-- 	ON h.householdID = pul.householdID
-- WHERE 
-- 	pul.householdID IS NULL 
-- GROUP BY 
-- 	pgt.generator_type
-- ORDER BY OffGridHouseholds DESC;