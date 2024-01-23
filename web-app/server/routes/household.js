const express = require("express");
const {
  getPublicUtilities,
  getManufacturers,
  saveHousehold,
  saveAppliance,
  getSingleHouseholdAppliances,
  getSingleHouseholdpowerGeneration,
  delteAppliance,
  removePowerGeneration,
  getHouseholdGridStatus,
  savePowerGeneration,
  getAllPowerGenerationTypes,
} = require("../controllers/householdController");

const router = express.Router();

// Post routes
router.post("/householdDetails", saveHousehold);
router.post("/appliance", saveAppliance);
router.post("/powerGeneration", savePowerGeneration);

// Get routes
router.get("/allPublicUtilities", getPublicUtilities);
router.get("/allManufacturers", getManufacturers);
router.get("/singleHouseholdAppliances", getSingleHouseholdAppliances);
router.get(
  "/singleHouseholdpowerGeneration",
  getSingleHouseholdpowerGeneration
);
router.get("/householdGridStatus", getHouseholdGridStatus);
router.get("/powerGenerationTypes", getAllPowerGenerationTypes);

// Delete routes
router.delete("/appliance", delteAppliance);
router.delete("/powerGeneration", removePowerGeneration);

module.exports = router;
