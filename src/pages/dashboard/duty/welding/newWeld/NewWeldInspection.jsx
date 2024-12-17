import React, { useState } from 'react'
import SubHeader from "../../../../../components/DKG_SubHeader";
import FormContainer from "../../../../../components/DKG_FormContainer";
import GeneralInfo from "../../../../../components/DKG_GeneralInfo";
import data from "../../../../../utils/frontSharedData/weldingInspection/WeldingInspection.json";
import FormBody from '../../../../../components/DKG_FormBody';
import { Divider, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom'
import FormInputItem from '../../../../../components/DKG_FormInputItem';
import FormInputNumberItem from '../../../../../components/DKG_FormInputNumberItem'
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';
import Btn from '../../../../../components/DKG_Btn';

const { weldingInspectionGeneralInfo, weldParameterDropdownList, reasonDimensionDropdownList, reasonUSFDDropdownList, resultDropdownList, weldResultList, reasonForNotOkList, panelLengthDropdownList, panelDecisionDropdownList } = data;

const NewWeldInspection = () => {
  const navigate = useNavigate();
  const [numberJoints, setNumberJoints] = useState(0);
  const [info, setInfo] = useState([
    {
      key: '1',
      end: 'Front',
    },
    {
      key: '2',
      end: 'Back',
    }
  ]);

  const [formData, setFormData] = useState({
    panelID: '', weldParameter: '', visual: '', marking: '', dimension: '', reasonDimension: '', reasonUSFD: '', weldOperator: '', usfdOperator: '', result: '', remarks: '', railID: '', weldResult: '', reasonForNotOk: '', panelRemarks: ''
  });

  const handleFormSubmit = () => {
    message.success("Form submission triggered.");
    navigate('/welding/home')
  };
  
  const handleChange = (fieldName, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handleSelectChange = (value, key) => {
    const updatedData = info.map((row) => {
      if (row.key === key) {
        return { ...row, weldResult: value, reasonForNotOk: value, remarks: value };
      }
      return row;
    });
    setInfo(updatedData);
  };

  const weldTableColumns = [
    {
      title: 'End',
      dataIndex: 'end',
      key: 'end',
      align: 'center',
      fixed: 'left'
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      align: 'center',
      render: (text, record) => (
        <FormDropdownItem name='weldResult' value={formData.weldResult} onChange={handleSelectChange} dropdownArray={weldResultList} valueField='key' visibleField='value' required/> 
      )
    },
    {
      title: 'Reason for Not OK',
      dataIndex: 'reasonForNotOk',
      key: 'reasonForNotOk',
      align: 'center',
      render: (text, record) => (
        <FormDropdownItem name='reasonForNotOk' value={formData.reasonForNotOk} onChange={handleSelectChange} dropdownArray={reasonForNotOkList} valueField='key' visibleField='value' required/>
      )
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <FormInputItem placeholder='Remarks' name='remarks' value={formData.remarks} required/>
      )
    },
  ]

  return (
    <FormContainer>
      <SubHeader title="New Weld Joint Inspection" link="/welding/home" />
      <GeneralInfo data={weldingInspectionGeneralInfo} />

      <FormBody initialValues={formData} onFinish={handleFormSubmit}>
        <div className="grid grid-cols-2 gap-x-2">
          <FormInputItem label='Panel ID' name='panelID' value={formData.panelID} onChange={handleChange} required />
          <FormInputNumberItem label='No. of Joints' name='numberJoints' value={numberJoints} onChange={setNumberJoints} min='1' max='19' required />
        </div>

        {Array.from({ length: numberJoints }, (_, index) => (
          <div key={index} className="!bg-offWhite opacity-80 flex flex-col border p-2 border-gray-100 rounded-md mt-4 mb-4 shadow-[4px_4px_4px_4px_rgba(0,0,0,0.1)]">
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                <FormInputItem label='Joint No.' value={formData.sampleType} onChange={handleChange} valueField='key' visibleField='value' disabled required/>
                <FormDropdownItem label='Weld Parameters' name='weldParameter' value={formData.weldParameter} dropdownArray={weldParameterDropdownList} onChange={handleChange} valueField='key' visibleField='value' required/> 
            </div>

            {formData.weldParameter === 'Not OK' && (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                  <FormDropdownItem label='Visual' name='visual' value={formData.visual} dropdownArray={weldParameterDropdownList} onChange={handleChange} valueField='key' visibleField='value'/>
                  <FormDropdownItem label='Marking' name='marking' value={formData.marking} dropdownArray={weldParameterDropdownList} onChange={handleChange} valueField='key' visibleField='value'/> 
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                  <FormDropdownItem label='Dimension' name='dimension' value={formData.dimension} dropdownArray={weldParameterDropdownList} onChange={handleChange} valueField='key' visibleField='value'/>
                  {formData.dimension === 'Not OK' && (
                    <FormDropdownItem label='Reason of Dimension for Not OK' name='reasonDimension' value={formData.reasonDimension} dropdownArray={reasonDimensionDropdownList} onChange={handleChange} valueField='key' visibleField='value'/> 
                  )} 
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                  <FormDropdownItem label='USFD' name='usfd' value={formData.usfd} dropdownArray={weldParameterDropdownList} onChange={handleChange} valueField='key' visibleField='value'/>
                  {formData.usfd === 'Not OK' && (
                    <FormDropdownItem label='Reason of USFD for Not OK' name='reasonUSFD' value={formData.reasonUSFD} dropdownArray={reasonUSFDDropdownList} onChange={handleChange} valueField='key' visibleField='value'/> 
                  )} 
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                  <FormInputItem label='Weld Operator' name='weldOperator' value={formData.weldOperator} onChange={handleChange} valueField='key' visibleField='value' disabled/>
                  <FormInputItem label='USFD Operator' name='usfdOperator' value={formData.usfdOperator} onChange={handleChange} valueField='key' visibleField='value' disabled/>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                  <FormDropdownItem label='Result' name='result' value={formData.result} dropdownArray={resultDropdownList} onChange={handleChange} valueField='key' visibleField='value'/> 
                  <FormInputItem label='Remarks' name='remarks' value={formData.remarks} onChange={handleChange} valueField='key' visibleField='value'/>
                </div>
              </>
            )}

            {formData.weldParameter === 'OK' && (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                  <FormDropdownItem label='Visual' name='visual' value={formData.visual} dropdownArray={weldParameterDropdownList} onChange={handleChange} valueField='key' visibleField='value' required/>
                  <FormDropdownItem label='Marking' name='marking' value={formData.marking} dropdownArray={weldParameterDropdownList} onChange={handleChange} valueField='key' visibleField='value' required/> 
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                  <FormDropdownItem label='Dimension' name='dimension' value={formData.dimension} dropdownArray={weldParameterDropdownList} onChange={handleChange} valueField='key' visibleField='value' required/>
                  {formData.dimension === 'Not OK' && (
                    <FormDropdownItem label='Reason of Dimension for Not OK' name='reasonDimension' value={formData.reasonDimension} dropdownArray={reasonDimensionDropdownList} onChange={handleChange} valueField='key' visibleField='value' required/> 
                  )} 
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                  <FormDropdownItem label='USFD' name='usfd' value={formData.usfd} dropdownArray={weldParameterDropdownList} onChange={handleChange} valueField='key' visibleField='value' required/>
                  {formData.usfd === 'Not OK' && (
                    <FormDropdownItem label='Reason of USFD for Not OK' name='reasonUSFD' value={formData.reasonUSFD} dropdownArray={reasonUSFDDropdownList} onChange={handleChange} valueField='key' visibleField='value' required/> 
                  )} 
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                  <FormInputItem label='Weld Operator' name='weldOperator' value={formData.weldOperator} onChange={handleChange} valueField='key' visibleField='value' disabled/>
                  <FormInputItem label='USFD Operator' name='usfdOperator' value={formData.usfdOperator} onChange={handleChange} valueField='key' visibleField='value' disabled/>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                  <FormDropdownItem label='Result' name='result' value={formData.result} dropdownArray={resultDropdownList} onChange={handleChange} valueField='key' visibleField='value' required/> 
                  <FormInputItem label='Remarks' name='remarks' value={formData.remarks} onChange={handleChange} valueField='key' visibleField='value' required/>
                </div>
              </>
            )}
          </div>
        ))}

        <div className="!bg-offWhite opacity-80 flex flex-col border p-2 border-gray-100 rounded-md mt-4 mb-4 shadow-[4px_4px_4px_4px_rgba(0,0,0,0.1)]">
          {Array.from({ length: numberJoints + 1 }, (_, index) => (
            <div className='grid grid-cols-1'>
              <FormInputItem label='Rail ID' name='railID' value={formData.railID} onChange={handleChange} valueField='key' visibleField='value' required/>
            </div>
          ))}
        </div>

        <Divider />

        <Table
          columns={weldTableColumns}
          dataSource={info}
          bordered 
          scroll={{x: true}}
          pagination={false}
        />

        <Divider />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
          <FormDropdownItem label='Panel Length (m)' name='panelLength' value={formData.panelLength} dropdownArray={panelLengthDropdownList} onChange={handleChange} valueField='key' visibleField='value' required/>
          <FormDropdownItem label='Panel Decision' name='panelDecision' value={formData.panelDecision} dropdownArray={panelDecisionDropdownList} onChange={handleChange} valueField='key' visibleField='value' required/> 
        </div>

        <FormInputItem label='Panel Remarks' name='panelRemarks' value={formData.panelRemarks} onChange={handleChange} valueField='key' visibleField='value' required/>

        <div className='flex justify-center mt-8'>
          <Btn htmlType='submit' className='w-[25%]'>Go Home & Save</Btn>
        </div>
      </FormBody>
    </FormContainer>
  )
}

export default NewWeldInspection