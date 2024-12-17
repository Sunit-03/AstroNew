import React, { useState, useEffect, useCallback } from 'react'
import FormContainer from '../../../../../components/DKG_FormContainer';
import SubHeader from '../../../../../components/DKG_SubHeader';
import GeneralInfo from '../../../../../components/DKG_GeneralInfo';
import data from "../../../../../utils/frontSharedData/weldingInspection/WeldingInspection.json";
import FormBody from '../../../../../components/DKG_FormBody';
import { FilterFilled, EditOutlined } from '@ant-design/icons';
import FormDropdownItem from '../../../../../components/DKG_FormDropdownItem';
import { Checkbox, Table, message } from 'antd';
import Search from "../../../../../components/DKG_Search"
import CustomDatePicker from '../../../../../components/DKG_CustomDatePicker';
import moment from 'moment'
import { Divider } from 'antd';
import IconBtn from '../../../../../components/DKG_IconBtn';
import { useNavigate } from "react-router-dom";
import Btn from '../../../../../components/DKG_Btn';

const { weldingInspectionGeneralInfo, railGradeDropdownList, railSectionList, heldRejectedPanelTableData } = data;

const checkBoxItems = [
  { "key": 1, "value": "Held" },
  { "key": 2, "value": "Rejected" },
  { "key": 3, "value": "Refinish" }
]

const HeldRejectedPanel = () => {
  const navigate = useNavigate()
  const [tableData, setTableData] = useState([]);
  const [weldStartDate, setWeldStartDate] = useState('')
  const [weldEndDate, setWeldEndDate] = useState('')
  const [checkedValues, setCheckedValues] = useState([])
  const [currentTablePage, setCurrentTablePage] = useState(1)
  const [tablePageSize, setTablePageSize] = useState(5)
  const [formData, setFormData] = useState({
    railSection: '', railGrade: ''
  })

  const populateTableData = useCallback(() => {
    setTableData([...heldRejectedPanelTableData]);
  }, []);

  useEffect(() => {
    populateTableData();
  }, [populateTableData]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => {
      return {
        ...prev,
        [fieldName]: value
      }
    })
  }

  const handlePageSizeChange = (value) => {
    setTablePageSize(value);
    setCurrentTablePage(1); // Reset to first page when page size changes
  };

  const handleRowClick = (heatNo) => {
    message.success(heatNo);
    navigate('/welding/newWeldInspection')
  };

  const handleClick = () => {
    navigate('/welding/home')
  };

  const columns = [
    {
      title: "Date of Inspection",
      dataIndex: "dateInspection",
      key: "dateInspection",
      align: "center"
    },
    {
      title: "Shift",
      dataIndex: "shift",
      key: "shift",
      align: "center"
    },
    {
      title: "Panel ID",
      dataIndex: "panelID",
      key: "panelID",
      align: "center"
    },
    {
      title: "Rail ID1",
      dataIndex: "railID1",
      key: "railID1",
      align: "center"
    },
    {
      title: "Rail ID2",
      dataIndex: "railID2",
      key: "railID2",
      align: "center"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center"
    },
    {
      title: "Edit",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <IconBtn
          icon={EditOutlined}
          onClick={() => handleRowClick(record.heatNo)}
        />
      ),
    },
  ];

  const handleWeldEndChange = (_, value) => {
    const date = moment(value, 'DD/MM/YYYY', true);
    if (!date.isValid()) {
      throw new Error('Invalid date format. Please use DD/MM/YYYY.');
    }
    const oneMonthBefore = date.subtract(1, 'months');
    const formattedValue = oneMonthBefore.format('DD/MM/YYYY');
    setWeldStartDate(formattedValue)
    setWeldEndDate(value)
  }

  return (
    <FormContainer>
      <SubHeader title="Held or Rejected Weld Panel Inspection" link="/welding/home" />
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

        <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <Checkbox.Group
              options={checkBoxItems.map(item => ({key: item.key, label: item.value, value: item.key }))}
              value={checkedValues}
              onChange={(checkedValues) => setCheckedValues(checkedValues)}
            />
          </div>

          <div className='mt-6 sm:mt-2'>
            <Search placeholder='Search by Panel ID or Joint no.' className='w-full' />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-x-2 mt-6'>
          <h1 className='font-semibold sm:mt-4'>Weld Joint Inspection Date: </h1>
          <CustomDatePicker label='From' name='weldStartDate' value={weldStartDate} onChange={handleWeldEndChange} />
          <CustomDatePicker label='To' name='weldEndDate' value={weldEndDate} />
        </div>

        <Divider className='mt-0 mb-4' />

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
      </FormBody>

      <div className='flex justify-center'>
        <Btn onClick={handleClick}>OK</Btn>
      </div>
    </FormContainer>
  )
}

export default HeldRejectedPanel