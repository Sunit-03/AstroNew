import React from "react";
import { Form, Input, Select, Button, InputNumber, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const Form15 = () => {
  const onFinish = (values) => {
    console.log("Form Values:", values);
  };

  return (
    <div className="form-container">
        <h2>Asset Master</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          uom: "KG",
          currentCondition: "New",
        }}
      >
        <div className="form-section">
          <Form.Item
            label="Asset Code"
            name="assetCode"
            rules={[{ required: true, message: "Asset Code is required" }]}
          >
            <Input disabled placeholder="Auto-generated" />
          </Form.Item>

          <Form.Item
            label="Material Code"
            name="materialCode"
            rules={[{ required: true, message: "Material Code is required" }]}
          >
            <Input disabled placeholder="Auto-generated" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Unit of Measure (UOM)"
            name="uom"
            rules={[{ required: true, message: "UOM is required" }]}
          >
            <Select>
              <Option value="KG">KG</Option>
              <Option value="Liters">Liters</Option>
              <Option value="Units">Units</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Make No." name="makeNo">
            <Input />
          </Form.Item>

          <Form.Item label="Model No." name="modelNo">
            <Input />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item label="Serial No." name="serialNo">
            <Input />
          </Form.Item>

          <Form.Item label="Component Name" name="componentName">
            <Input />
          </Form.Item>

          <Form.Item label="Component Code" name="componentCode">
            <Input />
          </Form.Item>
        </div>
        <div className="form-section">

        <Form.Item label="Quantity" name="quantity">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Locator"
          name="locator"
          rules={[{ required: true, message: "Locator is required" }]}
        >
          <Input />
        </Form.Item>
            <Form.Item
            label="Current Condition"
            name="currentCondition"
            rules={[{ required: true, message: "Current Condition is required" }]}
            >
            <Select>
                <Option value="New">New</Option>
                <Option value="Good">Good</Option>
                <Option value="Needs Repair">Needs Repair</Option>
            </Select>
            </Form.Item>
        </div>

        <h6>Asset Issue</h6>
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

        <Form.Item label="Transaction History" name="transactionHistory">
          <Button type="link">View Transaction History</Button>
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

export default Form15;
