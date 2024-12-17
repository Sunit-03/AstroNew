import React, { useEffect, useState } from "react";
import FormContainer from "../../../../../components/DKG_FormContainer";
import SubHeader from "../../../../../components/DKG_SubHeader";
import { useSelector } from "react-redux";
import { Divider, Form, message, TimePicker } from "antd";
import GeneralInfo from "../../../../../components/DKG_GeneralInfo";
import FormInputItem from "../../../../../components/DKG_FormInputItem";
import FormDropdownItem from "../../../../../components/DKG_FormDropdownItem";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import IconBtn from "../../../../../components/DKG_IconBtn";
import Btn from "../../../../../components/DKG_Btn";
import { apiCall } from "../../../../../utils/CommonFunctions";

const satUnsatDropdown = [
  {
    key: true,
    value: "Satisfactory",
  },
  {
    key: false,
    value: "Unsatisfactory",
  },
];

const RollingVerification = () => {
  const [form] = Form.useForm();

  const { token } = useSelector((state) => state.auth);
  const rollingGeneralInfo = useSelector((state) => state.rollingDuty);
  const { mill } = rollingGeneralInfo;

  const [formData, setFormData] = useState({
    bloomYardDtls: [
      {
        heatNo: null,
        internalTransferVerification: null,
        internalTransferVerificationDesc: null,
        heatRegisterVerification: null,
        heatRegisterVerificationDesc: null,
        bloomId: null,
        length: null,
        defect: null,
      },
    ],
    chargingTableDtls: [
      {
        heatNo: null,
        length: null,
        defect: null,
        bloomTrackingVerification: null,
        bloomTrackingVerificationDesc: null,
        hotBloomsDescaling: null,
        hotBloomsDescalingDesc: null,
      },
    ],
    tempObservationDtls: [
      //   {
      //       createdAt: null,
      //       soakingZoneTemp: null,
      //       finishingTemp: null
      //   }
    ],
  });

  const onFinish = async () => {
    try{
        await apiCall("POST", "/rolling/saveRollingVerification", token, {...formData, dutyId: rollingGeneralInfo.dutyId});
        message.success("Data saved successfully.")
    }catch(error){

    }
  };

  const setDescription = (field, value) => {
    if (value === true) {
      return "Satisfactory";
    } else {
      return "Unsatisfactory";
    }
  };

  const handleBloomDtlChange = (fieldName, value, index) => {
    setFormData((prev) => {
      const bloomYardDtlsUpdated = [...prev.bloomYardDtls];
      bloomYardDtlsUpdated[index][fieldName] = value;

      if (fieldName === "internalTransferVerification") {
        bloomYardDtlsUpdated[index]["internalTransferVerificationDesc"] =
          setDescription("internalTransferVerification", value);
      } else if (fieldName === "heatRegisterVerification") {
        bloomYardDtlsUpdated[index]["heatRegisterVerificationDesc"] =
          setDescription("heatRegisterVerification", value);
      }
      return {
        ...prev,
        bloomYardDtls: bloomYardDtlsUpdated,
      };
    });
  };

  const handleChargingTableDtlChange = (fieldName, value, index) => {
    setFormData((prev) => {
      const chargingTableUpdated = [...prev.chargingTableDtls];
      chargingTableUpdated[index][fieldName] = value;

      if (fieldName === "bloomTrackingVerification") {
        chargingTableUpdated[index]["bloomTrackingVerificationDesc"] =
          setDescription("bloomTrackingVerification", value);
      } else if (fieldName === "hotBloomsDescaling") {
        chargingTableUpdated[index]["hotBloomsDescalingDesc"] = setDescription(
          "hotBloomsDescaling",
          value
        );
      }
      return {
        ...prev,
        chargingTableDtls: chargingTableUpdated,
      };
    });
  };

  const handleBloomYardDtlDelete = (index) => {
    const bloomYarDtlsUpdated = formData.bloomYardDtls;
    bloomYarDtlsUpdated.splice(index, 1);
    setFormData((prev) => ({ ...prev, bloomYardDtls: bloomYarDtlsUpdated }));
  };

  const handleChargingDtlDtlDelete = (index) => {
    const chargingTableDtlsUpdated = formData.chargingTableDtls;
    chargingTableDtlsUpdated.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      chargingTableDtls: chargingTableDtlsUpdated,
    }));
  };

  const addNewBloomyard = () => {
    setFormData((prev) => {
      return {
        ...prev,
        bloomYardDtls: [
          ...prev.bloomYardDtls,
          {
            heatNo: null,
            internalTransferVerification: null,
            internalTransferVerificationDesc: null,
            heatRegisterVerification: null,
            heatRegisterVerificationDesc: null,
            bloomId: null,
            length: null,
            defect: null,
          },
        ],
      };
    });
  };

  const addNewChargingDtl = () => {
    setFormData((prev) => {
      return {
        ...prev,
        chargingTableDtls: [
          ...prev.chargingTableDtls,
          {
            heatNo: null,
            length: null,
            defect: null,
            bloomTrackingVerification: null,
            bloomTrackingVerificationDesc: null,
            hotBloomsDescaling: null,
            hotBloomsDescalingDesc: null,
          },
        ],
      };
    });
  };

  const addNewTempObsDtl = () => {
    setFormData((prev) => {
      return {
        ...prev,
        tempObservationDtls: [
          ...prev.tempObservationDtls,
          {
            createdAt: null,
            createdAtDayjs: null,
            soakingZoneTemp: null,
            finishingTemp: null,
          },
        ],
      };
    });
  };

  const handleTimingChange = (time, timeString, index) => {

    if (time) {
      // Directly use timeString because it's already in the correct format
      setFormData((prev) => {
        const tempObsvDtlsUpdated = prev.tempObservationDtls;
        tempObsvDtlsUpdated[index]["createdAt"] = timeString;
        tempObsvDtlsUpdated[index]["createdAtDayjs"] = time;
        return {
            ...prev,
            tempObservationDtls: tempObsvDtlsUpdated
        }
      })
    } else {
        setFormData((prev) => {
            const tempObsvDtlsUpdated = prev.tempObservationDtls;
            tempObsvDtlsUpdated[index]["createdAt"] = null;
            tempObsvDtlsUpdated[index]["createdAtDayjs"] = null;
            return {
                ...prev,
                tempObservationDtls: tempObsvDtlsUpdated
            }
          })
    }
  };

  const handleTempObsDtlChange = (fieldName, value, index) => {
    setFormData(prev => {
        const tempObsDtlsUpdated = prev.tempObservationDtls;
        tempObsDtlsUpdated[index][fieldName] = value;
        return {
            ...prev,
            tempObservationDtls: tempObsDtlsUpdated
        }
    })
  }


  useEffect(() => {
    form.setFieldsValue(formData);
  }, [form, formData]);

  return (
    <FormContainer>
      <SubHeader
        title={`Rail Rolling Verification - ${mill}`}
        link="/stage/rollingControl"
      />
      <GeneralInfo data={rollingGeneralInfo} />

      <Divider className="m-0" />

      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onFinish={onFinish}
      >
        <div className="relative">
          <h3 className="font-semibold !text-xl">Bloom Yard</h3>

          {formData?.bloomYardDtls?.map((record, index) => (
            <div className="grid grid-cols-2 gap-x-4 border p-4 pb-0 relative">
              <FormInputItem
                className="col-span-2"
                label="Heat number"
                name={["bloomYardDtls", index, "heatNo"]}
                onChange={(fName, value) =>
                  handleBloomDtlChange(fName, value, index)
                }
                required
              />

               
              {
                mill === "RSM" && (
                    <>
                        <FormInputItem name={["bloomyardDtls", index, "length"]} label="Length" required />
                        <FormInputItem name={["bloomyardDtls", index, "defect"]} label="Defect" required />
                    </>
                )
              } 

              <h4 className="font-semibold col-span-2">
                Online Verification of Internal Transfer Memo for Stacking
              </h4>
              <FormDropdownItem
                placeholder="satisfactory / unsatisfactory"
                formField="internalTransferVerification"
                name={[
                  "bloomYardDtls",
                  index,
                  "internalTransferVerificationDesc",
                ]}
                dropdownArray={satUnsatDropdown}
                visibleField="value"
                valueField="key"
                onChange={(fName, value) =>
                  handleBloomDtlChange(fName, value, index)
                }
                required
              />
              <h4 className="font-semibold col-span-2">
                Online Verification of Rail Heat Register with production report
              </h4>
              <FormDropdownItem
                placeholder="satisfactory / unsatisfactory"
                formField="heatRegisterVerification"
                name={["bloomYardDtls", index, "heatRegisterVerificationDesc"]}
                dropdownArray={satUnsatDropdown}
                visibleField="value"
                valueField="key"
                onChange={(fName, value) =>
                  handleBloomDtlChange(fName, value, index)
                }
                required
              />
              <IconBtn
                icon={DeleteOutlined}
                className="shadow-none absolute right-0"
                onClick={() => handleBloomYardDtlDelete(index)}
              />
            </div>
          ))}

          <IconBtn
            icon={PlusOutlined}
            text="add"
            className="absolute right-0 bottom-0"
            onClick={addNewBloomyard}
          />
        </div>

        <Divider />
        <div className="relative">
          <h3 className="font-semibold !text-xl">Charging Table</h3>

          {formData?.chargingTableDtls?.map((record, index) => (
            <div className="grid grid-cols-2 gap-x-4 border p-4 pb-0 relative">
              <h4 className="font-semibold col-span-3">Surface Inspection</h4>
              <FormInputItem
                placeholder="Heat number"
                name={["chargingTableDtls", index, "heatNo"]}
                onChange={(fName, value) =>
                  handleChargingTableDtlChange(fName, value, index)
                }
                required
              />
              <FormInputItem
                placeholder="Length"
                name={["chargingTableDtls", index, "length"]}
                onChange={(fName, value) =>
                  handleChargingTableDtlChange(fName, value, index)
                }
                required
              />
              <FormInputItem
                placeholder="Defect"
                name={["chargingTableDtls", index, "defect"]}
                onChange={(fName, value) =>
                  handleChargingTableDtlChange(fName, value, index)
                }
                required
              />

              <h4 className="font-semibold col-span-2">
                Online Verification of Computerized Bloom Tracking
              </h4>
              <FormDropdownItem
                placeholder="satisfactory / unsatisfactory"
                formField="bloomTrackingVerification"
                name={[
                  "chargingTableDtls",
                  index,
                  "bloomTrackingVerificationDesc",
                ]}
                dropdownArray={satUnsatDropdown}
                visibleField="value"
                valueField="key"
                required
                onChange={(fName, value) =>
                  handleChargingTableDtlChange(fName, value, index)
                }
              />

              <h4 className="font-semibold col-span-2">
                Descaling of Hot Blooms Before Rolling
              </h4>
              <FormDropdownItem
                placeholder="satisfactory / unsatisfactory"
                formField="hotBloomsDescaling"
                name={["chargingTableDtls", index, "hotBloomsDescalingDesc"]}
                dropdownArray={satUnsatDropdown}
                visibleField="value"
                valueField="key"
                required
                onChange={(fName, value) =>
                  handleChargingTableDtlChange(fName, value, index)
                }
              />

              <IconBtn
                icon={DeleteOutlined}
                className="shadow-none absolute right-0"
                onClick={() => handleChargingDtlDtlDelete(index)}
              />
            </div>
          ))}
          <IconBtn
            icon={PlusOutlined}
            text="add"
            className="absolute right-0 bottom-0"
            onClick={addNewChargingDtl}
          />
        </div>

        <Divider />

        <div className="relative">
          <h3 className="font-semibold !text-xl">Temperature Observation</h3>

          <div className="border grid grid-cols-3 divide-x divide-y divide-gray-300">
            <div className="p-2">Time of Observation</div>
            <div className="p-2">Soaking Zone Temp (1260 +/- 20)</div>
            <div className="p-2">Finishing Temp</div>
            {formData.tempObservationDtls?.map((record, index) => (
              <>
                <div className="p-2">
                  <Form.Item
                    name={["tempObservationDtls", index, "createdAtDayjs"]}
                    rules={[
                      { required: true, message: "Please select a time!" },
                    ]}
                    className="no-border"
                  >
                    <TimePicker
                      onChange={(time, timeString) => handleTimingChange(time, timeString, index)}
                      format="HH:mm:ss"
                      placeholder="Select Time"
                      className="w-full"
                    />
                  </Form.Item>
                </div>
                <div className="p-2">
                  <FormInputItem name={["tempObservationDtls", index, "soakingZoneTemp"]} className="no-border" required onChange={(name, value) => handleTempObsDtlChange(name, value, index)} />
                </div>
                <div className="p-2">
                  <FormInputItem name={["tempObservationDtls", index, "finishingTemp"]} className="no-border" onChange={(name, value) => handleTempObsDtlChange(name, value, index)} />
                </div>
              </>
            ))}

            <IconBtn
              icon={PlusOutlined}
              text="add"
              className="absolute right-0 -bottom-8"
              onClick={addNewTempObsDtl}
            />
          </div>
        </div>

        <Btn htmlType="submit"> Save </Btn>
      </Form>
    </FormContainer>
  );
};

export default RollingVerification;
