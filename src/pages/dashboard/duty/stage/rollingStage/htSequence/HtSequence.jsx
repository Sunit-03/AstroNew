import React, { useState, useCallback, useEffect } from "react";
import FormContainer from "../../../../../../components/DKG_FormContainer";
import SubHeader from "../../../../../../components/DKG_SubHeader";
import GeneralInfo from "../../../../../../components/DKG_GeneralInfo";
import data from "../../../../../../utils/frontSharedData/rollingStage/Stage.json";
import { Checkbox, Divider, Form, Modal, Table } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import IconBtn from "../../../../../../components/DKG_IconBtn";
import FormInputItem from "../../../../../../components/DKG_FormInputItem";
import Btn from "../../../../../../components/DKG_Btn";
import FormDropdownItem from "../../../../../../components/DKG_FormDropdownItem";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiCall, handleChange } from "../../../../../../utils/CommonFunctions";
import FormSearchItem from "../../../../../../components/DKG_FormSearchItem";

const { bloomQualityList, htStatusList } = data;

const HtSequence = () => {

  const handleRowClick = (record) => {
    setFormData({
      railId: record.railId,
      htStatus: record.htStatus,
      bloomQuality: record.bloomQuality,
      testMarked: record.testMarked
    })
  }

  const [form] = Form.useForm();
  const columns = [
    {
      title: "S.No.",
      dataIndex: "sNo",
      key: "sNo",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Rail ID",
      dataIndex: "railId",
      key: "railId",
    },
    {
      title: "Bloom Quality",
      dataIndex: "bloomQuality",
      key: "bloomQuality",
    },
    {
      title: "HT Status",
      dataIndex: "htStatus",
      key: "htStatus",
      render: (htStatus) => (htStatus ? "OK" : "NOT OK"),
    },
    {
      title: "Test Sample Marked",
      dataIndex: "testMarked",
      key: "testMarked",
      render: (testMarked) => testMarked.join(", "),
    },
    {
      title: "Actions",
      fixed: "right",
      render: (_, record) => (
        <IconBtn
          icon={EditOutlined}
          onClick={() => handleRowClick(record)}
        />
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const rollingGeneralInfo = useSelector((state) => state.rollingDuty);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);
  const [formData, setFormData] = useState({
    railId: null,
    bloomQuality: null,
    htStatus: null,
    htStatusDesc: null,
    testSampleMarked: null,
  });

  const [tableData, setTableData] = useState([]);

  const populateData = useCallback(async () => {
    try {
      const { data } = await apiCall(
        "GET",
        "/rolling/htSequence/getOpenBatchDtls",
        token
      );
      setTableData(data.responseData?.railIdDtlList || []);
    } catch (error) {}
  }, [token]);

  const handleHtStatusChange = (_, value) => {
    setFormData((prev) => ({
      ...prev,
      htStatus: value,
      htStatusDesc: value ? "OK" : "NOT OK",
    }));
  };

  const addData = async () => {
    const payload = {
      dutyId: rollingGeneralInfo.dutyId,
      railId: formData.railId,
      htStatus: formData.htStatus,
      bloomQuality: formData.bloomQuality,
    };
    try {
      await apiCall("POST", "/rolling/testing/saveRailDtls", token, payload);
      populateData();
    } catch (error) {}
  };

  const handleRailIdSearch = async () => {
    try {
      const { data } = await apiCall(
        "GET",
        `/rolling/htSequence/getRailIdMarkedTests?railId=${formData.railId}`,
        token
      );
      setFormData((prev) => ({
        ...prev,
        testSampleMarked: data?.responseData?.markedTests,
      }));
    } catch (error) {}
  };

  const saveHtSequence = async () => {
    if (checked) {
      try {
        await apiCall("POST", "rolling/htSequence/saveBatch", {
          dutyId: rollingGeneralInfo.dutyId,
        });
      } catch (error) {}
    }

    navigate("/stage/home")
  };

  useEffect(() => {
    populateData();
  }, [populateData]);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [form, formData]);

  return (
    <FormContainer>
      <SubHeader title="HT Sequence" link="/stage/home" />
      <GeneralInfo data={rollingGeneralInfo} />

      <Divider className="mt-0 mb-0" />

      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      >
        New rail heat marked
      </Checkbox>

      <div className="relative">
        <Table dataSource={tableData} columns={columns} />
        <IconBtn
          icon={PlusOutlined}
          text="add new rail"
          className="absolute left-0 bottom-16"
          onClick={() => setIsModalOpen(true)}
        />
        <Btn onClick={saveHtSequence} className="flex mx-auto"> Save </Btn>
      </div>
      <Modal
        open={isModalOpen}
        title="Add a new Rail"
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          initialValues={formData}
          layout="vertical"
          onFinish={addData}
        >
          <FormSearchItem
            label="Rail ID"
            name="railId"
            onSearch={handleRailIdSearch}
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
            required
          />

          <FormInputItem
            label="Test Sample Marked"
            name="testSampleMarked"
            onChange={(name, value) => handleChange(name, value, setFormData)}
            required
            disabled
          />

          <FormDropdownItem
            label="Bloom Quality"
            name="bloomQuality"
            formField="bloomQuality"
            dropdownArray={bloomQualityList}
            valueField="key"
            visibleField="value"
            onChange={(name, value) => handleChange(name, value, setFormData)}
            required
          />
          <FormDropdownItem
            label="HT Status"
            name="htStatusDesc"
            formField="htStatus"
            dropdownArray={htStatusList}
            valueField="key"
            visibleField="value"
            onChange={handleHtStatusChange}
            required
          />
          <Btn htmlType="submit" className="flex mx-auto">
            {" "}
            Save{" "}
          </Btn>
        </Form>
      </Modal>
    </FormContainer>
  );
};

export default HtSequence;
