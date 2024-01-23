import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import api from "../../../axios/api";
import { translateErrorMessage } from "../../../utils/errTranslator";

function AddedAppliancesTable({
  setCurrentStep,
  setDoneAddingAppliances,
  setApplianceCount,
  currentHouseholdID,
}) {
  const [appliances, setAppliances] = useState([]);
  const columns = [
    {
      title: "Appl #",
      dataIndex: "applianceID",
      key: "applianceID",
    },
    {
      title: "Type",
      dataIndex: "applianceType",
      key: "applianceType",
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer_name",
      key: "manufacturer_name",
    },
    {
      title: "Model",
      dataIndex: "model_name",
      key: "model_name",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <span
            className="delete_icon"
            onClick={() =>
              deleteAppliance(record.applianceID, currentHouseholdID)
            }
          >
            <DeleteOutlined />
          </span>
        );
      },
    },
  ];

  // When component loads, get all the appliances for current household
  useEffect(() => {
    getAllApplianceForHousehold(currentHouseholdID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllApplianceForHousehold = async (householdID) => {
    try {
      const response = await api.get(
        `/household/singleHouseholdAppliances?householdID=${householdID}`
      );
      setAppliances(response.data);
    } catch (err) {
      const m = translateErrorMessage(err);
      if (m) {
        message.error(m);
      }
    }
  };

  // Handle appliance deletion
  const deleteAppliance = async (applianceID, householdID) => {
    try {
      const response = await api.delete(
        `/household/appliance?householdID=${householdID}&applianceID=${applianceID}`
      );
      const newAppliancesList = appliances.filter(
        (a) => a.applianceID !== applianceID
      );
      setAppliances(newAppliancesList);
      console.log("Delete response ---", response);
    } catch (err) {
      const m = translateErrorMessage(err);
      if (m) {
        message.error(m);
      }
    }
  };

  // Handle next btn click
  const handleNextBtnClick = () => {
    setApplianceCount(0);
    setCurrentStep("powerGeneration");
  };

  // Handle add more appliance link click
  const handleAddMoreApplicances = () => {
    setDoneAddingAppliances(false);
  };

  return (
    <div className="householdInfo">
      <Table
        dataSource={appliances}
        columns={columns}
        size="small"
        pagination={false}
        rowKey={(record) => record.applianceID}
      />
      <div className="householdInfo__addMoreItems">
        <div onClick={handleAddMoreApplicances}> </div>
        <div onClick={handleAddMoreApplicances}> Add another appliance </div>
      </div>
      <div className="householdInfo__form_actions">
        <div className="householdInfo__form_actions_help"></div>
        <Button size="small" type="primary" onClick={handleNextBtnClick}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default AddedAppliancesTable;
