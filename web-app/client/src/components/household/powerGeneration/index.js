import React, { useState, useEffect } from "react";
import AddPowerGenerationForm from "./AddPowerGenerationForm";
import AddedPowerGenerationTable from "./AddedPowerGenerationTable";
import api from "../../../axios/api";

function PowerGeneration({ setCurrentStep, currentHouseholdID }) {
  const [doneAddingPowerGenerationSource, setDoneAddingPowerGenerationSource] =
    useState(false);
  const [powerGeneratorCount, setPowerGeneratorCount] = useState(0);
  const [isHouseholdOffGrid, setIsHouseholdOffGrid] = useState(true);

  // When component loads -
  useEffect(() => {
    evaluateIfHouseHoldIsOffGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Func to evaluate if household is offgrid
  const evaluateIfHouseHoldIsOffGrid = async () => {
    try {
      const response = await api(
        `/household/householdGridStatus?householdID=${currentHouseholdID}`
      );
      setIsHouseholdOffGrid(response.data.householdIsOffGrid);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {doneAddingPowerGenerationSource ? (
        <AddedPowerGenerationTable
          setDoneAddingPowerGenerationSource={
            setDoneAddingPowerGenerationSource
          }
          currentHouseholdID={currentHouseholdID}
          setCurrentStep={setCurrentStep}
          isHouseholdOffGrid={isHouseholdOffGrid}
        />
      ) : (
        <AddPowerGenerationForm
          setDoneAddingPowerGenerationSource={
            setDoneAddingPowerGenerationSource
          }
          currentHouseholdID={currentHouseholdID}
          setCurrentStep={setCurrentStep}
          powerGeneratorCount={powerGeneratorCount}
          setPowerGeneratorCount={setPowerGeneratorCount}
          isHouseholdOffGrid={isHouseholdOffGrid}
        />
      )}
    </>
  );
}

export default PowerGeneration;
