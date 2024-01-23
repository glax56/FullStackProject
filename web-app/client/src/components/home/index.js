import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";

import "./index.css";
import api from "../../axios/api";

function Home() {
  const [appHealth, setAppHealth] = useState(null);

  useEffect(() => {
    checkAppHealth();
  }, []);

  //Cheack server health
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
      {appHealth && appHealth.message === "Failed to connect to DB" ? (
        <Result
          title="Unable to connect to server"
          status="error"
          subTitle="Make sure both back end server and mysql server are running "
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>,
          ]}
        />
      ) : (
        <div className="home__content">
          <div className="home_greetingText">
            <div className="home__greeting"> Welcome to Alternakraft!</div>
            <div> Please select an action to continue</div>
          </div>
          <Link to="/submit_household">
            <Button type="primary">Enter my household info</Button>
          </Link>
          <Link to="/reports">
            <Button key="/reports" type="primary">
              View reports/query data
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default Home;
