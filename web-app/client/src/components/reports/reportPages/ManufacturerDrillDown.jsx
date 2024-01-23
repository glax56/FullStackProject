import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table } from "antd";

import "../index.css";
import api from "../../../axios/api";
import ReturnToReportBtn from "../ReturnToReportBtn";

//Table columns
const manufacturerDrillDownTableColumns = [
  {
    title: "",
    dataIndex: "sn",
    align: "center",
    width: "3%",
    render: (record) => {
      return `${record}.`;
    },
  },
  {
    title: "Appliance type",
    dataIndex: "ApplianceType",
  },
  {
    title: "Count",
    dataIndex: "TotalAppliances",
    align: "center",
  },
];

function ManufacturerDrillDown() {
  const { manufacturer } = useParams();
  const [applianceCount, setApplianceCount] = useState([]);

  //When component loads
  useEffect(() => {
    getTopManufacturer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // func to get top manufacturer
  const getTopManufacturer = async () => {
    try {
      const response = await api.get(
        `/reports/manufacturerDrillDown/${manufacturer}`
      );
      let data = response.data;
      data.forEach((d, index) => {
        d.sn = index + 1;
      });
      setApplianceCount(data);
    } catch (err) {
      //TODO - handle error gracefully
      console.log(err);
    }
  };

  return (
    <div className="report-wrapper">
      <Table
        className="reportTable"
        bordered={true}
        size="small"
        dataSource={applianceCount}
        columns={manufacturerDrillDownTableColumns}
        pagination={false}
        style={{ width: "500px" }}
        title={() => (
          <div className="table__header">{`Manufacturer - ${manufacturer}`}</div>
        )}
      />
      <ReturnToReportBtn />
    </div>
  );
}

export default ManufacturerDrillDown;
