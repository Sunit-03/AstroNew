import React, { useCallback, useEffect, useState } from "react";
import SubHeader from "../../../../../components/DKG_SubHeader";
import data from "../../../../../utils/db.json";
import GeneralInfo from "../../../../../components/DKG_GeneralInfo";
import FormBody from "../../../../../components/DKG_FormBody";
import { Checkbox, Divider, Image, message, Table, Upload } from "antd";
import CustomDatePicker from "../../../../../components/DKG_CustomDatePicker";
import FormInputItem from "../../../../../components/DKG_FormInputItem";
import FormDropdownItem from "../../../../../components/DKG_FormDropdownItem";
import FormNumericInputItem from "../../../../../components/DKG_FormNumericInputItem"
import { Link } from "react-router-dom";
import IconBtn from "../../../../../components/DKG_IconBtn";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import TextAreaComponent from "../../../../../components/DKG_TextAreaComponent";
import Btn from "../../../../../components/DKG_Btn";
import FormContainer from "../../../../../components/DKG_FormContainer";
import { useNavigate } from 'react-router-dom'

const {
  visualInspectionGeneralInfo,
  shiftList,
  visualInspectionAcceptanceData,
  visualInspectionDefectData,
} = data;
const { accLengthList, railClassList } = visualInspectionAcceptanceData;

const viRejectionDetailsColumns = [
  { title: "Length", dataIndex: "length", key: "length", align: 'center' },
  { title: "No. of Pieces", dataIndex: "numberPieces", key: "numberPieces", align: 'center' },
];

const viRejectionDetailsData = [
  {
    key: "1",
    length: "13m",
    numberPieces: "5",
  },
  {
    key: "2",
    length: "12m",
    numberPieces: "3",
  },
  {
    key: "3",
    length: "11m",
    numberPieces: "7",
  },
  {
    key: "4",
    length: "10m",
    numberPieces: "1",
  },
  {
    key: "5",
    length: "Comp. Length",
    numberPieces: "9",
  },
];

const VisualInspectionForm = () => {
  const [serialNumber, setSerialNumber] = useState('001');
  const [heatNumber, setHeatNumber] = useState('');
  const [actualOfferedLength, setActualOfferedLength] = useState('');
  const [formData, setFormData] = useState({
    railId: "U110324B034",
    shift: "",
    date: "",
    heatStatus: "",
    ut: "",
    dim: "",
    visual: "",
    gaugeEndStraightnessPresent: false,
    acceptanceDataList: [
      {
        accLength: "",
        number: '',
        railClass: "",
      },
    ],
    defectDataList: [
      {
        defectCategory: "",
        type: "",
        location: "",
        position: "",
      },
    ],
    remarks: "",
    uploadedImage: "",
  });
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);

  const [defectCategoryList, setDefectCategoryList] = useState([]);
  const [defectTypeList, setDefectTypeList] = useState([]);

  const handleFormSubmit = () => {
    message.success("Form submission triggered.");
    navigate('/visual/home')
  };

  const handleChange = (fieldName, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handleAcceptanceDataChange = (index, fieldName, value) => {
    setFormData((prev) => {
      const acptDtList = prev.acceptanceDataList;
      acptDtList[index][fieldName] = value;
      return {
        ...prev,
        acceptanceDataList: acptDtList,
      };
    });
  };

  const populateDefectDataList = useCallback(() => {
    const defCat = Object.keys(visualInspectionDefectData).map((item) => {
      return {
        key: item,
        value: item,
      };
    });
    setDefectCategoryList([...defCat]);
  }, []);

  const handleDefectCategoryChange = (index, fieldName, value) => {
    setFormData((prev) => {
      const defDatLst = prev.defectDataList;
      defDatLst[index][fieldName] = value;
      return {
        ...prev,
        defectDataList: defDatLst,
      };
    });

    setDefectTypeList((prev) => {
      const temp = prev;
      temp[index] = visualInspectionDefectData[value].map((item) => {
        return {
          key: item,
          value: item,
        };
      });
      return temp;
    });
  };

  const handleDefectDataChange = (index, fieldName, value) => {
    console.log(index, fieldName, value);

    setFormData((prev) => {
      const defDatList = prev.defectDataList;
      defDatList[index][fieldName] = value;
      return {
        ...prev,
        defectDataList: defDatList,
      };
    });
  };

  const addAcceptanceData = () => {
    setFormData((prev) => {
      const acptDtLst = prev.acceptanceDataList;
      const updatedLst = [
        ...acptDtLst,
        { accLength: "", number: '', railClass: "" },
      ];

      return {
        ...prev,
        acceptanceDataList: updatedLst,
      };
    });
  };

  const deleteAcptItem = (index) => {
    setFormData((prev) => {
      const acptDtLst = prev.acceptanceDataList;
      acptDtLst.splice(index, 1);
      return {
        ...prev,
        acceptanceDataList: acptDtLst,
      };
    });

    setDefectTypeList((prev) => {
      const defTypeLst = prev;
      defTypeLst.splice(index, 1);
      return defTypeLst;
    });
  };

  const deleteDefItem = (index) => {
    setFormData((prev) => {
      const defDtLst = prev.defectDataList;
      defDtLst.splice(index, 1);
      return {
        ...prev,
        acceptanceDataList: defDtLst,
      };
    });
  };

  const addDefectData = () => {
    setFormData((prev) => {
      const defDataLst = prev.defectDataList;
      defDataLst.push({
        defectCategory: "",
        type: "",
        location: "",
        position: "",
      });
      return {
        ...prev,
        defectDataList: defDataLst,
      };
    });
  };

  const handleImgUploadChange = (info) => {
    console.log(info.file.originFileObj);
    if (info.file.status === "done") {
      // Get the image URL
      const url = URL.createObjectURL(info.file.originFileObj);
      setFormData((prev) => {
        return {
          ...prev,
          uploadedImage: info.file.originFileObj,
        };
      });
      setPreviewUrl(url);
    } else if (info.file.status === "removed") {
      // Reset state when image is removed
      setFormData((prev) => {
        return {
          ...prev,
          uploadedImage: null,
        };
      });
      setPreviewUrl("");
    }
  };

  useEffect(() => {
    populateDefectDataList();
  }, [populateDefectDataList]);

  return (
    <FormContainer>
      <SubHeader title="Visual Inspection" link="/visual/home" />
      <GeneralInfo data={visualInspectionGeneralInfo} />
      <FormBody initialValues={formData} onFinish={handleFormSubmit}>
        <div className="mb-4">
          <span className="font-semibold">Rail ID: </span>
          {formData.railId}
        </div>

        <div>
          <div className="grid grid-cols-3 gap-x-2">

          <CustomDatePicker
            label="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            />
            <FormDropdownItem
              label="Shift"
              dropdownArray={shiftList}
              visibleField="value"
              valueField="key"
              name="shift"
              onChange={handleChange}
              required
              />
          <FormNumericInputItem
            label='S.No.'
            maxLength={3}
            value={serialNumber}
            onChange={setSerialNumber}
            required
          />
            </div>

            <div className="grid grid-cols-2 gap-x-2">

          <FormNumericInputItem
            label="Heat Number"
            minLength={6}
            maxLength={6}
            value={heatNumber}
            onChange={setHeatNumber}
            required
          />
          <FormInputItem
            label="Heat Status"
            name="heatStatus"
            onChange={handleChange}
            required
            />
            </div>

          <FormNumericInputItem
            label="Act. Offered Len. (in m.)"
            value={actualOfferedLength}
            onChange={setActualOfferedLength}
            required
          />
        </div>

        <Divider className="mt-0 mb-4" />

        <section className="flex flex-col gap-4">
          <h3 className="font-semibold">
            Feedback from AI System for Dim and Visual
          </h3>
          <div className="text-justify">
            <span className="font-semibold">UT: </span>
            Text
          </div>
          <div className="text-justify">
            <span className="font-semibold">Dim: </span>
            Text
          </div>
          <div className="text-justify">
            <span className="font-semibold">Visual: </span>
            Text
          </div>

          <div className="grid grid-cols-2">
            <Link to="#" className="text-blue-600">
              {" "}
              Go to AI Photo
            </Link>
            <Link to="#" className="text-blue-600 text-right">
              {" "}
              Go to NDT Report
            </Link>
          </div>
        </section>

        <Divider className="my-4" />
        <Checkbox
          className="checkbox-group"
          onChange={(e) =>
            handleChange("gaugeEndStraightnessPresent", e.target.checked)
          }
        >
          Gauging and End Straightness present at both the ends.
        </Checkbox>

        <Divider className="my-4" />

        <section className="flex flex-col gap-4">
          <h3 className="font-semibold">Add Acceptance Data</h3>

          {formData.acceptanceDataList.map((record, index) => {
            return (
              <div
                className=" relative flex flex-col gap-2 border p-2 py-4 rounded-md vi-acpt-def"
                key={index}
              >
                <FormDropdownItem
                  dropdownArray={accLengthList}
                  name="accLength"
                  visibleField="value"
                  valueField="key"
                  placeholder="Acc. length"
                  onChange={(fieldName, value) =>
                    handleAcceptanceDataChange(index, fieldName, value)
                  }
                />
                <FormInputItem
                  placeholder="Number"
                  type='number'
                  value={formData.number}
                  onChange={(fieldName, value) =>
                    handleAcceptanceDataChange(index, fieldName, value)
                  }
                />


                <FormDropdownItem
                  dropdownArray={railClassList}
                  name="railClass"
                  visibleField="value"
                  valueField="key"
                  placeholder="Rail Class"
                  onChange={(fieldName, value) =>
                    handleAcceptanceDataChange(index, fieldName, value)
                  }
                />
                <IconBtn
                  icon={DeleteOutlined}
                  className="absolute -top-4 right-0"
                  onClick={() => deleteAcptItem(index)}
                />
              </div>
            );
          })}

          <IconBtn
            icon={PlusOutlined}
            text="Add More Acceptance Data"
            className="-mt-4 w-fit"
            onClick={addAcceptanceData}
          />
        </section>

        <Divider />

        <section className="flex flex-col gap-4">
          <h3 className="font-semibold">Add Defect Data</h3>

          {formData.defectDataList.map((record, index) => {
            return (
              <div
                className="relative flex flex-col gap-2 border p-2 py-4 rounded-md vi-acpt-def"
                key={index}
              >

                <FormDropdownItem
                  dropdownArray={defectCategoryList}
                  name="defectCategory"
                  visibleField="value"
                  valueField="key"
                  placeholder="Defect Cat.."
                  onChange={(fieldName, value) =>
                    handleDefectCategoryChange(index, fieldName, value)
                  }
                />

                <FormDropdownItem
                  dropdownArray={defectTypeList[index] || []}
                  name="defectType"
                  visibleField="value"
                  valueField="key"
                  placeholder="Defect Type"
                  onChange={(fieldName, value) =>
                    handleDefectDataChange(index, fieldName, value)
                  }
                />
                  <FormInputItem
                    placeholder="Location"
                    name="location"
                    onChange={(fieldName, value) =>
                      handleDefectDataChange(index, fieldName, value)
                    }
                  />

                <FormInputItem
                  placeholder="Position"
                  name="position"
                  onChange={(fieldName, value) =>
                    handleDefectDataChange(index, fieldName, value)
                  }
                />
                <IconBtn
                  icon={DeleteOutlined}
                  className="absolute -top-4 right-0"
                  onClick={() => deleteDefItem(index)}
                />
              </div>
            );
          })}
          <IconBtn
            icon={PlusOutlined}
            text="Add More Defect Data"
            className="-mt-4 w-fit"
            onClick={addDefectData}
          />
        </section>

        <Divider  />

        <section>
          <h3 className="font-semibold mb-2">Rejection Details</h3>
          <Table
            dataSource={viRejectionDetailsData}
            columns={viRejectionDetailsColumns}
            scroll={{ x: true }}
            bordered
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
            }}
          />
        </section>

        <section className="flex flex-col">
          <h3 className="font-semibold">Remarks</h3>
          <TextAreaComponent
            name="remarks"
            placeholder="Enter remarks"
            rows="5"
          />
          <div className="mx-auto">
            <Upload
              accept="image/*"
              showUploadList={false}
              onChange={handleImgUploadChange}
            >
              <IconBtn text="Upload Image" icon={UploadOutlined} />
            </Upload>
          </div>

          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Preview"
              width={200}
              height={200}
              className="rounded shadow"
            />
          )}

          <Btn htmlType="submit" className="mx-auto mt-6">
            Save Inspection Data
          </Btn>
        </section>
      </FormBody>
    </FormContainer>
  );
};

export default VisualInspectionForm;