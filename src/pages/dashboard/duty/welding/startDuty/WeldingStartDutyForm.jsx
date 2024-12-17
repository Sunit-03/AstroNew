import React, { useEffect, useState } from "react";
import SubHeader from "../../../../../components/DKG_SubHeader";
import data from "../../../../../utils/frontSharedData/VisualInspection/VI.json";
import FormBody from "../../../../../components/DKG_FormBody";
import { message } from "antd";
import CustomDatePicker from "../../../../../components/DKG_CustomDatePicker";
import FormInputItem from "../../../../../components/DKG_FormInputItem";
import FormDropdownItem from "../../../../../components/DKG_FormDropdownItem";
import Btn from "../../../../../components/DKG_Btn";
import FormContainer from "../../../../../components/DKG_FormContainer";
import { useNavigate } from 'react-router-dom'
import SelectSearch from "../../../../../components/DKG_SelectSearch";

const { millMapingTer: sampleData, shiftList, railGradeList, railSectionList } = data;

const WeldingStartDutyForm = () => {
    const [millDropdownList, setMillDropdownList] = useState([]);
    const [weldingLineDropdownList, setWeldingLineDropdownList] = useState([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: '', shift: '', mill: '', weldingLine: '', railGrade: '', railSection: ''
    });

    const populateData = () => {
        const millDropdownList = Object.keys(sampleData).map( mill => {
          return {
            key: mill,
            value: mill
          }
        })
        setMillDropdownList([...millDropdownList])
    }

    useEffect(()=> {
        populateData()
    }, [])
    
    useEffect(()=>{
    if(sampleData[formData.mill]){
        const weldingLineDropdownList = sampleData[formData.mill].map(mill => {
        return {
            key: mill,
            value: mill
        }
        })
        setWeldingLineDropdownList([...weldingLineDropdownList])
    }
    }, [formData.mill, millDropdownList])

    const handleFormSubmit = () => {
        message.success("Form submission triggered.");
        navigate('/welding/home');
    };

    const handleChange = (fieldName, value) => {
        setFormData((prev) => {
          return {
            ...prev,
            [fieldName]: value,
          };
        });
    };

  return (
    <FormContainer>
        <SubHeader title="Welding Inspection - Shift Details" link="/" />

        <FormBody initialValues={formData} onFinish={handleFormSubmit}>
            <div className="grid grid-cols-2 gap-x-2">
                <CustomDatePicker label="Date" name="date" value={formData.date} onChange={handleChange} required />
                <FormDropdownItem label="Shift" name="shift" dropdownArray={shiftList} visibleField="value" valueField="key" onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-x-2">
                <FormDropdownItem label='Mill' name='mill' dropdownArray={millDropdownList} valueField={'key'} visibleField={'value'} onChange={handleChange} required />
                <FormDropdownItem label ='Welding Line' name='weldingLine' dropdownArray={weldingLineDropdownList} valueField={'key'} visibleField={'value'} onChange = {handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-x-2">
                <FormDropdownItem label="Rail Grade" name='railGrade' dropdownArray={railGradeList} visibleField='value' valueField='key' onChange={handleChange} required/>
                <FormDropdownItem label="Rail Section" name='railSection' dropdownArray={railSectionList} visibleField='value' valueField='key' onChange={handleChange} required />
            </div>

            <Btn htmlType="submit" className="flex justify-center mx-auto mt-2">
                Start Duty
            </Btn>
        </FormBody>
    </FormContainer>
  )
}

export default WeldingStartDutyForm