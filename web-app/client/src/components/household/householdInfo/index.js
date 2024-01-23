import React, { useState, useEffect } from "react";
import { Checkbox, Form, Input, Select, Button, Divider, message } from "antd";
import api from "../../../axios/api";
import { translateErrorMessage } from "../../../utils/errTranslator";

const { useForm } = Form;
const CheckboxGroup = Checkbox.Group;

//Form layout
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

// Home types -
const homeTypes = [
  { label: "House", value: "House" },
  { label: "Apartment", value: "Apartment" },
  { label: "Townhome", value: "Townhome" },
  { label: "Condominium", value: "Condominium" },
  { label: "Modular home", value: "Modular home" },
  { label: "Tiny house", value: "Tiny house" },
];

function HouseholdInfo({ setCurrentStep, setCurrentHouseholdID }) {
  const [heatingCoolingAbsence, setHeatingCoolingAbsence] = useState({
    heating: false,
    cooling: false,
  });
  const [publicUtilies, setPublicUtilies] = useState([]);

  //Get all public utilities when component loads
  useEffect(() => {
    getPublicUtilities();
  }, []);

  const getPublicUtilities = async () => {
    try {
      const response = await api.get("/household/allPublicUtilities/");
      if (response.data) {
        const utilities = response.data.map((data) => ({
          label: data.public_utility,
          value: data.public_utility_id,
        }));
        setPublicUtilies(utilities);
      }
    } catch (err) {
      const m = translateErrorMessage(err);
      if (m) {
        message.error(m);
      }
    }
  };

  //form
  const [houseHoldInfoForm] = useForm();

  //Handle heating  checkbox change
  const handleHeatingPresenceChange = (e) => {
    setHeatingCoolingAbsence({
      ...heatingCoolingAbsence,
      heating: e.target.checked,
    });
    houseHoldInfoForm.setFieldsValue({ heating: "" });
  };

  //Handle cooling checkbox change
  const handleCoolingPresenceChange = (e) => {
    setHeatingCoolingAbsence({
      ...heatingCoolingAbsence,
      cooling: e.target.checked,
    });
    houseHoldInfoForm.setFieldsValue({ cooling: "" });
  };

  // When next button is clicked
  const handleNextBtnClick = async () => {
    try {
      const payload = await houseHoldInfoForm.validateFields();
      const response = await api.post("/household/householdDetails", payload);
      setCurrentHouseholdID(response.data.householdID);
      setCurrentStep("appliances");
    } catch (err) {
      const m = translateErrorMessage(err);
      if (m) {
        message.error(m);
      }
    }
  };

  //Handle postal code value change
  const handlePostalCodeValueChange = (e) => {
    const cleanedPostalCode = e.target.value.replace(/[^0-9]/g, "");
    houseHoldInfoForm.setFieldsValue({ postalCode: cleanedPostalCode });
  };

  //JSX
  return (
    <div className="householdInfo">
      <div className="householdInfo_form">
        <Form
          size="small"
          colon={false}
          validateTrigger="onSubmit"
          form={houseHoldInfoForm}
          {...formLayout}
          labelAlign="left"
        >
          <Divider
            orientation="left"
            orientationMargin="0"
            className="form__divider"
          >
            Add household info
          </Divider>
          <Form.Item
            label="Email"
            name="email"
            validateTrigger={["onBlur"]}
            rules={[
              {
                type: "email",
                message: "Invalid E-mail",
              },
              {
                required: true,
                message: "E-mail is required",
              },
              {
                max: 250,
                message: "E-mail too long - max 250 chars",
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Postal Code"
            name="postalCode"
            validateTrigger={["onBlur"]}
            onChange={handlePostalCodeValueChange}
            rules={[
              {
                required: true,
                message: "Postal code is required",
              },
              {
                pattern: /^[0-9]{5}$/,
                message: "Invalid postal code",
              },
            ]}
          >
            <Input maxLength={5} />
          </Form.Item>

          <Divider
            orientation="left"
            orientationMargin="0"
            className="form__divider"
          >
            Household details
          </Divider>

          <Form.Item
            label="Home Type"
            name="household_type"
            validateTrigger={["onBlur"]}
            rules={[
              {
                required: true,
                message: "Home type is required",
              },
            ]}
          >
            <Select options={homeTypes}></Select>
          </Form.Item>

          <Form.Item
            label="Square Footage"
            name="square_footage"
            type="number"
            validateTrigger={["onBlur"]}
            required={true}
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      new Error("Square footage is required")
                    );
                  }
                  const intValue = parseInt(value, 10);
                  if (isNaN(intValue) || intValue.toString() !== value) {
                    return Promise.reject(
                      new Error("Square footage must  be a whole number.")
                    );
                  }

                  if (intValue < 1) {
                    return Promise.reject(
                      new Error("Square footage cannot be zero or less")
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
            label="Public Utilities"
            name="publicUtilities"
            validateTrigger={["onBlur"]}
          >
            <CheckboxGroup options={publicUtilies} />
          </Form.Item>

          <Divider
            orientation="left"
            orientationMargin="0"
            className="form__divider"
          >
            Thermostat settings
          </Divider>

          <Form.Item label="Heating">
            <Form.Item
              name="heating"
              disabled={!heatingCoolingAbsence.heating}
              validateTrigger={["onBlur"]}
              style={{
                display: "inline-block",
                width: "calc(67% - 8px)",
                marginBottom: "0px",
              }}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value && !heatingCoolingAbsence.heating) {
                      return Promise.reject(
                        new Error("If no heating, select no heating")
                      );
                    }
                    const intValue = parseInt(value, 10);
                    if (
                      !heatingCoolingAbsence.heating &&
                      (isNaN(intValue) || intValue.toString() !== value)
                    ) {
                      return Promise.reject(
                        new Error("Heating temp must be a whole number")
                      );
                    }
                    if (intValue < 0) {
                      return Promise.reject(
                        new Error("Heating temp cannot be a negative")
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" disabled={heatingCoolingAbsence.heating} />
            </Form.Item>
            <Form.Item
              name="noHeat"
              label=" "
              style={{
                display: "inline-block",
                width: "calc(33% - 8px)",
                margin: "0 8px",
                marginBottom: "5px",
              }}
            >
              <Checkbox
                checked={heatingCoolingAbsence.heating}
                onChange={handleHeatingPresenceChange}
              >
                No Heat
              </Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item label="Cooling">
            <Form.Item
              name="cooling"
              disabled={!heatingCoolingAbsence.cooling}
              validateTrigger={["onBlur"]}
              style={{
                display: "inline-block",
                width: "calc(67% - 8px)",
                marginBottom: "0px",
              }}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value && !heatingCoolingAbsence.cooling) {
                      return Promise.reject(
                        new Error("If no cooling, select no cooling")
                      );
                    }
                    const intValue = parseInt(value, 10);
                    if (
                      !heatingCoolingAbsence.cooling &&
                      (isNaN(intValue) || intValue.toString() !== value)
                    ) {
                      return Promise.reject(
                        new Error("Cooling temp must be a whole number")
                      );
                    }
                    if (intValue < 0) {
                      return Promise.reject(
                        new Error("Cooling temp cannot be a negative ")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" disabled={heatingCoolingAbsence.cooling} />
            </Form.Item>
            <Form.Item
              name="noCooling"
              label=" "
              style={{
                display: "inline-block",
                width: "calc(33% - 8px)",
                margin: "0 8px",
              }}
            >
              <Checkbox
                checked={heatingCoolingAbsence.cooling}
                onChange={handleCoolingPresenceChange}
              >
                No Cooling
              </Checkbox>
            </Form.Item>
          </Form.Item>
        </Form>
      </div>
      <div className="householdInfo__form_actions">
        <Button size="small" type="primary" onClick={handleNextBtnClick}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default HouseholdInfo;
