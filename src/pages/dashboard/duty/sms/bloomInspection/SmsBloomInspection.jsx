import React, { useEffect, useState } from "react";
import { Form, message } from "antd";
import SubHeader from "../../../../../components/DKG_SubHeader";
import GeneralInfo from "../../../../../components/DKG_GeneralInfo";
import FormContainer from "../../../../../components/DKG_FormContainer";
import TextAreaComponent from "../../../../../components/DKG_TextAreaComponent";
import FormInputItem from "../../../../../components/DKG_FormInputItem";
import FormDropdownItem from "../../../../../components/DKG_FormDropdownItem";
import Btn from "../../../../../components/DKG_Btn";
import FormSearchItem from "../../../../../components/DKG_FormSearchItem";
import { apiCall, handleChange } from "../../../../../utils/CommonFunctions";
import { useSelector } from "react-redux";

const bloomIdentificationList = [
  {
    key: "Satisfactory",
    value: "Satisfactory",
  },
  {
    key: "Unsatisfactory",
    value: "Unsatisfactory",
  },
];

const SmsBloomInspection = () => {
  const smsGeneralInfo = useSelector((state) => state.smsDuty);
  const [form] = Form.useForm();
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    castNo: null,
    noOfPrimeBlooms: null,
    noOfCoBlooms: null,
    bloomIdentification: null,
    lengthOfBlooms: null,
    surfaceConditionOfBlooms: "",
    noOfPrimeBloomsRejected: null,
    noOfCoBloomsRejected: null,
    remark: null,
  });

  const handleFormSubmit = async () => {
    try {
      // Call the API
      await apiCall("POST", "/sms/saveBloomInsp", token, { 
        ...formData, 
        dutyId: smsGeneralInfo.dutyId,
      });
  
      // Show success message only when the API call is successful
      message.success("Bloom Inspection successful.");
    } catch (error) {
      // Error is already handled by `apiCall` with `message.error`
      console.error("Form submission error:", error);
    }
  };

  const handleCastNoSearch = async (castNo) => {
    try {
      const { data } = await apiCall(
        "GET",
        `/sms/getBloomDtls?castNo=${castNo}`,
        token
      );
      setFormData({
        castNo: data.responseData?.castNo,
        noOfPrimeBlooms: data.responseData?.noOfPrimeBlooms,
        noOfCoBlooms: data.responseData?.noOfCoBlooms,
      });
    } catch (error) {}
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [form, formData])

  return (
    <FormContainer>
      <SubHeader link={"/sms/dutyEnd"} title="SMS - Bloom Inspection" />
      <GeneralInfo data={smsGeneralInfo} />
      <section>
        <Form
          form={form}
          initialValues={formData}
          className=" md:grid md:grid-cols-2 gap-x-8 bloom-inspection-form"
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <FormSearchItem
            label="Cast Number"
            name="heatNo"
            onSearch={handleCastNoSearch}
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
          />
          <FormInputItem
            label="Prime Blooms Count"
            name="noOfPrimeBlooms"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            required
          />
          <FormInputItem
            label="CO Blooms Count"
            name="noOfCoBlooms"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            required
          />
          <FormDropdownItem
            label="Bloom Identification"
            name="bloomIdentification"
            formField="bloomIdentification"
            dropdownArray={bloomIdentificationList}
            visibleField={"value"}
            valueField={"key"}
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            required
          />
          <FormInputItem
            label="Bloom Length"
            name="lengthOfBlooms"
            onChange={(fieldName, value) =>
                handleChange(fieldName, value, setFormData)}
            required
          />
          <FormInputItem
            label="Surface Condition"
            name="surfaceConditionOfBlooms"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            required
          />
          <FormInputItem
            label="Prime Blooms Rejected Count"
            name="noOfPrimeBloomsRejected"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            required
          />
          <FormInputItem
            label="CO Blooms Rejected Count"
            name="noOfCoBloomsRejected"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            required
          />
          <TextAreaComponent
            label="Remarks"
            name="remark"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            className="col-span-2"
            required
          />
            <Btn htmlType="submit" className="flex mx-auto col-span-2">Submit</Btn>
        </Form>
      </section>
      <section></section>
    </FormContainer>
  );
};

export default SmsBloomInspection;
