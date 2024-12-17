import React, { useState, useEffect } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer'
import SubHeader from '../../../../../components/DKG_SubHeader'
import GeneralInfo from '../../../../../components/DKG_GeneralInfo'
import data from "../../../../../utils/frontSharedData/calibration/calibration.json";
import { useNavigate } from 'react-router-dom';
import { message } from 'antd'
import FormBody from '../../../../../components/DKG_FormBody';
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';
import FormInputItem from '../../../../../components/DKG_FormInputItem';
import CustomDatePicker from '../../../../../components/DKG_CustomDatePicker';
import Btn from '../../../../../components/DKG_Btn';

const { instrumentMapping: sampleData, calibrationGeneralInfo, railSectionList, calResultList } = data;

const NewCalibrationForm = () => {
  const [instrumentCategoryList, setInstrumentCategoryList] = useState([])
  const [instrumentList, setInstrumentList] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    instrumentCategory: null, instrument: null,  instrumentDetail: '', railSection: null, serialNumber: '', calibrationDate: '', calibrationResult: '', calibrationUptoDate: '',
  })

  const handleChange = (fieldName, value) => {
    setFormData(prev=>{
      return {
        ...prev,
        [fieldName]: value
      }
    })
  }

  const handleFormSubmit = () => {
    message.success('Form Submit Called')
    navigate('/calibration/list');
  }

  const populateData = () => {
    const instrumentCategoryList = Object.keys(sampleData).map(inst => {
      return {
        key: inst,
        value: inst
      }
    })
    setInstrumentCategoryList([...instrumentCategoryList])
  }

  useEffect(()=> {
    populateData()
  }, [])

  useEffect(()=>{
    if(sampleData[formData.instrumentCategory]){
        const instrumentList = sampleData[formData.instrumentCategory].map(inst => {
        return {
            key: inst,
            value: inst
        }
        })
        setInstrumentList([...instrumentList])
    }
  }, [formData.instrumentCategory, instrumentCategoryList])

  return (
    <FormContainer>
      <SubHeader title='New / Modify Calibration Detail' link='/calibration/list' />
      <GeneralInfo data={calibrationGeneralInfo} />

      <FormBody initialValues={formData} onFinish={handleFormSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <FormDropdownItem label='Instrument Category' name='instrumentCategory' dropdownArray={instrumentCategoryList} valueField={'key'} visibleField={'value'} onChange={handleChange} required />
          <FormDropdownItem label ='Instrument' name='instrument' dropdownArray={instrumentList} valueField={'key'} visibleField={'value'} onChange = {handleChange} required />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <FormInputItem label='Instrument Detail' name='instrumentDetail' placeholder='Enter Instrument Detail' value={formData?.instrumentDetail} onChange={handleChange} required />
          {
              (formData.instrumentCategory === 'Gauge (Working)' || formData.instrumentCategory === 'Gauge (Master)') && 
              <FormDropdownItem label='Rail Section' name='railSection' dropdownArray={railSectionList} visibleField='value' valueField='key' onChange={handleChange} required />
          }
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <FormInputItem label='Serial Number' name='serialNumber' placeholder='Enter S. No.' value={formData?.serialNumber} onChange={handleChange} required />
          <CustomDatePicker label='Calibration Date' name='calibrationDate' value={formData?.calibrationDate} onChange={handleChange} required />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <FormDropdownItem label ='Calibration Result' name='calibrationResult' dropdownArray={calResultList} valueField={'key'} visibleField={'value'} onChange = {handleChange} required />
          {
              (formData?.calibrationResult === 'OK') && 
              <CustomDatePicker label='Cal. Valid upto Date' name='calibrationUptoDate' value={formData?.calibrationUptoDate} onChange={handleChange} required />
          }
        </div>

        <div className='flex justify-center mt-4'>
          <Btn htmlType='submit'>Save</Btn>
        </div>
      </FormBody>
    </FormContainer>
  )
}

export default NewCalibrationForm