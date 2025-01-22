import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const Form7b = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/contingencyPurchase"
        );
        const data = await response.json();

        if (data.responseData) {
          console.log("Fetched data:", data.responseData);
          const formattedData = {
            vendorName: data.responseData.vendorsName,
            vendorInvoiceNo: data.responseData.vendorsInvoiceNo,
            date: data.responseData.date
              ? dayjs(data.responseData.date)
              : undefined,
            remarks: data.responseData.remarksForPurchase,
            amountToBePaid: data.responseData.amountToBePaid,
            predefinedPurchaseStatement:
              data.responseData.predefinedPurchaseStatement,
            projectDetail: data.responseData.projectDetail,
          };
          form.setFieldsValue(formattedData);
          message.success("Contingency data fetched successfully!");
        }
      } catch (error) {
        console.error("Error fetching contingency data:", error);
        message.error("Error fetching contingency data. Please try again later!");
      }
    };
    fetchData();
  }, [form]);

  const submitContingencyData = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        responseStatus: {
          statusCode: 0,
          message: null,
          errorCode: null,
          errorType: null,
        },
        responseData: {
          vendorsName: values.vendorName,
          vendorsInvoiceNo: values.vendorInvoiceNo,
          date: values.date?.[0]?.format("YYYY-MM-DD"),
          remarksForPurchase: values.remarks,
          amountToBePaid: values.amountToBePaid,
          predefinedPurchaseStatement: values.predefinedPurchaseStatement,
          projectDetail: values.projectDetail,
        },
      };
      const response = await fetch(
        "http://localhost:5001/contingencyPurchases",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        }
      );
      if (!response.ok) {
        throw new Error("Error submitting data");
      }
      const data = await response.json();
      message.success("Data submitted successfully!");
      console.log("Submitted data:", data);
    } catch (error) {
      message.error("Error submitting data. Please try again later!");
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    submitContingencyData(values);
  };
  const props = {
    name: "file",
    accept: ".png,.jpg,.pdf,.docx", // Accept specific file types
    // action: "https://your-upload-endpoint.com/upload", // Replace with your server endpoint
    beforeUpload: (file) => {
      if (file.size > 10485760) {
        // Limit file size to 10MB
        message.error("File size must be smaller than 10MB!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <div className="form-container">
      <h2>Contingency Purchase</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="form-section">
          {/* Vendor Name */}
          <Form.Item
            label="Vendor Name"
            name="vendorName"
            rules={[{ required: true, message: "Please enter vendor name" }]}
          >
            <Select mode="multiple" placeholder="Select Vendor ID">
              <Option value="vendor1">Vendor 1</Option>
              <Option value="vendor2">Vendor 2</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Vendor Invoice No."
            name="vendorInvoiceNo"
            rules={[{ required: true, message: "Please enter vendor name" }]}
          >
            <Input placeholder="Enter Vendor Invoice No." />
          </Form.Item>
        </div>
        <Form.Item
          label="Date"
          name="date"
          // rules={[{ required: true, message: "Please enter date" }]}
        >
          <DatePicker />
        </Form.Item>
        <div>
          <Form.List name="lineItems" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #ccc",
                      padding: "20px",
                      marginBottom: "5px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 20,
                        flexWrap: "wrap",
                      }}
                      align="start"
                    >
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            name="materialCode"
                            label="Material Code"
                            rules={[
                              {
                                required: true,
                                message: "Please select a material code!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Material Code" />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            name="materialDescription"
                            label="Material Description"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please select a material description!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Material Description" />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[
                              {
                                required: true,
                                message: "Please enter quantity!",
                              },
                            ]}
                          >
                            <Input type="number" placeholder="Enter Quantity" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          {/* Unit Rate */}
                          <Form.Item
                            label="Unit Rate"
                            name="unitRate"
                            rules={[
                              {
                                required: true,
                                message: "Please enter the unit rate",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter unit rate"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          {/* Total */}
                          <Form.Item
                            label="Total Price"
                            name="totalPrice"
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                            shouldUpdate
                          >
                            <Input placeholder="Auto-calculated" disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: "32%" }}
                  >
                    Add Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
        <div className="form-section">
          <Form.Item label="Remarks for purchase" name="remarks">
            <Input.TextArea placeholder="Enter remarks for purchase" rows={1} />
          </Form.Item>

          <Form.Item
            label="Amount to be paid"
            name="amountToBePaid"
            rules={[
              { required: true, message: "Please enter amount to be paid" },
            ]}
          >
            <Input placeholder="Enter amount to be paid" type="number" />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            name="uploadInvoice"
            label="Upload copy of Invoice"
            // rules={[{ required: true }]}
          >
            <Upload {...props}>
              <Button type="primary" icon={<UploadOutlined />}>
                Upload GOI/RFP
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Predefined purchase statement"
            name="predefinedPurchaseStatement"
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        </div>
        <Form.Item
          name="projectDetail"
          label="Project Detail"
          style={{ width: "32%" }}
        >
          <Input.TextArea placeholder="Enter Project Detail" />
        </Form.Item>

        <div className="form-section">
          <Button type="default" htmlType="reset">
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="dashed" htmlType="button">
            Save Draft
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Form7b;
