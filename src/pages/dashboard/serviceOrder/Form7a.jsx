import React, { useEffect, useState } from "react";
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
import { Option } from "antd/es/mentions";

const Form7a = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [serviceOrders, setServiceOrders] = useState([]);

  // Fetch all service orders
  useEffect(() => {
    const fetchServiceOrders = async () => {
      try {
        const response = await fetch("http://localhost:5001/getServiceOrder");
        const data = await response.json();

        if (data.responseData) {
          setServiceOrders(data.responseData);
        }
      } catch (error) {
        console.error("Error fetching service orders:", error);
        message.error("Failed to load service orders");
      }
    };
    fetchServiceOrders();
  }, []);

  // Handle tender search
  const handleTenderSearch = async () => {
    setSearchLoading(true);
    try {
      const soId = form.getFieldValue("soId");
      if (!soId) {
        message.warning("Please enter a SO ID");
        return;
      }

      const selectedOrder = serviceOrders.find((order) => order.soId === soId);

      if (selectedOrder) {
        const formattedData = {
          tenderID: selectedOrder.tenderId,
          consigneeAddress: selectedOrder.consignesAddress,
          billingAddress: selectedOrder.billingAddress,
          deliveryPeriod: selectedOrder.jobCompletionPeriod,
          ifLDClauseApplicable: selectedOrder.ifLdClauseApplicable,
          incoTerms: selectedOrder.incoTerms,
          paymentTerms: selectedOrder.paymentTerms,
          vendorName: selectedOrder.vendorName,
          vendorAddress: selectedOrder.vendorAddress,
          applicablePBG: selectedOrder.applicablePBGToBeSubmitted,
          vendorAccountNo: selectedOrder.vendorsAccountNo,
          vendorIFSCCode: selectedOrder.vendorsIFSCCode,
          vendorAccountName: selectedOrder.vendorsAccountName,
          lineItems: selectedOrder.materials.map((item) => ({
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
        message.error("No service order found with this Tender ID");
      }
    } catch (error) {
      message.error("Error searching for service order");
      console.error("Error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const submitSOData = async (values) => {
    setLoading(true);
    try {
      const updatedLineItems = values.lineItems.map((item) => ({
        ...item,
        totalPrice: parseFloat(item.quantity) * parseFloat(item.unitRate),
      }));

      const formattedValues = {
        responseStatus: {
          statusCode: 0,
          message: null,
          errorCode: null,
          errorType: null,
        },
        responseData: {
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
          vendorsIFSCCode: values.vendorIFSCCode,
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
        },
      };

      const response = await fetch("http://localhost:5001/purchaseOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      });

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
      <Row justify={"end"}>
        <Col>
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
                onClick={handleTenderSearch}
                loading={searchLoading}
                >
                    <SearchOutlined />
                </Button>
            </Space>
          </Form.Item>
      </Form>
        </Col>
      </Row>
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
            <TextArea rows={1} placeholder="Enter consignee address" disabled />
          </Form.Item>

          <Form.Item
            label="Billing Address"
            name="billingAddress"
            rules={[
              { required: true, message: "Please enter billing address" },
            ]}
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
                          {/* Currency */}
                          <Form.Item
                            label="Currency"
                            name="currency"
                            rules={[
                              {
                                required: true,
                                message: "Please select a currency",
                              },
                            ]}
                          >
                            <Select placeholder="Select currency">
                              <Option value="USD">USD</Option>
                              <Option value="INR">INR</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          {/* Exchange Rate */}
                          <Form.Item label="Exchange Rate" name="exchangeRate">
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter exchange rate"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          {/* GST */}
                          <Form.Item
                            label="GST (%)"
                            name="gst"
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
                          {/* Duties */}
                          <Form.Item
                            label="Duties (%)"
                            name="duties"
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
                          {/* Budget Code */}
                          <Form.Item label="Budget Code" name="budgetCode">
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
          {/* if LD clause applicable */}
          <Form.Item
            // label="Is LD clause applicable?"
            name="ifLDClauseApplicable"
          >
            <Checkbox>If LD clause applicable?</Checkbox>
          </Form.Item>
          <Form.Item
            label="INCO Terms"
            name="incoTerms"
            //   rules={[
            //     { required: true, message: "Please specify the INCO terms" },
            //   ]}
          >
            <Input.TextArea rows={1} placeholder="Enter INCO Terms" />
          </Form.Item>

          <Form.Item
            label="Payment Terms"
            name="paymentTerms"
            //   rules={[
            //     { required: true, message: "Please specify the Payment terms" },
            //   ]}
          >
            <Input.TextArea rows={1} placeholder="Enter Payment Terms" />
          </Form.Item>
        </div>

        <div className="form-section">
          {/* Vendor Name */}
          <Form.Item
            label="Vendor Name"
            name="vendorName"
            rules={[{ required: true, message: "Please enter vendor name" }]}
          >
            <Input placeholder="Enter vendor name" />
          </Form.Item>

          {/* Vendor Address */}
          <Form.Item
            label="Vendor Address"
            name="vendorAddress"
            rules={[{ required: true, message: "Please enter vendor address" }]}
          >
            <TextArea rows={1} placeholder="Enter vendor address" />
          </Form.Item>

          {/* Applicable PBG to be submitted */}
          <Form.Item
            label="Applicable PBG to be submitted"
            name="applicablePBG"
            //   rules={[{ required: true }]}
          >
            <TextArea rows={1} />
          </Form.Item>
        </div>
        <div className="form-section">
          {/* Vendor's A/C no */}
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

          {/* Vendor's IFSC Code */}
          <Form.Item
            label="Vendor's IFSC code"
            name="vendorIFSCCode"
            rules={[
              { required: true, message: "Please enter vendor's IFSC code" },
            ]}
          >
            <Input placeholder="Enter vendor's IFSC code" />
          </Form.Item>

          {/* Vendor's A/C Name */}
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
        {/* Additional Terms & Conditions */}
        {/* <Form.Item label="Additional Terms & Conditions" name="termsConditions">
            <Input.TextArea placeholder="Enter additional terms and conditions" />
          </Form.Item> */}

        {/* Submit Button */}
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

export default Form7a;
