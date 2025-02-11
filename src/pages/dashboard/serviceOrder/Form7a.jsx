import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const Form7a = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  /**
   * This function fetches the service order data using the provided SO ID.
   * After fetching, it formats the data and populates the form fields.
   */
  const searchAndFillForm = async () => {
    setSearchLoading(true);
    const soId = form.getFieldValue("soId");
    if (!soId) {
      message.error("Please enter an SO ID");
      setSearchLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://103.181.158.220:8081/astro-service/api/service-orders/${soId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  
      // Check if the backend response indicates an error
      if (data.responseStatus && data.responseStatus.statusCode !== 200) { // Adjust status code as per your API
        message.error(data.responseStatus.message);
        setSearchLoading(false);
        return;
      }
  
      if (data.responseData) {
        const serviceOrder = data.responseData;
        const formattedData = {
          tenderID: serviceOrder.tenderId,
          consigneeAddress: serviceOrder.consignesAddress,
          billingAddress: serviceOrder.billingAddress,
          deliveryPeriod: serviceOrder.jobCompletionPeriod,
          ifLDClauseApplicable: serviceOrder.ifLdClauseApplicable,
          incoTerms: serviceOrder.incoTerms,
          paymentTerms: serviceOrder.paymentTerms,
          vendorName: serviceOrder.vendorName,
          vendorAddress: serviceOrder.vendorAddress,
          applicablePBG: serviceOrder.applicablePBGToBeSubmitted,
          vendorAccountNo: serviceOrder.vendorsAccountNo,
          vendorIFSCCode: serviceOrder.vendorsZRSCCode,
          vendorAccountName: serviceOrder.vendorsAccountName,
          lineItems: serviceOrder.materials.map((item) => ({
            materialCode: item.materialCode,
            materialDescription: item.materialDescription,
            quantity: item.quantity,
            unitRate: item.rate,
            exchangeRate: item.exchangeRate,
            currency: item.currency,
            gst: item.gst,
            duties: item.duties,
            budgetCode: item.budgetCode,
          })),
        };

        form.setFieldsValue(formattedData);
      message.success("Service order data loaded successfully");
    } else {
      message.error("No service order data found");
    }
  } catch (error) {
    console.error("Error fetching service order:", error);
    message.error(error.message || "Failed to fetch service order");
  } finally {
    setSearchLoading(false);
  }
};

  // Function to handle form submission
  const submitSOData = async (values) => {
    setLoading(true);
    try {
      // Calculate total price for each line item (if needed)
      const updatedLineItems = values.lineItems.map((item) => ({
        ...item,
        totalPrice: parseFloat(item.quantity) * parseFloat(item.unitRate),
      }));

      const formattedValues = {
        soId: form.getFieldValue("soId"), // Add this line
        tenderId: values.tenderID,
        consignesAddress: values.consigneeAddress,
        billingAddress: values.billingAddress,
        jobCompletionPeriod: values.deliveryPeriod,
        ifLdClauseApplicable: values.ifLDClauseApplicable,
        incoTerms: values.incoTerms,
        paymentTerms: values.paymentTerms,
        vendorName: values.vendorName,
        vendorAddress: values.vendorAddress,
        applicablePBGToBeSubmitted: values.applicablePBG,
        vendorsAccountNo: values.vendorAccountNo,
        vendorsZRSCCode: values.vendorIFSCCode,
        vendorsAccountName: values.vendorAccountName,
        materials: updatedLineItems.map((item) => ({
            materialCode: item.materialCode,
            materialDescription: item.materialDescription,
            quantity: parseFloat(item.quantity),
            rate: parseFloat(item.unitRate),
            exchangeRate: item.exchangeRate,
            currency: item.currency,
            gst: item.gst,
            duties: item.duties,
            budgetCode: item.budgetCode,
        })),
        createdBy: "admin",
        updatedBy: "admin",
    };
    console.log("Submitting Service Order:", formattedValues);

      const response = await fetch(
        "http://103.181.158.220:8081/astro-service/api/service-orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        }
      );

      if (!response.ok) throw new Error("Failed to submit form");

      message.success("Service order submitted successfully");
    } catch (error) {
      message.error("Failed to submit service order form");
      console.error("Error submitting SO:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Service Order</h2>
      <Row justify="end">
        <Col>
          {/* This inline form is used for entering the SO ID */}
          <Form form={form} layout="inline" style={{ marginBottom: "20px" }}>
            <Form.Item
              label="SO ID"
              name="soId"
              rules={[{ required: true, message: "Please enter SO ID" }]}
            >
              <Space>
                <Input placeholder="Enter SO ID" />
                <Button
                  type="primary"
                  onClick={searchAndFillForm} // call the new function here
                  loading={searchLoading}
                >
                  <SearchOutlined />
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>

      {/* Main Form */}
      <Form form={form} layout="vertical" onFinish={submitSOData}>
        <div className="form-section">
          <Form.Item
            label="Tender ID"
            name="tenderID"
            rules={[{ required: true, message: "Please enter Tender ID" }]}
          >
            <Input placeholder="Enter Tender ID" />
          </Form.Item>
          <Form.Item label="Consignee Address" name="consigneeAddress">
            <TextArea rows={1} placeholder="Enter consignee address" />
          </Form.Item>
          <Form.Item
            label="Billing Address"
            name="billingAddress"
            rules={[{ required: true, message: "Please enter billing address" }]}
          >
            <TextArea rows={1} placeholder="Enter billing address" />
          </Form.Item>
          <Form.Item label="Delivery Period" name="deliveryPeriod">
            <Input type="number" />
          </Form.Item>
        </div>

        <div>
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
                                message: "Please select a material code!",
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
                                message: "Please select a material description!",
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
                              { required: true, message: "Please enter quantity!" },
                            ]}
                          >
                            <Input type="number" placeholder="Enter Quantity" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            label="Unit Rate"
                            name={[name, "unitRate"]}
                            rules={[
                              { required: true, message: "Please enter the unit rate" },
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
                          <Form.Item
                            {...restField}
                            label="Currency"
                            name={[name, "currency"]}
                            rules={[
                              { required: true, message: "Please select a currency" },
                            ]}
                          >
                            <Select placeholder="Select currency">
                              <Option value="USD">USD</Option>
                              <Option value="INR">INR</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            label="Exchange Rate"
                            name={[name, "exchangeRate"]}
                          >
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter exchange rate"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            label="GST (%)"
                            name={[name, "gst"]}
                            rules={[
                              {
                                required: true,
                                message: "Please specify GST percentage",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter GST percentage"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            label="Duties (%)"
                            name={[name, "duties"]}
                            rules={[
                              {
                                required: true,
                                message: "Please specify duties",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter duties percentage"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            label="Budget Code"
                            name={[name, "budgetCode"]}
                          >
                            <Input placeholder="Enter Budget Code" />
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
          <Form.Item name="ifLDClauseApplicable" valuePropName="checked">
            <Checkbox>If LD clause applicable?</Checkbox>
          </Form.Item>
          <Form.Item label="INCO Terms" name="incoTerms">
            <Input.TextArea rows={1} placeholder="Enter INCO Terms" />
          </Form.Item>
          <Form.Item label="Payment Terms" name="paymentTerms">
            <Input.TextArea rows={1} placeholder="Enter Payment Terms" />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Vendor Name"
            name="vendorName"
            rules={[{ required: true, message: "Please enter vendor name" }]}
          >
            <Input placeholder="Enter vendor name" />
          </Form.Item>
          <Form.Item
            label="Vendor Address"
            name="vendorAddress"
            rules={[{ required: true, message: "Please enter vendor address" }]}
          >
            <TextArea rows={1} placeholder="Enter vendor address" />
          </Form.Item>
          <Form.Item label="Applicable PBG to be submitted" name="applicablePBG">
            <TextArea rows={1} />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Vendor's A/C no"
            name="vendorAccountNo"
            rules={[
              {
                required: true,
                message: "Please enter vendor's account number",
              },
            ]}
          >
            <Input placeholder="Enter vendor's account number" />
          </Form.Item>
          <Form.Item
            label="Vendor's IFSC code"
            name="vendorIFSCCode"
            rules={[
              { required: true, message: "Please enter vendor's IFSC code" },
            ]}
          >
            <Input placeholder="Enter vendor's IFSC code" />
          </Form.Item>
          <Form.Item
            label="Vendor's A/C Name"
            name="vendorAccountName"
            rules={[
              { required: true, message: "Please enter vendor's account name" },
            ]}
          >
            <Input placeholder="Enter vendor's account name" />
          </Form.Item>
        </div>

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

export default Form7a;
