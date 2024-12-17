import React,  { useState, useEffect, useCallback } from 'react';
import FormContainer from '../../../../../components/DKG_FormContainer'
import SubHeader from '../../../../../components/DKG_SubHeader'
import GeneralInfo from '../../../../../components/DKG_GeneralInfo'
import data from "../../../../../utils/frontSharedData/weldingInspection/WeldingInspection.json";
import FormBody from '../../../../../components/DKG_FormBody';
import { FilterFilled, EditOutlined, PlusOutlined } from '@ant-design/icons';
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';
import { Checkbox, Divider } from 'antd';
import { Table } from 'antd';
import IconBtn from '../../../../../components/DKG_IconBtn';
import { useNavigate } from "react-router-dom";
import Btn from '../../../../../components/DKG_Btn';
import FormInputItem from '../../../../../components/DKG_FormInputItem';

const { weldingInspectionGeneralInfo, railGradeDropdownList, railSectionList, weldNumberList, testDetailsColumns, testDetailsData, samplesDeclaredTableData, checkBoxItems, parameterStatusList } = data;

const WeldTestSample = () => {
    const [checkedValues, setCheckedValues] = useState([])
    const options = ['TLT', 'Hardness', 'Macro', 'Micro'];
    const [currentTablePage, setCurrentTablePage] = useState(1)
    const [tablePageSize, setTablePageSize] = useState(5)
    const navigate = useNavigate()
    const [showForm, setShowForm] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [formData, setFormData] = useState({
        railSection: '', railGrade: '', weldNumber: '', jointNumberForTLT: '', jointNumberForHardness: '', jointNumberForMicro: '', jointNumberForMacro: '', parameterStatus: ''
    })

    const handleChange = (fieldName, value) => {
        setFormData(prev => {
          return {
            ...prev,
            [fieldName]: value
          }
        })
    }

    const handleShowForm = () => {
        setShowForm(true);
    };

    const populateTableData = useCallback(() => {
        setTableData([...samplesDeclaredTableData]);
    }, []);

    useEffect(() => {
        populateTableData();
    }, [populateTableData]);

    const handleRowClick = (test) => {
        if(test === "TLT"){
            navigate('/welding/tltTestDetails')
        }else if(test === "Hardness"){
            navigate('/welding/hardnessTestDetails')
        }else if(test === "Micro"){
            navigate('/welding/microTestDetails')
        }else{
            navigate('/welding/macroTestDetails')
        }
    };

    const handlePageSizeChange = (value) => {
        setTablePageSize(value);
        setCurrentTablePage(1); // Reset to first page when page size changes
    };

    const handleFormSubmit = () => {
        setShowForm(false);
    }

    const columns = [
        {
          title: "Test",
          dataIndex: "test",
          key: "test",
          align: "center"
        },
        {
          title: "Joint Number",
          dataIndex: "jointNumber",
          key: "jointNumber",
          align: "center"
        },
        {
          title: "Date & Shift",
          dataIndex: "dateShift",
          key: "dateShift",
          align: "center"
        },
        {
          title: "Testing",
          align: "center",
          render: (_, record) => (
            <IconBtn
              icon={EditOutlined}
              onClick={() => handleRowClick(record.test)}
            />
          ),
        },
    ];

    const handleClick = () => {
        navigate('/welding/home')
    }

  return (
    <FormContainer>
        <SubHeader title="Weld Periodic Test Sample" link="/welding/home" />
        <GeneralInfo data={weldingInspectionGeneralInfo} />

        <FormBody initialValues={formData}>
            <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
                <div className='flex items-center gap-x-2'>
                    <FilterFilled />
                    <FormDropdownItem label='Rail Grade' name='railGrade' dropdownArray={railGradeDropdownList} valueField='key' visibleField='value' onChange={handleChange} className='w-full' />
                </div>

                <div className='flex items-center gap-x-2'>
                    <FilterFilled />         
                    <FormDropdownItem label ='Rail Section' name='railSection' dropdownArray={railSectionList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' />
                </div>
            </div>

            <div className='grid grid-cols-1'>
                <div className='flex items-center gap-x-2'>
                    <FilterFilled />         
                    <FormDropdownItem label ='Weld Machine Number' name='weldNumber' dropdownArray={weldNumberList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' />
                </div>
            </div>

            <Divider>Last Test Details</Divider>

            <Table 
                dataSource={testDetailsData} 
                columns={testDetailsColumns} 
                bordered
                scroll={{ x: true }}
                pagination={{
                pageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
                }}
            />

            <Divider>Samples Declared for Testing</Divider>

            <Table
                columns={columns}
                dataSource={tableData}
                scroll={{ x: true }}
                bordered
                pagination={{
                    current: currentTablePage,
                    pageSize: tablePageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "15", "20"],
                    onChange: (page) => setCurrentTablePage(page),
                    onShowSizeChange: (current, size) => handlePageSizeChange(size),
                }}
            />

            <IconBtn 
                icon={PlusOutlined} 
                text='Declare new Sample for Testing'
                onClick={handleShowForm}
            />

            {showForm && (
                <FormBody
                  initialValues={formData}
                  onFinish={handleFormSubmit}
                >
                    <div className="!bg-offWhite opacity-80 flex flex-col border p-2 border-gray-100 rounded-md mb-4 shadow-[4px_4px_4px_4px_rgba(0,0,0,0.1)]">
                        <div className='grid grid-cols-1'>
                            <Checkbox.Group
                                options={options}
                                value={checkedValues}
                                onChange={(checkedValues) => setCheckedValues(checkedValues)}
                                className='mb-4'
                            />
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-2'>
                            <FormDropdownItem label='Rail Grade' name='railGrade' dropdownArray={railGradeDropdownList} valueField='key' visibleField='value' onChange={handleChange} className='w-full' required />
                            <FormDropdownItem label ='Rail Section' name='railSection' dropdownArray={railSectionList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' required />
                        </div>

                        <div className='grid grid-cols-1'>         
                            <FormDropdownItem label ='Weld Machine Number' name='weldNumber' dropdownArray={weldNumberList} valueField='key' visibleField='value' onChange = {handleChange} className='w-full' required />
                        </div>

                        {checkedValues.includes('TLT') && (
                            <FormBody initialValues={formData}>
                                <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'> 
                                    <FormInputItem label='Sample Joint No. (TLT)' name='jointNumberForTLT' value={formData.jointNumberForTLT} onChange={handleChange} required/>     
                                    <FormDropdownItem label ='Parameter Status' name='parameterStatus' dropdownArray={parameterStatusList} valueField='key' visibleField='value' onChange = {handleChange} required />
                                </div>
                            </FormBody>
                        )}

                        {checkedValues.includes('Hardness') && (
                            <FormBody initialValues={formData}>
                                <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'> 
                                    <FormInputItem label='Sample Joint No. (Hardness)' name='jointNumberForHardness' value={formData.jointNumberForHardness} onChange={handleChange} required/>     
                                    <FormDropdownItem label ='Parameter Status' name='parameterStatus' dropdownArray={parameterStatusList} valueField='key' visibleField='value' onChange = {handleChange} required />
                                </div>
                            </FormBody>
                        )}

                        {checkedValues.includes('Micro') && (
                            <FormBody initialValues={formData}>
                                <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'> 
                                    <FormInputItem label='Sample Joint No. (Micro)' name='jointNumberForMicro' value={formData.jointNumberForMicro} onChange={handleChange} required/>     
                                    <FormDropdownItem label ='Parameter Status' name='parameterStatus' dropdownArray={parameterStatusList} valueField='key' visibleField='value' onChange = {handleChange} required />
                                </div>
                            </FormBody>
                        )}

                        {checkedValues.includes('Macro') && (
                            <FormBody initialValues={formData}>
                                <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'> 
                                    <FormInputItem label='Sample Joint No. (Macro)' name='jointNumberForMacro' value={formData.jointNumberForMacro} onChange={handleChange} required/>     
                                    <FormDropdownItem label ='Parameter Status' name='parameterStatus' dropdownArray={parameterStatusList} valueField='key' visibleField='value' onChange = {handleChange} required />
                                </div>
                            </FormBody>
                        )}

                        <div className='flex justify-center'>
                            <Btn htmlType='submit' className='w-36'>Save</Btn>
                        </div>
                    </div>
                </FormBody> 
            )}
            <div className='flex justify-center mt-6'>
                <Btn onClick={handleClick} className='w-36'>OK</Btn>
            </div>
        </FormBody>
    </FormContainer>
  )
}

export default WeldTestSample