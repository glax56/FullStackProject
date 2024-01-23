USE alternakraft;
    
-- Insert sample data into Household table
INSERT INTO Household (householdID, email, postalCode, household_type, square_footage, heating, cooling)
VALUES
    (1, 'email1@example.com', '19193', 'House', 1900, 69, 75),
    (2, 'email2@example.com', '19192', 'Apartment', 800, 68, 74),
    (3, 'email3@example.com', '08505', 'Townhome', 1200, 72, 77),
    (4, 'email4@example.com', '08076', 'Condominium', 900, 70, 72),
    (5, 'email5@example.com', '08073', 'House', 1776, 70, 71),
    
    -- Trying to make 6-10 all off the grid
    (6, 'email6@example.com', '19193', 'House', 1900, 69, 72),
    (7, 'email7@example.com', '19192', 'House', 800, 68, 71),
    (8, 'email8@example.com', '08505', 'House', 1200, 72, 73),
    (9, 'email9@example.com', '08076', 'House', 20000, 75, 70),
    (10, 'email10@example.com', '08073', 'House', 1776, 74, 70);
-- Insert sample data into PublicUtilityLinkage table
INSERT INTO PublicUtilityLinkage (householdID, public_utility_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 4),
    (3, 1),
    (3, 2),
    (3, 3),
    (4, 1),
    (4, 3),
    (5, 2),
    (5, 4);
    
-- Insert sample data into Appliance table
INSERT INTO Appliance (householdID, applianceID, applianceType, manufacturerID, model_name, btu_rating)
VALUES
    (1, 1, 'Air handler', 1, 'Model 1', 5000),
    (1, 2, 'Water heater', 2, 'Model 2', 8000),
    (2, 1, 'Air handler', 3, 'Model 3', 3000),
    (2, 2, 'Air handler', 1, 'Model 4', 6000),
    (3, 1, 'Water heater', 2, 'Model 5', 7000),
    (3, 2, 'Air handler', 3, 'Model 3', 3600),
    (4, 1, 'Water heater', 3, 'Model 6', 4000),
    (5, 1, 'Air handler', 3, 'Model 1', 3000),
    (8, 1, 'Water heater', 1, 'Model 2', 2900),
    (10, 1, 'Air handler', 2, 'Model 1', 5000);
    
-- Insert sample data into WaterHeater table
INSERT INTO WaterHeater (householdID, applianceID, energy_source, tank_size, temp_setting)
VALUES
    (1, 2, 'Electric', 50.0, 120),
    (3, 1, 'Gas', 40.0, 130),
    (4, 1, 'Electric', 60.0, 45),
    (8, 1, 'Gas', 43.6, 72);
    
-- Insert sample data into AirHandler table
INSERT INTO AirHandler (householdID, applianceID, rpm)
VALUES
    (1, 1, 2000),
    (2, 1, 1800),
    (2, 2, 2200),
    (3, 2, 5000),
    (5, 1, 1776),
    (10, 1, 1998);
    
-- Insert sample data into AirConditioner table
INSERT INTO AirConditioner (householdID, applianceID, eer)
VALUES
    (1, 1, 12.0),
    (2, 1, 14.5);

-- Insert sample data into Heater table
INSERT INTO Heater (householdID, applianceID, source)
VALUES
    (2, 2, 'Gas'),
    (3, 2, 'Electric');
    
-- Insert sample data into HeatPump table
INSERT INTO HeatPump (householdID, applianceID, seer, hspf)
VALUES
    (5, 1, 16.5, 9.0),
    (10, 1, 17.8, 9.4);
    
-- Insert sample data into PowerGenerator table
INSERT INTO PowerGenerator (householdID, powerGeneratorID, generatorTypeID, monthly_kilowatt, battery_storage)
VALUES
    (1, 1, 1, 300, NULL), -- On-the-grid can have power generator, too
    (6, 1, 1, 500, NULL),
    (7, 1, 2, 300, 200),
    (7, 2, 2, 350, 150),
    (8, 1, 1, 800, 125),
    (9, 1, 1, 150, NULL), -- Household 9 has both Solar and Wind-turbine
    (9, 2, 2, 755, 325),
    (10, 1, 1, 800, 490);