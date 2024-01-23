import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import "../index.css";
import api from "../../../axios/api";
import ReturnToReportBtn from "../ReturnToReportBtn";

const manufacturer_count = 25;

//Top manufacturer table columns
const topManufacturerTableColumn = [
  {
    title: "",
    dataIndex: "sn",
    render: (record) => {
      return `${record}.`;
    },
    align: "center",
  },
  {
    title: "Manufacturer",
    dataIndex: "Manufacturer",
    render: (record) => {
      return <a href={`/top_manufacturers/${record}`}>{record}</a>;
    },
  },
  {
    title: "Total Appliances",
    dataIndex: "TotalAppliances",
    width: "28%",
    align: "center",
  },
];

function TopManufacturers() {
  const [manufacturers, setManufacturers] = useState([]);

  //When component loads
  useEffect(() => {
    getTopManufacturer();
  }, []);

  // func to get top manufacturer
  const getTopManufacturer = async () => {
    try {
      const response = await api.get(
        `/reports/topManufacturers/${manufacturer_count}`
      );
      let data = response.data;
      data.forEach((d, index) => {
        d.sn = index + 1;
      });
      setManufacturers(response.data);
    } catch (err) {
      message.error("Failed to fetch top manufacturers");
    }
  };

  //JSX
  return (
    <div className="report-wrapper">
      <div className="reportTitle"></div>
      <Table
        className="reportTable"
        size="small"
        columns={topManufacturerTableColumn}
        bordered={true}
        style={{ width: "500px" }}
        pagination={false}
        dataSource={manufacturers}
        rowKey={(record) => record.Manufacturer}
        title={() => (
          <div className="table__header">
            Top {manufacturer_count} Manufacturers
          </div>
        )}
      />
      <ReturnToReportBtn />
    </div>
  );
}

export default TopManufacturers;
