import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import { Option } from "antd/es/mentions";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";

const Form20 = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Demand Form Values:", values);
  };
  return (
    <div className="form-container">
      <h2>Demand and Issue</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <h6>Demand (Consumable Request)</h6>
        <div className="form-section">
          <Form.Item
            label="Requestor Name"
            name="requestorName"
            rules={[{ required: true, message: "Please enter requestor name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please enter department" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Employee ID"
            name="empID"
            rules={[{ required: true, message: "Please enter employee ID" }]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            label="Contact Information"
            name="contactInfo"
            rules={[
              { required: true, message: "Please enter contact information" },
            ]}
          >
            <Input placeholder="Enter Email" type="email" />
          </Form.Item>

          <Form.Item
            label="Request Date"
            name="reqDate"
            rules={[{ required: true, message: "Please select request date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select priority">
              <Option value="urgent">Urgent</Option>
              <Option value="normal">Normal</Option>
            </Select>
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            label="Item Code"
            name="itemCode"
            rules={[{ required: true, message: "Please enter item code" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Item Description"
            name="itemDescription"
            rules={[
              { required: true, message: "Please enter item description" },
            ]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
          <Form.Item label="UOM" name="UOM" rules={[{ required: true }]}>
            <Select>
              <Option value="KG">KG</Option>
              <Option value="Litre">Litre</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Quantity Required"
            name="quantityRequired"
            rules={[
              { required: true, message: "Please enter quantity required" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Expected delivery Date"
            name="expectedDeliveryDate"
            rules={[
              {
                required: true,
                message: "Please select expected delivery date",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Usage Description"
            name="usageDescription"
            rules={[
              { required: true, message: "Please enter usage description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            label="Request Status"
            name="requestStatus"
            rules={[{ required: true }]}
          >
            <Select disabled placeholder="Status">
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Approved By" name="approvedBy">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Approved Date" name="approvedDate">
            <DatePicker disabled style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item label="Remarks" name="remarks">
          <Input.TextArea
            placeholder="Additional Notes (if any)"
            rows={1}
            style={{ width: "32%" }}
          />
        </Form.Item>
        {/* <h6>Item Details</h6> */}
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
            <Form.List name="lineItems" initialValue={[{}]}>
            {(fields, { add, remove }) => (
                <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 20, flexWrap: "wrap" }}
                    align="start"
                    >
                    <div className="form-section">
                    {/* S. No */}
                        <Form.Item
                            {...restField}
                            name={[name, "serialNumber"]}
                            fieldKey={[fieldKey, "serialNumber"]}
                            rules={[{ required: true, message: "Required!" }]}
                            style={{ width: "60px" }}
                        >
                            <Input placeholder="S. No" />
                        </Form.Item>

                        {/* Item Code */}
                        <Form.Item
                            {...restField}
                            name={[name, "itemCode"]}
                            fieldKey={[fieldKey, "itemCode"]}
                            rules={[{ required: true, message: "Required!" }]}
                            style={{ width: "150px" }}
                        >
                            <Input placeholder="Item Code" />
                        </Form.Item>

                        {/* Item Description */}
                        <Form.Item
                            {...restField}
                            name={[name, "itemDescription"]}
                            fieldKey={[fieldKey, "itemDescription"]}
                            rules={[{ required: true, message: "Required!" }]}
                            style={{ width: "200px" }}
                        >
                            <Input placeholder="Item Description" />
                        </Form.Item>
                        {/* Unit of Measurement */}
                        <Form.Item
                            {...restField}
                            name={[name, "unitOfMeasurement"]}
                            fieldKey={[fieldKey, "unitOfMeasurement"]}
                            style={{ width: "150px" }}
                        >
                            <Select placeholder="Unit">
                            <Option value="kg">Kg</Option>
                            <Option value="litre">Litre</Option>
                            <Option value="piece">Piece</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="form-section">
                    {/* Required Quantity */}
                    <Form.Item
                        {...restField}
                        name={[name, "requiredQuantity"]}
                        fieldKey={[fieldKey, "requiredQuantity"]}
                        style={{ width: "150px" }}
                    >
                        <Input placeholder="Quantity" />
                    </Form.Item>

                    {/* Required for No. of Days */}
                    <Form.Item
                        {...restField}
                        name={[name, "requiredForDays"]}
                        fieldKey={[fieldKey, "requiredForDays"]}
                        style={{ width: "150px" }}
                    >
                        <Input placeholder="Req. For Days" />
                    </Form.Item>
                    </div>
                    <div className="form-section">

                        {/* Remarks */}
                        <Form.Item
                            {...restField}
                            name={[name, "remarks"]}
                            fieldKey={[fieldKey, "remarks"]}
                            style={{ width: "200px" }}
                        >
                            <Input placeholder="Remarks" />
                        </Form.Item>
                    </div>

                    {/* Remove Button */}
                    <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                ))}

                {/* Add Item Button */}
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

        <h6>Issue (Consumable Issue)</h6>
        <div className="form-section">
          <Form.Item
            label="Issue ID"
            name="issueId"
            rules={[{ required: true, message: "Please enter issue ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Issue Date"
            name="issueDate"
            rules={[{ required: true, message: "Please select issue date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Request Reference ID"
            name="reqReferenceID"
            rules={[{ required: true, message: "Please enter reference ID" }]}
          >
            <Input disabled placeholder="linked to demand form" />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Recipient Name"
            name="recipientName"
            rules={[{ required: true, message: "Please enter recipient name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please enter department" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contact Information"
            name="contactInfo"
            rules={[{ required: true, message: "Please enter contact info" }]}
          >
            <Input placeholder="Enter Email" type="email" />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            label="Item Code"
            name="itemCode"
            rules={[{ required: true, message: "Please enter item code" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Item Description"
            name="itemDescription"
            rules={[
              { required: true, message: "Please enter item description" },
            ]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>

          <Form.Item label="UOM" name="UOM" rules={[{ required: true }]}>
            <Select>
              <Option value="KG">KG</Option>
              <Option value="Litre">Litre</Option>
            </Select>
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            label="Quantity Issued"
            name="quantityIssued"
            rules={[
              { required: true, message: "Please enter quantity issued" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Stock Balance"
            name="stockBalance"
            rules={[
              { required: true, message: "Please enter quantity issued" },
            ]}
          >
            <Input type="number" disabled placeholder="Auto-populated" />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item label="Name of Issuer" name="nameOfIssuer">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Designation" name="designation">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Date of Authorization" name="autorizationDate">
            <DatePicker disabled style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item label="Remarks" name="remarks">
          <Input.TextArea
            placeholder="Comments/Issues Noted (if any)"
            rows={1}
            style={{ width: "32%" }}
          />
        </Form.Item>
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

export default Form20;
