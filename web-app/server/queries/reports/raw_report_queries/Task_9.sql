SELECT DISTINCT m.manufacturer_name AS Manufacturer, app.model_name AS Model 
FROM Manufacturer m 
JOIN Appliance app ON m.manufacturerID = app.manufacturerID 
WHERE m.manufacturer_name 
LIKE '%${keyword}%' OR app.model_name LIKE '%${keyword}%'
ORDER BY m.manufacturer_name, app.model_name