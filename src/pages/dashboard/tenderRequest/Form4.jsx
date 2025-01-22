import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Select,
  Upload,
} from "antd";
import { Option } from "antd/es/mentions";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
// If using moment.js, make sure it's imported
import moment from "moment";

// If using date-fns, use their isValid function
// import { isValid } from 'date-fns';

const Form4 = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTenderData = async () => {
      try {
        const response = await fetch("http://localhost:5001/tender"); // Adjust endpoint as needed
        const data = await response.json();

        if (data.responseData) {
          console.log("Fetched data:", data.responseData);

          // Directly set field values using form.setFieldsValue
          const formData = {
            title: data.responseData.titleOfTender,
            openingDate: data.responseData.openingDate
              ? dayjs(data.responseData.openingDate)
              : undefined,
            closingDate: data.responseData.closingDate
              ? dayjs(data.responseData.closingDate)
              : undefined,
            indentId: data.responseData.indentId,
            indentMaterials: data.responseData.indentMaterials,
            modeOfProcurement: data.responseData.modeOfProcurement,
            bidType: data.responseData.bidType,
            lastDate: data.responseData.lastDateOfSubmission
              ? dayjs(data.responseData.lastDateOfSubmission)
              : undefined,
            applicableTaxes: data.responseData.applicableTaxes,
            tenderTerms: data.responseData.consignesAndBillinngAddress,
            paymentTerms: data.responseData.paymentTerms,
            ldClause: data.responseData.ldClause,
            applicablePerformance: data.responseData.applicablePerformance,
            bidSecurity: data.responseData.bidSecurityDeclaration,
            mllStatusDeclaration: data.responseData.mllStatusDeclaration,
            singleOrMultipleVendors: data.responseData.singleAndMultipleVendors,
            preBidDiscussions: data.responseData.preBidDisscussions,
          };
          form.setFieldsValue(formData);
          message.success("Tender data loaded successfully");
        //   form.setFieldsValue(data.responseData);
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
          preBidDisscussions: values.preBidDiscussions,
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
        </div>
        <div className="form-section">
          <Form.Item
            name="indentId"
            label="Indent ID"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="ID1">ID-1</Option>
              <Option value="ID2">ID-2</Option>
              <Option value="ID3">ID-3</Option>
            </Select>
          </Form.Item>

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
          </Form.Item>
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
        </div>
        <div className="form-section">
          <Form.Item
            name="tenderTerms"
            label="Tender Terms"
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
        </div>
        <div className="form-section">
          <Form.Item
            name="applicablePerformance"
            label="Applicable Performance"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>

          <Form.Item name="bidSecurity" label="Bid Security Declaration">
            <Radio>Yes</Radio>
          </Form.Item>

          <Form.Item name="mllStatusDeclaration" label="MLL Status Declaration">
            <Radio>Yes</Radio>
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
              <Option value="Single Vendor">Single Vendor</Option>
              <Option value="Multiple Vendors">Multiple Vendors</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="generalTerms&Conditions"
            label="General Terms & Conditions"
            rules={[{ required: true }]}
          >
            <Upload>
              <Button icon={<UploadOutlined />}>Upload General T&C</Button>
            </Upload>
          </Form.Item>
        </div>
        <div className="form-section">
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
