import React, { useState } from "react";
import SubHeader from "../../../../../components/DKG_SubHeader";
import FormContainer from "../../../../../components/DKG_FormContainer";
import GeneralInfo from "../../../../../components/DKG_GeneralInfo";
import data from "../../../../../utils/frontSharedData/ndt/ndt.json";
import TabList from "../../../../../components/DKG_TabList";
import ndtHomeTabs from '../../../../../utils/frontSharedData/ndt/ndtHome';
import { message, Divider } from 'antd';
import FormBody from "../../../../../components/DKG_FormBody";
import FormInputItem from "../../../../../components/DKG_FormInputItem";
import Btn from "../../../../../components/DKG_Btn";
import { useNavigate } from 'react-router-dom'

const { ndtGeneralInfo } = data;

const Home = () => {
    const navigate = useNavigate();
    const [remarks, setRemarks] = useState('')

    const handleFormSubmit = () => {
        message.success("Duty End Called")
        navigate('/')
    }

  return (
    <FormContainer>
        <SubHeader title="NDT - Home" link="/" />
        <GeneralInfo data={ndtGeneralInfo} />

        <section className="mt-6">
            <TabList tabList={ndtHomeTabs} />
        </section>

        <Divider className="mt-2 mb-0" />

        <FormBody initialValues={remarks} onFinish={handleFormSubmit}>            
            <FormInputItem placeholder='Enter Remarks' onChange={(_, value) => setRemarks(value)} name='remarks' required/>

            <div className='flex justify-center'>
                <Btn htmlType='submit' className='w-36'>End Duty</Btn>
            </div>
        </FormBody>
    </FormContainer>
  )
}

export default Home