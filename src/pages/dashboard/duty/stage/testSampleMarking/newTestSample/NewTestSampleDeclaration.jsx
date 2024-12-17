import React, { useEffect, useState } from "react";
import FormContainer from "../../../../../../components/DKG_FormContainer";
import SubHeader from "../../../../../../components/DKG_SubHeader";
import data from "../../../../../../utils/frontSharedData/testSampleDec/testSampleDec.json";
import GeneralInfo from "../../../../../../components/DKG_GeneralInfo";
import FormBody from "../../../../../../components/DKG_FormBody";
import { useLocation, useNavigate } from "react-router-dom";
import { message, Form } from "antd";
import FormDropdownItem from "../../../../../../components/DKG_FormDropdownItem";
import AcceptanceTestSample from "../acceptanceTestSample.jsx/AcceptanceTestSample";

const {
  testDropdownList,
  railGradeDropdownList,
  testSampleDecGeneralInfo,
  strandDropdownList,
  sampleLotDropdownList,
  sampleDropdownList,
  checkBoxItems,
  retestNameSecDropdownList,
  retestNameDropdownList,
} = data;

const NewTestSampleDeclaration = () => {
  const location = useLocation();
  const {state} = location;
  const module = state?.module || null;
  const dutyId = state?.dutyId || null;
  const generalInfo = state?.generalInfo || null;

  console.log("location: ", location.state)

  const [form] = Form.useForm();
  const [checkedValues, setCheckedValues] = useState([]);
  const [heatNumber, setHeatNumber] = useState("");

  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    // test: "",
    railGrade: "",
    // sampleType: "",
    // heatNumber: "",
    // strand: "",
    // sampleLot: "",
    // remarks: "",
    // sampleID: "",
    // retestName: "",
    // retestOne: "",
    // retestTwo: "",
    // retestThree: "",
  });

  const handleChange = (fieldName, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handleFormSubmit = () => {
    message.success("Duty End Called");
    // needs to be change later on
    navigate("/");
  };

  useEffect(() => {
    if(!module || !dutyId){
      message.error("Reach the page from an ongoing duty in a module.")
      navigate(-1);
  
    }
  }, [module, dutyId, navigate])

  return (
    <FormContainer>
      <SubHeader
        title="New Test Sample - Declaration"
        link="/stage/home"
      />
      <GeneralInfo data={generalInfo} />

      <FormBody initialValues={formData} onFinish={handleFormSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-4">
          <FormDropdownItem
            label="Test"
            name="test"
            formField="test"
            dropdownArray={testDropdownList}
            onChange={handleChange}
            valueField="key"
            visibleField="value"
            required
          />
          <FormDropdownItem
            label="Rail Grade"
            name="railGrade"
            formField="railGrade"
            dropdownArray={railGradeDropdownList}
            onChange={handleChange}
            valueField="key"
            visibleField="value"
            required
          />
        </div>

        </FormBody>

        {
          formData.test === "Acceptance Test" && <AcceptanceTestSample railGrade={formData.railGrade} dutyId={dutyId} />
        }

        {/* <section> */}
          {/* {formData.test === "Acceptance Test" &&
            (formData.railGrade === "R260" || formData.railGrade === "880") && (
              <Form form={form} initialValues={formData} onFinish={handleFormSubmit} className="bg-offWhite p-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FormDropdownItem
                      label="Sample Type"
                      name="sampleType"
                      formField="sampleType"
                      dropdownArray={sampleDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      className="w-full"
                      required
                    />
                    <FormDropdownItem
                      label="Strand"
                      name="strand"
                      value={formData.strand}
                      dropdownArray={strandDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      className="ml-2 w-[95%]"
                      required
                    />
                    <FormDropdownItem
                      label="Sample Lot"
                      name="sampleLot"
                      value={formData.sampleLot}
                      dropdownArray={sampleLotDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      required
                    />
                    <FormInputItem
                      label="Sample ID"
                      name="sampleId"
                      onChange={handleChange}
                    />
                    <FormInputItem
                      label="Heat Number"
                      name="heatNo"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Checkbox.Group
                      options={checkBoxItems.map((item) => ({
                        key: item.key,
                        label: item.value,
                        value: item.key,
                      }))}
                      value={checkedValues}
                      onChange={(checkedValues) =>
                        setCheckedValues(checkedValues)
                      }
                      className="checkbox-group mb-4"
                    />
                  </div>

                  <FormInputItem
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    required
                  />

                <div className="flex justify-center">
                  <Btn
                    htmlType="submit"
                    className="w-36"
                    onClick={handleFormSubmit}
                  >
                    Save
                  </Btn>
                </div>
              </Form>
            )}

          {formData.test === "Acceptance Test" &&
            formData.railGrade === "R350HT" && (
              <FormBody initialValues={formData} onFinish={handleFormSubmit}>
                <div className="!bg-offWhite opacity-80 flex flex-col border p-2 border-gray-100 rounded-md mt-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <FormDropdownItem
                      label="Sample Type"
                      name="sampleType"
                      value={formData.sampleType}
                      dropdownArray={sampleDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      className="w-full"
                      required
                    />
                    <FormInputItem
                      label="Sample ID"
                      name="sampleID"
                      value={formData.sampleID}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <FormNumericInputItem
                      label="Heat Number"
                      minLength={6}
                      maxLength={6}
                      value={heatNumber}
                      onChange={setHeatNumber}
                      required
                    />
                    <FormDropdownItem
                      label="Strand"
                      name="strand"
                      value={formData.strand}
                      dropdownArray={strandDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      className="ml-2 w-[95%]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <FormDropdownItem
                      label="Sample Lot"
                      name="sampleLot"
                      value={formData.sampleLot}
                      dropdownArray={sampleLotDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      required
                    />
                  </div>

                  <div>
                    <Checkbox.Group
                      options={checkBoxItems.map((item) => ({
                        key: item.key,
                        label: item.value,
                        value: item.key,
                      }))}
                      value={checkedValues}
                      onChange={(checkedValues) =>
                        setCheckedValues(checkedValues)
                      }
                      className="checkbox-group mb-4"
                    />
                  </div>

                  <FormInputItem
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex justify-center">
                  <Btn
                    htmlType="submit"
                    className="w-36"
                    onClick={handleFormSubmit}
                  >
                    Save
                  </Btn>
                </div>
              </FormBody>
            )}

          {formData.test === "Retest Samples" &&
            (formData.railGrade === "R260" || formData.railGrade === "880") && (
              <FormBody initialValues={formData} onFinish={handleFormSubmit}>
                <div className="!bg-offWhite opacity-80 flex flex-col border p-2 border-gray-100 rounded-md mt-4 mb-4 shadow-[4px_4px_4px_4px_rgba(0,0,0,0.1)]">
                  <div className="grid grid-cols-2">
                    <FormDropdownItem
                      label="Retest Name"
                      name="retestName"
                      value={formData.retestName}
                      dropdownArray={retestNameDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      required
                    />
                    <FormDropdownItem
                      label="Sample Lot"
                      name="sampleLot"
                      value={formData.sampleLot}
                      dropdownArray={sampleLotDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      className="ml-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <FormNumericInputItem
                      label="Heat Number"
                      minLength={6}
                      maxLength={6}
                      value={heatNumber}
                      onChange={setHeatNumber}
                      required
                    />
                    <FormDropdownItem
                      label="Retest 1"
                      name="retestOne"
                      value={formData.retestOne}
                      dropdownArray={strandDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      className="ml-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <FormDropdownItem
                      label="Retest 2"
                      name="retestTwo"
                      value={formData.retestTwo}
                      dropdownArray={strandDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      required
                    />
                    <FormDropdownItem
                      label="Retest 3"
                      name="retestThree"
                      value={formData.retestThree}
                      dropdownArray={strandDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      className="ml-2"
                      required
                    />
                  </div>

                  <FormInputItem
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex justify-center">
                  <Btn
                    htmlType="submit"
                    className="w-36"
                    onClick={handleFormSubmit}
                  >
                    Save
                  </Btn>
                </div>
              </FormBody>
            )}

          {formData.test === "Retest Samples" &&
            formData.railGrade === "R350HT" && (
              <FormBody initialValues={formData} onFinish={handleFormSubmit}>
                <div className="!bg-offWhite opacity-80 flex flex-col border p-2 border-gray-100 rounded-md mt-4 mb-4 shadow-[4px_4px_4px_4px_rgba(0,0,0,0.1)]">
                  <div className="grid grid-cols-2">
                    <FormDropdownItem
                      label="Retest Name"
                      name="retestName"
                      value={formData.retestName}
                      dropdownArray={retestNameSecDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      required
                    />
                    <FormDropdownItem
                      label="Sample Lot"
                      name="sampleLot"
                      value={formData.sampleLot}
                      dropdownArray={sampleLotDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      className="ml-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-x-2">
                    <FormInputItem
                      label="Sample ID"
                      name="sampleID"
                      value={formData.sampleID}
                      onChange={handleChange}
                      required
                    />
                    <FormNumericInputItem
                      label="Heat Number"
                      minLength={6}
                      maxLength={6}
                      value={heatNumber}
                      onChange={setHeatNumber}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1">
                    <FormDropdownItem
                      label="Strand"
                      name="strand"
                      value={formData.strand}
                      dropdownArray={strandDropdownList}
                      onChange={handleChange}
                      valueField="key"
                      visibleField="value"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Btn
                    htmlType="submit"
                    className="w-36"
                    onClick={handleFormSubmit}
                  >
                    Save
                  </Btn>
                </div>
              </FormBody>
            )} */}
        {/* </section> */}
      
    </FormContainer>
  );
};

export default NewTestSampleDeclaration;
