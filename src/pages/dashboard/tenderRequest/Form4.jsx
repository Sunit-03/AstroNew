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
    Upload,
  } from "antd";
  import { Option } from "antd/es/mentions";
  import {
    MinusCircleOutlined,
    PlusOutlined,
    SearchOutlined,
    UploadOutlined,
  } from "@ant-design/icons";
  import React, { useEffect, useState } from "react";
  import TextArea from "antd/es/input/TextArea";
  
  const Form4 = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
  
    // For indent data (used in the dropdown)
    const [indentData, setIndentData] = useState([]);
    const [selectedIndentMaterials, setSelectedIndentMaterials] = useState([]);
  
    // For Tender Search (separate functionality)
    const [searchTenderId, setSearchTenderId] = useState("");
    const [tenderDetails, setTenderDetails] = useState(null);
  
    // ----------------------------
    // XML Parsing & Indent Data Fetch
    // ----------------------------
    const parseXML = (xmlText) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");
      console.log("XML Document Root:", xml.documentElement);
  
      // Try to locate the indent elements. If there's a <responseData> wrapper, use that;
      // otherwise, try to get all "indent" tags from the document.
      let indentElements = xml.getElementsByTagName("indent");
  
      if (indentElements.length === 0) {
        // If no indent elements are found, try to locate them under a wrapper element (if it exists)
        const responseData = xml.getElementsByTagName("responseData")[0];
        if (responseData) {
          indentElements = responseData.getElementsByTagName("indent");
        }
      }
      console.log("Found indent elements:", indentElements);
  
      // Map through indent elements and extract data
      const parsedIndents = Array.from(indentElements).map((indent) => {
        const indentorId =
          indent.getElementsByTagName("indentorId")[0]?.textContent || null;
        // If indentorId is missing, log a warning:
        if (!indentorId) {
          console.warn("Missing indentorId in one of the indent elements", indent);
        }
        // Extract materialDetails if available
        let materialDetails = [];
        const materialDetailsElement =
          indent.getElementsByTagName("materialDetails")[0];
        if (materialDetailsElement) {
          materialDetails = Array.from(materialDetailsElement.children).map(
            (material) => ({
              materialCode:
                material.getElementsByTagName("materialCode")[0]?.textContent || "",
              materialDescription:
                material.getElementsByTagName("materialDescription")[0]
                  ?.textContent || "",
              quantity:
                material.getElementsByTagName("quantity")[0]?.textContent || "",
              unitPrice:
                material.getElementsByTagName("unitPrice")[0]?.textContent || "",
              uom:
                material.getElementsByTagName("uom")[0]?.textContent || "",
              budgetCode:
                material.getElementsByTagName("budgetCode")[0]?.textContent || "",
              totalPrize:
                material.getElementsByTagName("totalPrize")[0]?.textContent || "",
              materialCategory:
                material.getElementsByTagName("materialCategory")[0]
                  ?.textContent || "",
              materialSubCategory:
                material.getElementsByTagName("materialSubCategory")[0]
                  ?.textContent || "",
            })
          );
        }
  
        return { indentorId, materialDetails };
      });
  
      return parsedIndents.filter((indent) => indent.indentorId !== null);
    };
  
    // Fetch indent data using AllOrigins to bypass CORS
    const fetchIndentData = async () => {
      try {
        const response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            "http://103.181.158.220:8081/astro-service/api/indents"
          )}`
        );
        if (!response.ok) throw new Error("Failed to fetch indent data");
        const data = await response.json();
  
        // AllOrigins returns a JSON with a "contents" property containing the XML string.
        const xmlText = data.contents;
        console.log("Raw XML Text:", xmlText);
  
        const parsedData = parseXML(xmlText);
        console.log("Parsed indent data:", parsedData);
  
        setIndentData(parsedData);
      } catch (error) {
        console.error("Error fetching indent data:", error);
        message.error("Failed to fetch indent data");
      }
    };
  
    useEffect(() => {
      fetchIndentData();
    }, []);
  
    // ----------------------------
    // Indent selection handler
    // ----------------------------
    const handleIndentChange = (selectedIndentIds) => {
      let newMaterials = [];
  
      selectedIndentIds.forEach((indentId) => {
        const indent = indentData.find((item) => item.indentorId === indentId);
        if (indent && indent.materialDetails) {
          newMaterials = [...newMaterials, ...indent.materialDetails];
        }
      });
  
      // Remove duplicate materials based on materialCode
      const uniqueMaterials = newMaterials.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.materialCode === item.materialCode)
      );
  
      setSelectedIndentMaterials(uniqueMaterials);
      form.setFieldsValue({
        lineItems: uniqueMaterials.map(formatMaterial),
      });
    };
  
    // Format a material object for Form.List
    const formatMaterial = (material) => ({
      materialCode: material.materialCode,
      materialDescription: material.materialDescription,
      quantity: material.quantity,
      unitPrice: material.unitPrice,
      uom: material.uom,
      budgetCode: material.budgetCode,
      totalPrice: material.totalPrize,
      materialCategory: material.materialCategory,
      materialSubCategory: material.materialSubCategory,
    });
  
    // ----------------------------
    // Price calculation for line items
    // ----------------------------
    const calculateTotalPrice = (record) => {
      const quantity = parseFloat(record.quantity) || 0;
      const unitPrice = parseFloat(record.unitPrice) || 0;
      return quantity * unitPrice;
    };
  
    const handlePriceCalculation = (index, field, value) => {
      const lineItems = form.getFieldValue("lineItems");
      if (lineItems[index]) {
        const totalPrice = calculateTotalPrice({
          ...lineItems[index],
          [field]: value,
        });
        const updatedItems = [...lineItems];
        updatedItems[index] = { ...updatedItems[index], totalPrice };
        form.setFieldsValue({ lineItems: updatedItems });
      }
    };
  
    // ----------------------------
    // Tender Search Functionality
    // ----------------------------
    const handleSearchTender = async () => {
      if (!searchTenderId) {
        message.error("Please enter a Tender ID");
        return;
      }
      try {
        const response = await fetch(
          `http://103.181.158.220:8081/astro-service/api/tender-requests/${searchTenderId}`
        );
        if (!response.ok) throw new Error("Tender not found");
        const data = await response.json();
        setTenderDetails(data);
        message.success("Tender details fetched successfully!");
      } catch (error) {
        message.error("Failed to fetch tender details: " + error.message);
        console.error("Error fetching tender details:", error);
      }
    };
  
    // ----------------------------
    // Form Submission & Save Draft
    // ----------------------------
    const onFinish = async (values) => {
      setLoading(true);
      try {
        const formattedData = {
          titleOfTender: values.title,
          openingDate: values.openingDate?.format("YYYY-MM-DD"),
          closingDate: values.closingDate?.format("YYYY-MM-DD"),
          indentIds: values.indentId, // multiple indent IDs
          bidType: values.bidType,
          lastDate: values.lastDate?.format("YYYY-MM-DD"),
          applicableTaxes: values.applicableTaxes,
          consigneeAndBillingAddress: values.consignesAndBillinngAddress,
          incoTerms: values.incoTerms,
          paymentTerms: values.paymentTerms,
          ldClause: values.ldClause,
          applicablePerformance: values.applicablePerformance,
          bidSecurity: values.bidSecurity || false,
          mllStatusDeclaration: values.mllStatusDeclaration || false,
          singleOrMultipleVendors: values.singleOrMultipleVendors,
          preBidDiscussions: values.preBidDiscussions,
          lineItems: values.lineItems.map((item) => ({
            materialCode: item.materialCode,
            materialDescription: item.materialDescription,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            uom: item.uom,
            totalPrice: parseFloat(item.totalPrice),
            budgetCode: item.budgetCode,
          })),
        };
  
        const response = await fetch(
          "http://103.181.158.220:8081/astro-service/api/tenders",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
          }
        );
        if (!response.ok) throw new Error("Failed to submit tender");
  
        message.success("Tender submitted successfully!");
        form.resetFields();
      } catch (error) {
        message.error("Failed to submit tender: " + error.message);
        console.error("Error submitting tender:", error);
      } finally {
        setLoading(false);
      }
    };
  
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
        {/* Header with Tender Search (top right corner) */}
        <Row justify="end" style={{ marginBottom: "20px" }}>
          <Col>
            <Input
              placeholder="Enter Tender ID"
              value={searchTenderId}
              onChange={(e) => setSearchTenderId(e.target.value)}
              style={{ width: 200, marginRight: "10px" }}
            />
            <Button type="primary" onClick={handleSearchTender}>
              <SearchOutlined/>
            </Button>
          </Col>
        </Row>
  
        {/* Display fetched Tender Details (if available) */}
        {tenderDetails && (
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            <h3>Tender Details</h3>
            <pre>{JSON.stringify(tenderDetails, null, 2)}</pre>
          </div>
        )}
  
        <h2>Tender Request</h2>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className="form-section">
            <Form.Item
              name="title"
              label="Title of the Tender"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="openingDate"
              label="Opening Date"
              rules={[{ required: true }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="closingDate"
              label="Closing Date"
              rules={[{ required: true }]}
            >
              <DatePicker />
            </Form.Item>
          </div>
  
          <Form.Item
            name="indentId"
            label="Indent ID"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" onChange={handleIndentChange}>
              {indentData.map((indent) => (
                <Option key={indent.indentorId} value={indent.indentorId}>
                  {indent.indentorId}
                </Option>
              ))}
            </Select>
          </Form.Item>
  
          <div className="form-section">
            <Form.List name="lineItems">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div
                      key={key}
                      style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <Space
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                        align="start"
                      >
                        <Row gutter={16} style={{ width: "100%" }}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "materialCode"]}
                              label="Material Code"
                            >
                              <Input placeholder="Auto-filled" disabled />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "materialDescription"]}
                              label="Material Description"
                            >
                              <Input placeholder="Auto-filled" disabled />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "quantity"]}
                              label="Quantity"
                            >
                              <Input
                                type="number"
                                placeholder="Enter Quantity"
                                onBlur={(e) =>
                                  handlePriceCalculation(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "unitPrice"]}
                              label="Unit Price"
                            >
                              <Input
                                type="number"
                                placeholder="Enter Unit Price"
                                onBlur={(e) =>
                                  handlePriceCalculation(
                                    index,
                                    "unitPrice",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "uom"]}
                              label="UOM"
                            >
                              <Input placeholder="Auto-filled" disabled />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "budgetCode"]}
                              label="Budget Code"
                            >
                              <Input placeholder="Auto-filled" disabled />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "totalPrice"]}
                              label="Total Price"
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
                { required: true, message: "Please select the last date of submission" },
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
              label="Payment Terms"
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
              <Button type="primary" htmlType="submit" loading={loading}>
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
  