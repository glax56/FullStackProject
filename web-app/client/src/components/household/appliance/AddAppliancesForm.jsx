import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Divider, message, Checkbox } from "antd";

import api from "../../../axios/api";
import "../index.css";
import { translateErrorMessage } from "../../../utils/errTranslator";

const { useForm } = Form;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

//Form Layout
const formLayout = {
  labelCol: { span: 11 },
  wrapperCol: { span: 13 },
};

// Appliance type
const applianceTypes = [
  { label: "Air handler", value: "Air handler" },
  { label: "Water heater", value: "Water heater" },
];

// Heating cooling methods
const heatingCoolingMethods = [
  { label: "Air conditioner", value: "Air conditioner" },
  { label: "Heater", value: "Heater" },
  { label: "Heat pump", value: "Heat pump" },
];

// Heater energy source
const heaterEnergySource = [
  { label: "Electric", value: "Electric" },
  { label: "Gas", value: "Gas" },
  { label: "Thermosolar", value: "Thermosolar" },
];

// Water heater energy source
const waterHeaterEnergySource = [
  { label: "Electric", value: "Electric" },
  { label: "Gas", value: "Gas" },
  { label: "Fuel oil", value: "Fuel oil" },
  { label: "Heat pump", value: "Heat pump" },
];

function AddAppliancesForm({
  setDoneAddingAppliances,
  applianceCount,
  setApplianceCount,
  currentHouseholdID,
}) {
  const [applianceForm] = useForm();
  const [manufacturerList, setManufacturerList] = useState([]);
  const [selectedApplianceType, setSelectedApplianceType] = useState(null);
  const [selectedHeatingCoolingMethod, setSelectedHeatingCoolingMethod] =
    useState([]);

  // When compoent loads
  useEffect(() => {
    getAllManufacturers();
  }, []);

  const getAllManufacturers = async () => {
    try {
      const response = await api.get(`/household/allManufacturers`);
      setManufacturerList(response.data);
    } catch (err) {
      const m = translateErrorMessage(err);
      if (m) {
        message.error(m);
      }
    }
  };

  //Handle next btn clicked
  const handleNextBtnClick = async () => {
    try {
      // Validate fields and add householdID and applianceID to the payload
      const payload = await applianceForm.validateFields();
      payload.householdID = currentHouseholdID;
      payload.applianceID = applianceCount + 1;

      await api.post("/household/appliance/", payload);
      setApplianceCount((prev) => prev + 1);
      setDoneAddingAppliances(true);
    } catch (err) {
      const m = translateErrorMessage(err);
      if (m) {
        message.error(m);
      }
    }
  };

  return (
    <div className="appliances">
      <div className="appliances_form">
        <Form
          size="small"
          colon={false}
          {...formLayout}
          labelAlign="left"
          form={applianceForm}
        >
          <Divider
            orientation="left"
            orientationMargin="0"
            className="form__divider"
          >
            Add an appliance
          </Divider>

          <Form.Item
            label="Appliance Type"
            name="applianceType"
            validateTrigger={["onBlur"]}
            rules={[
              {
                required: true,
                message: "Select appliance type",
              },
            ]}
          >
            <Select
              options={applianceTypes}
              onChange={(value) => {
                setSelectedApplianceType(value);
              }}
            ></Select>
          </Form.Item>

          {selectedApplianceType ? (
            <>
              <Form.Item
                label="Manufacturer"
                name="manufacturerID"
                validateTrigger={["onBlur"]}
                rules={[
                  {
                    required: true,
                    message: "Select a manufacturer",
                  },
                ]}
              >
                <Select>
                  {manufacturerList.map((manufacturer) => {
                    return (
                      <Option
                        value={manufacturer.manufacturerID}
                        key={manufacturer.manufacturerID}
                      >
                        {manufacturer.manufacturer_name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item label="Model name" name="model_name">
                <Input type="text" maxLength={150} />
              </Form.Item>

              <Divider
                orientation="left"
                orientationMargin="0"
                className="form__divider"
              >
                Appliance details
              </Divider>

              <Form.Item
                label="BTU Rating"
                name="btu_rating"
                validateTrigger={["onBlur"]}
                rules={[
                  {
                    required: true,
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(
                          new Error("BTU rating is required")
                        );
                      }
                      const intValue = parseInt(value, 10);
                      if (isNaN(intValue) || intValue.toString() !== value) {
                        return Promise.reject(
                          new Error("BTU rating must be a whole number.")
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </>
          ) : null}

          {/* // -------------------------------------------------------------------- */}
          {selectedApplianceType === "Air handler" ? (
            <>
              <Form.Item
                label="Fan RPM"
                name="rpm"
                validateTrigger={["onBlur"]}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error("Fan RPM is required"));
                      }
                      const intValue = parseInt(value, 10);
                      if (isNaN(intValue) || intValue.toString() !== value) {
                        return Promise.reject(
                          new Error("Fan RPM must be a whole number.")
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="Heating/cooling method"
                name="heating_cooling_method"
                validateTrigger={["onBlur"]}
                rules={[
                  {
                    required: true,
                    message: "Select heating cooling method",
                  },
                ]}
              >
                <CheckboxGroup
                  options={heatingCoolingMethods}
                  onChange={(methods) => {
                    setSelectedHeatingCoolingMethod(methods);
                  }}
                />
              </Form.Item>
            </>
          ) : null}
          {/* // -------------------------------------------------------------------- */}
          {selectedApplianceType === "Water heater" ? (
            <>
              <Form.Item
                label="Tank Size ( in gallons )"
                name="tank_size"
                validateTrigger={["onBlur"]}
                required={true}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(
                          new Error("Tank size is required")
                        );
                      }
                      const decimals = (value.split(".")[1] || "").length;

                      let tankSize;
                      if (decimals > 0) {
                        tankSize = parseFloat(value);
                      } else {
                        tankSize = parseInt(value);
                      }

                      if (isNaN(tankSize) || decimals > 1) {
                        return Promise.reject(
                          new Error(
                            "Tank size must be a whole number or a decimal number up to the tenth decimal point"
                          )
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="Current temperature setting"
                name="temp_setting"
                validateTrigger={["onBlur"]}
                rules={[
                  {
                    validator: (_, value) => {
                      const intValue = parseInt(value, 10);
                      if (isNaN(intValue) || intValue.toString() !== value) {
                        return Promise.reject(
                          new Error(
                            "Current temp setting must be a whole number."
                          )
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="Energy Source"
                name="energy_source"
                validateTrigger={["onBlur"]}
                rules={[
                  {
                    required: true,
                    message: "Select energy source",
                  },
                ]}
              >
                <Select options={waterHeaterEnergySource}></Select>
              </Form.Item>
            </>
          ) : null}

          {selectedApplianceType === "Air handler" &&
          selectedHeatingCoolingMethod.includes("Air conditioner") ? (
            <>
              <Form.Item
                label="Energy efficiency ratio"
                name="eer"
                validateTrigger={["onBlur"]}
                required={true}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error("EER  is required"));
                      }
                      const decimals = (value.split(".")[1] || "").length;

                      let eer;
                      if (decimals > 0) {
                        eer = parseFloat(value);
                      } else {
                        eer = parseInt(value);
                      }

                      if (isNaN(eer) || decimals > 1) {
                        return Promise.reject(
                          new Error(
                            "EER rating must be a whole number or a decimal number up to the tenth decimal point"
                          )
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </>
          ) : null}

          {/* //------------------------------------------------------------------  */}
          {selectedApplianceType === "Air handler" &&
          selectedHeatingCoolingMethod.includes("Heat pump") ? (
            <>
              <Form.Item
                label="Seasonal energy efficiency ratio"
                name="seer"
                validateTrigger={["onBlur"]}
                required={true}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error("SEER  is required"));
                      }
                      const decimals = (value.split(".")[1] || "").length;

                      let seer;
                      if (decimals > 0) {
                        seer = parseFloat(value);
                      } else {
                        seer = parseInt(value);
                      }

                      if (isNaN(seer) || decimals > 1) {
                        return Promise.reject(
                          new Error(
                            "SEER rating must be a whole number or a decimal number up to the tenth decimal point"
                          )
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="Heating seasonal performance factor"
                name="hspf"
                validateTrigger={["onBlur"]}
                required={true}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error("HSPF  is required"));
                      }
                      const decimals = (value.split(".")[1] || "").length;

                      let hspf;
                      if (decimals > 0) {
                        hspf = parseFloat(value);
                      } else {
                        hspf = parseInt(value);
                      }

                      if (isNaN(hspf) || decimals > 1) {
                        return Promise.reject(
                          new Error(
                            "HSPF rating must be a whole number or a decimal number up to the tenth decimal point"
                          )
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </>
          ) : null}
          {/* //--------------------------------------------------------  */}

          {selectedApplianceType === "Air handler" &&
          selectedHeatingCoolingMethod.includes("Heater") ? (
            <Form.Item
              label="Energy Source"
              name="source"
              validateTrigger={["onBlur"]}
              rules={[
                {
                  required: true,
                  message: "Select energy source",
                },
              ]}
            >
              <Select options={heaterEnergySource}></Select>
            </Form.Item>
          ) : null}
        </Form>
      </div>

      <div className="householdInfo__form_actions">
        <Button size="small" type="primary" onClick={handleNextBtnClick}>
          Add
        </Button>
      </div>
    </div>
  );
}

export default AddAppliancesForm;
