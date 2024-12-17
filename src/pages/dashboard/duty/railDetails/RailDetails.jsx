import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import FormContainer from '../../../../components/DKG_FormContainer'
import { Table, Spin, Alert } from "antd";

const RailDetails = () => {
    const { railId } = useParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/dashboard/getDimensionalInspectionDtlByRailId?railId=${railId}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch rail details");
            }
            return response.json();
          })
          .then((data) => {
            setDetails(data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
    }, [railId]);

    if (loading) {
        return <Spin tip="Loading rail details..." />;
    }
    
    if (error) {
       return <Alert message="Error" description={error} type="error" showIcon />;
    }

    const columns = [
        {
          title: "Camera ID",
          dataIndex: "cameraId",
          key: "cameraId",
        },
        {
          title: "Inspected At",
          dataIndex: "inspectedAt",
          key: "inspectedAt",
        },
        {
          title: "Result Status",
          dataIndex: "resultStatus",
          key: "resultStatus",
        },
    ];

  return (
    <FormContainer>
        <h1>Rail Details for {railId}</h1>
        <Table columns={columns} dataSource={details} rowKey="cameraId" bordered />
    </FormContainer>
  )
}

export default RailDetails