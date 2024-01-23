import React, { useEffect } from "react";
import { Form, Button, Divider, Select, Space, Input, message } from "antd";
import "../index.css";
import { useState } from "react";
import api from "../../../axios/api";
import { translateErrorMessage } from "../../../utils/errTranslator";

const { useForm } = Form;

//Form Layout
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

function AddPowerGenerationForm({
  setDoneAddingPowerGenerationSource,
  setCurrentStep,
  currentHouseholdID,
  powerGeneratorCount,
  setPowerGeneratorCount,
  isHouseholdOffGrid,
}) {
  const [powerGenerationForm] = useForm();
  const [powerGenerationTypes, setPowerGenerationTypes] = useState([]);

  // When component loads -
  useEffect(() => {
    getPowerGenerationTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Func to get all powergeneration types
  const getPowerGenerationTypes = async () => {
    try {
      const response = await api("/household/powerGenerationTypes");
      setPowerGenerationTypes(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // When next btn is clicked
  const handleNextBtnClick = async () => {
    try {
      // Do error check
      const payload = await powerGenerationForm.validateFields();

      // Add below to payload
      payload.householdID = currentHouseholdID;
      payload.powerGeneratorID = powerGeneratorCount + 1;
      setPowerGeneratorCount((prev) => prev + 1);

      await api.post(`/household/powerGeneration`, payload);
      setDoneAddingPowerGenerationSource(true);
    } catch (err) {
      const m = translateErrorMessage(err);
      if (m) {
        message.error(m);
      }
    }
  };

  // When skip btn is clicked
  const handleSkip = () => {
    setCurrentStep("done");
  };

  return (
    <div className="appliances">
      <div className="appliances_form">
        <Form
          size="small"
          colon={false}
          {...formLayout}
          labelAlign="left"
          name="add_power_form"
          form={powerGenerationForm}
        >
          <Divider
            orientation="left"
            orientationMargin="0"
            className="form__divider"
          >
            Power Generation
          </Divider>

          <Form.Item
            label="Type"
            name="generatorTypeID"
            rules={[
              {
                required: true,
                message: "Power generation is required",
              },
            ]}
          >
            <Select
              options={powerGenerationTypes.map((pg) => ({
                label: pg.generator_type,
                value: pg.generatorTypeID,
              }))}
            ></Select>
          </Form.Item>

          <Form.Item
            label="Monthly kWh"
            name="monthly_kilowatt"
            required={true}
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(new Error("Monthly KWh is required"));
                  }

                  const intValue = parseInt(value, 10);
                  if (isNaN(intValue) || intValue.toString() !== value) {
                    return Promise.reject(
                      new Error("Monthly KWH must be a whole number.")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" step={1} />
          </Form.Item>

          <Form.Item label="Storage KWh" name="battery_storage">
            <Input type="number" />
          </Form.Item>
        </Form>
      </div>

      <div className="householdInfo__form_actions">
        <Space>
          {!isHouseholdOffGrid ? (
            <Button size="small" type="primary" onClick={handleSkip} ghost>
              Skip
            </Button>
          ) : null}
          <Button size="small" type="primary" onClick={handleNextBtnClick}>
            Add
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default AddPowerGenerationForm;
