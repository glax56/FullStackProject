const connection = require("../../config/db");
const { cleanQuery } = require("../../utils/cleanSqlQueries");

// select count of provided postalCode
const selectCountOfProvidedPostalCode = (postalCode) => {
  //Query
  let query = `SELECT COUNT(*) AS count FROM PostalCode  WHERE postalCode=${postalCode}`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Select 25 top manufacturer
const selectTop25Manufacturer = () => {
  //Query
  let query = `SELECT m.manufacturer_name AS Manufacturer
              ,COUNT(app.applianceID) AS TotalAppliances
              FROM
              Manufacturer m
              JOIN Appliance app
              ON m.manufacturerID = app.manufacturerID
              GROUP BY m.manufacturer_name
              ORDER BY TotalAppliances DESC
              LIMIT 25;`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Select appliances and appliance count for a manufacturer
const selectAppliancesForGivenManufacturer = (manufacturer) => {
  //Query
  let query = `SELECT a.appType	AS ApplianceType
              ,SUM(CASE
                  WHEN app.ApplianceType IS NOT NULL THEN 1
                  ELSE 0
                END) AS TotalAppliances
              FROM
              Manufacturer m
              CROSS JOIN
              (SELECT 'Air handler' AS appType
               UNION
              SELECT 'Water heater' AS appType) a
              LEFT JOIN Appliance app 
              ON m.manufacturerID = app.manufacturerID 
              AND a.appType = app.applianceType
              WHERE m.manufacturer_name = "${manufacturer}"
              GROUP BY a.appType;`;
  //query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Select appliances and appliance count for a manufacturer
const selectMatchingModelAndManufacturer = (keyword) => {
  //Query
  let query = `SELECT DISTINCT m.manufacturer_name AS Manufacturer, app.model_name AS Model 
  FROM Manufacturer m 
  JOIN Appliance app ON m.manufacturerID = app.manufacturerID 
  WHERE m.manufacturer_name 
  LIKE '%${keyword}%' OR app.model_name LIKE '%${keyword}%'
  ORDER BY m.manufacturer_name, app.model_name`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Select AC stat
const selectAcStat = () => {
  //Query
  let query = `WITH hh_types AS (
                SELECT 1 AS hh_type_id, 'Apartment' AS htype
                UNION ALL
                SELECT 2, 'Condominium'
                UNION ALL
                SELECT 3, 'House'
                UNION ALL
                SELECT 4, 'Townhome'
                UNION ALL
                SELECT 5, 'Modular home'
                UNION ALL
                SELECT 6, 'Tiny house'
              ),
              ac_sub as ( 
              SELECT DISTINCT ht.htype AS HouseHoldType
              ,COUNT(app.applianceID) AS TotalAirConditioners
              ,COALESCE(ROUND(AVG(app.btu_rating),0),0) AS Average_BTU
              ,COALESCE(ROUND(AVG(ah.rpm),1),0) AS Average_RPM
              ,COALESCE(ROUND(AVG(ac.eer),1),0) AS Average_EER
              FROM
              hh_types ht
              LEFT JOIN Household hh
              ON ht.htype = hh.household_type
              LEFT JOIN Appliance app
              ON hh.householdID = app.householdID
              LEFT JOIN AirHandler ah 
              ON ah.householdID = app.householdID 
              AND ah.applianceID = app.applianceID
              LEFT JOIN AirConditioner ac 
              ON ac.householdID = app.householdID 
              AND ac.applianceID = app.applianceID
              WHERE ac.householdID IS NOT NULL
              GROUP BY ht.htype
              ORDER BY ht.htype ASC)
              SELECT  DISTINCT ht.htype AS HouseHoldType,
              ac.TotalAirConditioners,
              ac.Average_BTU, 
              ac.Average_RPM,
              ac.Average_EER
              FROM hh_types ht
              LEFT JOIN ac_sub ac ON ht.htype = ac.HouseHoldType
              ORDER BY ht.htype;`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Select heater stat
const selectHeaterStat = () => {
  //Query
  let query = `WITH hh_types AS (
                SELECT 1 AS hh_type_id, 'Apartment' AS htype
                UNION ALL
                SELECT 2, 'Condominium'
                UNION ALL
                SELECT 3, 'House'
                UNION ALL
                SELECT 4, 'Townhome'
                UNION ALL
                SELECT 5, 'Modular home'
                UNION ALL
                SELECT 6, 'Tiny house'
              ),
            heater_sub as ( SELECT ht.htype AS HouseHoldType
              ,COUNT(h.applianceID) AS Total_Heaters
              ,COALESCE(ROUND(AVG(app.btu_rating),0),0)	AS Average_BTU
              ,COALESCE(ROUND(AVG(ah.rpm),1),0) AS Average_RPM
              ,CASE
                WHEN stc.source IS NULL THEN 'N/A'
                ELSE stc.source
              END AS Most_Used_Energy_Source
              FROM
              hh_types ht
              LEFT JOIN Household hh
              ON ht.htype = hh.household_type
              LEFT JOIN Appliance app
              ON hh.householdID = app.householdID
              LEFT JOIN AirHandler ah
              ON ah.householdID = app.householdID 
              AND ah.applianceID = app.applianceID   
              LEFT JOIN Heater h
              ON h.householdID = ah.householdID 
              AND h.applianceID = ah.applianceID   
              LEFT JOIN
                (
                SELECT
                t1.household_type,
                t1.source,
                t1.source_type_count,
                t1.R
                FROM (
                  SELECT
                  hh.household_type,
                  t.source,
                  COUNT(t.source) AS source_type_count,
                  ROW_NUMBER() OVER (PARTITION BY hh.household_type ORDER BY COUNT(t.source) DESC) AS R
                  FROM 
                  Household hh
                  LEFT JOIN Appliance a 
                  ON hh.householdid = a.householdid
                  LEFT JOIN Heater t 
                  ON t.householdID = a.householdID
                  AND t.applianceid = a.applianceid
                  where t.applianceid IS NOT NULL
                  GROUP BY hh.household_type, t.source) t1
                ) AS stc
              ON ht.htype = stc.household_type 
              AND stc.R = 1
              where h.applianceID is not null
              GROUP BY ht.htype, stc.source
              ORDER BY ht.htype ASC)
            SELECT ht.htype AS HouseHoldType,
            hs.Total_Heaters,
            hs.Average_BTU,
            hs.Average_RPM,
            hs.Most_Used_Energy_Source
            FROM hh_types ht
            LEFT JOIN heater_sub hs ON ht.htype = hs.HouseHoldType
            ORDER BY ht.htype`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Select heat pump stat
const selectHeatPumpStat = () => {
  //Query
  let query = `WITH hh_types AS (
                                SELECT 1 AS hh_type_id, 'Apartment' AS htype
                                UNION ALL
                                SELECT 2, 'Condominium'
                                UNION ALL
                                SELECT 3, 'House'
                                UNION ALL
                                SELECT 4, 'Townhome'
                                UNION ALL
                                SELECT 5, 'Modular home'
                                UNION ALL
                                SELECT 6, 'Tiny house'
                              ),
                            heat_pump_sub as (
                              SELECT DISTINCT ht.htype AS HouseHoldType
                              ,COALESCE(COUNT(hp.applianceID),0) AS TotalHeatPumps
                              ,COALESCE(ROUND(AVG(app.btu_rating),0),0)	AS Average_BTU
                              ,COALESCE(ROUND(AVG(ah.rpm),1),0) AS Average_RPM
                              ,COALESCE(ROUND(AVG(hp.seer),1),0) AS Average_SEER
                              ,COALESCE(ROUND(AVG(hp.hspf),1),0) AS Average_HPSF
                              FROM
                              hh_types ht
                              LEFT JOIN Household hh
                              ON ht.htype = hh.household_type
                              LEFT JOIN Appliance app
                              ON hh.householdID = app.householdID
                              LEFT JOIN AirHandler ah 
                              ON ah.householdID = app.householdID 
                              AND ah.applianceID = app.applianceID
                              LEFT JOIN HeatPump hp 
                              ON hp.householdID = app.householdID 
                              AND hp.applianceID = app.applianceID
                              where hp.applianceID is not null
                              GROUP BY ht.htype
                              ORDER BY ht.htype
                              )
                            SELECT  DISTINCT ht.htype AS HouseHoldType,
                            hps.TotalHeatPumps,
                            hps.Average_BTU, 
                            hps.Average_RPM,
                            hps.Average_SEER,
                            hps.Average_HPSF
                            FROM hh_types ht
                            LEFT JOIN heat_pump_sub hps ON ht.htype = hps.HouseHoldType
                            ORDER BY ht.htype`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Select water heater grouped by state
const selectWaterHeaterByState = () => {
  //Query
  let query = `SELECT pc.State AS State
              ,ROUND(AVG(wh.tank_size),0) AS Average_Tank_Size
              ,ROUND(AVG(app.btu_rating),0) AS Average_BTU
              ,ROUND(AVG(wh.temp_setting),1) AS Average_Temperature_Setting
              ,SUM(CASE
                WHEN wh.temp_setting IS NOT NULL and app.householdID IS NOT NULL THEN 1
                ELSE null
              END) AS Count_With_Temperature_Settings
              ,SUM(CASE
                WHEN wh.temp_setting IS NULL and app.householdID IS NOT NULL THEN 1
                ELSE null
              END) AS Count_Without_Temperature_Settings
              FROM PostalCode pc
              LEFT JOIN HouseHold hh 
              ON hh.postalCode = pc.postalCode
              LEFT JOIN Appliance app
              ON hh.householdID = app.householdID
              LEFT JOIN WaterHeater wh
              ON app.householdID = wh.householdID
              AND app.applianceID = wh.applianceID
              GROUP BY pc.State
              ORDER BY pc.State ASC;`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Select water heater stat for specified state
const selectWaterHeaterStateForSingleState = (state) => {
  //Query
  let query = `WITH EnergySources AS (
    SELECT 'Electric' AS energy_source
    UNION ALL
    SELECT 'Gas' AS energy_source
    UNION ALL
    SELECT 'Fuel oil' AS energy_source
    UNION ALL
    SELECT 'Heat pump' AS energy_source
    ),
    sub AS 
    (
      SELECT wh.energy_source, wh.tank_size, wh.temp_setting
      FROM WaterHeater wh, Household hh, PostalCode pc
      WHERE wh.householdID = hh.householdID
      AND hh.postalCode = pc.postalCode
      AND pc.state = "${state}"
  )
    SELECT es.energy_source AS EnergySource,
          ROUND(MIN(sub.tank_size), 0) AS MinTankSize ,
          ROUND(MAX(sub.tank_size), 0) AS MaxTankSize ,
          ROUND(AVG(sub.tank_size),0) AS AvgTankSize ,
          MIN(sub.temp_setting) AS MinTempSetting ,
          MAX(sub.temp_setting) AS MaxTempSetting ,
          ROUND(AVG(sub.temp_setting),1) AS AvgTempSetting 
          FROM EnergySources es
          LEFT JOIN sub sub ON sub.energy_source = es.energy_source
          GROUP BY es.energy_source
          ORDER BY es.energy_source ASC
  
   `;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// State with most off-grid household -TASK -  13.1
const selectStateWithMostOffGridHouseholds = () => {
  //Query
  let query = `SELECT 
                pc.state AS State
                  ,COUNT(*) AS OffGridHouseholds 
              FROM Household h
              JOIN PostalCode pc
                ON h.postalCode = pc.postalCode
              LEFT JOIN publicutilitylinkage pul
                ON h.householdID = pul.householdID
              WHERE pul.householdID IS NULL
              GROUP BY pc.state
              ORDER BY OffGridHouseholds DESC LIMIT 1;`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Offgrid avg battery storage capacity - TASK 13.2
const selectOffGridAvgBatteryStorageCapacity = () => {
  //Query
  let query = `SELECT COALESCE(ROUND(avg(battery_storage),0), 0) AS average_battery_storage FROM  PowerGenerator 
               WHERE  PowerGenerator.householdID NOT IN (SELECT householdID FROM PublicUtilityLinkage);`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Offgrid power generation type stat - TASK 13.3
const selectOffgridPowerGenerationTypeStat = () => {
  //Query
  let query = `SELECT 
                CASE WHEN count_solar = 0 THEN '0.0%' ELSE CONCAT(ROUND(100 * count_solar / (count_solar + count_windturbine + count_mixed), 1), '%') END AS Solar,
                CASE WHEN count_windturbine = 0 THEN '0.0%' ELSE CONCAT(ROUND(100 * count_windturbine / (count_solar + count_windturbine + count_mixed), 1), '%') END AS Windturbine,
                CASE WHEN count_mixed = 0 THEN '0.0%' ELSE CONCAT(ROUND(100 * count_mixed / (count_solar + count_windturbine + count_mixed), 1), '%') END AS Mixed
                FROM 
                (
                SELECT COUNT(DISTINCT pg.householdID) AS count_solar
                FROM PowerGenerator pg, Household h
                WHERE pg.householdId = h.householdId 
                AND pg.householdId NOT IN (SELECT householdID FROM PublicUtilityLinkage)
                AND pg.householdId IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID = 1)
                AND pg.householdId NOT IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID != 1)
                ) s,
                (
                SELECT COUNT(DISTINCT pg.householdID) AS count_windturbine
                FROM PowerGenerator pg, Household h
                WHERE pg.householdId = h.householdId 
                AND pg.householdId NOT IN (SELECT householdID FROM PublicUtilityLinkage)
                AND pg.householdId IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID = 2)
                AND pg.householdId NOT IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID != 2)
                ) wt,
                (
                SELECT COUNT(DISTINCT pg.householdID) AS count_mixed
                FROM PowerGenerator pg, Household h
                WHERE pg.householdId = h.householdId 
                AND pg.householdId NOT IN (SELECT householdID FROM PublicUtilityLinkage)
                AND pg.householdId IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID = 1)
                AND pg.householdId IN (SELECT householdID FROM PowerGenerator WHERE generatorTypeID = 2)
                ) m`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//select off the grid household count by household type - TASK 13.4
const selectOffTheGridHouseholdCountByHouseholdType = () => {
  //Query
  let query = `SELECT householdTypes.household_type, CONCAT(ROUND(householdTypes.household_count, 1), '%') AS household_count
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
                ) AS householdTypes;`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// select average tank size for all of-the-grid and on-the-grid properties - // 13.5
const selectAvgWaterHeaterTankSizeByOffTheGridFlag = () => {
  //Query
  let query = `SELECT COALESCE(round(on_the_grid_avg_waterheater_size,1), 0) as avg_on_grid_water_heater_size, 
              COALESCE(round(off_the_grid_avg_waterheater_size,1), 0) as avg_off_grid_water_heater_size
              FROM 
              (
              SELECT AVG(wh.tank_size) AS on_the_grid_avg_waterheater_size
              FROM WaterHeater wh, Household h
              WHERE wh.householdID = h.householdID
              AND wh.householdID IN (SELECT householdID FROM PublicUtilityLinkage)
              ) ongrid,
              (
              SELECT AVG(wh.tank_size) AS off_the_grid_avg_waterheater_size
              FROM WaterHeater wh, Household h
              WHERE wh.householdID = h.householdID
              AND wh.householdID NOT IN (SELECT householdID FROM PublicUtilityLinkage)
              ) offgrid`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Off the grid BTU stat - // 13.6
const selectOffTheGridBtuStat = () => {
  //Query
  let query = `
SELECT ApplianceTypes.applianceType AS ApplianceType
	,ROUND(MIN(COALESCE(app.btu_rating, 0)) ,0) AS MinBTU
	,ROUND(MAX(COALESCE(app.btu_rating, 0)) ,0) AS MaxBTU
	,ROUND(COALESCE(AVG(app.btu_rating), 0),0) AS AvgBTU
FROM (
  SELECT 'Air handler' AS applianceType
  UNION ALL
  SELECT 'Water heater'
) ApplianceTypes
LEFT JOIN Appliance app ON app.applianceType = ApplianceTypes.applianceType
LEFT JOIN Household hh ON app.householdID = hh.householdID
LEFT JOIN publicutilitylinkage pul ON hh.householdID = pul.householdID
WHERE pul.householdID IS NULL 
GROUP BY ApplianceTypes.applianceType;`;
  //query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Household by radius - 14.2.1
const selectHouseholdCountByRadius = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = "${postalCode}" UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = "${postalCode}" )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ),

  HouseholdTypes AS (SELECT 'House' AS household_type
  UNION ALL
  SELECT 'Apartment' AS household_type
  UNION ALL
  SELECT 'Townhome' AS household_type
  UNION ALL
  SELECT 'Condominium' AS household_type
  UNION ALL
  SELECT 'Modular home' AS household_type
  UNION ALL
  SELECT 'Tiny house' AS household_type)

  SELECT hht.household_type, 
  COUNT(CASE WHEN householdId IN (SELECT householdID FROM Household h, HAV hav WHERE h.postalCode = hav.SecondPostal) THEN 1 ELSE NULL END) AS household_count 
  FROM HouseholdTypes hht
  LEFT OUTER JOIN Household h ON h.household_type = hht.household_type
  GROUP BY hht.household_type
  ORDER BY household_count DESC`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Avg sq footage of houseldhould within search radius - 14.2
const selectAvgSqFootageByRadius = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = "${postalCode}" UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = "${postalCode}" )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ) SELECT ROUND(AVG(square_footage), 0) AS avg_square_footage FROM Household h, HAV hav WHERE h.postalCode = hav.SecondPostal; `;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Avg sq footage of houseldhould within search radius 14.3
const selectAvgHeatingTempByRadius = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = '${postalCode}' UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = '${postalCode}' )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ) SELECT ROUND(AVG(heating), 1) AS avg_heating_temp FROM Household h, HAV hav WHERE h.postalCode = hav.SecondPostal;`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Select avg cooling temp for households within specidied distance 14.4
const selectAvgCoolingTempByRadius = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = "${postalCode}" UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = "${postalCode}" )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ) SELECT ROUND(AVG(cooling), 1) AS avg_cooling_temp FROM Household h, HAV hav WHERE h.postalCode = hav.SecondPostal;`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Select list of all public utilities used by housedhold within given radius - 14.5
const selectAllPublicUtilitiesUsedByRadius = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = ${postalCode} UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = ${postalCode} )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ) SELECT GROUP_CONCAT(DISTINCT pu.public_utility) AS public_utilities_used FROM Household h, HAV hav, PublicUtilityLinkage pul, PublicUtilities pu WHERE h.postalCode = hav.SecondPostal AND pul.householdID = h.householdID AND pul.public_utility_id = pu.public_utility_id;`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//off-the-grid household count - 14.6
const selectOffGridHouseholdCount = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = '${postalCode}' UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = '${postalCode}' )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ) SELECT COUNT(CASE WHEN householdId NOT IN (SELECT householdID FROM PublicUtilityLinkage) THEN h.householdID ELSE NULL END) AS num_off_grid_homes FROM Household h, HAV hav WHERE h.postalCode = hav.SecondPostal; `;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//household count within radius - 14.? (has no identifier - think we missed this subtask)
const selectHouseholdCountWithinRadius = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = '${postalCode}' UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = '${postalCode}' )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ) 
  
  SELECT 
  COUNT(h.householdID) AS num_households_in_radius 
  FROM Household h, HAV hav 
  WHERE h.postalCode = hav.SecondPostal;`;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Count of homes with power-generation - 14.7
const selectPowerGeneratingHouseholdByRadius = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = '${postalCode}' UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = '${postalCode}' )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ) SELECT COUNT(DISTINCT h.householdID) AS num_homes_with_power_generation FROM Household h, HAV hav, PowerGenerator pg WHERE h.postalCode = hav.SecondPostal AND h.householdID = pg.householdID; `;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Select most common poewer generation type - 14.8
const selectMostCommonPowerGenType = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = ${postalCode} UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = ${postalCode} )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ) SELECT pgt.generator_type FROM Household h, HAV hav, PowerGenerator pg, PowerGeneratorType pgt WHERE h.postalCode = hav.SecondPostal AND h.householdID = pg.householdID AND pg.generatorTypeID = pgt.generatorTypeID GROUP BY pg.generatorTypeID ORDER BY COUNT(h.householdID) DESC LIMIT 1; `;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Select most common poewer generation type - 14.8
const selectAvgPowerGenPerHouseHold = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = ${postalCode} UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = ${postalCode} )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ) SELECT ROUND(AVG(pg_per_household), 0) AS avg_monthly_power_gen_per_household FROM ( SELECT SUM(pg.monthly_kilowatt) AS pg_per_household FROM Household h, HAV hav, PowerGenerator pg WHERE h.postalCode = hav.SecondPostal AND h.householdID = pg.householdID GROUP BY h.householdID ) f; `;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//Select number of houses with battery storage
const selectHouseholdCountWithBatteryStorage = ({ postalCode, distance }) => {
  //Query
  let query = `WITH HAV AS (SELECT T4.SecondPostal FROM ( SELECT T3.MainPostal ,T3.SecondPostal ,3958.75 * T3.c as Distance ,T3.DistanceVariable FROM ( SELECT T2.MainPostal ,T2.SecondPostal ,2 * ATAN2(SQRT(T2.a), SQRT(1 - T2.a)) AS c ,T2.DistanceVariable FROM ( SELECT T1.MainPostal ,T1.SecondPostal ,SIN(RADIANS(T1.DeltaLat) / 2) * SIN(RADIANS(T1.DeltaLat) / 2) + COS(RADIANS(T1.lat1)) * COS(RADIANS(T1.lat2)) * SIN(RADIANS(T1.DeltaLon) / 2) * SIN(RADIANS(T1.DeltaLon) / 2) AS a ,T1.DistanceVariable FROM (SELECT p1.PostalCode AS MainPostal ,p2.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p2.latitude AS lat2 ,p2.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p2.longitude AS lon2 ,p2.longitude-p1.longitude AS DeltaLon ,${distance} AS DistanceVariable FROM PostalCode p1 CROSS JOIN PostalCode p2 ON p2.PostalCode != p1.PostalCode AND p1.PostalCode = ${postalCode} UNION SELECT p1.PostalCode AS MainPostal ,p1.PostalCode AS SecondPostal ,p1.latitude AS lat1 ,p1.latitude AS lat2 ,p1.latitude-p1.latitude AS DeltaLat ,p1.longitude AS lon1 ,p1.longitude AS lon2 ,p1.longitude-p1.longitude AS DeltaLon ,0 AS DistanceVariable FROM PostalCode p1 WHERE p1.PostalCode = ${postalCode} )AS T1 )AS T2 )AS T3 )AS T4 WHERE Distance <= T4.DistanceVariable ) SELECT COUNT(DISTINCT pg.householdID) AS num_households_with_battery_storage FROM Household h, HAV hav, PowerGenerator pg WHERE h.postalCode = hav.SecondPostal AND h.householdID = pg.householdID AND pg.battery_storage IS NOT NULL; `;
  query = cleanQuery(query);

  return new Promise((resolve, reject) => {
    // Execute query
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  selectCountOfProvidedPostalCode,
  selectTop25Manufacturer,
  selectAppliancesForGivenManufacturer,
  selectMatchingModelAndManufacturer,
  selectAcStat,
  selectHeaterStat,
  selectHeatPumpStat,
  selectWaterHeaterByState,
  selectWaterHeaterStateForSingleState,
  selectStateWithMostOffGridHouseholds, //13.1
  selectOffGridAvgBatteryStorageCapacity, //13.2
  selectOffgridPowerGenerationTypeStat, //13.3
  selectOffTheGridHouseholdCountByHouseholdType, //13.4
  selectAvgWaterHeaterTankSizeByOffTheGridFlag, //13.5
  selectOffTheGridBtuStat, // 13.6
  selectHouseholdCountByRadius, //14.2.1
  selectAvgSqFootageByRadius, //14.2.2
  selectAvgHeatingTempByRadius, //14.2.3
  selectAvgCoolingTempByRadius, //14.2.4
  selectAllPublicUtilitiesUsedByRadius, // 14.2.5
  selectOffGridHouseholdCount, //14.2.6
  selectHouseholdCountWithinRadius, //14.2.?
  selectPowerGeneratingHouseholdByRadius, //14.2.7
  selectMostCommonPowerGenType, //14.2.8
  selectAvgPowerGenPerHouseHold, //14.2.9
  selectHouseholdCountWithBatteryStorage, // 14.2.10
};
