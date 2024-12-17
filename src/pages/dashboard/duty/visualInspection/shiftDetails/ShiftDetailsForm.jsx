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

const { millMaping: sampleData, millsMaping: secSampleData, shiftList, railGradeList, railSectionList } = data;

const ShiftDetailsForm = () => {
    const [millDropdownList, setMillDropdownList] = useState([]);
    const [lineNumberDropdownList, setLineNumberDropdownList] = useState([]);
    const [stdRailLengthList, setStdRailLengthList] = useState([])
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: '', shift: '', mill: '', lineNumber: '', railGrade: '', railSection: '', stdRailLength: '', otherIE: '', otherIE2: '', otherIE3: '', rclIE: '', rclIE2: '', rclIE3: ''
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
        const lineNumberDropdownList = sampleData[formData.mill].map(mill => {
        return {
            key: mill,
            value: mill
        }
        })
        setLineNumberDropdownList([...lineNumberDropdownList])
    }
    }, [formData.mill, millDropdownList])

    const handleFormSubmit = () => {
        message.success("Form submission triggered.");
        navigate('/visual/home');
    };

    useEffect(()=>{
        if(secSampleData[formData.mill]){
          const stdRailLengthList = secSampleData[formData.mill].map(mill => {
            return {
              key: mill,
              value: mill
            }
          })
          setStdRailLengthList([...stdRailLengthList])
        }
    }, [formData.mill, millDropdownList])

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
        <SubHeader title="Visual Inspection - Shift Details" link="/" />

        <FormBody initialValues={formData} onFinish={handleFormSubmit}>
            <div className="grid grid-cols-2 gap-x-2">
                <CustomDatePicker label="Date" name="date" value={formData.date} onChange={handleChange} required />
                <FormDropdownItem label="Shift" name="shift" dropdownArray={shiftList} visibleField="value" valueField="key" onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-x-2">
                <FormDropdownItem label='Mill' name='mill' dropdownArray={millDropdownList} valueField={'key'} visibleField={'value'} onChange={handleChange} required />
                <FormDropdownItem label ='Line Number' name='lineNumber' dropdownArray={lineNumberDropdownList} valueField={'key'} visibleField={'value'} onChange = {handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-x-2">
                <FormDropdownItem label="Rail Grade" name='railGrade' dropdownArray={railGradeList} visibleField='value' valueField='key' onChange={handleChange} required/>
                <FormDropdownItem label="Rail Section" name='railSection' dropdownArray={railSectionList} visibleField='value' valueField='key' onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-x-2">
                <FormDropdownItem label="Std. offered Rail Length" name='stdRailLength' dropdownArray={stdRailLengthList} visibleField={'value'} valueField={'key'} onChange={handleChange} required />
                <SelectSearch label='Add Other RITES IE' placeholder='Search a IE' name='otherIE' value={formData.otherIE} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-x-2">
                <SelectSearch label='Add Other RITES IE (2)' name='otherIE2' value={formData.otherIE2} onChange={handleChange} />
                <SelectSearch label='Add Other RITES IE (3)' name='otherIE3' value={formData.otherIE3} onChange={handleChange} />
            </div>
            
            <div className="grid grid-cols-2 gap-x-2">
              <FormInputItem label='Add Name of RCL IE' name='rclIE' value={formData.rclIE} onChange={handleChange} required/>
              <FormInputItem label='Add Name of RCL IE (2)' name='rclIE2' value={formData.rclIE2} onChange={handleChange} required/>
            </div>

            <FormInputItem label='Add Name of RCL IE (3)' name='rclIE3' value={formData.rclIE3} onChange={handleChange}/>
            <Btn htmlType="submit" className="flex justify-center mx-auto">
                Start Duty
            </Btn>
        </FormBody>
    </FormContainer>
  )
}

export default ShiftDetailsForm