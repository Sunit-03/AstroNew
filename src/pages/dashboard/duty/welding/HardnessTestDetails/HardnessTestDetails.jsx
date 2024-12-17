import React, { useState } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer';
import SubHeader from '../../../../../components/DKG_SubHeader';
import GeneralInfo from '../../../../../components/DKG_GeneralInfo';
import data from "../../../../../utils/frontSharedData/weldingInspection/WeldingInspection.json";
import { Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom'
import FormBody from '../../../../../components/DKG_FormBody';
import FormInputItem from '../../../../../components/DKG_FormInputItem';
import Btn from '../../../../../components/DKG_Btn';
import DKG_InteractionTable from '../../../../../components/DKG_InteractionTable';

const { weldingTestGeneralInfo } = data;

const HardnessTestDetails = () => {
  const [formData, setFormData] = useState({
    machineNumber: '', remarks: ''
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
      <SubHeader title="Weld Period Testing Details - Hardness" link="/welding/testSample" />
      <GeneralInfo data={weldingTestGeneralInfo} />

      <FormBody initialValues={formData} onFinish={handleFormSubmit}>
        <div className="grid grid-cols-1 gap-x-2">
          <FormInputItem label='Machine Number' name='machineNumber' value={formData.machineNumber} onChange={handleChange} disabled/>
        </div>

        <DKG_InteractionTable />

        <Divider />

        <FormInputItem label='Remarks' name='remarks' value={formData.remarks} onChange={handleChange} required/>

        <div className='flex justify-center'>
          <Btn htmlType='submit' className='w-36'>Save</Btn>
        </div>
      </FormBody>
    </FormContainer>
  )
}

export default HardnessTestDetails