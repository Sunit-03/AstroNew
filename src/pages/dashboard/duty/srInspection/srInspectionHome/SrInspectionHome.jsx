import React, { useState } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer';
import SubHeader from '../../../../../components/DKG_SubHeader';
import data from "../../../../../utils/frontSharedData/srInspection/srInspection.json";
import GeneralInfo from '../../../../../components/DKG_GeneralInfo';
import { Divider, Table } from 'antd';
import TabList from "../../../../../components/DKG_TabList";
import SrInspectionHomeTabs from "../../../../../utils/frontSharedData/srInspection/srInspection"
import FormBody from '../../../../../components/DKG_FormBody';
import FormInputItem from '../../../../../components/DKG_FormInputItem';
import { useNavigate } from 'react-router-dom'
import Btn from '../../../../../components/DKG_Btn';

const { srInspectionGeneralInfo, shortRailColumns, shortRailData } = data;

const SrInspectionHome = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    {
      remarks: ''
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
    navigate('/')
  }

  return (
    <FormContainer>
      <SubHeader title='Short Rail Inspection - Home' link='/' />
      <GeneralInfo data={srInspectionGeneralInfo} />

      <section className='mt-6'>
        <Table
          dataSource={shortRailData}
          columns={shortRailColumns}
          scroll={{ x: true }}
          bordered
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
          }}
        />
      </section>

      <Divider className='mt-0 mb-0' />

      <section className="mt-6">
        <TabList tabList={SrInspectionHomeTabs} />
      </section>

      <FormBody initialValues={formData} onFinish={handleFormSubmit} >
        <FormInputItem label='Shift Remarks by GL' name='remarks' value={formData.remarks} onChange={handleChange} required/>

        <div className='flex justify-center'>
          <Btn htmlType='submit' className='w-36'>SAVE</Btn>
        </div>
      </FormBody>
    </FormContainer>
  )
}

export default SrInspectionHome