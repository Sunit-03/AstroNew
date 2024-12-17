import React, { useState, useEffect } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer'
import SubHeader from '../../../../../components/DKG_SubHeader'
import GeneralInfo from '../../../../../components/DKG_GeneralInfo'
import data from "../../../../../utils/frontSharedData/calibration/calibration.json";
import FormBody from '../../../../../components/DKG_FormBody';
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';
import CustomDatePicker from "../../../../../components/DKG_CustomDatePicker"
import { Divider, Table } from 'antd';
import Btn from "../../../../../components/DKG_Btn"
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../../../../components/DKG_IconBtn';
import { FilterFilled, PlusOutlined } from "@ant-design/icons";

const { instrumentMapping: sampleData, calibrationGeneralInfo, railSectionList, detailList, serialNumberList, calResultList } = data;

const BulkCalibrationForm = () => {
  const [instrumentCategoryList, setInstrumentCategoryList] = useState([])
  const [instrumentList, setInstrumentList] = useState([]);
  const navigate = useNavigate();
  const [info, setInfo] = useState([
    {
      key: '1',
      serialNumber: '',
    },
  ]);

  const [formData, setFormData] = useState({
    instrumentCategory: null, instrument: null,  instrumentDetail: '', railSection: null, serialNumber: '', calibrationResult: '', calibrationUptoDate: '',
  })

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

  const handleChange = (fieldName, value) => {
    setFormData(prev=>{
      return {
        ...prev,
        [fieldName]: value
      }
    })
  }

  const handleAddRow = () => {
    const newRow = {
      key: `${info.length + 1}`,
      serialNumber: '',
    };
    setInfo([...info, newRow]);
  };

  const handleSelectChange = (value, key) => {
    const updatedData = info.map((row) => {
      if (row.key === key) {
        return { ...row, serialNumber: value };
      }
      return row;
    });
    setInfo(updatedData);
  };

  const bulkColumns = [
    {
      title: 'S.No.',
        dataIndex: 'key',
        key: 'key',
        render: (text, record, index) => index + 1,
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      render: (text, record) => (
        <FormDropdownItem name='serialNumber' placeholder='Select serial number' dropdownArray={serialNumberList} visibleField='value' valueField='key' onChange={handleSelectChange} required/>
      )
    }
  ]

  const handleClick = () => {
    navigate('/calibration/list');
  }

  return (
    <FormContainer>
      <SubHeader title='Bulk Re-Calibration List' link='/calibration/list' />
      <GeneralInfo data={calibrationGeneralInfo} />

      <FormBody initialValues={formData}>
        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <FilterFilled />
            <FormDropdownItem label='Instrument Category' name='instrumentCategory' dropdownArray={instrumentCategoryList} valueField={'key'} visibleField={'value'} onChange={handleChange} className='w-full' />
          </div>

          <div className='flex items-center gap-x-2'>
            <FilterFilled />         
            <FormDropdownItem label ='Instrument' name='instrument' dropdownArray={instrumentList} valueField={'key'} visibleField={'value'} onChange = {handleChange} className='w-full' />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <FilterFilled />
            <FormDropdownItem label ='Instrument Detail' name='instrumentDetail' dropdownArray={detailList} valueField={'key'} visibleField={'value'} onChange = {handleChange} className='w-full' />
          </div>

          {
            (formData.instrumentCategory === 'Gauge (Working)' || formData.instrumentCategory === 'Gauge (Master)') && 
              <div className='flex items-center gap-x-2'>
                <FilterFilled />
                <FormDropdownItem label='Rail Section' name='railSection' dropdownArray={railSectionList} visibleField='value' valueField='key' onChange={handleChange} className='w-full' />
              </div>
          }
        </div>
      </FormBody>

      <Divider className='mt-0 mb-2' />

      <Table columns={bulkColumns} dataSource={info} bordered pagination={false} />
      <div className='flex justify-center mt-4'>
        <IconBtn
          icon={PlusOutlined}
          text="Add Row / Instrument"
          className="-mt-4 w-fit"
          onClick={handleAddRow}
        />
      </div>

      <div className='grid grid-cols-1 gap-x-4 mt-8'>   
        <FormDropdownItem label ='Calibration Result' name='calibrationResult' dropdownArray={calResultList} valueField={'key'} visibleField={'value'} onChange = {handleChange} required />
        {
            (formData?.calibrationResult === 'OK' || formData?.calibrationResult === 'Not OK') && 
            <CustomDatePicker label='Cal. Valid upto Date' name='calibrationUptoDate' value={formData?.calibrationUptoDate} onChange={handleChange} className='w-[80%]' required />
        }
      </div>

      <div className='flex justify-center'>
        <Btn onClick={handleClick}>Save</Btn>
      </div>
    </FormContainer>
  )
}

export default BulkCalibrationForm