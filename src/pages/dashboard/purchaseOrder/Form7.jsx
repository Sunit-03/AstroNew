import { Button, DatePicker, Form, Input, Select } from 'antd'
import { Option } from 'antd/es/mentions';
import React from 'react'

const Form7 = () => {
    const handleSubmit = (values) => {
        console.log("Form Data:", values);
      };
  return (
    <div className='form-container'>
        <h2>Purchase Order (PO)</h2>
        <Form layout="vertical" onFinish={handleSubmit}>
        {/* Tender Requests */}
        <div className='form-section'>
            <Form.Item
            label="Tender Request(s)"
            name="tenderRequests"
            rules={[{ required: true, message: "Please select tender request(s)" }]}
            >
            <Select mode="multiple" placeholder="Select tender requests">
                <Option value="tender1">Tender 1</Option>
                <Option value="tender2">Tender 2</Option>
            </Select>
            </Form.Item>
            {/* Corresponding Indent */}
            <Form.Item
            label="Corresponding Indent(s)"
            name="correspondingIndents"
            rules={[
                { required: true, message: "Please select corresponding indent(s)" },
            ]}
            >
            <Select mode="multiple" placeholder="Select corresponding indents">
                <Option value="indent1">Indent 1</Option>
                <Option value="indent2">Indent 2</Option>
            </Select>
            </Form.Item>

            {/* Material Description */}
            <Form.Item
            label="Material Description"
            name="materialDescription"
            rules={[
                { required: true, message: "Material description is required" },
            ]}
            >
            <Input.TextArea rows={1} placeholder="Enter material description" />
            </Form.Item>
        </div>

        <div className='form-section'>
            {/* Quantity */}
            <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
            >
            <Input type="number" placeholder="Enter quantity" />
            </Form.Item>

            {/* Unit Rate */}
            <Form.Item
            label="Unit Rate"
            name="unitRate"
            rules={[{ required: true, message: "Please enter the unit rate" }]}
            >
            <Input type="number" step="0.01" placeholder="Enter unit rate" />
            </Form.Item>

            {/* Currency */}
            <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true, message: "Please select a currency" }]}
            >
            <Select placeholder="Select currency">
                <Option value="USD">USD</Option>
                <Option value="INR">INR</Option>
            </Select>
            </Form.Item>
        </div>

        <div className='form-section'>
                
            {/* Exchange Rate */}
            <Form.Item label="Exchange Rate" name="exchangeRate">
            <Input type="number" step="0.01" placeholder="Enter exchange rate" />
            </Form.Item>

            {/* GST */}
            <Form.Item
            label="GST (%)"
            name="gst"
            rules={[{ required: true, message: "Please specify GST percentage" }]}
            >
            <Input type="number" step="0.01" placeholder="Enter GST percentage" />
            </Form.Item>

            {/* Duties */}
            <Form.Item
            label="Duties (%)"
            name="duties"
            rules={[{ required: true, message: "Please specify duties" }]}
            >
            <Input type="number" step="0.01" placeholder="Enter duties percentage" />
            </Form.Item>
        </div>

        <div className='form-section'>
            {/* Freight Charges */}
            <Form.Item label="Freight Charges" name="freightCharges">
            <Input type="number" step="0.01" placeholder="Enter freight charges" />
            </Form.Item>

            {/* Delivery Period */}
            <Form.Item
            label="Delivery Period"
            name="deliveryPeriod"
            rules={[
                { required: true, message: "Please specify the delivery period" },
            ]}
            >
            <DatePicker placeholder="Select delivery date" />
            </Form.Item>

            {/* Warranty */}
            <Form.Item label="Warranty" name="warranty">
            <Input placeholder="Enter warranty terms" />
            </Form.Item>

            {/* Consignee Address */}
            <Form.Item
            label="Consignee Address"
            name="consigneeAddress"
            rules={[{ required: true, message: "Please enter consignee address" }]}
            >
            <Input placeholder="Enter consignee address" />
            </Form.Item>
        </div>

        {/* Additional Terms & Conditions */}
        <Form.Item label="Additional Terms & Conditions" name="termsConditions">
          <Input.TextArea placeholder="Enter additional terms and conditions" />
        </Form.Item>

        {/* Submit Button */}
        <div className='form-section'>
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
  )
}

export default Form7