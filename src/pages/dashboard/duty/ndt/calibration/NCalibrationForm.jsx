import React, { useState } from "react";
import SubHeader from "../../../../../components/DKG_SubHeader";
import FormContainer from "../../../../../components/DKG_FormContainer";
import GeneralInfo from "../../../../../components/DKG_GeneralInfo";
import data from "../../../../../utils/frontSharedData/ndt/ndt.json";
import { message, Divider, Checkbox } from 'antd';
import FormBody from "../../../../../components/DKG_FormBody";
import FormInputItem from "../../../../../components/DKG_FormInputItem";
import Btn from "../../../../../components/DKG_Btn";
import { useNavigate } from 'react-router-dom'
import CustomTimePicker from "../../../../../components/DKG_CustomTimePicker"
import { PlusOutlined }from '@ant-design/icons';
import IconBtn from '../../../../../components/DKG_IconBtn';
import FormNumericInputItem from '../../../../../components/DKG_FormNumericInputItem'

const { ndtGeneralInfo, checkBoxItems } = data;

const NCalibrationForm = () => {
  const [checkedValues, setCheckedValues] = useState([]);
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    {
      dataList: [
        {
          checkedValues: [], calTime: '', rclRep: "", remarks: ''
        }
      ],
      shiftRemarks: ''
    }
  );

  const handleChange = (fieldName, value) => {
    setFormData(prev => {
      return {
        ...prev,
        [fieldName]: value
      }
    })
  }

  const handleFormSubmit = () => {
    navigate('/ndt/home')
    message.success('Form Submit Called')
  }

  const handleAddCalibrationFields = () => {
    setFormData(prev => {
      return {
        ...prev,
        dataList: [
          ...prev.dataList,
          { checkedValues: [], calTime: '', rclRep: '', remarks: '' }
        ]
      }
    });

    setCheckedValues(checkedValues);
  };

  const handleNDTRoundValueChange = (index, fieldName, value) => {
    setFormData(prev => {
      const prevDataList = [...prev.dataList]
      prevDataList[index][fieldName] = value
      return {
        ...prev, 
        dataList: [...prevDataList]
      }
    });

    setCheckedValues(checkedValues)
  };

  return (
    <FormContainer>
        <SubHeader title="NDT - Calibration" link="/ndt/home" />
        <GeneralInfo data={ndtGeneralInfo} />

        <FormBody initialValues={formData} onFinish={handleFormSubmit} >
            {
            formData.dataList.map((record, index) => (
                <>                    
                    <div key={index}>
                        <section className='grid grid-cols-1'>
                            <Checkbox.Group
                                options={checkBoxItems.map(item => ({key: item.key, label: item.value, value: item.key }))}
                                value={checkedValues}
                                onChange={(fieldName, value) => handleNDTRoundValueChange(checkedValues, index, fieldName, value)}
                                className='mb-6'
                            />
                        </section>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 mt-3">
                            <CustomTimePicker label='Cal. Completion Time' name='calTime' key={record.id} value={formData?.calTime} onChange={(fieldName, value) => handleNDTRoundValueChange(index, fieldName, value)} required />
                            <FormNumericInputItem label='Calibration Speed (m/s)' value={value} onChange={setValue} required />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                            <FormInputItem label='RCL Rep.' name='rclRep' placeholder='Enter RCL Rep. name' key={record.id} value={formData.rclRep} onChange={(fieldName, value) => handleNDTRoundValueChange(index, fieldName, value)} required/>
                            <FormInputItem label='Remarks for this round' key={record.id} placeholder='Enter Remarks' onChange={(fieldName, value) => handleNDTRoundValueChange(index, fieldName, value)} name='remarks' required/>
                        </div>

                        <Divider className="mt-0 mb-0" />
                    </div>
                </>
            ))
            }
            
            <IconBtn icon={PlusOutlined} text='Add Calibration Round' onClick={handleAddCalibrationFields} className='mt-2' />

            <div className='mt-4'>
                <FormInputItem label='Remarks' placeholder='Enter Remarks' onChange={handleChange} name='shiftRemarks' required/>
                <div className='flex justify-center mt-8'>
                    <Btn htmlType='submit'>Save</Btn>
                </div>
            </div>
        </FormBody>
    </FormContainer>
  )
}

export default NCalibrationForm