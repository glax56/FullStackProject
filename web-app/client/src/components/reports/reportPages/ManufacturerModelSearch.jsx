import React, { useState, useEffect } from "react";
import { Input, Table, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";

import "../index.css";
import ReturnToReportBtn from "../ReturnToReportBtn";
import api from "../../../axios/api";

function ManufacturerModelSearch() {
  const [searchString, setSearchString] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSerchResult] = useState([]);

  // Columns
  const manufacturerModelResultColumns = [
    // {
    //   title: "",
    //   dataIndex: "sn",
    //   width: "3%",
    // },
    {
      title: "Manufacturer",
      width: "15%",
      dataIndex: "Manufacturer",
      render: (record) => {
        return (
          <span
            className={
              record?.toLowerCase().includes(searchString?.toLowerCase())
                ? "matchedString"
                : "unmatched"
            }
          >
            {record}
          </span>
        );
      },
    },
    {
      title: "Model",
      dataIndex: "Model",
      render: (record) => {
        return (
          <span
            className={
              record?.toLowerCase().includes(searchString?.toLowerCase())
                ? "matchedString"
                : "unmatched"
            }
          >
            {record}
          </span>
        );
      },
    },
  ];

  // debounce search string
  const debouncedSetSearchString = debounce((value) => {
    setSearchString(value);
  }, 500);

  useEffect(() => {
    if (searchString) {
      searchManufacturerAndModel(searchString);
    } else {
      setSerchResult([]);
    }
  }, [searchString]);

  const searchManufacturerAndModel = async (searchString) => {
    try {
      setSearching(true);
      const response = await api.get(
        `/reports/searchModelManufacturer?keyword=${searchString}`
      );
      const { data } = response;

      const resultArray = data.map((d, i) => {
        return { ...d, sn: i + 1 };
      });

      setSerchResult(resultArray);

      setSearching(false);
    } catch (err) {
      setSearching(false);
      message.error("Failed to search model and manufacturer");
    }
  };

  return (
    <div className="report-wrapper">
      <div className="reportTitle">Search Manufacturer / Model </div>
      <div style={{ marginTop: "10px" }}>
        <Input
          style={{ width: 240 }}
          size="small"
          placeholder="Start typing .."
          onChange={(e) => debouncedSetSearchString(e.target.value)}
          suffix={<SearchOutlined />}
        />
        <Table
          className="reportTable"
          size="small"
          // style={{ width: "500px" }}
          bordered={true}
          pagination={false}
          columns={manufacturerModelResultColumns}
          loading={searching}
          dataSource={searchResult}
          rowKey={(row) => {
            return row.manufacturer;
          }}
        />
      </div>
      <ReturnToReportBtn />
    </div>
  );
}

export default ManufacturerModelSearch;
