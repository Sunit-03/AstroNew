import React, { useEffect, useState } from "react";
import SubHeader from "../../../../../../components/DKG_SubHeader";
import FormContainer from "../../../../../../components/DKG_FormContainer";
import GeneralInfo from "../../../../../../components/DKG_GeneralInfo";
import TabList from "../../../../../../components/DKG_TabList";
import stageHomeTabs from "../../../../../../utils/frontSharedData/rollingStage/StageHome";
import { Divider } from 'antd';
import FormBody from "../../../../../../components/DKG_FormBody";
import FormInputItem from "../../../../../../components/DKG_FormInputItem";
import Btn from "../../../../../../components/DKG_Btn";
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { endRollingDuty } from "../../../../../../store/slice/rollingDutySlice";
import { ExperimentOutlined }from '@ant-design/icons';


const Home = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({shiftRemarks: null});
    const dispatch = useDispatch();

    const handleFormSubmit = async () => {
        await dispatch(endRollingDuty(formData)).unwrap();
        navigate('/')
    }

    const[generalInfo, setGeneralInfo] = useState(null);

    const rollingGeneralInfo = useSelector(state => state.rollingDuty);

    const testSampleMarkingTab = {
        title: 'Testing Sample Marking',
        icon: <ExperimentOutlined />,
        link: "/stage/testSampleMarkingList",
        state: {
            state: {
                module: 'rolling',
                dutyId: rollingGeneralInfo.dutyId,
                generalInfo: rollingGeneralInfo
            }
        }
    }


    useEffect(() => {
        setGeneralInfo(rollingGeneralInfo)
    }, [rollingGeneralInfo])

  return (
    <FormContainer>
        <SubHeader title="Stage - Home" link="/" />
        <GeneralInfo data={rollingGeneralInfo} />

        <section className="mt-6">
            <TabList tabList={[...stageHomeTabs, testSampleMarkingTab]} />
        </section>

        <Divider className="mt-6 mb-1" />

        <FormBody initialValues={formData} onFinish={handleFormSubmit}>
            <FormInputItem placeholder='Enter Remarks' onChange={(_, value) => setFormData({shiftRemarks: value})} name='shiftRemarks' required/>
            <div className='flex justify-center'>
                <Btn htmlType='submit' className='w-36'>End Duty</Btn>
            </div>
        </FormBody>
    </FormContainer>
  )
}

export default Home