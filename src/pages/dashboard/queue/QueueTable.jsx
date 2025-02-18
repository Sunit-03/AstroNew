import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Popover,
  Form,
  Row,
  Col,
  Tag,
  message,
  Spin,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const { Text } = Typography;

const QueueTable = () => {
  // Get the logged-in user's role details from Redux
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;
  const [data, setData] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [requestChangeComment, setRequestChangeComment] = useState("");
  const [additionalInfoComment, setAdditionalInfoComment] = useState("");
  const [indentData, setIndentData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // --- 1. Fetch workflow transitions dynamically on mount ---
  useEffect(() => {
    const fetchTransitions = async () => {
      try {
        const response = await axios.get(
          "http://103.181.158.220:8081/astro-service/getTransitionsByWorkflowId?workflowId=1"
        );
        setTransitions(response.data.responseData || []);
      } catch (error) {
        message.error("Failed to fetch workflow transitions.");
        console.error("Transitions fetch error:", error);
      }
    };
    fetchTransitions();
  }, []);

  // --- 2. Fetch the current user details from the UserMaster API ---
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://103.181.158.220:8081/astro-service/api/userMaster"
        );
        const userData = response.data.responseData;
        if (userData && userData.length > 0) {
          setCurrentUserId(userData[0].userId);
        } else {
          message.error("No user data found.");
        }
      } catch (error) {
        message.error("Failed to fetch user details.");
        console.error("User fetch error:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // --- 3. Fetch queue data based on the logged-in user's role ---
  const fetchData = async (roleName) => {
    if (!roleName) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://103.181.158.220:8081/astro-service/allPendingWorkflowTransition?roleName=${encodeURIComponent(
          roleName
        )}`
      );
      const apiData = response.data.responseData;
      const formattedData = apiData.map((item, index) => ({
        key: index.toString(),
        requestId: item.requestId,
        originalRequestId: item.requestId,
        workflowId: item.workflowId,
        workflowName: item.workflowName,
        status: item.nextAction,
        remarks: item.remarks || "No remarks",
      }));
      setData(formattedData);
    } catch (err) {
      setError(err.message);
      message.error("Failed to fetch queue data from the API.");
      console.error("fetchData error:", err);
    } finally {
      setLoading(false);
    }
  };

  // When the logged-in role information is available, fetch queue data
  useEffect(() => {
    if (auth && auth.role) {
      fetchData(auth.role);
    }
  }, [auth.role]);

  // --- Helper function: Fetch workflowTransitionId for a given indent (requestId) ---
  const fetchWorkflowTransitionId = async (requestId) => {
    try {
      const response = await axios.get(
        `http://103.181.158.220:8081/astro-service/workflowTransitionHistory?requestId=${requestId}`
      );
      const data = response.data.responseData;
      if (Array.isArray(data) && data.length > 0) {
        return data[0].workflowTransitionId;
      }
      return null;
    } catch (error) {
      console.error("Error fetching workflowTransitionId:", error);
      return null;
    }
  };

  const handleApprove = async (record) => {
    if (!currentUserId) {
      message.error("User details not loaded yet.");
      return;
    }
    try {
      const workflowTransitionId = await fetchWorkflowTransitionId(
        record.requestId
      );
      if (!workflowTransitionId) {
        message.error("Workflow transition ID not found for this indent.");
        return;
      }

      const payload = {
        action: "APPROVED",
        actionBy: actionPerformer,
        assignmentRole: null,
        remarks: "Approved successfully",
        requestId: record.requestId,
        workflowTransitionId,
      };

      await axios.post(
        "http://103.181.158.220:8081/astro-service/performTransitionAction",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      message.success(`Indent ${record.requestId} approved successfully.`);
      setData((prevData) =>
        prevData.filter((item) => item.key !== record.key)
      );
    } catch (error) {
      message.error("Failed to approve the indent.");
      console.error("Approval error:", error);
    }
  };

  const handleReject = async (record) => {
    if (!rejectComment.trim()) {
      message.warning("Please enter a reject comment.");
      return;
    }
    if (!currentUserId) {
      message.error("User details not loaded yet.");
      return;
    }
    try {
      const workflowTransitionId = await fetchWorkflowTransitionId(
        record.requestId
      );
      if (!workflowTransitionId) {
        message.error("Workflow transition ID not found for this indent.");
        return;
      }

      const payload = {
        action: "REJECTED",
        actionBy: actionPerformer,
        assignmentRole: null,
        remarks: rejectComment,
        requestId: record.requestId,
        workflowTransitionId,
      };

      await axios.post(
        "http://103.181.158.220:8081/astro-service/performTransitionAction",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      message.success(`Indent ${record.requestId} rejected successfully.`);
      setData((prevData) =>
        prevData.filter((item) => item.key !== record.key)
      );
      setRejectComment("");
    } catch (error) {
      message.error("Failed to reject the indent.");
      console.error("Rejection error:", error);
    }
  };

  const handleRequestChangeSubmit = (record) => {
    const updatedData = data.map((item) =>
      item.key === record.key
        ? { ...item, remarks: `Request Change: ${requestChangeComment}` }
        : item
    );
    setData(updatedData);
    setRequestChangeComment("");
    message.success("Request change comments added.");
  };

  const handleAdditionalInfoSubmit = (record) => {
    const updatedData = data.map((item) =>
      item.key === record.key
        ? { ...item, remarks: `Additional Info: ${additionalInfoComment}` }
        : item
    );
    setData(updatedData);
    setAdditionalInfoComment("");
    message.success("Additional info comments added.");
  };

  // --- Fetch indent details when a Request ID is clicked ---
  const fetchIndentDetails = async (requestId) => {
    if (!requestId) {
      message.error("No indent ID found.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://103.181.158.220:8081/astro-service/api/indents/${requestId}`
      );
      setIndentData(response.data.responseData);
      setModalVisible(true);
    } catch (err) {
      message.error("Failed to fetch indent details.");
      console.error("Indent fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

//   const handleRemoveIndent = (record) => {
//     setData((prevData) =>
//       prevData.filter((item) => item.key !== record.key)
//     );
//     message.success(`Indent ${record.requestId} removed from the queue.`);
//   };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
      sorter: (a, b) => a.requestId.localeCompare(b.requestId),
      render: (text) => (
        <Button type="link" onClick={() => fetchIndentDetails(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Workflow ID",
      dataIndex: "workflowId",
      key: "workflowId",
      filters: [
        { text: "1", value: "1" },
        { text: "2", value: "2" },
        { text: "3", value: "3" },
      ],
      onFilter: (value, record) => record.workflowId === value,
    },
    {
      title: "Workflow Name",
      dataIndex: "workflowName",
      key: "workflowName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Approved" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        if (record.status === "Approved") return null;
        return (
          <Space wrap>
            <Button type="link" onClick={() => handleApprove(record)}>
              Approve
            </Button>
            <Popover
              content={
                <div style={{ padding: 12 }}>
                  <Input.TextArea
                    placeholder="Reject Comments"
                    rows={3}
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleReject(record)}
                    style={{ marginTop: 8 }}
                  >
                    Submit
                  </Button>
                </div>
              }
              title="Reject"
              trigger="click"
            >
              <Button danger type="link">
                Reject
              </Button>
            </Popover>
            <Popover
              content={
                <div style={{ padding: 12 }}>
                  <Input.TextArea
                    placeholder="Request Change Comments"
                    rows={3}
                    value={requestChangeComment}
                    onChange={(e) =>
                      setRequestChangeComment(e.target.value)
                    }
                  />
                  <Button
                    type="primary"
                    onClick={() => handleRequestChangeSubmit(record)}
                    style={{ marginTop: 8 }}
                  >
                    Submit
                  </Button>
                </div>
              }
              title="Request Change"
              trigger="click"
            >
              <Button type="link">Request Change</Button>
            </Popover>
            {/* <Button
              type="link"
              danger
              onClick={() => handleRemoveIndent(record)}
            >
              Remove
            </Button> */}
          </Space>
        );
      },
    },
  ];

  // --- Filter Component remains unchanged ---
  const FilterComponent = ({ onFilter }) => {
    const [form] = Form.useForm();
    const handleReset = () => {
      form.resetFields();
      onFilter({});
    };
    return (
      <Form form={form} onFinish={onFilter}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Form.Item name="requestId" style={{ marginBottom: 10 }}>
              <Input placeholder="Request ID" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="workflowId" style={{ marginBottom: 10 }}>
              <Input placeholder="Workflow ID" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="workflowName" style={{ marginBottom: 10 }}>
              <Input placeholder="Workflow Name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Space style={{ marginBottom: 10 }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
              >
                Search
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </Space>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Display the logged-in user's role details */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Text strong>Role ID:</Text> {auth.roleId || "N/A"}
        </Col>
        <Col>
          <Text strong>Role Name:</Text> {auth.role || "N/A"}
        </Col>
        <Col>
          <Text strong>User ID:</Text> {actionPerformer}
        </Col>
      </Row>

      <FilterComponent onFilter={(filters) => console.log(filters)} />

      {loading ? (
        <Spin size="large" tip="Loading..." style={{ marginTop: 24 }} />
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : (
        <Table columns={columns} dataSource={data} />
      )}

      {/* Indent Details Modal */}
      <Modal
        title={`Indent Details - ${indentData?.indentId || "N/A"}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {indentData ? (
          <div>
            <p>
              <strong>Indentor Name:</strong> {indentData.indentorName}
            </p>
            <p>
              <strong>Email:</strong> {indentData.indentorEmailAddress}
            </p>
            <p>
              <strong>Mobile No:</strong> {indentData.indentorMobileNo}
            </p>
            <p>
              <strong>Project Name:</strong> {indentData.projectName}
            </p>
            <p>
              <strong>Location:</strong> {indentData.consignesLocation}
            </p>
            <p>
              <strong>Estimated Rate:</strong> ₹
              {indentData.estimatedRate &&
                indentData.estimatedRate.toFixed(2)}
            </p>
            <p>
              <strong>Total Price of Materials:</strong> ₹
              {indentData.totalPriceOfAllMaterials &&
                indentData.totalPriceOfAllMaterials.toFixed(2)}
            </p>
            {indentData.isPreBidMeetingRequired && (
              <div>
                <h3>Pre-Bid Meeting</h3>
                <p>
                  <strong>Date:</strong> {indentData.preBidMeetingDate}
                </p>
                <p>
                  <strong>Venue:</strong> {indentData.preBidMeetingVenue}
                </p>
              </div>
            )}
            <h3>Material Details</h3>
            <Table
              dataSource={indentData.materialDetails}
              pagination={false}
              bordered
              columns={[
                {
                  title: "Material Code",
                  dataIndex: "materialCode",
                  key: "materialCode",
                },
                {
                  title: "Description",
                  dataIndex: "materialDescription",
                  key: "materialDescription",
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                },
                {
                  title: "Unit Price",
                  dataIndex: "unitPrice",
                  key: "unitPrice",
                  render: (text) => `₹${text.toFixed(2)}`,
                },
                {
                  title: "Total Price",
                  dataIndex: "totalPrice",
                  key: "totalPrice",
                  render: (text) => `₹${text.toFixed(2)}`,
                },
                { title: "UOM", dataIndex: "uom", key: "uom" },
                {
                  title: "Budget Code",
                  dataIndex: "budgetCode",
                  key: "budgetCode",
                },
              ]}
            />
          </div>
        ) : (
          <Spin tip="Loading details..." />
        )}
      </Modal>
    </div>
  );
};

export default QueueTable;
