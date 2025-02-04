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
// import { message } from "antd"; // Import for notifications

const Form4 = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [indentData, setIndentData] = useState([]); // Store fetched indent data
  const [selectedIndentMaterials, setSelectedIndentMaterials] = useState([]); // Store materials dynamically

  
  const parseXML = (xmlText) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");
  
    const responseData = xml.getElementsByTagName("responseData")[0];
  
    // Convert indent data into an array
    const indents = responseData.getElementsByTagName("indent");
    return Array.from(indents).map((indent) => ({
      indentorId: indent.getElementsByTagName("indentorId")[0]?.textContent, // Get Indent ID
      materialDetails: Array.from(indent.getElementsByTagName("materialDetails")[0]?.children || []).map(
        (material) => ({
          materialCode: material.getElementsByTagName("materialCode")[0]?.textContent,
          materialDescription: material.getElementsByTagName("materialDescription")[0]?.textContent,
          quantity: material.getElementsByTagName("quantity")[0]?.textContent,
          unitPrice: material.getElementsByTagName("unitPrice")[0]?.textContent,
          uom: material.getElementsByTagName("uom")[0]?.textContent,
          budgetCode: material.getElementsByTagName("budgetCode")[0]?.textContent,
          totalPrize: material.getElementsByTagName("totalPrize")[0]?.textContent,
          materialCategory: material.getElementsByTagName("materialCategory")[0]?.textContent,
          materialSubCategory: material.getElementsByTagName("materialSubCategory")[0]?.textContent,
        })
      ),
    }));
  };
  
  const fetchIndentData = async () => {
    try {
        const response = await fetch(
            `https://api.allorigins.win/get?url=${encodeURIComponent(
              `http://103.181.158.220:8081/astro-service/api/indents`
            )}`
        );
      if (!response.ok) throw new Error("Failed to fetch indent data");
  
      const text = await response.text(); // Get XML response as text
      const data = parseXML(text); // Convert XML to JSON
  
      console.log("Converted JSON Data:", data);
      setIndentData(data); // Store JSON data in state
    } catch (error) {
      console.error("Error fetching indent data:", error);
      message.error("Failed to fetch indent data");
    }
  };

  useEffect(() => {
    fetchIndentData();
  }, []);

  // Handle indent selection
  const handleIndentChange = (selectedIndentIds) => {
    let newMaterials = [];
  
    selectedIndentIds.forEach((indentId) => {
      const indent = indentData.find((item) => item.indentorId === indentId);
      if (indent && indent.materialDetails) {
        newMaterials = [...newMaterials, ...indent.materialDetails];
      }
    });
  
    // Remove duplicates based on `materialCode`
    const uniqueMaterials = newMaterials.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.materialCode === item.materialCode)
    );
  
    setSelectedIndentMaterials(uniqueMaterials); // Store selected materials
  
    // Update the form's `lineItems`
    form.setFieldsValue({ lineItems: uniqueMaterials.map(formatMaterial) });
  };

  // Function to format material data for `Form.List`
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

  // Handle material selection for individual line items
  const handleMaterialSelect = (materialCode, index) => {
    const selectedMaterial = selectedIndentMaterials.find(
      (m) => m.materialCode === materialCode
    );
    if (selectedMaterial) {
      const lineItems = form.getFieldValue("lineItems");
      const updatedItems = [...lineItems];
      updatedItems[index] = {
        ...updatedItems[index],
        materialCode: selectedMaterial.materialCode,
        materialDescription: selectedMaterial.materialDescription,
        quantity: selectedMaterial.quantity,
        unitPrice: selectedMaterial.unitPrice,
        uom: selectedMaterial.uom,
        budgetCode: selectedMaterial.budgetCode,
        totalPrice: selectedMaterial.totalPrize,
        materialCategory: selectedMaterial.materialCategory,
        materialSubCategory: selectedMaterial.materialSubCategory,
      };
      form.setFieldsValue({ lineItems: updatedItems });
    }
  };

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
      updatedItems[index] = {
        ...updatedItems[index],
        totalPrice: totalPrice,
      };

      form.setFieldsValue({ lineItems: updatedItems });
    }
  };

//   useEffect(() => {
//     const fetchTenderData = async () => {
//       try {
//         const response = await fetch("http://localhost:5001/getTender"); // Adjust endpoint as needed
//         const data = await response.json();

//         if (data.responseData) {
//           console.log("Fetched data:", data.responseData);
//         }
//       } catch (error) {
//         message.error("Failed to fetch tender data");
//         console.error("Error fetching tender data:", error);
//       }
//     };
//     fetchTenderData();
//   }, [form]);

  const onFinish = async (values) => {
          setLoading(true);
          try {
            // Format the data for backend API
            const formattedData = {
              titleOfTender: values.title,
              openingDate: values.openingDate?.format("YYYY-MM-DD"),
              closingDate: values.closingDate?.format("YYYY-MM-DD"),
              indentIds: values.indentId, // Multiple indent IDs
              bidType: values.bidType,
              lastDate: values.lastDate?.format("YYYY-MM-DD"),
              applicableTaxes: values.applicableTaxes,
              consigneeAndBillingAddress: values.consigneesAndBillingAddress,
              incoTerms: values.incoTerms,
              paymentTerms: values.paymentTerms,
              ldClause: values.ldClause,
              applicablePerformance: values.applicablePerformance,
              bidSecurity: values.bidSecurity || false,
              mllStatusDeclaration: values.mllStatusDeclaration || false,
              singleOrMultipleVendors: values.singleOrMultipleVendors,
              preBidDiscussions: values.preBidDiscussions,
              lineItems: values.lineItems.map(item => ({
                materialCode: item.materialCode,
                materialDescription: item.materialDescription,
                quantity: parseFloat(item.quantity),
                unitPrice: parseFloat(item.unitPrice),
                uom: item.uom,
                totalPrice: parseFloat(item.totalPrice),
                budgetCode: item.budgetCode
              })),
            };
      
            // ✅ Send data to backend
            const response = await fetch("http://103.181.158.220:8081/astro-service/api/tenders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formattedData),
            });
      
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

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ date: null }}
      >
        <div className="form-section">
             <Form.Item name="title" label="Title of the Tender" rules={[{ required: true }]}>
               <Input />
             </Form.Item>
             <Form.Item name="openingDate" label="Opening Date" rules={[{ required: true }]}>
               <DatePicker />
             </Form.Item>
             <Form.Item name="closingDate" label="Closing Date" rules={[{ required: true }]}>
               <DatePicker />
             </Form.Item>
           </div>
           <Form.Item name="indentId" label="Indent ID" rules={[{ required: true }]}>
            <Select mode="multiple" onChange={handleIndentChange}>
                {indentData.map((indent) => (
                <Option key={indent.indentorId} value={indent.indentorId}>
                    {indent.indentorId}
                </Option>
                ))}
            </Select>
            </Form.Item>


        <div className="form-section">
          <div>
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

// import { 
//     Button, Checkbox, Col, DatePicker, Form, Input, message, Row, Select, Space, Upload 
//   } from "antd";
//   import { Option } from "antd/es/mentions";
//   import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
//   import React, { useEffect, useState } from "react";
//   import TextArea from "antd/es/input/TextArea";
  
//   const Form4 = () => {
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const [indentData, setIndentData] = useState([]); // Stores Indent IDs from backend
  
//     // ✅ Fetch Indent IDs from backend for dropdown
//     useEffect(() => {
//       const fetchIndentData = async () => {
//         try {
//           const response = await fetch("http://103.181.158.220:8081/astro-service/api/indents");
//           if (!response.ok) throw new Error("Failed to fetch indent data");
          
//           const data = await response.json();
//           if (data.responseData) setIndentData(data.responseData);
//         } catch (error) {
//           console.error("Error fetching indent data:", error);
//           message.error("Failed to fetch indent data");
//         }
//       };
//       fetchIndentData();
//     }, []);
  
//     // ✅ Handle form submission
//     const onFinish = async (values) => {
//       setLoading(true);
//       try {
//         // Format the data for backend API
//         const formattedData = {
//           titleOfTender: values.title,
//           openingDate: values.openingDate?.format("YYYY-MM-DD"),
//           closingDate: values.closingDate?.format("YYYY-MM-DD"),
//           indentIds: values.indentId, // Multiple indent IDs
//           bidType: values.bidType,
//           lastDate: values.lastDate?.format("YYYY-MM-DD"),
//           applicableTaxes: values.applicableTaxes,
//           consigneeAndBillingAddress: values.consigneesAndBillingAddress,
//           incoTerms: values.incoTerms,
//           paymentTerms: values.paymentTerms,
//           ldClause: values.ldClause,
//           applicablePerformance: values.applicablePerformance,
//           bidSecurity: values.bidSecurity || false,
//           mllStatusDeclaration: values.mllStatusDeclaration || false,
//           singleOrMultipleVendors: values.singleOrMultipleVendors,
//           preBidDiscussions: values.preBidDiscussions,
//           lineItems: values.lineItems.map(item => ({
//             materialCode: item.materialCode,
//             materialDescription: item.materialDescription,
//             quantity: parseFloat(item.quantity),
//             unitPrice: parseFloat(item.unitPrice),
//             uom: item.uom,
//             totalPrice: parseFloat(item.totalPrice),
//             budgetCode: item.budgetCode
//           })),
//         };
  
//         // ✅ Send data to backend
//         const response = await fetch("http://103.181.158.220:8081/astro-service/api/tenders", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formattedData),
//         });
  
//         if (!response.ok) throw new Error("Failed to submit tender");
  
//         message.success("Tender submitted successfully!");
//         form.resetFields();
//       } catch (error) {
//         message.error("Failed to submit tender: " + error.message);
//         console.error("Error submitting tender:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     return (
//       <div className="form-container">
//         <h2>Tender Request</h2>
  
//         <Form form={form} onFinish={onFinish} layout="vertical">
//           <div className="form-section">
//             <Form.Item name="title" label="Title of the Tender" rules={[{ required: true }]}>
//               <Input />
//             </Form.Item>
//             <Form.Item name="openingDate" label="Opening Date" rules={[{ required: true }]}>
//               <DatePicker />
//             </Form.Item>
//             <Form.Item name="closingDate" label="Closing Date" rules={[{ required: true }]}>
//               <DatePicker />
//             </Form.Item>
//           </div>
  
//           {/* Indent ID Selection */}
//           <Form.Item name="indentId" label="Indent ID" rules={[{ required: true }]}>
//             <Select mode="multiple">
//               {indentData.map((indent) => (
//                 <Option key={indent.indentorId} value={indent.indentorId}>
//                   {indent.indentorId}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
  
//           {/* Line Items */}
//           <Form.List name="lineItems" initialValue={[{}]}>
//             {(fields, { add, remove }) => (
//               <>
//                 {fields.map(({ key, name, ...restField }, index) => (
//                   <div key={key} style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "20px" }}>
//                     <Space style={{ display: "flex", flexDirection: "column", width: "100%" }}>
//                       <Row gutter={16}>
//                         <Col span={8}>
//                           <Form.Item {...restField} name={[name, "materialCode"]} label="Material Code" rules={[{ required: true }]}>
//                             <Input placeholder="Material Code" />
//                           </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                           <Form.Item {...restField} name={[name, "materialDescription"]} label="Material Description">
//                             <Input placeholder="Material Description" disabled />
//                           </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                           <Form.Item {...restField} name={[name, "quantity"]} label="Quantity" rules={[{ required: true }]}>
//                             <Input type="number" placeholder="Enter Quantity" />
//                           </Form.Item>
//                         </Col>
//                       </Row>
//                       <MinusCircleOutlined onClick={() => remove(name)} />
//                     </Space>
//                   </div>
//                 ))}
//                 <Form.Item>
//                   <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
//                     Add Item
//                   </Button>
//                 </Form.Item>
//               </>
//             )}
//           </Form.List>
  
//           {/* Other Tender Details */}
//           <Form.Item name="bidType" label="Bid Type" rules={[{ required: true }]}>
//             <Select>
//               <Option value="Single Bid">Single Bid</Option>
//               <Option value="Two Bid">Two Bid</Option>
//             </Select>
//           </Form.Item>
  
//           <Form.Item name="lastDate" label="Last Date of Submission" rules={[{ required: true }]}>
//             <DatePicker />
//           </Form.Item>
  
//           <Form.Item name="applicableTaxes" label="Applicable Taxes" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
  
//           <Form.Item name="consigneesAndBillingAddress" label="Consignees and Billing Address" rules={[{ required: true }]}>
//             <TextArea rows={1} />
//           </Form.Item>
  
//           {/* Submit Buttons */}
//           <Form.Item>
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <Button type="default" htmlType="reset">
//                 Reset
//               </Button>
//               <Button type="primary" htmlType="submit" loading={loading}>
//                 Submit
//               </Button>
//             </div>
//           </Form.Item>
//         </Form>
//       </div>
//     );
//   };
  
//   export default Form4;
  