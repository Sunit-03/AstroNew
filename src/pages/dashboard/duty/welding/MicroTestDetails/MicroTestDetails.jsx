import React, { useState } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer';
import SubHeader from '../../../../../components/DKG_SubHeader';
import GeneralInfo from '../../../../../components/DKG_GeneralInfo';
import data from "../../../../../utils/frontSharedData/weldingInspection/WeldingInspection.json";
import { Divider, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom'
import FormBody from '../../../../../components/DKG_FormBody';
import FormInputItem from '../../../../../components/DKG_FormInputItem';
import Btn from '../../../../../components/DKG_Btn';
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';

const { weldingTestGeneralInfo, deviationList } = data;

const MicroTestDetails = () => {
  const [formData, setFormData] = useState({
    machineNumber: '', remarks: ''
  });
  const navigate = useNavigate();

  const handleSelectChange = (value, key) => {
    const updatedData = info.map((row) => {
      if (row.key === key) {
        return { ...row, deviation: value, deviationSec: value };
      }
      return row;
    });
    setInfo(updatedData);
  };

  const [info, setInfo] = useState([
    {
      key: '1',
      testParameter: 'Is Microstructure free from Martensite and Bainite',
      deviation:<FormDropdownItem name='deviation' placeholder='Select deviation' dropdownArray={deviationList} visibleField='value' valueField='key' onChange={handleSelectChange} required/>
    },
    {
      key: '2',
      testParameter: 'Is ASTM Grain Size not coarser than 4 at 100 X',
      deviation:<FormDropdownItem name='deviationSec' placeholder='Select deviation' dropdownArray={deviationList} visibleField='value' valueField='key' onChange={handleSelectChange} required/>
    },
  ]);

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

  const microTestColumns = [
    {
      title: 'Test Parameter',
      dataIndex: 'testParameter',
      key: 'testParameter',
      align: 'center'
    },
    {
      title: 'Deviation',
      dataIndex: 'deviation',
      key: 'deviation',
      align: 'center',
    }
  ]

  return (
    <FormContainer>
      <SubHeader title="Weld Period Testing Details - Micro" link="/welding/testSample" />
      <GeneralInfo data={weldingTestGeneralInfo} />

      <FormBody initialValues={formData} onFinish={handleFormSubmit}>
        <div className="grid grid-cols-1 gap-x-2">
          <FormInputItem label='Machine Number' name='machineNumber' value={formData.machineNumber} onChange={handleChange} disabled/>
        </div>

        <Table columns={microTestColumns} dataSource={info} bordered pagination={false} />

        <Divider />

        <FormInputItem label='Remarks' name='remarks' value={formData.remarks} onChange={handleChange} required/>

        <div className='flex justify-center'>
          <Btn htmlType='submit' className='w-36'>Save</Btn>
        </div>
      </FormBody>
    </FormContainer>
  )
}

export default MicroTestDetails