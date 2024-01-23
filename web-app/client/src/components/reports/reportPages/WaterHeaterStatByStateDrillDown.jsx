import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import { useParams } from "react-router-dom";
import ReturnToReportBtn from "../ReturnToReportBtn";
import api from "../../../axios/api";

import "../index.css";
const waterHeaterStatDrillDownTableCols = [
  { title: "", dataIndex: "sn", align: "center" },
  { title: "Energy Source", dataIndex: "EnergySource", align: "center" },
  { title: "Min Tank Size", dataIndex: "MinTankSize", align: "center" },
  { title: "Avg Tank Size", dataIndex: "AvgTankSize", align: "center" },
  { title: "Max Tank Size", dataIndex: "MaxTankSize", align: "center" },
  { title: "Min Temp Setting", dataIndex: "MinTempSetting", align: "center" },
  { title: "Avg Temp Setting", dataIndex: "AvgTempSetting", align: "center" },
  { title: "Max Temp Setting", dataIndex: "MaxTempSetting", align: "center" },
];

function WaterHeaterStatByStateDrillDown() {
  const { state } = useParams();

  //When component loads
  useEffect(() => {
    waterHeaterStatForGivenState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [
    gettingWaterHeaterStatForGivenState,
    setGettingWaterHeaterStatForGivenState,
  ] = useState(false);
  const [waterHeaterStatForState, setWaterHeaterStatForState] = useState([]);

  // func to get top manufacturer
  const waterHeaterStatForGivenState = async () => {
    try {
      setGettingWaterHeaterStatForGivenState(true);
      const response = await api.get(
        `/reports/waterHeaterStatByStateDrillDown/${state}`
      );
      let data = response.data;
      data.forEach((d, index) => {
        d.sn = index + 1;
      });
      setWaterHeaterStatForState(data);
    } catch (err) {
      message.error("Failed to fetch water heater by state");
    } finally {
      setGettingWaterHeaterStatForGivenState(false);
    }
  };

  return (
    <div>
      {/* <div className="reportTitle">{state} - Water heater statistics</div> */}
      <Table
        className="reportTable"
        size="small"
        bordered={true}
        dataSource={waterHeaterStatForState}
        pagination={false}
        columns={waterHeaterStatDrillDownTableCols}
        loading={gettingWaterHeaterStatForGivenState}
        title={() => (
          <div className="table__header">{state} - Water heater statistics</div>
        )}
      />
      <ReturnToReportBtn />
    </div>
  );
}

export default WaterHeaterStatByStateDrillDown;
