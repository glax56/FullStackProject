import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";

import Header from "./components/header";
import CheckDbConnection from "./components/appHealth";
import Home from "./components/home";
import Household from "./components/household";

//Reports
import Reports from "./components/reports";
import TopManufacturers from "./components/reports/reportPages/TopManufacturers";
import ManufacturerDrillDown from "./components/reports/reportPages/ManufacturerDrillDown";
import ManufacturerModelSearch from "./components/reports/reportPages/ManufacturerModelSearch";
import HeatingCoolingMethodDetails from "./components/reports/reportPages/HeatingCoolingMethodDetails";
import WaterHeaterStatByState from "./components/reports/reportPages/WaterHeaterStatByState";
import WaterHeaterStatByStateDrillDown from "./components/reports/reportPages/WaterHeaterStatByStateDrillDown";
import OffGridHouseHoldDashBoard from "./components/reports/reportPages/OffGridHouseHoldDashBoard";
import HouseholdAveragesByRadius from "./components/reports/reportPages/HouseholdAveragesByRadius";

import "./App.css";
import api from "./axios/api";

function App() {
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

  //Custom theme
  const customTheme = {
    token: {
      borderRadius: 0,
    },
  };

  return (
    <ConfigProvider theme={customTheme}>
      <div className="app">
        <Router>
          <Header />
          <div className="app__body">
            <Routes>
              {appHealth && appHealth.message === "Failed to connect to DB" ? (
                <>
                  <Route path="/health" element={<CheckDbConnection />} />
                  <Route path="/*" element={<Home replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/health" element={<CheckDbConnection />} />
                  <Route path="/submit_household" element={<Household />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route
                    path="/top_manufacturers"
                    element={<TopManufacturers />}
                  />
                  <Route
                    path="/top_manufacturers/:manufacturer"
                    element={<ManufacturerDrillDown />}
                  />
                  <Route
                    path="/manufacturer_model_search"
                    element={<ManufacturerModelSearch />}
                  />
                  <Route
                    path="/heating_cooling_method_details"
                    element={<HeatingCoolingMethodDetails />}
                  />
                  <Route
                    path="/water_heater_stat_by_state"
                    element={<WaterHeaterStatByState />}
                  />
                  <Route
                    path="/water_heater_stat_by_state/:state"
                    element={<WaterHeaterStatByStateDrillDown />}
                  />
                  <Route
                    path="/off-grid-household-dashboard"
                    element={<OffGridHouseHoldDashBoard />}
                  />
                  <Route
                    path="/household_averages_by_radius"
                    element={<HouseholdAveragesByRadius />}
                  />
                  <Route path="/*" element={<Home replace />} />
                </>
              )}
            </Routes>
          </div>
        </Router>
      </div>
    </ConfigProvider>
  );
}

export default App;
