-- List househould powergeneration
SELECT PG.powerGeneratorID, PGT.generator_type, PG.monthly_kilowatt, PG.battery_storage
FROM PowerGenerator PG
JOIN PowerGeneratorType PGT ON PG.generatorTypeID = PGT.generatorTypeID
WHERE PG.householdID = '$householdID';