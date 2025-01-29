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

  const fetchContingencyData = async (id) => {
    if (!id) return;
    
    try {
      const response = await fetch(
        `http://localhost:5001/getContingencyPurchase`
      );
      const data = await response.json();

      if (data.responseData) {
        // Find the matching contingency purchase
        const contingencyPurchase = data.responseData.find(
          item => item.contigencyId.toString() === id.toString()
        );

        if (contingencyPurchase) {
          console.log("Fetched data:", contingencyPurchase);
          const formattedData = {
            vendorName: contingencyPurchase.vendorsName,
            vendorInvoiceNo: contingencyPurchase.vendorsInvoiceNo,
            date: contingencyPurchase.date ? dayjs(contingencyPurchase.date, "DD/MM/YYYY") : undefined,
            remarks: contingencyPurchase.remarksForPurchase,
            amountToBePaid: contingencyPurchase.amountToBePaid,
            predefinedPurchaseStatement: contingencyPurchase.predifinedPurchaseStatement,
            projectDetail: contingencyPurchase.projectDetail,
            lineItems: [{
              materialCode: contingencyPurchase.materialCode,
              materialDescription: contingencyPurchase.materialDescription,
              quantity: contingencyPurchase.quantity,
              unitRate: contingencyPurchase.unitPrice,
              totalPrice: contingencyPurchase.quantity * contingencyPurchase.unitPrice
            }]
          };
          form.setFieldsValue(formattedData);
          message.success("Contingency data fetched successfully!");
        } else {
          message.error("No contingency purchase found with this ID!");
        }
      }
    } catch (error) {
      console.error("Error fetching contingency data:", error);
      message.error("Error fetching contingency data. Please try again later!");
    }
  };

  const submitContingencyData = async (values) => {
    setLoading(true);
    try {
      // Get the first line item since your DB structure has single item
      const lineItem = values.lineItems[0];
      
      const formattedValues = {
        responseStatus: {
          statusCode: 0,
          message: null,
          errorCode: null,
          errorType: null,
        },
        responseData: {
          contigencyId: contingencyId || null,
          vendorsName: values.vendorName,
          vendorsInvoiceNo: values.vendorInvoiceNo,
          materialCode: lineItem.materialCode,
          materialDescription: lineItem.materialDescription,
          quantity: parseFloat(lineItem.quantity),
          unitPrice: parseFloat(lineItem.unitRate),
          remarksForPurchase: values.remarks,
          amountToBePaid: parseFloat(values.amountToBePaid),
          uploadCopyOfInvoice: null, // Handle file upload separately if needed
          predifinedPurchaseStatement: values.predefinedPurchaseStatement,
          projectDetail: values.projectDetail,
          date: values.date?.format("DD/MM/YYYY"),
          createdBy: "user", // You might want to get this from your auth system
          updatedBy: "user",
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        }
      };

      const url = contingencyId 
        ? `http://localhost:5001/contingencyPurchase/${contingencyId}`
        : "http://localhost:5001/contingencyPurchase";
      
      const method = contingencyId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      });

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

  // Calculate total price when quantity or unit rate changes
  const updateTotalPrice = (name) => {
    const values = form.getFieldValue(['lineItems', name]);
    if (values?.quantity && values?.unitRate) {
      const total = values.quantity * values.unitRate;
      form.setFieldValue(['lineItems', name, 'totalPrice'], total);
    }
  };

  const handleSubmit = (values) => {
    submitContingencyData(values);
  };

  const props = {
    name: "file",
    accept: ".png,.jpg,.pdf,.docx",
    beforeUpload: (file) => {
      if (file.size > 10485760) {
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
      
      <div className="form-section" style={{ marginBottom: '20px' }}>
        <Row justify='end'>
            <Col>
            <Form.Item label="Contingency ID">

                <Input
                placeholder="Enter Contingency ID"
                value={contingencyId}
                onChange={(e) => setContingencyId(e.target.value)}
                style={{ width: '200px', marginRight: '10px' }}
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

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            rules={[{ required: true, message: "Please enter vendor invoice number" }]}
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
                          rules={[{ required: true, message: "Please enter material code" }]}
                        >
                          <Input placeholder="Enter Material Code" />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "materialDescription"]}
                          label="Material Description"
                          rules={[{ required: true, message: "Please enter material description" }]}
                        >
                          <Input placeholder="Enter Material Description" />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label="Quantity"
                          rules={[{ required: true, message: "Please enter quantity" }]}
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
                          rules={[{ required: true, message: "Please enter unit rate" }]}
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
            rules={[{ required: true, message: "Please enter amount to be paid" }]}
          >
            <Input placeholder="Enter amount to be paid" type="number" step="0.01" />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item 
            name="uploadInvoice" 
            label="Upload copy of Invoice"
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