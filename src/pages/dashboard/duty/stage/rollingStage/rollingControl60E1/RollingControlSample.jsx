import React, { useCallback, useEffect, useState } from "react";
import FormContainer from "../../../../../../components/DKG_FormContainer";
import SubHeader from "../../../../../../components/DKG_SubHeader";
import GeneralInfo from "../../../../../../components/DKG_GeneralInfo";
import data from "../../../../../../utils/frontSharedData/rollingStage/Stage.json";
import { Divider, Form, message, TimePicker } from "antd";
import { useLocation } from "react-router-dom";
import FormInputItem from "../../../../../../components/DKG_FormInputItem";
import FormDropdownItem from "../../../../../../components/DKG_FormDropdownItem";
import Btn from "../../../../../../components/DKG_Btn";
import { useSelector } from "react-redux";
import { apiCall } from "../../../../../../utils/CommonFunctions";
import dayjs from "dayjs";

const {
  sampleLocationList,
  headList,
  asyList,
  footToeList,
  crownProfileList,
  fishingHeightList,
  footFlatnessList,
} = data;

const RollingControlSample = () => {
  const location = useLocation();
  const {state} = location;

  const heatNo = state?.heatNo || null
  const sampleNo = state?.sampleNo || null


  const [form] = Form.useForm();

  const { token } = useSelector((state) => state.auth);
  const rollingGeneralInfo = useSelector((state) => state.rollingDuty);
  const { railSection } = rollingGeneralInfo;

  const [formData, setFormData] = useState({
    sampleNo: null,
    heatNo: null,
    timing: null,
    sampleLocation: null,
    height: null,
    flange: null,
    weight: null,
    web: null,
    head: null,
    asy: null,
    footToe: null,
    crownProfile: null,
    fishingHeight: null,
    footFlatness: null,
    remark: null,
  });

  const handleChange = (fieldName, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handleFormSubmit = async () => {
    try {
      await apiCall("POST", "/rolling/saveControlHeat", token, {
        ...formData,
        dutyId: rollingGeneralInfo.dutyId,
      });
      message.success("Data saved successfully");
    } catch (error) {}
  };

  const handleDtlSearch = useCallback(async (heatNo, sampleNo) => {
    try {
      const { data } = await apiCall(
        "POST",
        "/rolling/getControlSampleDtls",
        token,
        { heatNo, sampleNo }
      );

      const { responseData } = data;

      setFormData({
        sampleNo: responseData?.sampleNo,
        heatNo: responseData?.heatNo,
        timing: responseData?.timing,
        sampleLocation: responseData?.sampleLocation,
        height: responseData?.height,
        flange: responseData?.flange,
        weight: responseData?.weight,
        web: responseData?.web,
        head: responseData?.head,
        asy: responseData?.asy,
        footToe: responseData?.footToe,
        crownProfile: responseData?.crownProfile,
        fishingHeight: responseData?.fishingHeight,
        footFlatness: responseData?.footFlatness,
        remark: responseData?.remark,
      });
    } catch (error) {}
  }, [token]);

  const handleTimingChange = (time, timeString) => {
    if (time) {
      // Directly use timeString because it's already in the correct format
      setFormData((prev) => ({ ...prev, timing: timeString }));
    } else {
      // Handle cleared picker
      setFormData((prev) => ({ ...prev, timing: null }));
    }
  };

  const timingDayJs = formData.timing
    ? dayjs(formData.timing, "HH:mm:ss")
    : null;

  useEffect(() => {
    form.setFieldsValue({ ...formData, timingDayJs });
  }, [formData, form, timingDayJs]);

  useEffect(() => {
    if(heatNo && sampleNo){
      handleDtlSearch(heatNo, sampleNo);
    }
  }, [heatNo, sampleNo, handleDtlSearch])

  return (
    <FormContainer>
      <SubHeader
        title={`Rolling Control Sample Dimensions - ${railSection}`}
        link="/stage/rollingControl"
      />
      <GeneralInfo data={rollingGeneralInfo} />

      <Form
        initialValues={{ ...formData, timingDayJs }}
        onFinish={handleFormSubmit}
        form={form}
        layout="vertical"
      >
        <div className="grid grid-cols-2 gap-x-2">
          <FormInputItem
            label="Sample No."
            name="sampleNo"
            onChange={handleChange}
          />
          <FormInputItem
            label="Heat No."
            name="heatNo"
            value={formData.heatNumber}
            onChange={handleChange}
            required
          />

          <Form.Item
            label="Select Time"
            name="timingDayJs"
            rules={[{ required: true, message: "Please select a time!" }]}
          >
            <TimePicker
              onChange={handleTimingChange}
              format="HH:mm:ss"
              placeholder="Select Time"
              className="w-full"
            />
          </Form.Item>
          <FormDropdownItem
            label="Sample Location"
            name="sampleLocation"
            formField="sampleLocation"
            dropdownArray={sampleLocationList}
            visibleField="value"
            valueField="key"
            onChange={handleChange}
            required
          />
        </div>

        <Divider className="mt-0 mb-4" />

        <div className="grid grid-cols-2 gap-x-2">
          <FormInputItem
            label="Height"
            name="height"
            onChange={handleChange}
            required
          />
          <FormInputItem
            label="Flange"
            name="flange"
            onChange={handleChange}
            required
          />

          <FormInputItem label="Weight" name="weight" onChange={handleChange} />
          <FormInputItem
            label="Web (mm)"
            name="web"
            onChange={handleChange}
            required
          />
          <FormDropdownItem
            label="Head"
            name="head"
            formField="head"
            dropdownArray={headList}
            visibleField="value"
            valueField="key"
            onChange={handleChange}
            required
          />

          {railSection !== "60E1A1" && (
            <FormDropdownItem
              label="Asy"
              name="asy"
              formField="asy"
              dropdownArray={asyList}
              visibleField="value"
              valueField="key"
              onChange={handleChange}
              required
            />
          )}

          {railSection === "60E1" && (
            <FormDropdownItem
              label="Foot Toe"
              name="footToe"
              formField="footToe"
              dropdownArray={footToeList}
              visibleField="value"
              valueField="key"
              onChange={handleChange}
              required
            />
          )}

          {railSection !== "IRS52" && (
            <>
              <FormDropdownItem
                label="Fishing Height"
                name="fishingHeight"
                formField="fishingHeight"
                dropdownArray={fishingHeightList}
                visibleField="value"
                valueField="key"
                onChange={handleChange}
                required
              />
              <FormDropdownItem
                label="Crown Profile"
                name="crownProfile"
                formField="crownProfile"
                dropdownArray={crownProfileList}
                visibleField="value"
                valueField="key"
                onChange={handleChange}
                required
              />
            </>
          )}
          <FormDropdownItem
            label="Foot Flatness"
            name="footFlatness"
            formField="footFlatness"
            dropdownArray={footFlatnessList}
            visibleField="value"
            valueField="key"
            onChange={handleChange}
            required
          />
        </div>

        <Divider className="mb-4 mt-0" />

        <FormInputItem
          label="Remarks"
          name="remark"
          onChange={handleChange}
          required
        />

        <Btn htmlType="submit" className="flex justify-center mx-auto">
          Save
        </Btn>
      </Form>
    </FormContainer>
  );
};

export default RollingControlSample;
