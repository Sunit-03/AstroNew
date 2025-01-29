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
    Spin,
  } from "antd";
  import {
    MinusCircleOutlined,
    PlusOutlined,
    SearchOutlined,
  } from "@ant-design/icons";
  import { Option } from "antd/es/mentions";
  import React, { useState } from "react";
  import TextArea from "antd/es/input/TextArea";
  
  const Form7 = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
  
    // Function to handle tender search
    const handleTenderSearch = async (poId) => {
      if (!poId) {
        message.warning("Please enter a PO ID");
        return;
      }
  
      setSearching(true);
      try {
        const response = await fetch("http://localhost:5001/getPurchaseOrder");
        const data = await response.json();
  
        // Find the matching purchase order
        const matchingPO = data.responseData.find(
          (po) => po.poId.toLowerCase() === poId.toLowerCase()
        );
  
        if (matchingPO) {
          const formattedData = {
            tenderID: matchingPO.tenderId,
            indentID: matchingPO.indentId,
            consigneeAddress: matchingPO.consignesAddress,
            billingAddress: matchingPO.billingAddress,
            deliveryPeriod: matchingPO.deliveryPeriod,
            warranty: matchingPO.warranty,
            ifLDClauseApplicable: matchingPO.ifLdClauseApplicable,
            incoTerms: matchingPO.incoterms,
            paymentTerms: matchingPO.paymentterms,
            vendorName: matchingPO.vendorName,
            vendorAddress: matchingPO.vendorAddress,
            applicablePBG: matchingPO.applicablePbgToBeSubmitted,
            transporterDetails: matchingPO.transposterAndFreightForWarderDetails,
            vendorAccountNo: matchingPO.vendorAccountNumber,
            vendorIFSCCode: matchingPO.vendorsIfscCode,
            vendorAccountName: matchingPO.vendorAccountName,
            lineItems: matchingPO.purchaseOrderAttributes.map((item) => ({
              materialCode: item.materialCode,
              materialDescription: item.materialDescription,
              quantity: item.quantity,
              unitRate: item.rate,
              currency: item.currency,
              exchangeRate: item.exchangeRate,
              gst: item.gst,
              duties: item.duties,
              freightCharges: item.freightCharge,
            })),
          };
          form.setFieldsValue(formattedData);
          message.success("PO Data loaded successfully");
        } else {
          message.warning("No purchase order found for this Tender ID");
          form.resetFields();
        }
      } catch (error) {
        message.error("Failed to fetch PO data");
        console.error("Error fetching data:", error);
      } finally {
        setSearching(false);
      }
    };
  
    const submitPOData = async (values) => {
      setLoading(true);
      try {
        const updatedLineItems = values.lineItems.map((item) => ({
          materialCode: item.materialCode,
          materialDescription: item.materialDescription,
          quantity: parseFloat(item.quantity),
          rate: parseFloat(item.unitRate),
          currency: item.currency,
          exchangeRate: parseFloat(item.exchangeRate),
          gst: parseFloat(item.gst),
          duties: parseFloat(item.duties),
          freightCharge: parseFloat(item.freightCharges),
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
            indentId: values.indentID,
            consignesAddress: values.consigneeAddress,
            billingAddress: values.billingAddress,
            deliveryPeriod: parseFloat(values.deliveryPeriod),
            warranty: parseFloat(values.warranty),
            ifLdClauseApplicable: values.ifLDClauseApplicable,
            incoterms: values.incoTerms,
            paymentterms: values.paymentTerms,
            vendorName: values.vendorName,
            vendorAddress: values.vendorAddress,
            applicablePbgToBeSubmitted: values.applicablePBG,
            transposterAndFreightForWarderDetails: values.transporterDetails,
            vendorAccountNumber: values.vendorAccountNo,
            vendorsIfscCode: values.vendorIFSCCode,
            vendorAccountName: values.vendorAccountName,
            purchaseOrderAttributes: updatedLineItems,
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
  
        message.success("PO submitted successfully");
      } catch (error) {
        message.error("Failed to submit PO form");
        console.error("Error submitting PO:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="form-container">
        <h2>Purchase Order (PO)</h2>
        <Row justify={"end"}>
          <Col>
            <Form.Item
              label="PO ID"
              name="poID"
              rules={[{ required: true, message: "Please enter PO ID" }]}
            >
              <Input.Search
                placeholder="Enter PO ID "
                onSearch={handleTenderSearch}
                enterButton={<SearchOutlined />}
                loading={searching}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form
          form={form}
          layout="vertical"
          onFinish={submitPOData}
          initialValues={{ date: null }}
        >
          <div className="form-section">
            {/* Indent ID */}
            <Form.Item
              label="Indent ID"
              name="indentID"
              rules={[{ required: true, message: "Please enter Indent ID" }]}
            >
              <Input placeholder="Enter Indent ID" />
            </Form.Item>
  
            {/* Consignee Address */}
            <Form.Item label="Consignee Address" name="consigneeAddress">
              <TextArea rows={1} placeholder="Enter consignee address" />
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
              <Input type="number" placeholder="Enter delivery period" />
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
  