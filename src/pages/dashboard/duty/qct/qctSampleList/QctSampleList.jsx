import React, { useState } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer';
import SubHeader from '../../../../../components/DKG_SubHeader';
import GeneralInfo from '../../../../../components/DKG_GeneralInfo';
import data from "../../../../../utils/frontSharedData/qct/qct.json";
import FormBody from '../../../../../components/DKG_FormBody';
import { useNavigate } from 'react-router-dom';
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';
import { Table, Divider } from 'antd';
import Btn from '../../../../../components/DKG_Btn';
import { FilterFilled } from "@ant-design/icons";

const { millDropdownList, qctGeneralInfo, railSectionList, railGradeList, qctList, sampleDeclarationColumns, sampleDeclarationData } = data;

const QctSampleList = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mill: '', railSection: '',  railGrade: '', qct: ''
  })

  const handleChange = (fieldName, value) => {
    setFormData(prev => {
      return {
        ...prev,
        [fieldName]: value
      }
    })
  }

  const handleClick = () => {
    navigate('/qct/newSampleDeclaration')
  }

  return (
    <FormContainer>
      <SubHeader title='QCT - Sample List' link='/' />
      <GeneralInfo data={qctGeneralInfo} />

      <FormBody initialValues={formData}>
        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <FilterFilled />
            <FormDropdownItem label='Mill' name='mill' dropdownArray={millDropdownList} valueField='key' visibleField='value' onChange={handleChange} className='w-full' />
          </div>

          <div className='flex items-center gap-x-2'>
            <FilterFilled />         
            <FormDropdownItem label ='Rail Section' name='railSection' dropdownArray={railSectionList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <FilterFilled />
            <FormDropdownItem label='Rail Grade' name='railGrade' dropdownArray={railGradeList} valueField='key' visibleField='value' onChange={handleChange} className='w-full' />
          </div>

          <div className='flex items-center gap-x-2'>
            <FilterFilled />          
            <FormDropdownItem label ='QCT' name='qct' dropdownArray={qctList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' />
          </div>
        </div>

        <Divider>Samples Declared for Testing</Divider>

        <Table 
          dataSource={sampleDeclarationData} 
          columns={sampleDeclarationColumns} 
          scroll={{ x: true }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30"],
          }}
        />

        <div className='flex justify-center mt-4'>
          <Btn onClick={handleClick}>Declare New Sample for Testing</Btn>
        </div>
      </FormBody>
    </FormContainer>
  )
}

export default QctSampleList