import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import "../index.css";
import ReturnToReportBtn from "../ReturnToReportBtn";
import api from "../../../axios/api";

// Water heater by state table cols
const waterHeaterByStateTableCols = [
  { title: "", dataIndex: "sn", align: "center" },
  {
    title: "State",
    dataIndex: "State",
    align: "center",
    render: (record) => {
      return <a href={`/water_heater_stat_by_state/${record}`}>{record}</a>;
    },
  },
  { title: "Avg size", dataIndex: "Average_Tank_Size", align: "center" },
  { title: "Avg BTU", dataIndex: "Average_BTU", align: "center" },
  {
    title: "Avg temp",
    dataIndex: "Average_Temperature_Setting",
    align: "center",
  },
  {
    title: "Temp-set household count",
    dataIndex: "Count_With_Temperature_Settings",
    align: "center",
    width: "20%",
  },
  {
    title: "No Temp-set household count",
    dataIndex: "Count_Without_Temperature_Settings",
    align: "center",
    width: "20%",
  },
];

function WaterHeaterStatByState() {
  const [gettingWaterHeaterStatByState, setGettingWaterHeaterByState] =
    useState(false);
  const [waterHeaterStat, setWaterHeaterStat] = useState([]);
  // When componnet loads
  useEffect(() => {
    getWaterHeaterByState();
  }, []);

  // func to get top manufacturer
  const getWaterHeaterByState = async () => {
    try {
      setGettingWaterHeaterByState(true);
      const response = await api.get(`/reports/waterHeaterStatByState`);
      let data = response.data;
      data.forEach((d, index) => {
        d.sn = index + 1;
      });
      setWaterHeaterStat(data);
    } catch (err) {
      message.error("Failed to fetch water heater by state");
    } finally {
      setGettingWaterHeaterByState(false);
    }
  };
  return (
    <div>
      {/* <div className="reportTitle">Water heater statistics by state</div> */}
      <Table
        className="reportTable"
        pagination={false}
        bordered={true}
        // style={{ width: "800px" }}
        columns={waterHeaterByStateTableCols}
        size="small"
        loading={gettingWaterHeaterStatByState}
        dataSource={waterHeaterStat}
        title={() => <div className="table__header">Water heater by state</div>}
      />
      <ReturnToReportBtn />
    </div>
  );
}

export default WaterHeaterStatByState;

//TODO- add key to all tables
