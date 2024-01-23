import React from "react";
import { Link } from "react-router-dom";
import { DoubleLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "./index.css";

function ReturnToReportBtn({ title }) {
  return (
    <div className="returnToAllReportsBtn">
      <Link to="/reports">
        <Button
          size="small"
          type="primary"
          className="backToReportsBtn"
          icon={<DoubleLeftOutlined />}
        >
          All reports
        </Button>
      </Link>
    </div>
  );
}

export default ReturnToReportBtn;
