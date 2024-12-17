import React, { useState } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer';
import SubHeader from '../../../../../components/DKG_SubHeader';
import GeneralInfo from '../../../../../components/DKG_GeneralInfo';
import data from "../../../../../utils/frontSharedData/srInspection/srInspection.json";
import FormBody from '../../../../../components/DKG_FormBody';
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';

const { srInspectionGeneralInfo, railSectionList, railGradeList } = data;

const SrNewInspectionForm = () => {
  const [formData, setFormData] = useState({
    railSection: '', railGrade: ''
  })

  const handleChange = (fieldName, value) => {
    setFormData(prev => {
      return {
        ...prev,
        [fieldName]: value
      }
    })
  }

  return (
    <FormContainer>
      <SubHeader title='Short Rail Inspection Form' link='/srInspection' />
      <GeneralInfo data={srInspectionGeneralInfo} />

      <FormBody initialValues={formData}>
        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <FormDropdownItem label='Rail Section Inspected' name='railSection' dropdownArray={railSectionList} valueField='key' visibleField='value' onChange={handleChange} className='w-full' />
          <FormDropdownItem label ='Rail Grade Inspected' name='railGrade' dropdownArray={railGradeList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' />
        </div>
      </FormBody>
    </FormContainer>
  )
}

export default SrNewInspectionForm