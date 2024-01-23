const express = require("express");
const router = express.Router();

const {
  checkIfPostalCodeIsValid,
  getTopManufacturers,
  manufacturerDrillDown,
  searchModelManufacturer,
  acStats,
  heaterStats,
  heatPumps,
  waterHeaterStatByState,
  waterHeaterStatByStateDrillDown,
  stateWithMostOffGridHouses, // TASK - 13.1
  offGridAvgBatteryStorageCapacity, // TASK - 13.2
  offGridPowerGenerationTypeStat, // TASK - 13.3
  percentageOfOffGridHouseholdByHouseType, // TASK - 13.4
  waterTankSizeoffGridVsOnGrid, // TASK - 13.5
  offTheGridBTUStat, // TASK - 13.6
  getHouseholdCountByRadius, // 14.2.1
  getAvgSqFootByRadius, //14.2.2
  getAvgHeatingTempByRadius, // 14.2.3
  getAvgCoolingTempByRadius, // 14.2.4
  getAPublicUtilitesByRadius, // 14.2.5
  getOffgridHouseholdCount, // 14.2.6
  getHouseholdCountInRadius, // 14.2.?
  getPowerGeneratingHouseholdCount, //14.2.7
  getMostCommonPowerGenSourceByRadius, //14.2.8
  getAvgPowerGenPerHouholdByRadius, //14.2.9
  countOfHouseholdWithBatteryStorage, //14.10
} = require("../controllers/reportController");

// Validate zipcode
router.get("/validatePostalCode", checkIfPostalCodeIsValid);

// Top 25 popular manufacturers
router.get("/topManufacturers/:count", getTopManufacturers);
router.get("/manufacturerDrillDown/:manufacturer", manufacturerDrillDown);

//Manufacturer/model search
router.get("/searchModelManufacturer", searchModelManufacturer);

//Heating/cooling method details
router.get("/acStats", acStats);
router.get("/heaterStats", heaterStats);
router.get("/heatPumpStat", heatPumps);

//Water heater statistics by state
router.get("/waterHeaterStatByState", waterHeaterStatByState);
router.get(
  "/waterHeaterStatByStateDrillDown/:state",
  waterHeaterStatByStateDrillDown
);

//Off-the-grid household dashboard
router.get("/stateWithMostOffGridHouses", stateWithMostOffGridHouses); // TASK - 13.1
router.get(
  "/offGridAvgBatteryStorageCapacity",
  offGridAvgBatteryStorageCapacity
); // TASK - 13.2
router.get("/offGridPowerGenerationTypeStat", offGridPowerGenerationTypeStat); //TASK - 13.3
router.get(
  "/percentageOfOffGridHouseholdByHouseType",
  percentageOfOffGridHouseholdByHouseType
); // TASK-13.4
router.get("/waterHeaterTankSizeoffGridVsOnGrid", waterTankSizeoffGridVsOnGrid); // TASK - 13.5
router.get("/offTheGridBTUStat", offTheGridBTUStat); // TASK 13.6

// Stat by radius
router.get("/householdCountByRadius", getHouseholdCountByRadius); // TASK - 14.2.1
router.get("/householdAvgSqftByRadius", getAvgSqFootByRadius); // TASK - 14.2.2

router.get("/householdAvgHeatingByRadius", getAvgHeatingTempByRadius); // TASK - 14.2.3
router.get("/householdAvgCooolingByRadius", getAvgCoolingTempByRadius); // TASK - 14.2.4
router.get("/publicUtilitiesByRadius", getAPublicUtilitesByRadius); // TASK - 14.2.5
router.get("/offGridHouseholdCountByRadius", getOffgridHouseholdCount); // TASK - 14.2.6
router.get("/householdCountInRadius", getHouseholdCountInRadius); // TASK - 14.2.?
router.get(
  "/powerGeneratingHouseholdCountByRadius",
  getPowerGeneratingHouseholdCount
); // TASK - 14.2.7
router.get(
  "/mostCommonPowerGenSourceByRadius",
  getMostCommonPowerGenSourceByRadius
); // TASK - 14.2.8
router.get("/avgPowerGenByRadius", getAvgPowerGenPerHouholdByRadius);
router.get(
  "/countOfHouseholdWithBatteryStorageByRadius",
  countOfHouseholdWithBatteryStorage
);

// Household averages by radius
module.exports = router;
