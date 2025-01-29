import { Button, Checkbox, Col, DatePicker, Form, Input, message, Row, Select, Space, Upload } from "antd";
import { Option } from "antd/es/mentions";
import { MinusCircleOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

const Form4 = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tenderId, setTenderId] = useState("");

  const handleSearch = async () => {
    if (!tenderId) {
      message.warning("Please enter an Tender ID");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/getTender"); // Adjust endpoint as needed
      const data = await response.json();

      if (data.responseData) {
        const tender = data.responseData.find((item) => item.tenderId === tenderId);
        if (tender) {
          form.setFieldsValue({
            title: tender.titleOfTender,
            openingDate: tender.openingDate ? dayjs(tender.openingDate, "DD/MM/YYYY") : undefined,
            closingDate: tender.closingDate ? dayjs(tender.closingDate, "DD/MM/YYYY") : undefined,
            indentId: tender.indentId,
            indentMaterials: tender.indentMaterials,
            modeOfProcurement: tender.modeOfProcurement,
            bidType: tender.bidType,
            lastDate: tender.lastDateOfSubmission ? dayjs(tender.lastDateOfSubmission, "DD/MM/YYYY") : undefined,
            applicableTaxes: tender.applicableTaxes,
            consignesAndBillinngAddress: tender.consignesAndBillinngAddress,
            incoTerms: tender.incoTerms,
            paymentTerms: tender.paymentTerms,
            ldClause: tender.ldClause,
            applicablePerformance: tender.applicablePerformance,
            bidSecurity: tender.bidSecurityDeclaration,
            mllStatusDeclaration: tender.mllStatusDeclaration,
            singleOrMultipleVendors: tender.singleAndMultipleVendors,
            preBidDiscussions: tender.preBidDisscussions,
            tenderUpload: tender.uploadTenderDocuments,
          });
          message.success("Tender data loaded successfully");
        } else {
          message.warning("No tender found with the provided Tender ID");
        }
      }
    } catch (error) {
      message.error("Failed to fetch tender data");
      console.error("Error fetching tender data:", error);
    }
  };

  const calculateTotalPrice = (record) => {
    const quantity = parseFloat(record.quantity) || 0;
    const unitPrice = parseFloat(record.unitPrice) || 0;
    return quantity * unitPrice;
  };

  const handlePriceCalculation = (index, field, value) => {
    const lineItems = form.getFieldValue('lineItems');
    if (lineItems[index]) {
      const totalPrice = calculateTotalPrice({
        ...lineItems[index],
        [field]: value
      });
      
      const updatedItems = [...lineItems];
      updatedItems[index] = {
        ...updatedItems[index],
        totalPrice: totalPrice
      };
      
      form.setFieldsValue({ lineItems: updatedItems });
    }
  };

  useEffect(() => {
    const fetchTenderData = async () => {
      try {
        const response = await fetch("http://localhost:5001/getTender"); // Adjust endpoint as needed
        const data = await response.json();

        if (data.responseData) {
          console.log("Fetched data:", data.responseData);
        }
      } catch (error) {
        message.error("Failed to fetch tender data");
        console.error("Error fetching tender data:", error);
      }
    };
    fetchTenderData();
  }, [form]);

  // POST request to submit form data
  const submitTenderData = async (values) => {
    setLoading(true);
    try {
      // Format dates to match API expectations
      const formattedValues = {
        responseStatus: {
          statusCode: 0,
          message: null,
          errorCode: null,
          errorType: null,
        },
        responseData: {
          titleOfTender: values.titleOfTender,
          openingDate: values.openingDate?.[0]?.format("YYYY-MM-DD"),
          closingDate: values.closingDate?.[0]?.format("YYYY-MM-DD"),
          indentId: values.indentId,
          indentMaterials: values.indentMaterials,
          modeOfProcurement: values.modeOfProcurement,
          bidType: values.bidType,
          lastDateOfSubmission: values.lastDate?.[0]?.format("YYYY-MM-DD"),
          applicableTaxes: values.applicableTaxes,
          consignesAndBillinngAddress: values.tenderTerms,
          paymentTerms: values.paymentTerms,
          ldClause: values.ldClause,
          applicablePerformance: values.applicablePerformance,
          bidSecurityDeclaration: values.bidSecurity,
          mllStatusDeclaration: values.mllStatusDeclaration,
          singleAndMultipleVendors: values.singleOrMultipleVendors,
          preBidDiscussions: values.preBidDiscussions,
          // Add any additional fields needed by your API
          updatedBy: "currentUser", // Replace with actual user info
          createdBy: "currentUser", // Replace with actual user info
          createdDate: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSSSSS"),
          updatedDate: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSSSSS"),
        },
      };

      const response = await fetch("http://localhost:5001/tenders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      message.success("Tender submitted successfully");
      console.log("Submit response:", result);
    } catch (error) {
      message.error("Failed to submit tender data");
      console.error("Error submitting tender:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    submitTenderData(values);
  };

  // Function to handle save draft (basic implementation)
  const saveDraft = async () => {
    try {
      const currentValues = await form.validateFields();
      localStorage.setItem("tenderDraft", JSON.stringify(currentValues));
      message.success("Draft saved successfully");
    } catch (error) {
      message.error("Failed to save draft");
    }
  };

  return (
    <div className="form-container">
      <h2>Tender Request</h2>
      <Row justify="end">
        <Col>
        <Form.Item
            name="tenderId"
            label="Tender ID"
            rules={[{ required: true }]}>
                <Input
                placeholder="Enter Tender ID"
                value={tenderId}
                onChange={(e) => setTenderId(e.target.value)}
                style={{ width: 200 }}
                />
                <Button type="primary" onClick={handleSearch}>
                    <SearchOutlined/>
                </Button>
            </Form.Item>
        </Col>
      </Row>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ date: null }}
      >
        <div className="form-section">
          <Form.Item
            name="title"
            label="Title of the Tender"
            rules={[
              { required: true, message: "Please enter the tender title" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="openingDate"
            label="Opening Date"
            rules={[
              { required: true, message: "Please select the opening date" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="closingDate"
            label="Closing Date"
            rules={[
              { required: true, message: "Please select the closing date" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="indentId"
            label="Indent ID"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              <Option value="ID1">ID-1</Option>
              <Option value="ID2">ID-2</Option>
              <Option value="ID3">ID-3</Option>
            </Select>
          </Form.Item>
        </div>
        <div className="form-section">
          <div>
          <Form.List name="lineItems" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField },index) => (
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
                            <Select placeholder="Select Material Code" disabled>
                              <Option value="MAT001">MAT001</Option>
                              <Option value="MAT002">MAT002</Option>
                              <Option value="MAT003">MAT003</Option>
                            </Select>
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
                            <Select placeholder="Select Material Description" disabled>
                              <Option value="Description 1">
                                Description 1
                              </Option>
                              <Option value="Description 2">
                                Description 2
                              </Option>
                              <Option value="Description 3">
                                Description 3
                              </Option>
                            </Select>
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
                            <Input type="number" placeholder="Enter Quantity" disabled onChange={(e)=>handlePriceCalculation(index,'quantity',e.target.value)} />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            name="unitPrice"
                            label="Unit Price"
                            rules={[
                              {
                                required: true,
                                message: "Please enter unit price!",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              placeholder="Enter Unit Price"
                              disabled
                              onChange={(e)=>handlePriceCalculation(index,'unitPrice',e.target.value)}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            name="uom"
                            label="UOM"
                            rules={[
                              { required: true, message: "Please select UOM!" },
                            ]}
                          >
                            <Select disabled placeholder="Select UOM">
                              <Option value="Kg">Kg</Option>
                              <Option value="Litre">Litre</Option>
                              <Option value="Unit">Unit</Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            name="budgetCode"
                            label="Budget Code"
                            rules={[
                              {
                                required: true,
                                message: "Please select a budget code!",
                              },
                            ]}
                          >
                            <Select disabled placeholder="Select Budget Code">
                              <Option value="BUD001">BUD001</Option>
                              <Option value="BUD002">BUD002</Option>
                              <Option value="BUD003">BUD003</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name="commonlyUsed"
                            label="Commonly Used by department"
                            rules={[
                              {
                                required: true,
                                // message: "Please enter material subcategory!",
                              },
                            ]}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            name="totalPrice"
                            label="Total Price"
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

        </div>
        {/* <div className="form-section">
          <Form.Item
            name="indentMaterials"
            label="Indent Materials"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="modeOfProcurement"
            label="Mode of Procurement"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="GeM">GeM</Option>
              <Option value="CPPP">CPPP</Option>
              <Option value="Proprietary">Proprietary</Option>
              <Option value="Limited Tender">Limited Tender</Option>
            </Select>
          </Form.Item> */}
          <div className="form-section">

          <Form.Item
            name="bidType"
            label="Bid Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Single Bid">Single Bid</Option>
              <Option value="Two Bid">Two Bid</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="lastDate"
            label="Last Date of Submission"
            rules={[
              {
                required: true,
                message: "Please select the last date of submission",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="applicableTaxes"
            label="Applicable Taxes"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        <Form.Item
            name="consignesAndBillinngAddress"
            label="Consignees and Billing Address"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
          </div>
        <div className="form-section">
          <Form.Item
            name="incoTerms"
            label="INCO Terms"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
          <Form.Item
            name="paymentTerms"
            label="Paymemt Terms"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>

          <Form.Item
            name="ldClause"
            label="LD Clause"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
          <Form.Item
            name="applicablePerformance"
            label="Applicable Performance"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        </div>
        <div className="form-section">

          <Form.Item name="bidSecurity" label="Bid Security Declaration">
            <Checkbox>Yes</Checkbox>
          </Form.Item>

          <Form.Item name="mllStatusDeclaration" label="MLL Status Declaration">
            <Checkbox>Yes</Checkbox>
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            name="tenderUpload"
            label="Tender Upload"
            rules={[{ required: true }]}
          >
            <Upload>
              <Button icon={<UploadOutlined />}>Upload Tender Documents</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="singleOrMultipleVendors"
            label="Single or Multiple Vendors"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Single">Single</Option>
              <Option value="Multiple">Multiple</Option>
            </Select>
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            name="generalTerms&Conditions"
            label="General Terms & Conditions"
            rules={[{ required: true }]}
          >
            <Upload>
              <Button icon={<UploadOutlined />}>Upload General T&C</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="specificTerms&Conditions"
            label="Specific Terms & Conditions"
            rules={[{ required: true }]}
          >
            <Upload>
              <Button icon={<UploadOutlined />}>Upload Specific T&C</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="preBidDiscussions"
            label="Pre Bid Discussions"
            rules={[{ required: true }]}
          >
            <TextArea rows={1} />
          </Form.Item>
        </div>
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="default" htmlType="reset">
              Reset
            </Button>
            <Button type="primary" htmlType="submit" onClick={loading}>
              Submit
            </Button>
            <Button type="dashed" htmlType="button" onClick={saveDraft}>
              Save Draft
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form4;
