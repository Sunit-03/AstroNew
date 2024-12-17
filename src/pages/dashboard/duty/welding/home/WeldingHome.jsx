import React, { useState } from "react";
import SubHeader from "../../../../../components/DKG_SubHeader";
import FormContainer from "../../../../../components/DKG_FormContainer";
import GeneralInfo from "../../../../../components/DKG_GeneralInfo";
import data from "../../../../../utils/frontSharedData/weldingInspection/WeldingInspection.json";
import TabList from "../../../../../components/DKG_TabList";
import weldingHomeTabs from '../../../../../utils/frontSharedData/weldingInspection/WeldingHome';
import { message, Divider, Table } from 'antd';
import FormBody from "../../../../../components/DKG_FormBody";
import FormInputItem from "../../../../../components/DKG_FormInputItem";
import Btn from "../../../../../components/DKG_Btn";
import { useNavigate } from 'react-router-dom'

const { weldingInspectionGeneralInfo, weldingData, weldingColumns } = data;

const WeldingHome = () => {
    const navigate = useNavigate();
    const [remarks, setRemarks] = useState('')
    const [info, setInfo] = useState([
      {
        key: '1',
        null: 'Head',
      },
      {
        key: '2',
        null: 'Foot',
      }
    ]);

    const handleFormSubmit = () => {
        message.success("Duty End Called")
        setInfo([...info]);
        navigate('/')
    }

    const weldDataColumns = [
      {
        title: '',
        dataIndex: 'null',
        key: 'null',
        align: 'center',
        fixed: 'left'
      },
      {
        title: 'Machine S.No.',
        dataIndex: 'machineSNo',
        key: 'machineSNo',
        align: 'center',
        render: (text, record) => (
          <FormInputItem placeholder='Machine S.No.' required/>
        )
      },
      {
        title: 'Probe Details',
        dataIndex: 'probeDetails',
        key: 'probeDetails',
        align: 'center',
        render: (text, record) => (
          <FormInputItem placeholder='Probe Details' required/>
        )
      },
      {
        title: 'Probe DB',
        dataIndex: 'probeDB',
        key: 'probeDB',
        align: 'center',
        render: (text, record) => (
          <FormInputItem placeholder='Probe DB' required/>
        )
      },
      {
        title: 'Remarks',
        dataIndex: 'remarks',
        key: 'remarks',
        align: 'center',
        fixed: 'right',
        render: (text, record) => (
          <FormInputItem placeholder='Remarks' required/>
        )
      },
    ]

  return (
    <FormContainer>
        <SubHeader title="Welding - Home" link="/" />
        <GeneralInfo data={weldingInspectionGeneralInfo} />

        <section className='mt-4'>
          <Table
            dataSource={weldingData}
            columns={weldingColumns}
            scroll={{ x: true }}
            bordered
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
            }}
          />
        </section>

        <Divider className="mt-0 mb-0" />

        <section className="mt-6">
            <TabList tabList={weldingHomeTabs} />
        </section>

        <Divider className="mb-0" />

        <section>
          <h2 className="font-bold">No. of Joints  welded in previous Shift after Weld Test (BSP4): <span className="font-normal text-red-500">come from database</span></h2>
          <h2 className="font-bold">No. of Joints  welded in previous shift after Weld Test (BSP1): <span className="font-normal text-red-500">come from database</span></h2>
          <h2 className="font-bold">No. of Joints  welded in this previous shift after Weld Test (BSP2): <span className="font-normal text-red-500">come from database</span></h2>
        </section>

        <Divider className="mb-2 mt-0" />

        <Table 
          columns={weldDataColumns}
          dataSource={info}
          bordered
          scroll={{x: true}}
          pagination={false}
        />

        <FormBody initialValues={remarks} onFinish={handleFormSubmit}>
            
          <Divider className="mt-0" />

          <FormInputItem placeholder='Enter Remarks' onChange={(_, value) => setRemarks(value)} name='remarks' required/>

          <div className='flex justify-center'>
              <Btn htmlType='submit' className='w-36'>End Duty</Btn>
          </div>
        </FormBody>
    </FormContainer>
  )
}

export default WeldingHome