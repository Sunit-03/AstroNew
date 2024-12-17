import React, { useState } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer'
import GeneralInfo from '../../../../../components/DKG_GeneralInfo'
import FormBody from '../../../../../components/DKG_FormBody'
import data from "../../../../../utils/frontSharedData/qct/qct.json";
import FormInputItem from '../../../../../components/DKG_FormInputItem';
import SubHeader from '../../../../../components/DKG_SubHeader';
import Btn from '../../../../../components/DKG_Btn';
import { useNavigate } from 'react-router-dom';
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';
import CustomDatePicker from '../../../../../components/DKG_CustomDatePicker';
import { Divider } from 'antd';
import DKG_InteractionTable from '../../../../../components/DKG_QCTSampleDecTable';

const { millDropdownList, qctGeneralInfo, railSectionList, railGradeList, qctList, sampleDeclarationColumns, sampleDeclarationData, qctSecList } = data;

const QctSampleDeclarationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    {
      mill: '', railSection: '', railGrade: '', date: '', qct: '', numberSamples: '', remarks: ''
    }
  );

  const handleChange = (fieldName, value) => {
    setFormData(prev => {
      return {
        ...prev,
        [fieldName]: value
      }
    })
  };

  const handleFormSubmit = () => {
    navigate('/qct/sampleList')
  }

  return (
    <FormContainer>
      <SubHeader title='QCT - Sample Declaration' link='/qct/sampleList' />
      <GeneralInfo data={qctGeneralInfo} />

      <FormBody initialValues={formData} onFinish={handleFormSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>  
          <FormDropdownItem label='Mill' name='mill' dropdownArray={millDropdownList} valueField='key' visibleField='value' onChange={handleChange} className='w-full' required />          
          <FormDropdownItem label ='Rail Section' name='railSection' dropdownArray={railSectionList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' required />  
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <FormDropdownItem label='Rail Grade' name='railGrade' dropdownArray={railGradeList} valueField='key' visibleField='value' onChange={handleChange} className='w-full' required /> 
          {(formData.railGrade === 'R350HT' || formData.railGrade === '1080HH') &&
            <FormDropdownItem label ='QCT' name='qct' dropdownArray={qctList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' required />
          }
          {(formData.railGrade === 'R260' || formData.railGrade === '880') &&
            <FormDropdownItem label ='QCT' name='qct' dropdownArray={qctSecList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' required />
          }        
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <CustomDatePicker label="Date" name="date" value={formData.date} onChange={handleChange} required />        
          <FormInputItem label='No. of Samples' name='numberSamples' onChange={handleChange} required/>
        </div>

        <Divider>Samples Declared for Testing</Divider>

        <DKG_InteractionTable />

        <Divider className='mt-2 mb-2' />

        <FormInputItem label='Remarks' name='remarks' value={formData.remarks} onChange={handleChange} required/>

        <div className='flex justify-center mt-4'>
          <Btn htmlType='submit'>Save</Btn>
        </div>
      </FormBody>
    </FormContainer>
  )
}

export default QctSampleDeclarationForm