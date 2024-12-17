import React from 'react'
import SubHeader from '../../../../../components/DKG_SubHeader'
import { Divider } from 'antd';
import { Table } from "antd";
import GeneralInfo from "../../../../../components/DKG_GeneralInfo";
import data from "../../../../../utils/frontSharedData/ndt/ndt.json";
import { useNavigate } from 'react-router-dom'
import Btn from '../../../../../components/DKG_Btn';
import FormContainer from '../../../../../components/DKG_FormContainer';

const { ndtRailWiseData: sampleData, columns, ndtGeneralInfo } = data;

const NReport = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/ndt/home')
  }

  return (
    <FormContainer>
        <SubHeader title='NDT - Report' link='/ndt/home' />
        <GeneralInfo data={ndtGeneralInfo} />

        <Divider>Rail Wise Record</Divider>

        <Table
            dataSource={sampleData}
            columns={columns}
            scroll={{ x: true }}
            pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30"],
            }}
        />

        <div className='flex justify-center mt-4'>
            <Btn onClick={handleClick}>NDT Home</Btn>
        </div>
    </FormContainer>
  )
}

export default NReport