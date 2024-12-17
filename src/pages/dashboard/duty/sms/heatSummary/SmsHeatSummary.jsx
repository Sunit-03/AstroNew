import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Form, message, Modal, Table } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import SubHeader from "../../../../../components/DKG_SubHeader";
import GeneralInfo from "../../../../../components/DKG_GeneralInfo";
import IconBtn from "../../../../../components/DKG_IconBtn";
import FormInputItem from "../../../../../components/DKG_FormInputItem";
import Btn from "../../../../../components/DKG_Btn";
import FormContainer from "../../../../../components/DKG_FormContainer";
import { apiCall, checkAndConvertToFLoat, handleChange } from "../../../../../utils/CommonFunctions";
import { useSelector } from "react-redux";

const SmsHeatSummary = () => {
  const [newHeat, setNewHeat] = useState({
    heatNo: "",
    turnDownTemp: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(5);

  const smsGeneralInfo = useSelector((state) => state.smsDuty);
  const { token } = useSelector((state) => state.auth);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    heatDtlList: [
      // {
      //   heatNo: "H12345",
      //   sequenceNo: null,
      //   heatRemark: null,
      //   isDiverted: false,
      //   hydris: null,
      //   heatStage: "Converter"
      // }
    ],
    hydrisClb: null,
    lecoClbList: null,
    makeOfCastingPowder: null,
    makeOfHydrisProbe: null,
    amlcFunctioning: false,
    emsFunctioning: false,
    hydrogenMeasurementAutomatic: false,
    ladleToTundishUsed: false,
    slagDetectorFunctioning: false,
    tundishToMouldUsed: false,
  });

  const populateTableData = useCallback(async () => {
    try {
      const { data } = await apiCall(
        "GET",
        `/sms/getShiftSummaryDtls?dutyId=${smsGeneralInfo.dutyId}`,
        token
      );
      const { responseData } = data;

      setFormData({
        hydrisClb: responseData?.hydrisClb,
        lecoClbList: responseData?.lecoClbList,
        makeOfCastingPowder: responseData?.makeOfCastingPowder,
        makeOfHydrisProbe: responseData?.makeOfHydrisProbe,
        amlcFunctioning: responseData?.amlcFunctioning,
        emsFunctioning: responseData?.emsFunctioning,
        hydrogenMeasurementAutomatic:
          responseData?.hydrogenMeasurementAutomatic,
        ladleToTundishUsed: responseData?.ladleToTundishUsed,
        slagDetectorFunctioning: responseData?.slagDetectorFunctioning,
        tundishToMouldUsed: responseData?.tundishToMouldUsed,
        heatDtlList: responseData?.heatDtlList,
      });
    } catch (error) {}
  }, [smsGeneralInfo.dutyId, token]);

  const columns = [
    {
      title: "S/No",
      dataIndex: "sNo",
      key: "sNo",
      render: (_, __, index) => index + 1, // Adding 1 to the index to start from 1
    },
    {
      title: "Heat No.",
      dataIndex: "heatNo",
      key: "heatNo",
      fixed: "left",
    },
    {
      title: "Sequence No.",
      dataIndex: "sequenceNo",
      key: "sequenceNo",
    },
    {
      title: "H2",
      dataIndex: "hydris",
      key: "h2",
    },
    {
      title: "Stage",
      dataIndex: "heatStage",
      key: "stage",
    },
    {
      title: "Heat Remark",
      dataIndex: "heatRemark",
      key: "heatRemark",
    },
    {
      title: "Actions",
      fixed: "right",
      render: (_, record) => (
        <IconBtn
          icon={EditOutlined}
          onClick={() => navigate("/sms/heatDtl", {state: {heatNo: record.heatNo}})}
        />
      ),
    },
  ];

  const addNewHeat = async () => {
    const checkFloatObj = checkAndConvertToFLoat(newHeat.turnDownTemp);
    if(!checkFloatObj.isFloat){
      return;
    }
      const payload = {
        heatNo: newHeat.heatNo,
        turnDownTemp: checkFloatObj.number,
        dutyId: smsGeneralInfo.dutyId
      }

      try{
        await apiCall("POST", "/sms/addNewHeat", token, payload);
        setIsModalOpen(false);
        message.success("New heat added successfully.")
        setNewHeat({
          heatNo: "",
          turnDownTemp: ""
        })
        populateTableData();
      }
      catch(error){

      }
  };

  const handleNewHeatValChange = (fieldName, value) => {
    setNewHeat((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handlePageSizeChange = (value) => {
    setTablePageSize(value);
    setCurrentTablePage(1); // Reset to first page when page size changes
  };

  const onFinish = async () => {
    const payload = {
      makeOfCastingPowder: formData.makeOfCastingPowder,
      makeOfHydrisProbe: formData.makeOfHydrisProbe,
      amlcFunctioning: formData.amlcFunctioning,
      emsFunctioning: formData.emsFunctioning,
      hydrogenMeasurementAutomatic: formData.hydrogenMeasurementAutomatic,
      ladleToTundishUsed: formData.ladleToTundishUsed,
      slagDetectorFunctioning: formData.slagDetectorFunctioning,
      tundishToMouldUsed: formData.tundishToMouldUsed,
      dutyId: smsGeneralInfo.dutyId,
    };

    try {
      await apiCall("POST", "/sms/saveShiftSummaryDtls", token, payload);
      message.success("SMS Shift Summary Data saved succesfully.");
      navigate("/sms/dutyEnd");
    } catch (error) {}
  };

  useEffect(() => {
    populateTableData();
  }, [populateTableData]);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  return (
    <FormContainer className="flex flex-col gap-4 md:gap-8">
      <SubHeader title="SMS - Shift Summary" link="/sms/dutyEnd" />
      <GeneralInfo data={smsGeneralInfo} />
      <section>
        <div className="grid grid-cols-1 gap-2 md:gap-4 border p-1 border-[#d9d9d9] shadow-md rounded-sm relative">
          <div>
            <h3 className="font-semibold">Hydris Calibration Details</h3>
            <div className="grid grid-cols-2">
              {formData.hydrisClb &&
                Object.keys(formData.hydrisClb).map((key) => {
                  return (
                    <h3 key={key}>
                      {key}: {formData.hydrisClb[key]}
                    </h3>
                  );
                })}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Leco Calibration Details</h3>
            <div className="grid grid-cols-2">
              {formData.lecoClbList &&
                formData.lecoClbList.map((record) => {
                  return (
                    <h3 key={record.key}>
                      {record.key}: {record.value}
                    </h3>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="relative">
          <Table
            columns={columns}
            dataSource={formData.heatDtlList}
            scroll={{ x: true }}
            bordered
            pagination={{
              current: currentTablePage,
              pageSize: tablePageSize,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
              onChange: (page) => setCurrentTablePage(page),
              onShowSizeChange: (current, size) => handlePageSizeChange(size),
            }}
          />
          <IconBtn
            icon={PlusOutlined}
            text="add new heat"
            className="absolute left-0 bottom-4"
            onClick={() => setIsModalOpen(true)}
          />

          <IconBtn
            icon={PlusOutlined}
            text="add existing heat"
            className="absolute left-40 bottom-4"
            onClick={() => navigate("/sms/heatDtl")}
          />
        </div>
      </section>

      <section>
        <Form
          form={form}
          layout="vertical"
          initialValues={formData}
          onFinish={onFinish}
        >
          <div className="flex flex-col gap-2 mb-6">
            <Checkbox
              checked={formData.emsFunctioning}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emsFunctioning: e.target.checked,
                }))
              }
            >
              Is Ems Functioning?
            </Checkbox>
            <Checkbox
              checked={formData.slagDetectorFunctioning}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slagDetectorFunctioning: e.target.checked,
                }))
              }
            >
              Is Slag Detector cum Slag Arrester Functioning ?
            </Checkbox>
            <Checkbox
              checked={formData.amlcFunctioning}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amlcFunctioning: e.target.checked,
                }))
              }
            >
              Is AMLC Functioning ?
            </Checkbox>
            <Checkbox
              checked={formData.hydrogenMeasurementAutomatic}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hydrogenMeasurementAutomatic: e.target.checked,
                }))
              }
            >
              Is Hydrogen Measurement Automatic ?
            </Checkbox>
            <Checkbox
              checked={formData.ladleToTundishUsed}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ladleToTundishUsed: e.target.checked,
                }))
              }
            >
              Is Shroud (Ladle to Tundish) Used ?
            </Checkbox>
            <Checkbox
              checked={formData.tundishToMouldUsed}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tundishToMouldUsed: e.target.checked,
                }))
              }
            >
              Is Shroud (Tundish to Mould) Used ?
            </Checkbox>
          </div>

          <FormInputItem
            label="Make of Casting Powder Used"
            name="makeOfCastingPowder"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)}
          />
          <FormInputItem
            label="Make of Hydris Probe used"
            name="makeOfHydrisProbe"
            onChange={(fieldName, value) =>
              handleChange(fieldName, value, setFormData)
            }
          />
          <div className="text-center">
            <Btn htmlType="submit">Save</Btn>
          </div>
        </Form>
      </section>

      <Modal
        title="Add new heat"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >

        <Form layout="vertical" onFinish={addNewHeat}>

        <FormInputItem
          label="Enter Heat Number"
          placeholder="734562"
          name="heatNo"
          // minLength={6}
          // maxLength={6}
          onChange={handleNewHeatValChange}
          required
          />
        <FormInputItem
          label="Turn Down Temperature"
          placeholder="45.23"
          // minLength={6}
          // maxLength={6}
          name="turnDownTemp"
          onChange={handleNewHeatValChange}
          required
          />
        <Btn htmlType="submit">Add</Btn>
          </Form>
      </Modal>
    </FormContainer>
  );
};

export default SmsHeatSummary;
