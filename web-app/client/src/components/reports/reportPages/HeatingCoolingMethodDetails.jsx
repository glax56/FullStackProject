import React, { useEffect, useState } from "react";
import { Table, message, Tabs } from "antd";
import "../index.css";
import ReturnToReportBtn from "../ReturnToReportBtn";
import api from "../../../axios/api";

// AC stat table cols
const acStatTableCols = [
  {
    title: "",
    dataIndex: "sn",
    render: (record) => {
      return `${record}.`;
    },
    align: "center",
  },
  {
    title: "Household Types",
    dataIndex: "HouseHoldType",
  },
  { title: "Count", dataIndex: "TotalAirConditioners", align: "center" },
  { title: "Avg BTU", dataIndex: "Average_BTU", align: "center" },
  { title: "Avg RPM", dataIndex: "Average_RPM", align: "center" },
  { title: "Avg EER", dataIndex: "Average_EER", align: "center" },
];

//Heater stat table cols
const heaterStatTableCols = [
  {
    title: "",
    dataIndex: "sn",
    render: (record) => {
      return `${record}.`;
    },
    align: "center",
  },
  { title: "Household Type", dataIndex: "HouseHoldType" },
  { title: "Count", dataIndex: "Total_Heaters", align: "center" },
  { title: "Avg BTU", dataIndex: "Average_BTU", align: "center" },
  { title: "Avg RPM", dataIndex: "Average_RPM", align: "center" },
  {
    title: "Most common energy source",
    dataIndex: "Most_Used_Energy_Source",
    render: (record) => {
      return record === "N/A" ? null : record;
    },
  },
];

//Heatpump stat table cols
const heatPumpStatTableCols = [
  {
    title: "",
    dataIndex: "sn",
    render: (record) => {
      return `${record}.`;
    },
    align: "center",
  },
  { title: "Household Type", dataIndex: "HouseHoldType" },
  { title: "Count", dataIndex: "TotalHeatPumps", align: "center" },
  { title: "Avg BTU", dataIndex: "Average_BTU", align: "center" },
  { title: "Avg RPM", dataIndex: "Average_RPM", align: "center" },
  { title: "Avg SEER", dataIndex: "Average_SEER", align: "center" },
  { title: "Avg HSPF", dataIndex: "Average_HPSF", align: "center" },
];

function HeatingCoolingMethodStat() {
  const [gettingAcStat, setGettingAcStat] = useState(false);
  const [acStats, setAcStats] = useState([[]]);
  const [gettingHeaterStat, setGettingHeaterStat] = useState(false);
  const [heaterStats, setHeaterStats] = useState([]);
  const [gettingHeatPumpStat, setGettingHeatPumpStat] = useState(false);
  const [heatPumpStats, setHeatPumpStats] = useState([]);

  // Get all stats when component loads
  useEffect(() => {
    acStat();
    heaterStat();
    heatPumpStat();
  }, []);

  // func to get AC Stat
  const acStat = async () => {
    try {
      setGettingAcStat(true);
      const response = await api.get(`/reports/acStats`);
      let { data } = response;
      data.forEach((d, index) => {
        d.sn = index + 1;
      });
      setAcStats(data);
    } catch (err) {
      message.error("Failed to fetch AC Stat");
    } finally {
      setGettingAcStat(false);
    }
  };

  // func to get Heater Stat
  const heaterStat = async () => {
    try {
      setGettingHeaterStat(true);
      const response = await api.get(`/reports/heaterStats`);
      let { data } = response;
      data.forEach((d, index) => {
        d.sn = index + 1;
      });
      setHeaterStats(data);
    } catch (err) {
      message.error("Failed to fetch Heater Stat");
    } finally {
      setGettingHeaterStat(false);
    }
  };

  // func to get heat pump stat
  const heatPumpStat = async () => {
    try {
      setGettingHeatPumpStat(true);
      const response = await api.get(`/reports/heatPumpStat`);
      let { data } = response;
      data.forEach((d, index) => {
        d.sn = index + 1;
      });
      setHeatPumpStats(data);
    } catch (err) {
      message.error("Failed to fetch Heat pump stat");
    } finally {
      setGettingHeatPumpStat(false);
    }
  };

  // Tab items
  const tabItems = [
    {
      key: "1",
      label: `AC statistics`,
      children: (
        <Table
          className="reportTable"
          size="small"
          dataSource={acStats}
          bordered={true}
          style={{ width: "800px" }}
          loading={gettingAcStat}
          columns={acStatTableCols}
          pagination={false}
        />
      ),
    },
    {
      key: "2",
      label: `Heater statistics`,
      children: (
        <Table
          className="reportTable"
          style={{ width: "800px" }}
          dataSource={heaterStats}
          size="small"
          bordered={true}
          loading={gettingHeaterStat}
          columns={heaterStatTableCols}
          pagination={false}
        />
      ),
    },
    {
      key: "3",
      label: `Heat pump statistics`,
      children: (
        <Table
          className="reportTable"
          style={{ width: "800px" }}
          size="small"
          dataSource={heatPumpStats}
          bordered={true}
          columns={heatPumpStatTableCols}
          loading={gettingHeatPumpStat}
          pagination={false}
        />
      ),
    },
  ];

  return (
    <div className="report-wrapper">
      <div className="reportTitle">Heating/cooling method details </div>
      <Tabs items={tabItems}></Tabs>
      <ReturnToReportBtn />
    </div>
  );
}

export default HeatingCoolingMethodStat;

// TODO - form validation fails do not show message
// TODO - Show message if sent from back end or smth else
// TODO - Translate error message sent by server to general user readable format
