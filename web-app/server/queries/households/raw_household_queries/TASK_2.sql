SELECT manufacturerID, manufacturer_name FROM Manufacturer;

INSERT INTO Appliance(householdID, applianceID, applianceType, manufacturerID, model_name, btu_rating)
	VALUES($householdID, $applianceID, $applianceType, $manufacturerID, $model_name, $btu_rating);

INSERT INTO AirHandler(HouseholdID, applianceID, rpm)
	VALUES($HouseholdID, $applianceID, $rpm);

INSERT INTO WaterHeater(householdID, applianceID, energy_source, tank_size, temp_setting)
	VALUES($householdID, $applianceID, $energy_source, tank_size, temp_setting);

INSERT INTO AirConditioner(householdID, applianceID, eer)
	VALUES($householdID, $applianceID, $eer);

INSERT INTO Heater(householdID, applianceID, source)
	VALUES($householdID, $applianceID, $source);

INSERT INTO HeatPump(householdID, applianceID, seer, hspf)
	VALUES($householdID, $applianceID, $seer, $hspf)

