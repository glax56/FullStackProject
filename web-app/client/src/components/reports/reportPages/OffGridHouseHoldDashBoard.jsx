import React, { useEffect, useState } from "react";
import { Descriptions, Table } from "antd";
import "../index.css";
import ReturnToReportBtn from "../ReturnToReportBtn";
import api from "../../../axios/api";

// Description Layout
const descriptionsLayout = {
  column: 1,
  bordered: true,
  style: { width: "450px", marginTop: "10px" },
  size: "small",
  pagination: false,
};

//BTU stat columns
const btuStatCols = [
  {
    title: "Appliance Type",
    dataIndex: "ApplianceType",
  },
  {
    title: "Min BTU",
    dataIndex: "MinBTU",
  },
  {
    title: "Max BTU",
    dataIndex: "MaxBTU",
  },
  {
    title: "Avg BTU",
    dataIndex: "AvgBTU",
  },
];

//Off grid power generation table cols
const powerGenStatCols = [
  {
    title: "Solar",
    dataIndex: "Solar",
  },
  {
    title: "Windturbine",
    dataIndex: "Windturbine",
  },
  {
    title: "Mixed",
    dataIndex: "Mixed",
  },
];

//Household type count columns
const householdTypeCountCols = [
  {
    title: "Type of household",
    dataIndex: "household_type",
  },
  {
    title: "Percentage",
    dataIndex: "household_count",
  },
];

//Tank size table cols
const tankSizeTableCols = [
  {
    title: "Off-the-Grid",
    dataIndex: "avg_on_grid_water_heater_size",
  },
  {
    title: "On-the-Grid",
    dataIndex: "avg_off_grid_water_heater_size",
  },
];

function OffGridHouseHoldDashBoard() {
  const [mostOffGridState, setMostOffGridState] = useState(null);
  const [averageBatteryStorage, setAverageBatteryStorage] = useState(null);
  const [powerGenerationTypeStat, setPowerGenerationTypeStat] = useState(null);
  const [householdTypesStat, setHouseholdTypeStat] = useState(null);
  const [avgTankSize, setAvgTankSize] = useState(null);
  const [btuStats, setBtuStats] = useState(null);

  useEffect(() => {
    getOffGridHouseholds();
    getAverageBatteryStorage();
    getOffGridPowerGenerationTypeStat();
    getOffGridHouseholdTypes();
    getAvgTankSizeoffGridVsOnGrid();
    getBtuStats();
  }, []);

  // Get  state with most off-grid households and other details
  const getOffGridHouseholds = async () => {
    try {
      const response = await api.get("/reports/stateWithMostOffGridHouses");
      const data = response.data[0];
      setMostOffGridState(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Get  average battery storage for all off-grid houses
  const getAverageBatteryStorage = async () => {
    try {
      const response = await api.get(
        "/reports/offGridAvgBatteryStorageCapacity"
      );
      const data = response.data[0];
      setAverageBatteryStorage(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Get off grid power genration type stat (%)
  const getOffGridPowerGenerationTypeStat = async () => {
    try {
      const response = await api.get("/reports/offGridPowerGenerationTypeStat");
      const data = response.data;
      setPowerGenerationTypeStat(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Off grid house hold type count
  const getOffGridHouseholdTypes = async () => {
    try {
      const response = await api.get(
        "/reports/percentageOfOffGridHouseholdByHouseType"
      );
      const data = response.data;
      setHouseholdTypeStat(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Offgrid vs ongrid water tank size
  const getAvgTankSizeoffGridVsOnGrid = async () => {
    try {
      const response = await api.get(
        "/reports/waterHeaterTankSizeoffGridVsOnGrid"
      );
      const data = response.data;
      setAvgTankSize(data);
    } catch (err) {
      console.log(err);
    }
  };

  // BTU stats
  const getBtuStats = async () => {
    try {
      const response = await api.get("/reports/offTheGridBTUStat");
      const data = response.data;
      setBtuStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ marginBottom: "50px" }}>
      <div className="reportTitle">Off-the-grid household dashboard</div>
      <div className="off-grid-household-dashboard">
        <div className="off-grid-household-sections">
          <Descriptions {...descriptionsLayout}>
            {mostOffGridState ? (
              <>
                <Descriptions.Item label="State with most Off-Grid households">
                  {mostOffGridState.State}
                </Descriptions.Item>
                <Descriptions.Item
                  label={`Total off-grid households in ${mostOffGridState.State}`}
                >
                  {mostOffGridState.OffGridHouseholds}
                </Descriptions.Item>
              </>
            ) : null}

            {averageBatteryStorage ? (
              <Descriptions.Item label="Avg battery storage/battery for off-grid households">
                {averageBatteryStorage.average_battery_storage}
              </Descriptions.Item>
            ) : null}
          </Descriptions>

          {powerGenerationTypeStat ? (
            <Table
              {...descriptionsLayout}
              columns={powerGenStatCols}
              dataSource={powerGenerationTypeStat}
              size="small"
              pagination={false}
              caption={
                <div className="table-caption"> Power generation type </div>
              }
            ></Table>
          ) : null}

          {avgTankSize ? (
            <Table
              caption={
                <div className="table-caption">
                  {" "}
                  Average tank size (in Gallons)
                </div>
              }
              {...descriptionsLayout}
              columns={tankSizeTableCols}
              dataSource={avgTankSize}
            ></Table>
          ) : null}
        </div>
        <div>
          {householdTypesStat ? (
            <Table
              {...descriptionsLayout}
              columns={householdTypeCountCols}
              dataSource={householdTypesStat}
              caption={
                <div className="table-caption"> Household percentage </div>
              }
            ></Table>
          ) : null}

          {btuStats ? (
            <Table
              columns={btuStatCols}
              dataSource={btuStats}
              size="small"
              pagination={false}
              caption={<div className="table-caption"> BTU statistics </div>}
              {...descriptionsLayout}
            ></Table>
          ) : null}
        </div>
        <ReturnToReportBtn />
      </div>
    </div>
  );
}

export default OffGridHouseHoldDashBoard;
