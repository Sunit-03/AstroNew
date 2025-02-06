import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Select,
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
import { Option } from "antd/es/mentions";

const { Text } = Typography;

const QueueTable = () => {
  const [data, setData] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [requestChangeComment, setRequestChangeComment] = useState("");
  const [additionalInfoComment, setAdditionalInfoComment] = useState("");
  const [indentData, setIndentData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Indent details modal

  // Persistent role selection dropdown at the top left.
  const [selectedRole, setSelectedRole] = useState("");

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

  // --- 2. Extract unique roles from transitions using nextRoleName ---
  const getUniqueRoles = () => {
    const roles = transitions.map((item) => item.nextRoleName);
    return [...new Set(roles)];
  };

  // --- 3. Fetch queue data based on the selected role ---
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
      // Preserve the original request ID along with other properties.
      const formattedData = apiData.map((item, index) => ({
        key: index.toString(),
        requestId: item.requestId,
        originalRequestId: item.requestId, // Preserve original ID (e.g., "IND13")
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

  // --- 4. Handle role change from the persistent dropdown ---
  const handleRoleChange = (value) => {
    setSelectedRole(value);
    fetchData(value);
  };

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
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                Search
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </Space>
          </Col>
        </Row>
      </Form>
    );
  };

  // --- 5. Action Handlers ---

  // Approve: Call nextTransition endpoint and remove the record from the current queue.
  const handleApprove = async (record) => {
    try {
      // Use the preserved originalRequestId if available.
      const requestIdToUse = record.originalRequestId || record.requestId;
      const url = `http://103.181.158.220:8081/astro-service/nextTransition?workflowId=1&workflowName=indent%20workflow&currentRole=${encodeURIComponent(
        selectedRole
      )}&requestId=${encodeURIComponent(requestIdToUse)}`;
      const transitionResponse = await axios.get(url);
      // Assuming the backend returns the next role name in response.data.nextRoleName.
      const nextRole = transitionResponse.data.nextRoleName || "the next role";
      message.success(`Request ${requestIdToUse} approved and moved to ${nextRole}.`);
      // Remove the approved record from current role's queue.
      setData((prevData) => prevData.filter((item) => item.key !== record.key));
    } catch (error) {
      message.error("Failed to approve the request.");
      console.error("Approval error:", error);
    }
  };

  const handleReject = (record) => {
    const updatedData = data.map((item) =>
      item.key === record.key
        ? { ...item, status: "Rejected", remarks: `Reject Comments: ${rejectComment}` }
        : item
    );
    setData(updatedData);
    setRejectComment("");
    message.success("Reject comments added.");
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

  // --- 6. Fetch indent details when a Request ID is clicked ---
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
          <Space>
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
                    onChange={(e) => setRequestChangeComment(e.target.value)}
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
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Persistent Role Selection at Top Left */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Text strong>Select Role:</Text>
        </Col>
        <Col>
          <Select
            placeholder="Select a role"
            style={{ width: 200 }}
            value={selectedRole || undefined}
            onChange={handleRoleChange}
          >
            {getUniqueRoles().map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
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
              {indentData.estimatedRate && indentData.estimatedRate.toFixed(2)}
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
                { title: "Material Code", dataIndex: "materialCode", key: "materialCode" },
                { title: "Description", dataIndex: "materialDescription", key: "materialDescription" },
                { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                {
                  title: "Unit Price",
                  dataIndex: "unitPrice",
                  key: "unitPrice",
                  render: (text) => `₹${text.toFixed(2)}`,
                },
                {
                  title: "Total Price",
                  dataIndex: "totalPrize",
                  key: "totalPrize",
                  render: (text) => `₹${text.toFixed(2)}`,
                },
                { title: "UOM", dataIndex: "uom", key: "uom" },
                { title: "Budget Code", dataIndex: "budgetCode", key: "budgetCode" },
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
