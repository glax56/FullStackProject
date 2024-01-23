import React, { useState } from "react";

import FormSteps from "./formSteps";
import HouseholdInfo from "./householdInfo";
import Appliance from "./appliance";
import PowerGeneration from "./powerGeneration";
import SubmissionComplte from "./submissionComplete";

import "./index.css";

function Household() {
  const [currentStep, setCurrentStep] = useState("householdInfo");
  const [currentHouseholdID, setCurrentHouseholdID] = useState(null);

  return (
    <div className="household">
      <FormSteps currentStep={currentStep} />
      {currentStep === "householdInfo" ? (
        <HouseholdInfo
          setCurrentStep={setCurrentStep}
          setCurrentHouseholdID={setCurrentHouseholdID}
        />
      ) : null}
      {currentStep === "appliances" ? (
        <Appliance
          setCurrentStep={setCurrentStep}
          currentHouseholdID={currentHouseholdID}
        />
      ) : null}

      {currentStep === "powerGeneration" ? (
        <PowerGeneration
          setCurrentStep={setCurrentStep}
          currentHouseholdID={currentHouseholdID}
        />
      ) : null}

      {currentStep === "done" ? (
        <SubmissionComplte setCurrentHouseholdID={setCurrentHouseholdID} />
      ) : null}
    </div>
  );
}

export default Household;
