SELECT  a.applianceID, a.applianceType, m.manufacturer_name, a.model_name 
	FROM Appliance AS a
    INNER JOIN Manufacturer AS m ON a.manufacturerID = m.manufacturerID
	WHERE a.householdID = $householdID;

SELECT householdID 
	FROM PublicUtilityLinkage
	WHERE householdID = $householdID
