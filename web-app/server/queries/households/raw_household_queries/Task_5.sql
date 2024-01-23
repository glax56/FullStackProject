--Off-the-Grid Check
-- SELECT householdID 
-- FROM Household
-- WHERE '$householdID' NOT IN (SELECT householdID FROM PublicUtilityLinkage);
SELECT public_utility_id FROM PublicUtilityLinkage where householdID=${householdID};

-- Get Power Generator Types
SELECT generatorTypeID, generator_type
FROM PowerGeneratorType;

-- Insert new powergenerator into table
INSERT INTO PowerGenerator (householdID, powerGeneratorID, generatorTypeID, monthly_kilowatt, battery_storage)
VALUES ('$householdID', '$powerGeneratorID', '$generatorTypeID', '$monthly_kilowatt', '$battery_storage');