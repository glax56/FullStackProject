-- Delete instance of househould powergeneration
DELETE 
FROM PowerGenerator
WHERE householdID = '$householdID' and powerGeneratorID = '$powerGeneratorID';
