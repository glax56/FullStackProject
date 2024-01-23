//Imports
const {
  selectAllPublicUtilities,
  insertHouseHold,
  insertPublicUtilityLinkage,
  selectAllManufacturers,
  insertAppliance,
  insertWaterHeater,
  insertAirHandler,
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
} = require("../queries/households/householdQueries");

// Get public utilities
const getPublicUtilities = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting public utilities ...`);
    const response = await selectAllPublicUtilities();
    res.status(200).send(response);
  } catch (err) {
    res.status(503).send(err);
    console.log(err);
  }
};

// Save household
const saveHousehold = async (req, res) => {
  try {
    const payload = req.body;

    // If heating/cooling not provided change to null
    if (payload.heating === "" || payload.heating === undefined) {
      payload.heating = null;
    }
    if (payload.cooling === "" || payload.cooling === undefined) {
      payload.cooling = null;
    }

    // Saving household info
    console.log(`[${req.url}] - Saving household info ...`);
    const { insertId } = await insertHouseHold(payload);

    // Saving public utilities linkage
    const publicUtils = payload.publicUtilities;
    if (publicUtils && publicUtils.length > 0) {
      await insertPublicUtilityLinkage({
        householdID: insertId,
        publicUtils,
      });
    }
    res.status(200).send({ householdID: insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message || "Opps !! Unable to save household info",
    });
  }
};

// Get manufacturers
const getManufacturers = async (req, res) => {
  try {
    const response = await selectAllManufacturers();
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch manufacturers" });
  }
};

// Save appliance
const saveAppliance = async (req, res) => {
  try {
    let {
      householdID,
      applianceID,
      applianceType,
      manufacturerID,
      model_name,
      btu_rating,
      tank_size = null,
      temp_setting = null,
      energy_source = null,
      rpm = null,
      heating_cooling_method = null,
      eer = null,
      source = null, // Energy source for heater
      seer = null,
      hspf = null,
    } = req.body;

    // save appliance
    console.log(`[${req.url} - Inserting into appliance ...`);
    if (model_name === "" || model_name === undefined) {
      model_name = null;
    }
    await insertAppliance(
      householdID,
      applianceID,
      applianceType,
      manufacturerID,
      model_name,
      btu_rating
    );

    // if appliance is water heater
    if (applianceType === "Water heater") {
      console.log(`[${req.url}] - Inserting into WaterHeater...`);
      await insertWaterHeater(
        householdID,
        applianceID,
        energy_source,
        tank_size,
        temp_setting
      );
    }

    if (applianceType === "Air handler") {
      console.log(`[${req.url}] - Inserting into Airhandler...`);
      await insertAirHandler(householdID, applianceID, rpm);
    }

    if (heating_cooling_method?.includes("Air conditioner")) {
      // if heating cooling method is Air conditioner
      console.log(`[${req.url}] - Inserting into AirConditioner ...`);
      await insertAirConditioner(householdID, applianceID, eer);
    }

    // If heating and cooling methond is
    if (heating_cooling_method?.includes("Heater")) {
      console.log(`[${req.url}] - Inserting into heater ...`);
      await insertHeater(householdID, applianceID, source);
    }

    // If heating and cooling methond is
    if (heating_cooling_method?.includes("Heat pump")) {
      console.log(`[${req.url}] - Inserting into heat pump ...`);
      await insertHeatPump(householdID, applianceID, seer, hspf);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to save appliances" });
    console.error(err);
  }
};

// Get recently added appliance AKA all appliances for an household
const getSingleHouseholdAppliances = async (req, res) => {
  try {
    const { householdID } = req.query;
    const response = await selectAllAppliancesForHousehold(householdID);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appliance" });
    console.error(err);
  }
};

// Delete appliances
const delteAppliance = async (req, res) => {
  try {
    console.log(`[ ${req.url}] - Deleting appliance ...`);
    const { householdID, applianceID } = req.query;
    await deleteAppliance(householdID, applianceID);
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete appliances" });
    console.error(err);
  }
};

// Check if household is offgrid or not
const getHouseholdGridStatus = async (req, res) => {
  try {
    console.log(`[${req.url}] - getting household grid status ..`);
    const { householdID } = req.query;
    const response = await selectPublicUtilityForHousehold(householdID);
    const data = { householdIsOffGrid: false };
    if (response.length < 1) {
      data.householdIsOffGrid = true;
    }
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to get household grid status" });
    console.error(err);
  }
};

//Get all power generation types
const getAllPowerGenerationTypes = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting power generation ...`);
    const response = await selectAllPowerGenerationTypes();
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch power generation types" });
    console.log(err);
  }
};

// Save power generation
const savePowerGeneration = async (req, res) => {
  try {
    console.log(`[${req.url}] - saving power generation ...`);
    const {
      householdID,
      powerGeneratorID,
      generatorTypeID,
      monthly_kilowatt,
      battery_storage,
    } = req.body;

    const response = await insertIntoPowerGeneration(
      householdID,
      powerGeneratorID,
      generatorTypeID,
      monthly_kilowatt,
      battery_storage
    );
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to save power generation" });
    console.error(err);
  }
};

const getSingleHouseholdpowerGeneration = async (req, res) => {
  try {
    const queryParams = req.query;
    console.log(`[${req.url}] - Getting power generation for a household`);
    const { householdID } = req.query;
    const response = await selectPowerGenerationForHousehold(householdID);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch  power generation" });
    console.error(err);
  }
};

const removePowerGeneration = async (req, res) => {
  try {
    console.log(`[${req.url}] - Deleting power generation ...`);
    const { householdID, powerGeneratorID } = req.query;
    const response = await deletePowerGeneration(powerGeneratorID, householdID);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove power generation" });
    console.error(err);
  }
};

module.exports = {
  getPublicUtilities,
  saveHousehold,
  getManufacturers,
  saveAppliance,
  getSingleHouseholdAppliances,
  getSingleHouseholdpowerGeneration,
  delteAppliance,
  getHouseholdGridStatus,
  getAllPowerGenerationTypes,
  savePowerGeneration,
  removePowerGeneration,
};
