const connection = require("../../config/db");
const { cleanQuery } = require("../../utils/cleanSqlQueries");

// Select all public utilities
const selectAllPublicUtilities = () => {
  //Query
  let query = `SELECT public_utility_id, public_utility FROM PublicUtilities`;
  query = cleanQuery(query);

  //Execute query
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// insert into  household
const insertHouseHold = async (payload) => {
  const {
    email,
    postalCode,
    household_type,
    square_footage,
    heating,
    cooling,
  } = payload;

  //Query
  let query = `INSERT INTO Household(email, postalCode, household_type, square_footage, heating, cooling)
			VALUES("${email}", "${postalCode}", "${household_type}", ${square_footage}, ${heating}, ${cooling});`;
  query = cleanQuery(query);

  //Execute query
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const insertPublicUtilityLinkage = async (payload) => {
  const { householdID, publicUtils } = payload;
  const values = publicUtils
    .map((util) => `(${householdID},${util})`)
    .join(",");

  // Query
  let query = `INSERT INTO PublicUtilityLinkage(householdID, public_utility_id) values ${values}`;
  query = cleanQuery(query);

  //Execute query
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Select all manufacturers
const selectAllManufacturers = () => {
  //Query
  let query = "SELECT manufacturerID, manufacturer_name FROM manufacturer";
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

// Insert into appliances
const insertAppliance = (
  householdID,
  applianceID,
  applianceType,
  manufacturerID,
  model_name,
  btu_rating
) => {
  //Query
  let query = `INSERT INTO Appliance (householdID, applianceID, applianceType, manufacturerID, model_name, btu_rating)
                VALUES(${householdID},${applianceID},"${applianceType}",${manufacturerID},${
    model_name ? `"${model_name}"` : model_name
  },${btu_rating})`;

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

// Insert Into water heater
const insertWaterHeater = (
  householdID,
  applianceID,
  energy_source,
  tank_size,
  temp_setting
) => {
  //Query
  let query = `INSERT INTO WaterHeater (householdID, applianceID, energy_source, tank_size, temp_setting)
                VALUES(${householdID},${applianceID},"${energy_source}",${tank_size},${temp_setting})`;

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

// Insert into air handler
const insertAirHandler = (householdID, applianceID, rpm) => {
  //Query
  let query = `INSERT INTO AirHandler (householdID, applianceID, rpm)
                VALUES(${householdID},${applianceID}, ${rpm})`;
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

// Insert into air conditioner
const insertAirConditioner = (householdID, applianceID, eer) => {
  //Query
  let query = `INSERT INTO AirConditioner (householdID, applianceID, eer)
                VALUES(${householdID},${applianceID}, ${eer})`;
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

//Insert into heater
const insertHeater = (householdID, applianceID, source) => {
  //Query
  let query = `INSERT INTO Heater(householdID, applianceID, source)
               VALUES(${householdID},${applianceID}, "${source}")`;
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

//Insert into Heat pump
const insertHeatPump = (householdID, applianceID, seer, hspf) => {
  //Query
  let query = `INSERT INTO HeatPump(householdID,applianceID, seer, hspf)
               VALUES(${householdID},${applianceID},${seer}, "${hspf}")`;
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

// Select all appliance for a household
const selectAllAppliancesForHousehold = (householdID) => {
  //Query
  let query = `SELECT  a.applianceID, a.applianceType, m.manufacturer_name, a.model_name 
	             FROM Appliance AS a
               INNER JOIN Manufacturer AS m ON a.manufacturerID = m.manufacturerID
	             WHERE a.householdID = ${householdID};`;
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

// Delete appliance
const deleteAppliance = (householdID, applianceID) => {
  //Query
  let query = `DELETE 
              FROM Appliance 
              WHERE applianceID = ${applianceID} AND householdID = ${householdID} ;`;
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

// [] if a household does not have public utility
const selectPublicUtilityForHousehold = (householdID) => {
  //Query
  let query = `SELECT public_utility_id FROM PublicUtilityLinkage where householdID=${householdID};`;
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

//Get power generation type
const selectAllPowerGenerationTypes = () => {
  //Query
  let query = `SELECT generatorTypeID, generator_type FROM PowerGeneratorType;`;
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

//Insert into power generation
const insertIntoPowerGeneration = (
  householdID,
  powerGeneratorID,
  generatorTypeID,
  monthly_kilowatt,
  battery_storage
) => {
  //Query
  let query = `INSERT INTO PowerGenerator (householdID, powerGeneratorID, generatorTypeID, monthly_kilowatt, battery_storage)
               VALUES (${householdID}, ${powerGeneratorID}, ${generatorTypeID}, ${monthly_kilowatt}, ${
    battery_storage ? battery_storage : null
  });`;
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

// Select all power generation
const selectPowerGenerationForHousehold = (householdID) => {
  //Query
  let query = `SELECT PG.powerGeneratorID, PGT.generator_type, PG.monthly_kilowatt, PG.battery_storage
               FROM PowerGenerator PG
               JOIN PowerGeneratorType PGT ON PG.generatorTypeID = PGT.generatorTypeID
               WHERE PG.householdID = ${householdID};`;
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

// Delete power generation
const deletePowerGeneration = (powerGeneratorID, householdID) => {
  //Query
  let query = `DELETE 
               FROM PowerGenerator
               WHERE householdID = ${householdID} and powerGeneratorID = ${powerGeneratorID};`;
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

// Export all functions above
module.exports = {
  selectAllPublicUtilities,
  insertHouseHold,
  selectAllManufacturers,
  insertPublicUtilityLinkage,
  insertAppliance,
  insertAirHandler,
  insertWaterHeater,
  insertAirConditioner,
  insertHeater,
  insertHeatPump,
  selectAllAppliancesForHousehold,
  deleteAppliance,
  selectPublicUtilityForHousehold,
  selectAllPowerGenerationTypes,
  insertIntoPowerGeneration,
  selectPowerGenerationForHousehold,
  deletePowerGeneration,
};
