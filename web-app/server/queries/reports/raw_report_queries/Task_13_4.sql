-- The CASE statement restricts COUNT to only count households which are off-the-grid
-- SELECT household_type, COUNT(CASE WHEN householdId NOT IN (SELECT householdID FROM PublicUtilityLinkage) THEN 1 ELSE NULL END) AS num_off_the_grid
-- FROM Household h
-- GROUP BY h.household_type;

SELECT householdTypes.household_type, CONCAT(ROUND(householdTypes.household_count, 1), '%') AS household_count
FROM (
    SELECT household_type, COUNT(household_type) * 100.0 / SUM(COUNT(household_type)) OVER () AS household_count
    FROM household
    WHERE household.householdID NOT IN (SELECT householdID FROM PublicUtilityLinkage)
    GROUP BY household_type
    UNION ALL
    SELECT t.household_type, 0 AS household_count
    FROM (
        SELECT 'House' AS household_type UNION ALL
        SELECT 'Apartment' UNION ALL
        SELECT 'Townhome' UNION ALL
        SELECT 'Condominium' UNION ALL
        SELECT 'Modular home' UNION ALL
        SELECT 'Tiny house'
    ) AS t
    WHERE t.household_type NOT IN (
        SELECT household_type
        FROM household
        WHERE household.householdID NOT IN (SELECT householdID FROM PublicUtilityLinkage)
        GROUP BY household_type
    )
    ORDER BY household_count DESC
) AS householdTypes;