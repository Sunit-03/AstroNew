import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Upload, DatePicker, Checkbox, Space, Row, Col, message } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined, SearchOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

const Form1 = () => {
  const [form] = Form.useForm();
  const [preBidRequired, setPreBidRequired] = useState(false);
  const [rateContractIndent, setRateContractIndent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const indentId = form.getFieldValue('indentId');
    if (!indentId) {
      message.error('Please enter an Indent ID');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5001/getIndent?indentorId=${indentId}`);
      if (!response.ok) throw new Error('Failed to fetch data');
  
      const data = await response.json();
      console.log('Fetched Data:', data); // Debugging: Log the fetched data
  
      const matchingIndent = data.responseData.find(item => item.indentorId === indentId);
      if (!matchingIndent) {
        message.error('No data found for the given Indent ID');
        return;
      }
  
      const formData = {
        indentorName: matchingIndent.indentorName,
        indentorId: matchingIndent.indentorId,
        indentorMobileNo: matchingIndent.indentorMobileNo,
        indentorEmail: matchingIndent.indentorEmailAddress,
        consigneeLocation: matchingIndent.consignesLocation,
        projectName: matchingIndent.projectName,
        preBidMeetingRequired: matchingIndent.isPreBidMeetingRequired,
        preBidMeetingDetails: matchingIndent.preBidMeetingDate ? 
          [dayjs(matchingIndent.preBidMeetingDate)] : undefined,
        preBidMeetingLocation: matchingIndent.preBidMeetingVenue,
        rateContractIndent: matchingIndent.isItARateContractIndent,
        estimatedRate: matchingIndent.estimatedRate,
        periodOfRateContract: matchingIndent.periodOfContract,
        singleOrMultipleJob: matchingIndent.singleAndMultipleJob,
        lineItems: matchingIndent.materialDetails.map(item => ({
          materialCode: item.materialCode,
          materialDescription: item.materialDescription,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          uom: item.uom,
          budgetCode: item.budgetCode,
          materialCategory: item.materialCategory,
          materialSubcategory: item.materialSubCategory,
          totalPrice: item.totalPrize,
          materialOrJobCodeUsedByDept: item.materialAndJob
        }))
      };

      console.log("Line Items: ", formData.lineItems);
  
      console.log('Form Data to Set:', formData); // Debugging: Log the form data
      form.setFieldsValue(formData); // Set all form fields, including lineItems
      setPreBidRequired(matchingIndent.isPreBidMeetingRequired);
      setRateContractIndent(matchingIndent.isItARateContractIndent);
      message.success('Form data fetched successfully');
    } catch (error) {
      message.error('Failed to fetch form data');
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updatedLineItems = values.lineItems.map(item => ({
        ...item,
        totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice)
      }));

      const apiData = {
        responseStatus: {
          statusCode: 0,
          message: null,
          errorCode: null,
          errorType: null
        },
        responseData: {
          indentorName: values.indentorName,
          indentorId: values.indentorId,
          indentorMobileNo: values.indentorMobileNo,
          indentorEmailAddress: values.indentorEmail,
          consignesLocation: values.consigneeLocation,
          uploadingPriorApprovals: values.uploadPriorApprovals?.[0]?.response?.url || '',
          projectName: values.projectName,
          uploadTenderDocuments: values.uploadTenderDocuments?.[0]?.response?.url || '',
          isPreBidMeetingRequired: values.preBidMeetingRequired,
          preBidMeetingDate: values.preBidMeetingDetails?.[0]?.format('YYYY-MM-DD'),
          preBidMeetingVenue: values.preBidMeetingLocation,
          isItARateContractIndent: values.rateContractIndent,
          estimatedRate: parseFloat(values.estimatedRate),
          periodOfContract: parseFloat(values.periodOfRateContract),
          singleAndMultipleJob: values.singleOrMultipleJob,
          uploadGOIOrRFP: values.uploadGOIorRFP?.[0]?.response?.url || '',
          uploadPACOrBrandPAC: values.uploadPACorBrandPAC?.[0]?.response?.url || '',
          materialDetails: updatedLineItems.map(item => ({
            materialCode: item.materialCode,
            materialDescription: item.materialDescription,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            uom: item.uom,
            totalPrize: item.totalPrice,
            budgetCode: item.budgetCode,
            materialCategory: item.materialCategory,
            materialSubCategory: item.materialSubcategory,
            materialAndJob: item.materialOrJobCodeUsedByDept
          })),
          createdBy: "admin",
          updatedBy: "admin"
        }
      };

      const response = await fetch('http://localhost:5000/indents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) throw new Error('Failed to submit form');
      
      const responseData = await response.json();
      message.success('Form submitted successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit form: ' + error.message);
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
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

  const handleCheckboxChange = (e) => {
    setPreBidRequired(e.target.checked);
  };

  const handleCheckboxChange2 = (e) => {
    setRateContractIndent(e.target.checked);
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
      <h2>Indent Creation</h2>
      <Row justify="end">
        <Col>
            <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Indent ID"
            name="indentId"
            rules={[{ required: true, message: "Indentor ID is required" }]}
          >
            <Space>
              <Input placeholder="Enter Indent ID" />
              <Button type="primary" onClick={handleSearch}>
              <SearchOutlined />
              </Button>
            </Space>
          </Form.Item>
            </Form>
        </Col>
      </Row>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ date: null }}
      >
        <div className="form-section">
          <Form.Item
            label="Indentor Name"
            name="indentorName"
            rules={[{ required: true, message: "Indentor name is required" }]}
          >
            <Input value="Auto-populated" />
          </Form.Item>


          <Form.Item
            label="Indentor Mobile No."
            name="indentorMobileNo"
            rules={[{ required: true, message: "Indentor mobile number is required" }]}
          >
            <Input value="Auto-populated" />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Indentor Email"
            name="indentorEmail"
            rules={[{ required: true, message: "Indentor name is required" }]}
          >
            <Input value="Auto-populated"  />
          </Form.Item>

          <Form.Item
            label="Consignee Location"
            name="consigneeLocation"
            rules={[{ required: true, message: "Indentor name is required" }]}
          >
            <TextArea rows={1} value="Auto-populated" />
          </Form.Item>

          <Form.Item
            name="uploadPriorApprovals"
            label="Upload Prior Approvals"
            // rules={[{ required: true }]}
          >
            <Upload {...props}>
              <Button type="primary" icon={<UploadOutlined />}>
                Upload Prior Approvals
              </Button>
            </Upload>
          </Form.Item>
        </div>

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
                            <Select placeholder="Select Material Code" >
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
                            <Select placeholder="Select Material Description" >
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
                            <Input type="number" placeholder="Enter Quantity"  onChange={(e)=>handlePriceCalculation(index,'quantity',e.target.value)} />
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
                            <Select  placeholder="Select UOM">
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
                            <Select  placeholder="Select Budget Code">
                              <Option value="BUD001">BUD001</Option>
                              <Option value="BUD002">BUD002</Option>
                              <Option value="BUD003">BUD003</Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            name="materialCategory"
                            label="Material Category"
                            rules={[
                              {
                                required: true,
                                message: "Please enter material category!",
                              },
                            ]}
                          >
                            <Input  placeholder="Enter Material Category" />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            name="materialSubcategory"
                            label="Material Subcategory"
                            rules={[
                              {
                                required: true,
                                message: "Please enter material subcategory!",
                              },
                            ]}
                          >
                            <Input  placeholder="Enter Material Subcategory" />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            name="totalPrice"
                            label="Total Price"
                            shouldUpdate
                          >
                            <Input placeholder="Auto-calculated"  />
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
          <Form.Item name="projectName" label="Project Name">
            <Select  placeholder="Select project">
              <Option value="project1">Project 1</Option>
              <Option value="project2">Project 2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="uploadTenderDocuments"
            label="Upload Tender Documents"
            rules={[{ required: true }]}
          >
            <Upload {...props}>
              <Button type="primary" icon={<UploadOutlined />}>
                Upload Tender Documents
              </Button>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item name="preBidMeetingRequired" valuePropName="checked">
          <Checkbox onChange={handleCheckboxChange}>
            Pre-bid Meeting Required
          </Checkbox>
        </Form.Item>
        <div className="form-section">
          {preBidRequired && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="preBidMeetingDetails"
                  label="Pre-bid Meeting Details"
                >
                  <DatePicker.RangePicker showTime format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Pre Bid Meeting Location"
                  name="preBidMeetingLocation"
                  rules={[
                    {
                      required: true,
                      message: "Pre Bid Meeting Location is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>

        <Form.Item name="rateContractIndent" valuePropName="checked">
          <Checkbox onChange={handleCheckboxChange2}>
            Is it a rate contract indent
          </Checkbox>
        </Form.Item>
        <div className="form-section">
          {rateContractIndent && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="estimatedRate"
                  label="Estimated Rate"
                  rules={[
                    {
                      required: true,
                      message: "Please enter estimated rate!",
                    },
                  ]}
                >
                  <Input  type="number" placeholder="Enter Estimated Rate" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="periodOfRateContract"
                  label="Period of Rate Contract"
                  rules={[
                    {
                      required: true,
                      message: "Enter Period of Contract!",
                    },
                  ]}
                >
                  <Input  type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="singleOrMultipleJob"
                  label="Single or Multiple Job"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select  placeholder="Select Material Code">
                    <Option value="Single">Single</Option>
                    <Option value="Multiple">Multiple</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>
        <div className="form-section">
          <Form.Item
            name="uploadGOIorRFP"
            label="Upload GOI or RFP"
            // rules={[{ required: true }]}
          >
            <Upload {...props}>
              <Button type="primary" icon={<UploadOutlined />}>
                Upload GOI/RFP
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="uploadPACorBrandPAC"
            label="Upload PAC or Brand PAC"
            rules={[{ required: true }]}
          >
            <Upload {...props}>
              <Button type="primary" icon={<UploadOutlined />}>
                Upload PAC/Brand PAC
              </Button>
            </Upload>
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
                      <Form.Item
                        name="materialOrJobCodeUsedByDept"
                        label="Material/Job Code Used By Dept"
                        rules={[{ required: true }]}
                        style={{ width: "100%" }}
                      >
                        <Input  />
                      </Form.Item>
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

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form1;