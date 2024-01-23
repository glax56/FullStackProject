import React, { useState, useEffect } from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

import api from "../../axios/api";
import "./index.css";

function CheckDbConnection() {
  const navigate = useNavigate();
  const [appHealth, setAppHealth] = useState(null);

  useEffect(() => {
    checkAppHealth();
  }, []);

  //Cheack health
  const checkAppHealth = async () => {
    try {
      const response = await api.get(`/db/serverHealth`);
      setAppHealth(response.data);
    } catch (err) {
      setAppHealth({
        message: "Failed to connect to DB",
        data: { upTime: "0 Seconds" },
      });
      console.log(err);
    }
  };

  return (
    <>
      {appHealth ? (
        <Result
          status={
            appHealth.message !== "Failed to connect to DB"
              ? "success"
              : "error"
          }
          title={appHealth.message}
          subTitle={`Uptime : ${appHealth.data.upTime}`}
          extra={[
            <Button type="primary" key="console" onClick={() => navigate("/")}>
              Go Home
            </Button>,
          ]}
        />
      ) : null}
    </>
  );
}

export default CheckDbConnection;
