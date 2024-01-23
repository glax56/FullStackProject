import React from "react";
import { Steps } from "antd";

import "../index.css";

const steps = [
  {
    title: "Household Info",
    key: "householdInfo",
  },
  {
    title: "Appliances",
    key: "appliances",
  },
  {
    title: "Power Generation",
    key: "powerGeneration",
  },
  {
    title: "Done",
    key: "done",
  },
];

function FormSteps({ currentStep }) {
  return (
    <div className="formSteps">
      <Steps
        current={steps.findIndex((step) => step.key === currentStep)}
        size="small"
        labelPlacement="horizontal"
        items={steps}
      />
    </div>
  );
}

export default FormSteps;
