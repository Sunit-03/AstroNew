// import React from 'react'
// import {LineChartOutlined, EyeOutlined, ExperimentOutlined, ToolOutlined, DatabaseOutlined, CompassOutlined, DeploymentUnitOutlined, RadarChartOutlined, AuditOutlined, MessageOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import Tab from '../../../components/DKG_Tab';

// const dutyItemTabs = [
//   {
//     id: 1,
//     title: 'SMS Record',
//     icon: <MessageOutlined />,
//     link: '/record/sms'
//   },
//   {
//     id: 2,
//     title: 'Rolling Stage Record',
//     icon: <AuditOutlined />,
//     // link: '/stage/startDuty'
//   },
//   {
//     id: 3,
//     title: 'NDT Record',
//     icon: <RadarChartOutlined />,
//     // link: '/ndt/startDuty'
//   },
//   {
//     id: 4,
//     title: 'Testing Record',
//     icon: <ExperimentOutlined />,
//     // link:  '/testing/home'
//   },
//   {
//     id: 5,
//     title: 'Visual Insp. Record',
//     icon: <EyeOutlined />,
//     // link: '/visual/startDuty'
//   },
//   {
//     id: 6,
//     title: 'Welding Insp. Record',
//     icon: <DeploymentUnitOutlined />,
//     // link: '/welding/startDuty'
//   },
//   {
//     id: 7,
//     title: 'Short Rail Insp. Record',
//     icon: <CompassOutlined />,
//     // link: '/srInspection'
//   },
//   {
//     id: 8,
//     title: 'QCT Record',
//     icon: <DatabaseOutlined />,
//     // link: '/qct/sampleList'
//   },
//   {
//     id: 9,
//     title: 'Calibration Record',
//     icon: <ToolOutlined />,
//     // link: '/calibration/list'
//   },
//   {
//     id: 10,
//     title: 'Info Record',
//     icon: <LineChartOutlined />
//   },
// ]


// const Records = () => {
//   const navigate = useNavigate()
//   const renderRecordItemTabs = () =>
//     dutyItemTabs.map((item) => {
//       return (
//         <div onClick={() => navigate(item.link)} className="flex justify-between items-center  border border-darkBlueHover w-full p-2 px-4 gap-4 rounded-lg shadow-lg bg-gray-200">
//           <span className="records-tab-icon">{item.icon}</span>
//           <span className="font-medium">
//             {item.title}
//           </span>
//         </div>
//       );
//     });
//   return (
//     <section>
//     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//       {renderRecordItemTabs()}
//     </div>
//   </section>
//   )
// }

// export default Records

import { Button, Checkbox, Form, Input } from "antd";
import React from "react";

const Form3 = () => {
  const [form] = Form.useForm();
  return (
    <div className="form-container">
      <h2>Indent Modification Form</h2>
      <Form form={form} layout="vertical">
        <div className="form-section">
          <Form.Item
            label="Indent ID"
            name="indentId"
            rules={[{ required: true, message: "Indent ID is required" }]}
          >
            <Input placeholder="Enter Indent ID" />
          </Form.Item>
          <Form.Item
            label="Changes Made"
            name="changesMade"
            rules={[{ required: true, message: "Changes Made is required" }]}
          >
            <Input.TextArea rows={1} placeholder="Enter Changes Made" />
          </Form.Item>
          <Form.Item label="Resubmission Comments" name="resubmissionComments">
            <Input.TextArea
              rows={1}
              placeholder="Enter Resubmission Comments"
            />
          </Form.Item>
        </div>
        <div className="form-section">
          <Form.Item
            name="approversNotified"
            label="Approvers Notified"
            valuePropName="checked"
            rules={[
              { required: true, message: "Approvers should be notified" },
            ]}
          >
            <Checkbox>Approvers Notified?</Checkbox>
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

export default Form3;
