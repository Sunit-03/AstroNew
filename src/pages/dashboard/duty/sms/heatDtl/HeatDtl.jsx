import React, { useCallback, useEffect, useMemo, useState } from "react";
import FormContainer from "../../../../../components/DKG_FormContainer";
import { Checkbox, Divider, Form, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import FormSearchItem from "../../../../../components/DKG_FormSearchItem";
import { apiCall, handleChange } from "../../../../../utils/CommonFunctions";
import FormInputItem from "../../../../../components/DKG_FormInputItem";
import FormDropdownItem from "../../../../../components/DKG_FormDropdownItem";
import Btn from "../../../../../components/DKG_Btn";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import IconBtn from "../../../../../components/DKG_IconBtn";

const wvDropDown = [
  {
    key: "Witnessed",
    value: "Witnessed",
  },
  {
    key: "Verified",
    value: "Verified",
  },
];

const ladleChemDropDown = [
  {
    key: "Send To Lab",
    value: "Send To Lab",
  },
  {
    key: "Pass",
    value: "Pass",
  },
  {
    key: "Reject",
    value: "Reject",
  },
];

const heatStageObj = {
  Converter: 1,
  Degassing: 2,
  Casting: 3,
  "Chemical Analysis": 4,
  "Bloom Cutting": 5,
};

const HeatDtl = () => {
  const { token } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const { dutyId } = useSelector((state) => state.smsDuty);
  const [completedHeatStage, setCompletedHeatStage] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);

  const navigate = useNavigate();

  const { state } = useLocation();
  const heatNo = state?.heatNo || null;

  const [formData, setFormData] = useState({
    heatNo: null,
    turnDownTemp: null,
    turnDownTempWv: null,
    degassingVacuum: null,
    degassingDuration: null,
    degassingVacuumWv: null,
    degassingDurationWv: null,
    castingTemp: null,
    casterNo: null,
    sequenceNo: null,
    hydris: null,
    isProbeDipped: false,
    isHydrogenBw80And100: false,
    nitrogen: null,
    oxygen: null,
    sentToLadle: null,
    noOfPrimeBlooms: null,
    primeBloomsLength: null,
    primeBloomsTotalLength: null,
    noOfCoBlooms: null,
    coBloomsLength: null,
    coBloomsTotalLength: null,
    noOfRejectedBlooms: null,
    rejectedBloomsLength: null,
    rejectedBloomsTotalLength: null,
    weightOfPrimeBlooms: null,
    weightOfCoBlooms: null,
    weightOfRejectedBlooms: null,
    totalCastWt: null,
    isDiverted: false,
    heatRemark: null,
  });

  const stageValidationRules = useMemo(
    () => ({
      stage1: ["turnDownTemp", "turnDownTempWv"],
      stage2: [
        "degassingVacuum",
        "degassingVacuumWv",
        "degassingDuration",
        "degassingDurationWv",
      ],
      stage3: ["castingTemp", "casterNo", "sequenceNo", "hydris"],
      stage4: ["nitrogen", "oxygen", "sentToLadle"],
      stage5: [
        "weightOfPrimeBlooms",
        "weightOfCoBlooms",
        "weightOfRejectedBlooms",
        "totalCastWt",
      ],
    }),
    []
  );

  const validateStage = useCallback(
    (stage) => {
      const fields = stageValidationRules[`stage${stage}`];
      for (let field of fields) {
        if (!formData[field]) {
          return false; // Incomplete stage
        }
      }
      return true; // Stage is complete
    },
    [formData, stageValidationRules]
  );

  const isFieldDisabled = (stage) => {
    return stage <= completedHeatStage;
  };

  const handleHeatNoSearch = useCallback(
    async (heatNo = null) => {
      try {
        const { data } = await apiCall(
          "GET",
          `/sms/getHeatDtls?heatNo=${heatNo ? heatNo : formData.heatNo}`,
          token
        );
        const { responseData } = data;

        setFormData({
          heatNo: responseData?.heatNo || null,
          turnDownTemp: responseData?.turnDownTemp || null,
          turnDownTempWv: responseData?.turnDownTempWv || null,
          degassingVacuum: responseData?.degassingVacuum || null,
          degassingDuration: responseData?.degassingDuration || null,
          degassingVacuumWv: responseData?.degassingVacuumWv || null,
          degassingDurationWv: responseData?.degassingDurationWv || null,
          castingTemp: responseData?.castingTemp || null,
          casterNo: responseData?.casterNo || null,
          sequenceNo: responseData?.sequenceNo || null,
          hydris: responseData?.hydris || null,
          isProbeDipped: responseData?.isProbeDipped || false,
          isHydrogenBw80And100: responseData?.isHydrogenBw80And100 || false,
          nitrogen: responseData?.nitrogen || null,
          oxygen: responseData?.oxygen || null,
          sentToLadle: responseData?.sentToLadle || null,
          noOfPrimeBlooms: responseData?.noOfPrimeBlooms || null,
          primeBloomsLength: responseData?.primeBloomsLength || null,
          primeBloomsTotalLength: responseData?.primeBloomsTotalLength || null,
          noOfCoBlooms: responseData?.noOfCoBlooms || null,
          coBloomsLength: responseData?.coBloomsLength || null,
          coBloomsTotalLength: responseData?.coBloomsTotalLength || null,
          noOfRejectedBlooms: responseData?.noOfRejectedBlooms || null,
          rejectedBloomsLength: responseData?.rejectedBloomsLength || null,
          rejectedBloomsTotalLength:
            responseData?.rejectedBloomsTotalLength || null,
          weightOfPrimeBlooms: responseData?.weightOfPrimeBlooms || null,
          weightOfCoBlooms: responseData?.weightOfCoBlooms || null,
          weightOfRejectedBlooms: responseData?.weightOfRejectedBlooms || null,
          totalCastWt: responseData?.totalCastWt || null,
          isDiverted: responseData?.isDiverted || false,
          heatRemark: responseData?.heatRemark || null,
        });

        const heatStageNum = heatStageObj[responseData?.heatStage];
        setCompletedHeatStage(heatStageNum);
      } catch (error) {}
    },
    [token, formData.heatNo]
  );

  const onFinish = async () => {
    const fields = stageValidationRules[`stage${currentStage}`];
    if (currentStage === 5) {
      if (
        !formData.weightOfPrimeBlooms ||
        !formData.weightOfCoBlooms ||
        !formData.weightOfRejectedBlooms ||
        !formData.totalCastWt
      ) {
        message.error(`Please fill all the fields for Stage ${currentStage}`);
        return;
      }
    } else {
      for (let field of fields) {
        if (formData[field]) {
          message.error(`Please fill all the fields for Stage ${currentStage}`);
          return;
        }
      }
    }

    try {
      await apiCall("POST", "/sms/updateHeatDtls", token, {
        ...formData,
        dutyId,
      });
      message.success("SMS heat details updated successfully.");
    } catch (error) {}
  };

  const [primeBloomsFieldState, setPrimeBloomsFieldState] = useState({
    noOfPrimeBlooms: false,
    primeBloomsLength: false,
    primeBloomsTotalLength: false,
  });

  const [coBloomsFieldState, setCoBloomsFieldState] = useState({
    noOfCoBlooms: false,
    coBloomsLength: false,
    coBloomsTotalLength: false,
  });

  const [rejectedBloomsFieldState, setRejectedBloomsFieldState] = useState({
    noOfRejectedBlooms: false,
    rejectedBloomsLength: false,
    rejectedBloomsTotalLength: false,
  });

  const handlePrimeBloomDtlChange = (fieldName, value) => {
    let primeBloomWt = 0;

    const { noOfPrimeBlooms, primeBloomsLength } = formData;

    if (fieldName === "noOfPrimeBlooms" || fieldName === "primeBloomsLength") {
      const isOtherFieldEmpty =
        (fieldName === "noOfPrimeBlooms" && !primeBloomsLength) ||
        (fieldName === "primeBloomsLength" && !noOfPrimeBlooms);

      if (!value && isOtherFieldEmpty) {
        setPrimeBloomsFieldState({
          noOfPrimeBlooms: false,
          primeBloomsLength: false,
          primeBloomsTotalLength: false,
        });
      } else {
        setPrimeBloomsFieldState({
          noOfPrimeBlooms: false,
          primeBloomsLength: false,
          primeBloomsTotalLength: true,
        });
      }
      primeBloomWt =
        (fieldName === "noOfPrimeBlooms" ? value : noOfPrimeBlooms) *
        (fieldName === "primeBloomsLength" ? value : primeBloomsLength) *
        75;
    } else if (fieldName === "primeBloomsTotalLength") {
      if (!value) {
        setPrimeBloomsFieldState({
          noOfPrimeBlooms: false,
          primeBloomsLength: false,
          primeBloomsTotalLength: false,
        });
      } else {
        setPrimeBloomsFieldState({
          noOfPrimeBlooms: true,
          primeBloomsLength: true,
          primeBloomsTotalLength: false,
        });
      }
      primeBloomWt = value * 75;
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
      weightOfPrimeBlooms: primeBloomWt,
      totalCastWt:
        primeBloomWt + prev.weightOfCoBlooms + prev.weightOfRejectedBlooms,
    }));
  };

  const handleCoBloomDtlChange = (fieldName, value) => {
    let coBloomWt = 0;

    const { noOfCoBlooms, coBloomsLength } = formData;

    if (fieldName === "noOfCoBlooms" || fieldName === "coBloomsLength") {
      const isOtherFieldEmpty =
        (fieldName === "noOfCoBlooms" && !coBloomsLength) ||
        (fieldName === "coBloomsLength" && !noOfCoBlooms);

      if (!value && isOtherFieldEmpty) {
        setCoBloomsFieldState({
          noOfCoBlooms: false,
          coBloomsLength: false,
          coBloomsTotalLength: false,
        });
      } else {
        setCoBloomsFieldState({
          noOfCoBlooms: false,
          coBloomsLength: false,
          coBloomsTotalLength: true,
        });
      }
      coBloomWt =
        (fieldName === "noOfCoBlooms" ? value : noOfCoBlooms) *
        (fieldName === "coBloomsLength" ? value : coBloomsLength) *
        75;
    } else if (fieldName === "coBloomsTotalLength") {
      if (!value) {
        setCoBloomsFieldState({
          noOfCoBlooms: false,
          coBloomsLength: false,
          coBloomsTotalLength: false,
        });
      } else {
        setCoBloomsFieldState({
          noOfCoBlooms: true,
          coBloomsLength: true,
          coBloomsTotalLength: false,
        });
      }
      coBloomWt = value * 75;
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
      weightOfCoBlooms: coBloomWt,
      totalCastWt:
        coBloomWt + prev.weightOfPrimeBlooms + prev.weightOfRejectedBlooms,
    }));
  };

  const handleRejectedBloomDtlChange = (fieldName, value) => {
    let rejectedBloomWt = 0;

    const { noOfRejectedBlooms, rejectedBloomsLength } = formData;

    if (
      fieldName === "noOfRejectedBlooms" ||
      fieldName === "rejectedBloomsLength"
    ) {
      const isOtherFieldEmpty =
        (fieldName === "noOfRejectedBlooms" && !rejectedBloomsLength) ||
        (fieldName === "rejectedBloomsLength" && !noOfRejectedBlooms);

      if (!value && isOtherFieldEmpty) {
        setRejectedBloomsFieldState({
          noOfRejectedBlooms: false,
          rejectedBloomsLength: false,
          rejectedBloomsTotalLength: false,
        });
      } else {
        setRejectedBloomsFieldState({
          noOfRejectedBlooms: false,
          rejectedBloomsLength: false,
          rejectedBloomsTotalLength: true,
        });
      }
      rejectedBloomWt =
        (fieldName === "noOfRejectedBlooms" ? value : noOfRejectedBlooms) *
        (fieldName === "rejectedBloomsLength" ? value : rejectedBloomsLength) *
        75;
    } else if (fieldName === "rejectedBloomsTotalLength") {
      if (!value) {
        setRejectedBloomsFieldState({
          noOfRejectedBlooms: false,
          rejectedBloomsLength: false,
          rejectedBloomsTotalLength: false,
        });
      } else {
        setRejectedBloomsFieldState({
          noOfRejectedBlooms: true,
          rejectedBloomsLength: true,
          rejectedBloomsTotalLength: false,
        });
      }
      rejectedBloomWt = value * 75;
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
      weightOfRejectedBlooms: rejectedBloomWt,
      totalCastWt:
        rejectedBloomWt + prev.weightOfCoBlooms + prev.weightOfPrimeBlooms,
    }));
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  useEffect(() => {
    if (validateStage(currentStage) && currentStage < 5) {
      setCurrentStage(currentStage + 1);
    }
  }, [currentStage, formData, validateStage]);

  useEffect(() => {
    if (heatNo !== null) {
      setFormData((prev) => ({ ...prev, heatNo: heatNo }));
      handleHeatNoSearch(heatNo);
    }
  }, [handleHeatNoSearch, heatNo]);

  return (
    <FormContainer>
      <div className="relative">
        <IconBtn
          icon={ArrowLeftOutlined}
          onClick={() => navigate("/sms/heatSummary")}
          className="absolute left-0 shadow-none bg-inherit"
        />
        <h1 className="font-semibold !text-xl text-center">Heat Detail</h1>
      </div>
      <Form
        layout="vertical"
        initialValues={formData}
        form={form}
        onFinish={onFinish}
        // onValuesChange={handleBloomDtlChange}
      >
        <FormSearchItem
          label="Enter Heat Number"
          name="heatNo"
          onSearch={handleHeatNoSearch}
          onChange={(fieldName, value) =>
            handleChange(fieldName, value, setFormData)
          }
        />

        <Divider />

        <h3 className="font-semibold">Stage 1: Converter</h3>

        <div className="grid grid-cols-2 gap-8">
          <FormInputItem
            label="Turn Down Temperature (&deg;C)"
            name="turnDownTemp"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            // disabled={currentStage !== 1}
            disabled={isFieldDisabled(1)}
          />
          <FormDropdownItem
            label="Witnessed / Verified"
            name="turnDownTempWv"
            formField="turnDownTempWv"
            dropdownArray={wvDropDown}
            visibleField="value"
            valueField="key"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            // disabled={currentStage !== 1}
            // disabled={isFieldDisabled(1)}
          />
        </div>

        <Divider />
        <h3 className="font-semibold">Stage 2: Degassing</h3>
        <div className="grid grid-cols-2 gap-x-4">
          <FormInputItem
            label="Degassing Vacuum(m bar)"
            name="degassingVacuum"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            disabled={isFieldDisabled(2)}
          />
          <FormDropdownItem
            label="Witnessed / Verified"
            name="degassingVacuumWv"
            formField="degassingVacuumWv"
            dropdownArray={wvDropDown}
            visibleField="value"
            valueField="key"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
          />
          <FormInputItem
            label="Degassing Duration(min)"
            name="degassingDuration"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            disabled={isFieldDisabled(2)}
          />
          <FormDropdownItem
            label="Witnessed / Verified"
            name="degassingDurationWv"
            formField="degassingDurationWv"
            dropdownArray={wvDropDown}
            visibleField="value"
            valueField="key"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
          />
        </div>

        <Divider />

        <h3 className="font-semibold">Stage 3: Casting</h3>
        <div className="grid grid-cols-2 gap-x-4">
          <FormInputItem
            label="Casting Temperature (&deg;C)"
            name="castingTemp"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            disabled={isFieldDisabled(3)}
          />
          <FormInputItem
            label="Caster Number "
            name="casterNo"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            disabled={isFieldDisabled(3)}
          />
          <FormInputItem
            label="Sequence Number "
            name="sequenceNo"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            disabled={isFieldDisabled(3)}
          />
          <FormInputItem
            label="Hydris"
            name="hydris"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            disabled={isFieldDisabled(4)}
          />
        </div>

        <Divider />

        <Checkbox
          checked={formData.isProbeDipped}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              isProbeDipped: e.target.checked,
            }))
          }
        >
          Is probe dipped below 300mm from slag - metal surface
        </Checkbox>
        <Checkbox
          checked={formData.isHydrogenBw80And100}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              isHydrogenBw80And100: e.target.checked,
            }))
          }
        >
          Is measurement of hydrogen between 80-100m of Casting
        </Checkbox>

        <Divider />
        <h3 className="font-semibold">Stage 4: Chemical Analysis</h3>
        <div className="grid grid-cols-2 gap-x-4">
          <FormInputItem
            label="Nitrogen (ppm)"
            name="nitrogen"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            disabled={isFieldDisabled(4)}
          />
          <FormInputItem
            label="Oxygen (ppm)"
            name="oxygen"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            disabled={isFieldDisabled(4)}
          />

          <FormDropdownItem
            label="Ladle Chemistry"
            name="sentToLadle"
            formField="sentToLadle"
            dropdownArray={ladleChemDropDown}
            visibleField="value"
            valueField="key"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            disabled={isFieldDisabled(4)}
          />
        </div>

        <Divider />

        <h3 className="font-semibold">Stage 5: Bloom Details</h3>
        <div className="border grid grid-cols-5 divide-x divide-y divide-gray-300">
          <div></div>
          <h3 className="p-2">Number</h3>
          <h3 className="p-2">Length</h3>
          <h3 className="p-2">Tot. Len.</h3>
          <h3 className="p-2">Weight</h3>

          <h3 className="text-center p-2">Prime</h3>
          <FormInputItem
            className="no-border"
            name="noOfPrimeBlooms"
            onChange={handlePrimeBloomDtlChange}
            disabled={
              isFieldDisabled(5) || primeBloomsFieldState.noOfPrimeBlooms
            }
          />
          <FormInputItem
            className="no-border"
            name="primeBloomsLength"
            onChange={handlePrimeBloomDtlChange}
            disabled={
              isFieldDisabled(5) || primeBloomsFieldState.primeBloomsLength
            }
          />
          <FormInputItem
            className="no-border"
            name="primeBloomsTotalLength"
            onChange={handlePrimeBloomDtlChange}
            disabled={
              isFieldDisabled(5) || primeBloomsFieldState.primeBloomsTotalLength
            }
          />
          <FormInputItem
            className="no-border"
            name="weightOfPrimeBlooms"
            disabled
          />

          <h3 className="text-center p-2">CO</h3>
          <FormInputItem
            className="no-border"
            name="noOfCoBlooms"
            onChange={handleCoBloomDtlChange}
            disabled={isFieldDisabled(5) || coBloomsFieldState.noOfCoBlooms}
          />
          <FormInputItem
            className="no-border"
            name="coBloomsLength"
            onChange={handleCoBloomDtlChange}
            disabled={isFieldDisabled(5) || coBloomsFieldState.coBloomsLength}
          />
          <FormInputItem
            className="no-border"
            name="coBloomsTotalLength"
            onChange={handleCoBloomDtlChange}
            disabled={
              isFieldDisabled(5) || coBloomsFieldState.coBloomsTotalLength
            }
          />
          <FormInputItem
            className="no-border"
            name="weightOfCoBlooms"
            disabled
          />

          <h3 className="text-center p-2">Rejected</h3>
          <FormInputItem
            className="no-border"
            name="noOfRejectedBlooms"
            onChange={handleRejectedBloomDtlChange}
            disabled={
              isFieldDisabled(5) || rejectedBloomsFieldState.noOfRejectedBlooms
            }
          />
          <FormInputItem
            className="no-border"
            name="rejectedBloomsLength"
            onChange={handleRejectedBloomDtlChange}
            disabled={
              isFieldDisabled(5) ||
              rejectedBloomsFieldState.rejectedBloomsLength
            }
          />
          <FormInputItem
            className="no-border"
            name="rejectedBloomsTotalLength"
            onChange={handleRejectedBloomDtlChange}
            disabled={
              isFieldDisabled(5) ||
              rejectedBloomsFieldState.rejectedBloomsTotalLength
            }
          />
          <FormInputItem
            className="no-border"
            name="weightOfRejectedBlooms"
            disabled
          />

          <h3 className="text-center p-2 col-span-4">Total Cast Weight</h3>
          <FormInputItem className="no-border" name="totalCastWt" disabled />
        </div>

        <Checkbox
          className="my-4"
          checked={formData.isDiverted}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              isDiverted: e.target.checked,
              heatRemark: e.target.checked ? "Divereted" : null,
            }))
          }
        >
          Mark as diverted heat.
        </Checkbox>

        <FormInputItem name="heatRemark" placeholder="Heat Remark" disabled />
        <Btn htmlType="submit" className="flex mx-auto">
          {" "}
          Save{" "}
        </Btn>
      </Form>
    </FormContainer>
  );
};

export default HeatDtl;
