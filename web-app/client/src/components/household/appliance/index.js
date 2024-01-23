import React, { useState } from "react";
import AddAppliancesForm from "./AddAppliancesForm";
import AddedAppliancesTable from "./AddedAppliancesTable";
function Appliance({ setCurrentStep, currentHouseholdID }) {
  const [doneAddingAppliances, setDoneAddingAppliances] = useState(false);
  const [applianceCount, setApplianceCount] = useState(0);

  return (
    <>
      {doneAddingAppliances ? (
        <AddedAppliancesTable
          setCurrentStep={setCurrentStep}
          setDoneAddingAppliances={setDoneAddingAppliances}
          setApplianceCount={setApplianceCount}
          currentHouseholdID={currentHouseholdID}
        />
      ) : (
        <AddAppliancesForm
          setDoneAddingAppliances={setDoneAddingAppliances}
          currentHouseholdID={currentHouseholdID}
          applianceCount={applianceCount}
          setApplianceCount={setApplianceCount}
        />
      )}
    </>
  );
}

export default Appliance;
