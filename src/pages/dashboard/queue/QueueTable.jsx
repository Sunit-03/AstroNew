// QueueTable.js
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
} from "antd";
import { SearchOutlined, CommentOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios"; // For making API requests

const { Text } = Typography;
const { Option } = Select;

// Queue Table Component
const QueueTable = () => {
  const [data, setData] = useState([]); // Table data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedRow, setSelectedRow] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [requestChangeComment, setRequestChangeComment] = useState("");
  const [additionalInfoComment, setAdditionalInfoComment] = useState("");

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://103.181.158.220:8081/astro-service/allPendingWorkflowTransition?roleName=reporting%20officer"
      );
      const apiData = response.data.responseData; // Assuming the API response has a `responseData` field
      const formattedData = apiData.map((item, index) => ({
        key: index.toString(), // Unique key for each row
        requestId: item.requestId,
        workflowType: item.workflowType,
        workflowId: item.workflowId,
        workflowName: item.workflowName,
        status: item.nextAction, // Default to "Pending" if status is not provided
        remarks: item.remarks || "No remarks", // Default to "No remarks" if remarks are not provided
      }));
      setData(formattedData);
    } catch (err) {
      setError(err.message);
      message.error("Failed to fetch data from the API.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

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
          {/* <Col span={6}>
            <Form.Item name="workflowType" style={{ marginBottom: 10 }}>
              <Select placeholder="Workflow Type" allowClear>
                <Option value="Indent Approval">Indent Approval</Option>
                <Option value="Tender Approval">Tender Approval</Option>
                <Option value="PO/SO/WO Approval">PO/SO/WO Approval</Option>
              </Select>
            </Form.Item>
          </Col> */}
          <Col span={6}>
            <Space
            style={{ marginBottom: 10 }}
            >
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

  // Handle Approval
  const handleApprove = (record) => {
    const updatedData = data.map((item) =>
      item.key === record.key ? { ...item, status: "Approved" } : item
    );
    setData(updatedData);
    message.success(`Request ${record.requestId} approved.`);
  };

  // Handle Rejection
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

  // Handle Request Change Comments
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

  // Handle Additional Info Comments
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

  // Table Columns
  const columns = [
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
      sorter: (a, b) => a.requestId.localeCompare(b.requestId),
    },
    {
        title: "Workflow ID",
        dataIndex: "workflowId",
        key: "workflowId",
        sorter: (a, b) => a.workflowId.localeCompare(b.workflowId),
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
    // {
    //   title: "Workflow Type",
    //   dataIndex: "workflowType",
    //   key: "workflowType",
    //   filters: [
    //     { text: "Indent Approval", value: "Indent Approval" },
    //     { text: "Tender Approval", value: "Tender Approval" },
    //     { text: "PO/SO/WO Approval", value: "PO/SO/WO Approval" },
    //   ],
    //   onFilter: (value, record) => record.workflowType === value,
    // },
    // { title: "Indent ID", dataIndex: "indentId", key: "indentId" },
    // { title: "CP ID", dataIndex: "cpId", key: "cpId" },
    // { title: "Tender ID", dataIndex: "tenderId", key: "tenderId" },
    // { title: "PO/SO/WO ID", dataIndex: "poSoWoId", key: "poSoWoId" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Approved" ? "green" : "volcano"}>
          {status}
        </Tag>
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
        // Hide actions for approved requests
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
              <Button danger type="link">Reject</Button>
            </Popover>
            <Popover
              content={
                <div style={{ padding: 12 }}>
                  <Select
                    placeholder="Select User"
                    style={{ width: "100%", marginBottom: 8 }}
                    suffixIcon={<UserOutlined />}
                  >
                    <Option value="user1">User 1</Option>
                    <Option value="user2">User 2</Option>
                  </Select>
                  <Input.TextArea
                    placeholder="Additional Info Comments"
                    rows={2}
                    value={additionalInfoComment}
                    onChange={(e) => setAdditionalInfoComment(e.target.value)}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleAdditionalInfoSubmit(record)}
                    style={{ marginTop: 8 }}
                  >
                    Submit
                  </Button>
                </div>
              }
              title="Additional Info"
              trigger="click"
            >
              <Button icon={<CommentOutlined />} type="link">
                Info
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
      <FilterComponent onFilter={(filters) => console.log(filters)} />
      {loading ? (
        <Spin size="large" tip="Loading..." style={{ marginTop: 24 }} />
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowRender: (record) =>
              record.key === selectedRow && (
                <div style={{ margin: 0 }}>
                  <Text strong>Reject Comments:</Text>
                  <Input.TextArea
                    rows={2}
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    style={{ marginTop: 8 }}
                  />
                </div>
              ),
            rowExpandable: (record) => record.key === selectedRow,
          }}
        />
      )}
    </div>
  );
};

export default QueueTable;