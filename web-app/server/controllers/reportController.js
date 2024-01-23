const {
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
  selectAllPublicUtilitiesUsedByRadius, //14.2.5
  selectOffGridHouseholdCount, //14.2.6
  selectHouseholdCountWithinRadius, // 14.2.?
  selectPowerGeneratingHouseholdByRadius, //14.2.7
  selectMostCommonPowerGenType, //14.2.8
  selectAvgPowerGenPerHouseHold, //14.2.9
  selectHouseholdCountWithBatteryStorage, // 14.2.10
} = require("../queries/reports/reportQueries");

//Check if postal code is valid
const checkIfPostalCodeIsValid = async (req, res) => {
  try {
    console.log(`[ ${req.url}] - Validating zipcode`);
    const { postalCode } = req.query;

    const response = await selectCountOfProvidedPostalCode(postalCode);

    res.status(200).send(response[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
// Top 25 popular manufacturers
const getTopManufacturers = async (req, res) => {
  try {
    console.log(`[ ${req.url}] - Getting 25 to manufacturers`);
    const response = await selectTop25Manufacturer();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Get appliances type and count for a given manufacturer
const manufacturerDrillDown = async (req, res) => {
  const { manufacturer } = req.params;
  console.log(`[ ${req.url}] - drilling ${manufacturer}`);
  try {
    const response = await selectAppliancesForGivenManufacturer(manufacturer);
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

//Get manufacturer or model that matches a keyword
const searchModelManufacturer = async (req, res) => {
  try {
    const { keyword } = req.query;
    console.log(
      `[ ${req.url}] - Searching for matching model or manufacturer ... ${keyword}`
    );
    const response = await selectMatchingModelAndManufacturer(keyword);
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Heating/cooling method details - Airconditioner
const acStats = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting AC stat ...`);
    const response = await selectAcStat();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Heating/cooling method details - Heater
const heaterStats = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting heater stat ...`);
    const response = await selectHeaterStat();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Heating/cooling method details - Heat pumps
const heatPumps = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting heat pump ...`);
    const response = await selectHeatPumpStat();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Water heater statistics by state
const waterHeaterStatByState = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting water heater stat by state ...`);
    const response = await selectWaterHeaterByState();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Water heater stat by state drill down
const waterHeaterStatByStateDrillDown = async (req, res) => {
  try {
    const { state } = req.params;
    console.log(`[${req.url}] - Getting water heater stat for ${state} ...`);
    const response = await selectWaterHeaterStateForSingleState(state);
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
// Off-the-grid household dashboard - TASK 13.1
const stateWithMostOffGridHouses = async (req, res) => {
  try {
    const response = await selectStateWithMostOffGridHouseholds();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: `Failed to fetch state with most households`,
    });
  }
};

// Off-the-grid avg battery storage capacity. TASK - 13.2
const offGridAvgBatteryStorageCapacity = async (req, res) => {
  try {
    const response = await selectOffGridAvgBatteryStorageCapacity();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: `Failed to fetch state with most households`,
    });
  }
};

// off-grid % for each power generation type (solar, wind-turbine, or mixed). TASK - 13.3
const offGridPowerGenerationTypeStat = async (req, res) => {
  try {
    console.log(
      `[${req.url}] - Getting off-grid % for each power generation type `
    );
    const response = await selectOffgridPowerGenerationTypeStat();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Off-the-grid household types count // TASK - 13.4
const percentageOfOffGridHouseholdByHouseType = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting off-grid household type count `);
    const response = await selectOffTheGridHouseholdCountByHouseholdType();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Avg water heater tank size off-the-grid household vs Avg water heater tank size on-the-grid households// TASK - 13.5
const waterTankSizeoffGridVsOnGrid = async (req, res) => {
  try {
    console.log(`[${req.url}] - avg water heater size on  vs off-grid ... `);
    const response = await selectAvgWaterHeaterTankSizeByOffTheGridFlag();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// BTU stats- TSAK - 13.6
const offTheGridBTUStat = async (req, res) => {
  try {
    console.log(`[${req.url}] - getting BTU stat for offgrid households ...`);
    const response = await selectOffTheGridBtuStat();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Household count (grouped by household type) by search radius 14.2.1
const getHouseholdCountByRadius = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting household count by radius ...`);
    const { postalCode, distance } = req.query;
    const response = await selectHouseholdCountByRadius({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch household count by radius" });
    console.log(err);
  }
};

// Household avg sqft by radous //  14.2.2
const getAvgSqFootByRadius = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting avg household sqft by radius ...`);
    const { postalCode, distance } = req.query;
    const response = await selectAvgSqFootageByRadius({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch avg household sqft by radius" });
    console.log(err);
  }
};

// Household avg sqft by radius //  14.2.3
const getAvgHeatingTempByRadius = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting avg heating temp by radius ...`);
    const { postalCode, distance } = req.query;
    const response = await selectAvgHeatingTempByRadius({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch avg heating temperature" });
    console.log(err);
  }
};

// Get avg cooling  //14.2.4
const getAvgCoolingTempByRadius = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting avg cooling temp by radius ...`);
    const { postalCode, distance } = req.query;
    const response = await selectAvgCoolingTempByRadius({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      message:
        "Failed to fetch avg cooling temperature for household with in given radius",
    });
    console.log(err);
  }
};

// Get avg cooling  //14.2.5
const getAPublicUtilitesByRadius = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting avg cooling temp by radius ...`);
    const { postalCode, distance } = req.query;
    const response = await selectAllPublicUtilitiesUsedByRadius({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      message:
        "Failed to fetch public utilites for household in specified radius",
    });
    console.log(err);
  }
};

// Get off-the-grid household count  //14.2.6
const getOffgridHouseholdCount = async (req, res) => {
  try {
    console.log(
      `[${req.url}] - Getting off-the-grid household count in radius ...`
    );
    const { postalCode, distance } = req.query;
    const response = await selectOffGridHouseholdCount({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch off-the-grid household count" });
    console.log(err);
  }
};

// Get household count within radius //14.2.?
const getHouseholdCountInRadius = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting household count within radius ...`);
    const { postalCode, distance } = req.query;
    const response = await selectHouseholdCountWithinRadius({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch household count in radius" });
    console.log(err);
  }
};

// Count of households that generate power within specified radius //14.2.7
const getPowerGeneratingHouseholdCount = async (req, res) => {
  try {
    console.log(
      `[${req.url}] - Getting count of household that generateds power`
    );
    const { postalCode, distance } = req.query;
    const response = await selectPowerGeneratingHouseholdByRadius({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch count of household that generateds power",
    });
    console.log(err);
  }
};

// Most common power generation source //14.2.8
const getMostCommonPowerGenSourceByRadius = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting most common power gen method`);
    const { postalCode, distance } = req.query;
    const response = await selectMostCommonPowerGenType({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch most common power generation source",
    });
    console.log(err);
  }
};

// Get average power generation for all households within the given radius
const getAvgPowerGenPerHouholdByRadius = async (req, res) => {
  try {
    console.log(`[${req.url}] - Getting avg power generation by radius`);
    const { postalCode, distance } = req.query;
    const response = await selectAvgPowerGenPerHouseHold({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch average power generation by radius",
    });
    console.log(err);
  }
};

// Get count of household with battery storage
const countOfHouseholdWithBatteryStorage = async (req, res) => {
  try {
    console.log(
      `[${req.url}] - Getting count of household with battery storage`
    );
    const { postalCode, distance } = req.query;
    const response = await selectHouseholdCountWithBatteryStorage({
      postalCode,
      distance,
    });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch count of household with battery storage",
    });
    console.log(err);
  }
};

module.exports = {
  checkIfPostalCodeIsValid,
  getTopManufacturers,
  manufacturerDrillDown,
  searchModelManufacturer,
  acStats,
  heaterStats,
  heatPumps,
  waterHeaterStatByState,
  waterHeaterStatByStateDrillDown,
  stateWithMostOffGridHouses, //13.1
  offGridAvgBatteryStorageCapacity, //13.2
  offGridPowerGenerationTypeStat, // 13.3
  percentageOfOffGridHouseholdByHouseType, // 13.4
  waterTankSizeoffGridVsOnGrid, //13.5
  offTheGridBTUStat, // 13.6
  getHouseholdCountByRadius, //14.2.1
  getAvgSqFootByRadius, //14.2.2
  getAvgHeatingTempByRadius, //14.2.3
  getAvgCoolingTempByRadius, //14.2.4
  getAPublicUtilitesByRadius, //14.2.5
  getOffgridHouseholdCount, //14.2.6
  getHouseholdCountInRadius, // 14.2.?
  getPowerGeneratingHouseholdCount, // 14.2.7
  getMostCommonPowerGenSourceByRadius, //14.2.8
  getAvgPowerGenPerHouholdByRadius, //14.2.9
  countOfHouseholdWithBatteryStorage, //14.2.10
};
