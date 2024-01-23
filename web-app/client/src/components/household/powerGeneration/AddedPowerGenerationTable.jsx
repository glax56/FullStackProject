import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import api from "../../../axios/api";
import { translateErrorMessage } from "../../../utils/errTranslator";

function AddedPowerGenerationTable({
  setCurrentStep,
  setDoneAddingPowerGenerationSource,
  currentHouseholdID,
  isHouseholdOffGrid,
}) {
  const [powerGeneration, setPowerGeneration] = useState([]);

  //Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "powerGeneratorID",
    },
    {
      title: "Generator type",
      dataIndex: "generator_type",
    },
    {
      title: "Monthly kWh",
      dataIndex: "monthly_kilowatt",
    },
    {
      title: "Battery kWh",
      dataIndex: "battery_storage",
    },
    {
      title: "",
      render: (_, record) => {
        return (
          <span
            className="delete_icon"
            onClick={() =>
              deletePowerGeneration(record.powerGeneratorID, currentHouseholdID)
            }
          >
            <DeleteOutlined />
          </span>
        );
      },
    },
  ];

  const deletePowerGeneration = async (powerGeneratorID, householdID) => {
    try {
      await api.delete(
        `/household/powerGeneration?householdID=${householdID}&powerGeneratorID=${powerGeneratorID}`
      );
      const newPowerGeneratorList = powerGeneration.filter(
        (pg) => pg.powerGeneratorID !== powerGeneratorID
      );
      setPowerGeneration(newPowerGeneratorList);
    } catch (err) {
      const m = translateErrorMessage(err);
      if (m) {
        message.error(m);
      }
    }
  };

  //When component loads
  useEffect(() => {
    getAllPowerGeneration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Get all power generation for this household
  const getAllPowerGeneration = async () => {
    try {
      const response = await api.get(
        `/household/singleHouseholdpowerGeneration?householdID=${currentHouseholdID}`
      );
      setPowerGeneration(response.data);
    } catch (err) {
      const m = translateErrorMessage(err);
      if (m) {
        message.error(m);
      }
    }
  };
  //When next button is clicked
  const handleNextBtnClick = () => {
    setCurrentStep("done");
  };

  // When add more appliance is clicked
  const handleAddMoreApplicances = () => {
    setDoneAddingPowerGenerationSource(false);
  };
  return (
    // JSX
    <div className="householdInfo">
      <Table
        dataSource={powerGeneration}
        columns={columns}
        size="small"
        pagination={false}
        rowKey={(record) => record.powerGeneratorID}
      />
      <div className="householdInfo__addMoreItems">
        <div style={{ color: "#FF0000" }}>
          {isHouseholdOffGrid && powerGeneration.length === 0
            ? "* Atleast 1 power  generation is required for off-the-grid household"
            : null}
        </div>
        <div onClick={handleAddMoreApplicances}> Add more power </div>
      </div>
      <div className="householdInfo__form_actions">
        <div className="householdInfo__form_actions_help"></div>
        <Button
          size="small"
          type="primary"
          onClick={handleNextBtnClick}
          disabled={isHouseholdOffGrid && powerGeneration.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default AddedPowerGenerationTable;
