// import React, { useEffect, useRef, useState } from "react";
// import dayjs from "dayjs";
// import { DeleteOutlined } from "@ant-design/icons";
// import Heading from "../../../components/DKG_Heading";
// import FormBody from "../../../components/DKG_FormBody";
// import OrgDtls from "../../../components/DKG_OrgDetail";
// import FormDropdownItem from "../../../components/DKG_FormDropdownItem";
// import FormSearchItem from "../../../components/DKG_FormSearchItem copy";
// import { Button, message } from "antd";
// import FormInputItem from "../../../components/DKG_FormInputItem";
// import InputDatePickerComb from "../../../components/DKG_InputDatepickerComb";
// import ItemSearch from "../../../components/DKG_ItemSearch";
// import dataJson from "../../../utils/demo.json";
// import { itemHandleChange, removeItem } from "../../../utils/CommonFunctions";
// import TermsConditionContainer from "../../../components/DKG_TermsConditionContainer";
// import DesignationContainer from "../../../components/DKG_DesignationContainer";
// import ButtonContainer from "../../../components/DKG_ButtonContainer";
// import useHandlePrint from "../../../components/useHandlePrint";

// const {data} = dataJson

// const currentDate = dayjs();
// const dateFormat = "DD/MM/YYYY";

// const ddOpt = [
//   {
//     key: "IRP",
//     value: "Issue/Return",
//   },
//   {
//     key: "PO",
//     value: "Purchase Order",
//   },
//   {
//     key: "IOP",
//     value: "Inter Org Transfer",
//   },
// ];

// const Home = () => {
//   const containerRef = useRef();
//   const formRef = useRef();
//   const handlePrint = useHandlePrint(containerRef);

//   const [formData, setFormData] = useState({
//     genDate: currentDate.format(dateFormat),
//     genName: "Demo User 1",
//     issueDate: currentDate.format(dateFormat),
//     issueName: "",
//     approvedDate: currentDate.format(dateFormat),
//     approvedName: "",
//     processId: "12346",
//     type: "IRP",
//     gatePassDate: currentDate.format(dateFormat),
//     processType: "IRP",
//     processTypeDesc: "Issue/Return ",
//     gatePassNo: "string",
//     ceRegionalCenterCd: "",
//     ceRegionalCenterName: "",
//     ceAddress: "",
//     ceZipcode: "",
//     crRegionalCenterCd: "001",
//     crRegionalCenterName: "Demo Organization",
//     crAddress: "Demo Address",
//     crPincode: "123456",
//     consumerName: "",
//     contactNo: "",
//     noaNo: "",
//     noaDate: currentDate.format(dateFormat),
//     dateOfDelivery: currentDate.format(dateFormat),
//     modeOfDelivery: "",
//     challanNo: "",
//     supplierCode: "",
//     supplierName: "",
//     noteType: "Accepted Items",
//     rejectionNoteNo: "",
//     items: [
//       // {
//       //   srNo: 0,
//       //   itemCode: "",
//       //   itemDesc: "",
//       //   uom: "",
//       //   quantity: 0,
//       //   noOfDays: 0,
//       //   remarks: "",
//       //   conditionOfGoods: "",
//       //   budgetHeadProcurement: "",
//       //   locatorId: "",
//       // },
//     ],
//     userId: "Demo user",
//     termsCondition: "",
//     note: "",
//   });

//   console.log("FormData: ", formData.items)

//   const handleChange = (fieldName, value) => {
//     const updatedFormData = { ...formData, [fieldName]: value };

//     if (fieldName === "processType") {
//       updatedFormData.processTypeDesc =
//         value === "IRP"
//           ? "Issue/Return"
//           : value === "PO"
//           ? "Purchase Order"
//           : "Inter Org Transfer";
//     }

//     setFormData(updatedFormData);
//   };

//   const handleSearch = (value) => {
//     message.success("Search triggered");
//   };

//   const onFinish = () =>{
//     message.success("Form submission triggered.")
//   }

//   useEffect(() => {
//     if (formRef.current) formRef.current.updateField(formData);
//   }, [formData]);

//   return (
//     <div className="a4-container" ref={containerRef}>
//       <Heading
//         txnNo={formData.processId}
//         date={formData.genDate}
//         title="Custom add title"
//       />
//       <FormBody ref={formRef} formData={formData}>
//         <section className="org-dtl-container">
//           <OrgDtls
//             heading="Consignor Details"
//             cdName="crRegionalCenterCd"
//             orgName="crRegionalCenterName"
//             pinName="crPincode"
//             adrName="crAddress"
//           />
//           <OrgDtls
//             heading="Consignee Details"
//             cdName="ceRegionalCenterCd"
//             orgName="ceRegionalCenterName"
//             pinName="cePincode"
//             adrName="ceAddress"
//           />
//           <div className="other-container">
//             <h3 className="font-bold text-[#003566]">Other Details</h3>
//             <FormDropdownItem
//               name="processTypeDesc"
//               formField="processType"
//               label="Process Type"
//               dropdownArray={ddOpt}
//               visibleField="value"
//               valueField="key"
//               onChange={handleChange}
//             />

//             {formData.processType === "IRP" && (
//               <FormSearchItem
//                 label="Outward Gate Pass No."
//                 name="gatePassNo"
//                 onSearch={(value) => handleSearch(value)}
//                 onChange={handleChange}
//                 // readOnly={isTxnData}
//               />
//             )}

//             {formData.processType === "PO" && (
//               <>
//                 <FormInputItem
//                   label="Challan / Invoice No."
//                   name="challanNo"
//                   onChange={handleChange}
//                   // readOnly={isTxnData}
//                 />

//                 <InputDatePickerComb
//                   inputLabel="NOA No."
//                   inputName="noaNo"
//                   onChange={handleChange}
//                   dateLabel="NOA Date"
//                   dateName="noaDate"
//                   dateValue={formData.noaDate}
//                   // readOnly={isTxnData}
//                 />
//                 <InputDatePickerComb
//                   inputLabel="Del. Mode"
//                   inputName="modeOfDelivery"
//                   onChange={handleChange}
//                   dateLabel="Del. Date"
//                   dateName="dateOfDelivery"
//                   dateValue={formData.dateOfDelivery}
//                   // readOnly={isTxnData}
//                 />
//               </>
//             )}
//           </div>
//         </section>
        
//         <section className="detail-container">
//             {
//               formData.processType ==="PO" && (
//                 <ItemSearch itemArray={data} setFormData={setFormData} />
//               )
//             }

// {formData?.items?.map((item, key) => {
//             return (
//               <div className="item-container">
//                 <div className="item-detail-container">
//                   <FormInputItem
//                   className="no-margin"
//                     label="S. No."
//                     name={
//                       item.srNo ? ["items", key, "srNo"] : ["items", key, "sNo"]
//                     }
//                     readOnly={true}
//                   />
//                   <FormInputItem
//                   className="no-margin"
//                     label="Item Code"
//                     name={["items", key, "itemCode"]}
//                     readOnly={true}
//                   />
//                   <FormInputItem
//                     label="Item Description"
//                     className="item-desc-cell no-margin"
//                     name={["items", key, "itemDesc"]}
//                     readOnly={true}
//                   />
//                   <FormInputItem
//                   className="no-margin"
//                     label="Unit of Measurement"
//                     name={["items", key, "uomDesc"]}
//                     readOnly={true}
//                   />

//                   {formData.type !== "IOP" && (
//                     <FormInputItem
//                     className="no-margin"
//                       label="Locator Description"
//                       name={["items", key, "locatorDesc"]}
//                       readOnly={true}
//                     />
//                   )}

//                   <FormInputItem
//                   className="no-margin"
//                     label="Quantity"
//                     name={["items", key, "quantity"]}
//                     onChange={(fieldName, value) =>
//                       itemHandleChange(fieldName, value, key, setFormData)
//                     }
//                     // readOnly={isTxnData}
//                   />

//                   {(formData.type === "IRP" || formData.type === "IOP") && (
//                     <FormInputItem
//                     className="no-margin"
//                       label="Req. For Days"
//                       name={
//                         item.noOfDays
//                           ? ["items", key, "noOfDays"]
//                           : ["items", key, "requiredDays"]
//                       }
//                       onChange={(fieldName, value) =>
//                         itemHandleChange(fieldName, value, key, setFormData)
//                       }
//                       readOnly
//                     />
//                   )}

//                   <FormInputItem
//                   className="no-margin"
//                     name={["items", key, "remarks"]}
//                     label="Remarks"
//                     onChange={(fieldName, value) =>
//                       itemHandleChange(fieldName, value, key, setFormData)
//                     }
//                     // readOnly={isTxnData}
//                   />
//                 </div>
//                 <Button
//                   icon={<DeleteOutlined />}
//                   className="delete-btn exclude-print"
//                   onClick={() => removeItem(key, setFormData)}
//                   // style={{ display: isTxnData ? "none" : "block" }}
//                 />
//               </div>
//             );
//           })}
//         </section>

//         <TermsConditionContainer
//           termsConditionVisible
//           noteVisible
//           handleChange={handleChange}
//           // readOnly={isTxnData}
//         />
//         <DesignationContainer
//           genByVisible
//           issueVisible
//           genDateValue={formData.genDate}
//           issueDateValue={formData.issueDate}
//           // readOnly={isTxnData}
//           handleChange={handleChange}
//         />
//         <ButtonContainer
//           handlePrint={handlePrint}
//           onFinish={onFinish}
//           // submitBtnEnabled={submitBtnEnabled}
//           // printBtnEnabled={printBtnEnabled}
//           draftDataName="igpDraft"
//           formData={formData}
//           // draftBtnEnabled={draftBtnEnabled}
//           // disabled={isTxnData}
//         />

//       </FormBody>
//     </div>
//   );
// };

// export default Home;

import React from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  DatePicker,
  Checkbox,
} from "antd";
import { Option } from "antd/es/mentions";

const Form1 = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log("Form Values:", values);
  };

  return (
    <div className="form-container">
      <h2>Indent Creation Form</h2>
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
            <Input value='Auto-populated' disabled />
          </Form.Item>
          <Form.Item
            label="Contact Details"
            name="contactDetails"
            rules={[
              { required: true, message: "Contact details are required" },
            ]}
          >
            <Input placeholder="Enter contact number or email" />
          </Form.Item>

          <Form.Item
            label="Material/Job code"
            name="materialJobCode"
            rules={[
              { required: true, message: "Material/Job code is required" },
            ]}
          >
            <Input disabled placeholder="Pre-filled code" />
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            name="consigneeLocation"
            label="Consignee Location"
            rules={[
              { required: true, message: "Consignee Location is required" },
            ]}
          >
            <Select placeholder="Select location">
              <Option value="location1">Location 1</Option>
              <Option value="location2">Location 2</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="budgetCode"
            label="Budget Code"
            rules={[{ required: true, message: "Budget Code is required" }]}
          >
            <Select placeholder="Select budget code">
              <Option value="budget1">Budget 1</Option>
              <Option value="budget2">Budget 2</Option>
            </Select>
          </Form.Item>

          <Form.Item name="projectName" label="Project Name">
            <Select placeholder="Select project">
              <Option value="project1">Project 1</Option>
              <Option value="project2">Project 2</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Quantity is required" }]}
          >
            <Input type="number" placeholder="Enter Quantity" />
          </Form.Item>
          <Form.Item
            name="preBidMeetingDetails"
            label="Pre-bid Meeting Details"
          >
            <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item name="technicalDocuments" label="Technical Documents">
            <Upload>
              <Button>Upload PDF/Link</Button>
            </Upload>
          </Form.Item>
        </div>

        <div className="form-section">
          <Form.Item name="preBidMeetingRequired" valuePropName="checked">
            <Checkbox>Pre-bid Meeting Required</Checkbox>
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

export default Form1;

// export default Home