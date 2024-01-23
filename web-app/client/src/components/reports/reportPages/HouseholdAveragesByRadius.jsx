import React, { useState } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  Descriptions,
  Table,
  message,
} from "antd";

import "../index.css";
import ReturnToReportBtn from "../ReturnToReportBtn";
import api from "../../../axios/api";

//Radius options
const radiusOption = [
  { label: "0", value: 0 },
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  { label: "250", value: 250 },
];

//Household type count cols
const householdTypeCountTableCols = [
  {
    title: "Household Type",
    dataIndex: "household_type",
  },
  {
    title: "Count",
    dataIndex: "household_count",
  },
];

function HouseholdAveragesByRadius() {
  const [searchParams, setSearchParams] = useState(null);
  const [householdTypeCount, setHouseholdTypeCount] = useState(null);
  const [avgeSqFootage, setAvgSqFootage] = useState(null);
  const [avgHeatingTemp, setAvgHeatingTemp] = useState(null);
  const [avgCoolingTemp, setAvgCoolingTemp] = useState(null);
  const [publicUtilities, setPublicUtilities] = useState(null);
  const [offGridHouseholdCount, setOffGridHouseholdCount] = useState(null);
  const [householdCountWithinRadius, setHouseholdCountWithinRadius] =
    useState(null);
  const [powerGeneratingHouseHolds, setPowerGeneratingHouseholds] =
    useState(null);
  const [mostCommonPowerGenSrc, setMostCommonPowerGenSrc] = useState(null);
  const [avgPowerGen, setAvgPowerGen] = useState(null);
  const [householdWithBattryStorageCount, setHouseholdWithBattryStorageCount] =
    useState(null);
  const [form] = Form.useForm();

  // When search btn is clicked
  const handleSearch = async (values) => {
    //Check if zip code is valid
    try {
      const { postalCode } = values;
      const response = await api.get(
        `/reports/validatePostalCode?postalCode=${postalCode}`
      );
      const postalCodeCount = response.data.count;
      if (postalCodeCount === 0) {
        throw Error("Invalid postal code");
      }
    } catch (err) {
      message.error(err.message);
      return;
    }
    //Get all household types count
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/householdCountByRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setHouseholdTypeCount(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }

    //Get  avg sqft for household within the radius
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/householdAvgSqftByRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setAvgSqFootage(response.data[0]);
    } catch (err) {
      console.log(err);
    }

    //Get avg heating temp
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/householdAvgHeatingByRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setAvgHeatingTemp(response.data[0]);
    } catch (err) {
      console.log(err);
    }

    //Get avg cooling temp
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/householdAvgCooolingByRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setAvgCoolingTemp(response.data[0]);
    } catch (err) {
      console.log(err);
    }

    //Get public utilities used
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/publicUtilitiesByRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setPublicUtilities(response.data[0]);
    } catch (err) {
      console.log(err);
    }

    //Get off-the-grid household count
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/offGridHouseholdCountByRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setOffGridHouseholdCount(response.data[0]);
    } catch (err) {
      console.log(err);
    }

    // Get household count within radius
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/householdCountInRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setHouseholdCountWithinRadius(response.data[0]);
    } catch (err) {
      console.log(err);
    }

    //Get count of household that has power generation
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/powerGeneratingHouseholdCountByRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setPowerGeneratingHouseholds(response.data[0]);
    } catch (err) {
      console.log(err);
    }

    //Most common power generation source
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/mostCommonPowerGenSourceByRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setMostCommonPowerGenSrc(response.data[0]);
    } catch (err) {
      console.log(err);
    }

    //Avg power generation per household
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/avgPowerGenByRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setAvgPowerGen(response.data[0]);
    } catch (err) {
      console.log(err);
    }

    //Count of household with battery storage
    try {
      const { postalCode, distance } = values;
      setSearchParams({ postalCode, distance });
      const response = await api.get(
        `/reports/countOfHouseholdWithBatteryStorageByRadius?postalCode=${postalCode}&distance=${distance} `
      );
      setHouseholdWithBattryStorageCount(response.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  //Handle postal code value change
  const handlePostalCodeValueChange = (e) => {
    const cleanedPostalCode = e.target.value.replace(/[^0-9]/g, "");
    form.setFieldsValue({ postalCode: cleanedPostalCode });
  };

  return (
    <div style={{ marginBottom: "100px" }}>
      {searchParams ? null : (
        <div className="reportTitle">Household averages by radius</div>
      )}
      <div className="search-by-radius-main">
        <div className="search-by-radius-section">
          <Form
            layout="vertical"
            onFinish={(values) => {
              handleSearch(values);
            }}
            form={form}
          >
            <Row gutter={5} className="searchInputs">
              <Col>
                <Form.Item
                  required
                  label={searchParams ? false : "Postal code"}
                  name="postalCode"
                  rules={[
                    {
                      required: true,
                      message: "Postal code required",
                    },
                  ]}
                >
                  <Input
                    size="small"
                    placeholder="Postal code"
                    maxLength={5}
                    onChange={handlePostalCodeValueChange}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  required
                  name="distance"
                  label={searchParams ? null : "Radius"}
                  rules={[
                    {
                      required: true,
                      message: "Radius required",
                    },
                  ]}
                >
                  <Select
                    options={radiusOption}
                    style={{ width: "100px" }}
                    size="small"
                  ></Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label={searchParams ? false : " "}>
                  <Button type="primary" htmlType="submit" size="small">
                    Search
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Descriptions
            bordered={true}
            column={1}
            size="small"
            style={{ width: "550px", marginTop: "20px" }}
          >
            {searchParams ? (
              <>
                <Descriptions.Item label="Postal Code">
                  {searchParams.postalCode}
                </Descriptions.Item>
                <Descriptions.Item label="Search Radius (in Miles)">
                  {searchParams.distance}
                </Descriptions.Item>
              </>
            ) : null}

            {avgeSqFootage ? (
              <Descriptions.Item label="Average SQ footage">
                {avgeSqFootage.avg_square_footage}
              </Descriptions.Item>
            ) : null}

            {avgHeatingTemp ? (
              <Descriptions.Item label="Average Heating Temperature">
                {avgHeatingTemp.avg_heating_temp}
              </Descriptions.Item>
            ) : null}

            {avgCoolingTemp ? (
              <Descriptions.Item label="Average Cooling Temperature">
                {avgCoolingTemp.avg_cooling_temp}
              </Descriptions.Item>
            ) : null}

            {publicUtilities ? (
              <Descriptions.Item label="Public Utilities">
                {publicUtilities?.public_utilities_used?.replace(/,/g, ", ")}
              </Descriptions.Item>
            ) : null}

            {offGridHouseholdCount ? (
              <Descriptions.Item label="Total Off-the-grid Households">
                {offGridHouseholdCount.num_off_grid_homes}
              </Descriptions.Item>
            ) : null}

            {householdCountWithinRadius ? (
              <Descriptions.Item label="Total households within radius">
                {householdCountWithinRadius.num_households_in_radius}
              </Descriptions.Item>
            ) : null}

            {powerGeneratingHouseHolds ? (
              <Descriptions.Item label="Total Households with Power Generation ">
                {powerGeneratingHouseHolds.num_homes_with_power_generation}
              </Descriptions.Item>
            ) : null}

            {mostCommonPowerGenSrc ? (
              <Descriptions.Item label="Most Common Energy Generation Source">
                {mostCommonPowerGenSrc.generator_type}
              </Descriptions.Item>
            ) : null}

            {avgPowerGen ? (
              <Descriptions.Item label="Average Monthly Power Generation/Household">
                {avgPowerGen.avg_monthly_power_gen_per_household}
              </Descriptions.Item>
            ) : null}

            {householdWithBattryStorageCount ? (
              <Descriptions.Item label="Total Household with battery storage">
                {
                  householdWithBattryStorageCount.num_households_with_battery_storage
                }
              </Descriptions.Item>
            ) : null}
          </Descriptions>
        </div>
        <div className="search-by-radius-section">
          {householdTypeCount ? (
            <Table
              columns={householdTypeCountTableCols}
              dataSource={householdTypeCount}
              size="small"
              style={{ width: "450px", marginTop: "20px" }}
              pagination={false}
              caption={
                <div className="table-caption"> Household types count </div>
              }
            ></Table>
          ) : null}
        </div>
      </div>

      <ReturnToReportBtn />
    </div>
  );
}

export default HouseholdAveragesByRadius;
