import React, { useState, useEffect } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer'
import SubHeader from '../../../../../components/DKG_SubHeader'
import data from "../../../../../utils/frontSharedData/calibration/calibration.json";
import FormBody from '../../../../../components/DKG_FormBody';
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';
import CustomDatePicker from "../../../../../components/DKG_CustomDatePicker"
import Search from "../../../../../components/DKG_Search"
import { Divider, Table, Modal } from 'antd';
import Btn from "../../../../../components/DKG_Btn"
import { useNavigate } from 'react-router-dom';
import { FilterFilled, EditOutlined } from '@ant-design/icons';
import IconBtn from '../../../../../components/DKG_IconBtn';
import FormInputItem from '../../../../../components/DKG_FormInputItem';

const { instrumentMapping: sampleData, railSectionList, reportInfo } = data;

const CalibrationList = () => {
  const [instrumentCategoryList, setInstrumentCategoryList] = useState([])
  const [instrumentList, setInstrumentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    instrumentCategory: '', instrument: '',  instrumentDetail: '', railSection: null, serialNumber: '', calibrationDate: '', calibrationUptoDate: '',
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

  const handleClick = () => {
    navigate('/calibration/bulkCalibration');
  }

  const handleClickSec = () => {
    navigate('/calibration/newModifyCalibration');
  }

  const handleClickTer = () => {
    navigate('/');
  }

  const columns = [
    {
        title: "S.No.",
        dataIndex: "serialNumber",
        key: "serialNumber",
        fixed: "left",
        align: "center"
    },
    {
        title: "Instrument",
        dataIndex: "instrument",
        key: "instrument",
        fixed: "left",
        align: "center"
    },
    {
        title: "Detail",
        dataIndex: "detail",
        key: "detail",
        align: "center"
    },
    {
        title: "Rail Section",
        dataIndex: "railSection",
        key: "railSection",
        align: "center"
    },
    {
        title: "Serial Number",
        dataIndex: "sNumber",
        key: "sNumber",
        align: "center"
    },
    {
        title: "Gauge Status",
        dataIndex: "gaugeStatus",
        key: "gaugeStatus",
        align: "center"
    },
    {
        title: "Calibration Due Date",
        dataIndex: "dueDate",
        key: "dueDate",
        align: "center"
    },
    {
      title: "Modify",
      fixed: "right",
      render: (_, record) => (
        <IconBtn 
          icon={EditOutlined} 
          onClick={() => setIsModalOpen(true)}
        />
      ),
    },
  ]

  return (
    <FormContainer>
      <SubHeader title="Calibration - List" link="/" />

      <FormBody initialValues={formData}>
        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <FilterFilled />
            <FormDropdownItem label='Instrument Category' name='instrumentCategory' dropdownArray={instrumentCategoryList} valueField='key' visibleField='value' onChange={handleChange} className='w-full' required />
          </div>

          <div className='flex items-center gap-x-2'>
            <FilterFilled />         
            <FormDropdownItem label ='Instrument' name='instrument' dropdownArray={instrumentList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' required />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          {
            (formData.instrumentCategory === 'Gauge (Working)' || formData.instrumentCategory === 'Gauge (Master)') && 
              <div className='flex items-center gap-x-2'>
                <FilterFilled />
                  <FormDropdownItem label='Rail Section' name='railSection' dropdownArray={railSectionList} visibleField='value' valueField='key' onChange={handleChange} className='w-full' required />
              </div>
          }

          <CustomDatePicker label='Calibration Valid upto Date' name='calibrationUptoDate' value={formData?.calibrationUptoDate} onChange={handleChange} required />
        </div>

        <div className='flex justify-center mt-2'>
          <Search placeholder='Search by S. No.' />
        </div>
      </FormBody>

      <Divider className='mt-0 mb-2' />

      <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2'>
        <div className='flex justify-center'>
          <Btn onClick={handleClick} className='sm:mt-0 md:mt-0'>Bulk Calibration</Btn>
        </div>

        <div className='flex justify-center'>
          <Btn onClick={handleClickSec} className='mt-2 sm:mt-0 md:mt-0'>Add New Calibration</Btn>
        </div>
      </div>

      <Divider className='mt-0 mb-2' />

      <Table
        columns={columns}
        dataSource={reportInfo}
        scroll={{ x: true }}
        bordered
        pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
        }}
      />
      
      <div className='flex justify-center'>
        <Btn onClick={handleClickTer}>OK</Btn>
      </div>

      <Modal title='Modify Calibration List' open={isModalOpen} onCancel={()=>setIsModalOpen(false)} footer={null}>
          <FormInputItem placeholder='Enter Heat Number' />
          <Btn>Add</Btn>
      </Modal>
    </FormContainer>
  )
}

export default CalibrationList