import React, { useState } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer';
import SubHeader from '../../../../../components/DKG_SubHeader';
import GeneralInfo from '../../../../../components/DKG_GeneralInfo';
import data from "../../../../../utils/frontSharedData/weldingInspection/WeldingInspection.json";
import { message } from 'antd';
import { useNavigate } from 'react-router-dom'
import FormBody from '../../../../../components/DKG_FormBody';
import FormInputItem from '../../../../../components/DKG_FormInputItem';
import FormNumericInputItem from "../../../../../components/DKG_FormNumericInputItem"
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';
import Btn from '../../../../../components/DKG_Btn';

const { weldingTestGeneralInfo, brokenOrNotList } = data;

const TLTTestDetails = () => {
  const [span, setSpan] = useState('')
  const [loadApplied, setLoadApplied] = useState('')
  const [deflection, setDeflection] = useState('')
  const [formData, setFormData] = useState({
    machineNumber: '', brokenOrNot: '', remarks: ''
  });
  const navigate = useNavigate();

  const handleChange = (fieldName, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handleFormSubmit = () => {
    message.success("Form submission triggered.");
    navigate('/welding/testSample');
  };

  return (
    <FormContainer>
      <SubHeader title="Weld Period Testing Details - TLT" link="/welding/testSample" />
      <GeneralInfo data={weldingTestGeneralInfo} />

      <FormBody initialValues={formData} onFinish={handleFormSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
          <FormInputItem label='Machine Number' name='machineNumber' value={formData.machineNumber} onChange={handleChange} disabled/>
          <FormNumericInputItem label="Span (m)" value={span} onChange={setSpan} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
          <FormNumericInputItem label="Load Applied (T)" value={loadApplied} onChange={setLoadApplied} required />
          <FormNumericInputItem label="Deflection (mm)" value={deflection} onChange={setDeflection} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
          <FormNumericInputItem label="Load at 20mm Deflection (T)" value={loadApplied} onChange={setLoadApplied} required />
          <FormDropdownItem label="Broken or Not" name="brokenOrNot" dropdownArray={brokenOrNotList} visibleField="value" valueField="key" onChange={handleChange} required />
        </div>

        <FormInputItem label='Remarks' name='remarks' value={formData.remarks} onChange={handleChange} required/>

        <div className='flex justify-center'>
          <Btn htmlType='submit' className='w-36'>Save</Btn>
        </div>
      </FormBody>
    </FormContainer>
  )
}

export default TLTTestDetails