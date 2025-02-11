import React, { useEffect, useState } from "react";
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
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import dayjs from "dayjs";

const Form7b = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [contingencyId, setContingencyId] = useState("");

  const fetchContingencyData = async () => {
    if (!contingencyId) {
      message.warning("Please enter a Contingency ID.");
      return;
    }

    try {
      const response = await fetch(
        `http://103.181.158.220:8081/astro-service/api/contigency-purchase/${contingencyId}`
      );
      const data = await response.json();

      if (data.responseData) {
        const purchase = data.responseData;
        const formattedData = {
          vendorName: purchase.vendorsName,
          vendorInvoiceNo: purchase.vendorsInvoiceNo,
          date: purchase.date ? dayjs(purchase.date, "DD/MM/YYYY") : undefined,
          remarks: purchase.remarksForPurchase,
          amountToBePaid: purchase.amountToBePaid,
          predefinedPurchaseStatement: purchase.predifinedPurchaseStatement,
          projectDetail: purchase.projectDetail,
          lineItems: [
            {
              materialCode: purchase.materialCode,
              materialDescription: purchase.materialDescription,
              quantity: purchase.quantity,
              unitRate: purchase.unitPrice,
              totalPrice: purchase.quantity * purchase.unitPrice,
            },
          ],
        };
        form.setFieldsValue(formattedData);
        message.success("Contingency data fetched successfully!");
      } else {
        message.error("No contingency purchase found with this ID.");
      }
    } catch (error) {
      console.error("Error fetching contingency data:", error);
      message.error("Failed to fetch contingency data.");
    }
  };

  // Submit contingency purchase data
  const submitContingencyData = async (values) => {
    setLoading(true);
    try {
      const lineItem = values.lineItems[0]; // Ensure a single line item is being sent
  
      // Build the base JSON payload.
      const formattedValues = {
        contigencyId: contingencyId || null,
        vendorsName: values.vendorName,
        vendorsInvoiceNo: values.vendorInvoiceNo,
        materialCode: lineItem.materialCode,
        materialDescription: lineItem.materialDescription,
        quantity: parseFloat(lineItem.quantity),
        unitPrice: parseFloat(lineItem.unitRate),
        remarksForPurchase: values.remarks,
        amountToBePaid: parseFloat(values.amountToBePaid),
        // This field will later be replaced with the file’s Base64 string
        uploadCopyOfInvoice: "", 
        predifinedPurchaseStatement: values.predefinedPurchaseStatement,
        projectDetail: values.projectDetail,
        projectName: null,
        date: values.date?.format("DD/MM/YYYY"),
        createdBy: "adminu",
        updatedBy: "admin",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };
  
      // Process the file from the "uploadInvoice" field.
      const files = form.getFieldValue("uploadInvoice");
      if (files && files.length > 0) {
        const file = files[0].originFileObj;
        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          message.error(`uploadInvoice file is too large. Maximum 5MB allowed.`);
          throw new Error(`File too large: uploadInvoice`);
        }
        // Convert the file to a Base64 string.
        const fileBase64 = await toBase64(file);
        // Set the Base64 string in the payload using the key the backend expects.
        formattedValues.uploadCopyOfInvoice = fileBase64;
      }
  
      // Convert the full payload (including the file data) to a JSON string.
      const payloadJson = JSON.stringify(formattedValues);
      console.log("📤 Sending data:", JSON.stringify(formattedValues, null, 2));
      console.log("Payload JSON:", payloadJson);
  
      // Send the payload as a plain text (or adjust the content type as needed).
      const response = await fetch("http://103.181.158.220:8081/astro-service/api/contigency-purchase", {
        method: "POST",
        body: payloadJson,
      });
  
      const responseData = await response.json();
      console.log("📥 Server response:", responseData);
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
  
      message.success("Data submitted successfully!");
    } catch (error) {
      console.error("❌ Error submitting data:", error);
      message.error(`Error submitting data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate total price dynamically
  const updateTotalPrice = (name) => {
    const values = form.getFieldValue(["lineItems", name]);
    if (values?.quantity && values?.unitRate) {
      const total = values.quantity * values.unitRate;
      form.setFieldValue(["lineItems", name, "totalPrice"], total);
    }
  };

  return (
    <div className="form-container">
      <h2>Contingency Purchase</h2>

      <div className="form-section" style={{ marginBottom: "20px" }}>
        <Row justify="end">
          <Col>
            <Form.Item label="Contingency ID">
              <Input
                placeholder="Enter Contingency ID"
                value={contingencyId}
                onChange={(e) => setContingencyId(e.target.value)}
                style={{ width: "200px", marginRight: "10px" }}
              />
              <Button
                type="primary"
                onClick={() => fetchContingencyData(contingencyId)}
                disabled={!contingencyId}
              >
                <SearchOutlined />
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <Form form={form} layout="vertical" onFinish={submitContingencyData}>
        <div className="form-section">
          <Form.Item
            label="Vendor Name"
            name="vendorName"
            rules={[{ required: true, message: "Please enter vendor name" }]}
          >
            <Select mode="multiple" placeholder="Select Vendor ID">
              <Option value="ABC">ABC</Option>
              <Option value="ABC V">ABC V</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Vendor Invoice No."
            name="vendorInvoiceNo"
            rules={[
              { required: true, message: "Please enter vendor invoice number" },
            ]}
          >
            <Input placeholder="Enter Vendor Invoice No." />
          </Form.Item>
        </div>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.List name="lineItems" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
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
                          {...restField}
                          name={[name, "materialCode"]}
                          label="Material Code"
                          rules={[
                            {
                              required: true,
                              message: "Please enter material code",
                            },
                          ]}
                        >
                          <Input placeholder="Enter Material Code" />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "materialDescription"]}
                          label="Material Description"
                          rules={[
                            {
                              required: true,
                              message: "Please enter material description",
                            },
                          ]}
                        >
                          <Input placeholder="Enter Material Description" />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label="Quantity"
                          rules={[
                            {
                              required: true,
                              message: "Please enter quantity",
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            placeholder="Enter Quantity"
                            onChange={() => updateTotalPrice(name)}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "unitRate"]}
                          label="Unit Rate"
                          rules={[
                            {
                              required: true,
                              message: "Please enter unit rate",
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter unit rate"
                            onChange={() => updateTotalPrice(name)}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "totalPrice"]}
                          label="Total Price"
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
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

        <div className="form-section">
          <Form.Item
            label="Remarks for purchase"
            name="remarks"
            rules={[{ required: true, message: "Please enter remarks" }]}
          >
            <Input.TextArea placeholder="Enter remarks for purchase" rows={1} />
          </Form.Item>

          <Form.Item
            label="Amount to be paid"
            name="amountToBePaid"
            rules={[
              { required: true, message: "Please enter amount to be paid" },
            ]}
          >
            <Input
              placeholder="Enter amount to be paid"
              type="number"
              step="0.01"
            />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            name="uploadInvoice"
            label="Upload copy of Invoice"
            rules={[{ required: true, message: "Please upload invoice copy" }]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Invoice Copy</Button>
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
          rules={[{ required: true, message: "Please enter project detail" }]}
        >
          <Input.TextArea placeholder="Enter Project Detail" />
        </Form.Item>

        <div className="form-section">
          <Button type="default" htmlType="reset">
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
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
