import React from "react";
import { Form, Input, InputNumber, DatePicker, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
// import React from "react";

const { Option } = Select;

const Form11 = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form Values:", values);
  };

  return (
    <div className="form-container">
        <h2>General Details</h2>
        <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ UOM: "KG" }}
        >
            <div className="form-section">
                <Form.Item label="GPRN No." name="GPRN" rules={[{ required: true }]}> 
                    <Input readOnly placeholder="Auto-generated" />
                </Form.Item>

                <Form.Item label="PO No." name="PO" rules={[{ required: true }]}> 
                    <Input placeholder="Enter PO Number" />
                </Form.Item>
                <Form.Item label="Date" name="date" rules={[{ required: true }]}> 
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
            </div>

        <div className="form-section">
            <Form.Item label="Delivery Challan/Invoice No." name="invoiceNo" rules={[{ required: true }]}> 
                <Input placeholder="Enter Invoice/Challan No." />
            </Form.Item>

            <Form.Item label="Delivery Challan/Invoice Date" name="invoiceDate" rules={[{ required: true }]}> 
                <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Vendor ID" name="vendorID" rules={[{ required: true }]}> 
                <Input placeholder="Enter Vendor ID" />
            </Form.Item>
        </div>

        <div className="form-section">

            <Form.Item label="Vendor Name" name="vendorName" rules={[{ required: true }]}> 
                <Input placeholder="Enter Vendor Name" />
            </Form.Item>

            <Form.Item label="Vendor Email ID" name="vendorEmail" rules={[{ type: "email" }]}> 
                <Input placeholder="Enter Vendor Email" />
            </Form.Item>

            <Form.Item label="Vendor Contact No." name="vendorContact"> 
                <InputNumber style={{ width: "100%" }} placeholder="Enter Contact Number" />
            </Form.Item>
        </div>

        <h2>Material Details</h2>
        <div className="form-section">

            <Form.Item label="Material Code" name="materialCode" rules={[{ required: true }]}> 
                <Input readOnly placeholder="Auto-generated" />
            </Form.Item>

            <Form.Item label="Description" name="description" rules={[{ required: true }]}> 
                <Input.TextArea placeholder="Enter Material Description" rows={1}/>
            </Form.Item>

            <Form.Item label="UOM" name="UOM" rules={[{ required: true }]}> 
                <Select>
                <Option value="KG">KG</Option>
                <Option value="Litre">Litre</Option>
                </Select>
            </Form.Item>
        </div>

        <div className="form-section">

            <Form.Item label="Ordered Quantity" name="orderedQuantity" rules={[{ required: true }]}> 
                <InputNumber style={{ width: "100%" }} placeholder="Enter Ordered Quantity" />
            </Form.Item>

            <Form.Item label="Received Quantity" name="receivedQuantity" rules={[{ required: true }]}> 
                <InputNumber style={{ width: "100%" }} placeholder="Enter Received Quantity" />
            </Form.Item>

            <Form.Item label="Unit Price (Rs)" name="unitPrice" rules={[{ required: true }]}> 
                <InputNumber style={{ width: "100%" }} placeholder="Enter Unit Price" />
            </Form.Item>
        </div>
        <div className="form-section">
            <Form.Item label="Net Price (Rs)" name="netPrice"> 
                <InputNumber readOnly style={{ width: "100%" }} placeholder="Auto-calculated" />
            </Form.Item>
            <Form.Item label="Attach Photograph" name="photograph"> 
                <Upload listType="picture" beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Form.Item>
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

export default Form11;
