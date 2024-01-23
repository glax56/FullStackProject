import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

const manufacturer_count = 25;

function Reports() {
  return (
    <div className="reports__index">
      <div>
        <h2> All reports</h2>
      </div>
      <div className="reports__all_links">
        <div>
          <Link to="/top_manufacturers">
            Top {manufacturer_count} manufacturers
          </Link>
        </div>
        <div>
          <Link to="/manufacturer_model_search">
            Manufacturer / model search
          </Link>
        </div>
        <div>
          <Link to="/heating_cooling_method_details">
            Heating/cooling method details
          </Link>
        </div>
        <div>
          <Link to="/water_heater_stat_by_state">
            Water heater statistics by state
          </Link>
        </div>
        <div>
          <Link to="/off-grid-household-dashboard">
            Off-the-grid household dashboard
          </Link>
        </div>
        <div>
          <Link to="/household_averages_by_radius">
            Household averages by radius
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Reports;
