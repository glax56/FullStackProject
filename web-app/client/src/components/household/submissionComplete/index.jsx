import React, { useEffect } from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function SubmissionComplte({ setCurrentHouseholdID }) {
  const navigate = useNavigate();

  //when component loads
  useEffect(() => {
    setCurrentHouseholdID(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When return to main menu is clicked
  const handleGoToHome = () => {
    navigate("/");
  };
  return (
    <div className="householdInfo">
      <Result
        size="small"
        status="success"
        title="Submission complete !!"
        subTitle="Thank you for providing your information to Alternakraft !"
        extra={[
          <Button type="primary" onClick={handleGoToHome}>
            Return to main menu
          </Button>,
        ]}
      />
    </div>
  );
}

export default SubmissionComplte;
