import {
  Button,
  Checkbox,
  Col,
  DatePicker,
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
  UploadOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

const Form7 = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/purchaseOrder");
        const data = await response.json();

        // Populate the form with fetched data
        if (data.responseData) {
          console.log("Fetched data:", data.responseData);
          const formattedData = {
            tenderID: data.responseData.tenderId,
            indentID: data.responseData.indentId,
            consigneeAddress: data.responseData.consignesAddress,
            billingAddress: data.responseData.billingAddress,
            deliveryPeriod: data.responseData.deliveryPeriod,
            warranty: data.responseData.warranty,
            ifLDClauseApplicable: data.responseData.ifLdClauseApplicable,
            incoTerms: data.responseData.incoterms,
            paymentTerms: data.responseData.paymentterms,
            vendorName: data.responseData.vendorName,
            vendorAddress: data.responseData.vendorAddress,
            applicablePBG: data.responseData.applicablePbgToBeSubmitted,
            transporterDetails:
              data.responseData.transposterAndFreightForWarderDetails,
            vendorAccountNo: data.responseData.vendorAccountNumber,
            vendorAccountName: data.responseData.vendorAccountName,
            lineItems: data.responseData.purchaseOrderAttributes.map(
              (item) => ({
                materialCode: item.materialCode,
                materialDescription: item.materialDescription,
                quantity: item.quantity,
                unitRate: item.rate,
                currency: item.currency,
                exchangeRate: item.exchangeRate,
                gst: item.gst,
                duties: item.duties,
                freightCharges: item.freightCharge,
              })
            ),
          };
          form.setFieldsValue(formattedData);
          message.success("PO Data loaded successfully");
        }
      } catch (error) {
        message.error("Failed to fetch PO data");
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [form]);
  const submitPOData = async (values) => {
    setLoading(true);
    try {
      const updatedLineItems = values.lineItems.map((item) => ({
        ...item,
        totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
      }));
      const formattedValues = {
        responseStatus: {
          statusCode: 0,
          message: null,
          errorCode: null,
          errorType: null,
        },
        responseData: {
          tenderID: values.tenderID,
          indentID: values.indentID,
          consigneeAddress: values.consigneeAddress,
          billingAddress: values.billingAddress,
          deliveryPeriod: values.deliveryPeriod,
          warranty: values.warranty,
          ifLDClauseApplicable: values.ifLDClauseApplicable,
          incoTerms: values.incoTerms,
          paymentTerms: values.paymentTerms,
          vendorName: values.vendorName,
          vendorAddress: values.vendorAddress,
          applicablePBG: values.applicablePbgToBeSubmitted,
          transporterDetails: values.transporterDetails,
          vendorAccountNo: values.vendorAccountNo,
          vendorIFSCCode: values.vendorIFSCCode,
          vendorAccountName: values.vendorAccountName,
          materialDetails: updatedLineItems.map((item) => ({
            materialCode: item.materialCode,
            materialDescription: item.materialDescription,
            quantity: parseFloat(item.quantity),
            unitRate: parseFloat(item.unitRate),
            currency: item.currency,
            exchangeRate: item.exchangeRate,
            gst: item.gst,
            duties: item.duties,
            freightCharges: item.freightCharge,
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

      const result = await response.json();
      message.success("Tender submitted successfully");
      console.log("Submit response:", result);
    } catch (error) {
      message.error("failed to submit PO form");
      console.error("Error submitting PO:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    submitPOData(values);
  };
  return (
    <div className="form-container">
      <h2>Purchase Order (PO)</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{date:null}}>
        {/* Tender Requests */}
        <div className="form-section">
          <Form.Item
            label="Tender ID"
            name="tenderID"
            rules={[{ required: true, message: "Please select Tender ID" }]}
          >
            <Select mode="multiple" placeholder="Select Tender ID">
              <Option value="tender1">TenderID 1</Option>
              <Option value="tender2">TenderID 2</Option>
            </Select>
          </Form.Item>

          {/* Consignee Address */}
          <Form.Item label="Consignee Address" name="consigneeAddress">
            <TextArea rows={1} placeholder="Enter consignee address" disabled />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Indent ID"
            name="indentID"
            rules={[
              {
                required: true,
                message: "Please select corresponding indent(s)",
              },
            ]}
          >
            <Input mode="multiple" placeholder="Select corresponding indents" />
          </Form.Item>

          {/* Billing Address */}
          <Form.Item
            label="Billing Address"
            name="billingAddress"
            rules={[
              { required: true, message: "Please enter billing address" },
            ]}
          >
            <TextArea rows={1} placeholder="Enter billing address" />
          </Form.Item>

          {/* Delivery Period */}
          <Form.Item
            label="Delivery Period"
            name="deliveryPeriod"
            rules={[
              { required: true, message: "Please specify the delivery period" },
            ]}
          >
            <Input type="number" placeholder="Select delivery period" />
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
                          {/* Freight Charges */}
                          <Form.Item
                            label="Freight Charges"
                            name="freightCharges"
                          >
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter freight charges"
                            />
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
          {/* Warranty */}
          <Form.Item label="Warranty" name="warranty">
            <Input placeholder="Enter warranty terms" />
          </Form.Item>

          {/* if LD clause applicable */}
          <Form.Item name="ifLDClauseApplicable">
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
            // rules={[{ required: true }]}
          >
            <TextArea rows={1} />
          </Form.Item>

          <Form.Item
            label="Transporter/freight forwarder Details"
            name="transporterDetails"
            //   rules={[{ required: true, message: "Enter Transporter Details" }]}
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

export default Form7;
