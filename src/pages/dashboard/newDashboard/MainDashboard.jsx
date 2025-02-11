import axios from "axios";
import React, { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import TableComponent from "../../../components/DKG_Table";

const MainDashboard = ({data = []}) => {
  const [activeTab, setActiveTab] = useState(1);

  const [tableColumns, setTableColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [tileData, setTileData] = useState([]);

  const populateData = useCallback(async () => {
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Dashboard data is invalid:", data);
      return; // Exit if data is not valid
    }
  
    const tileData = await Promise.all(
      data.map(async (item) => {
        try {
          const { data } = await axios.get(item.api);
          return {
            id: item.id,
            title: item.title,
            data,
            icon: item.icon,
            tableColumns: item.tableColumns,
            color: item.color,
          };
        } catch (error) {
          console.error("Error fetching tile data:", error);
          return null; // Handle API failures gracefully
        }
      })
    );
  
    const validTileData = tileData.filter((item) => item !== null);
    if (validTileData.length > 0) {
      setTileData(validTileData);
      setTableColumns(validTileData[0]?.tableColumns || []);
      setTableData(validTileData[0]?.data || []);
    }
  }, [data]);
  

  const handleTileClick = (id) => {
    setTableColumns(tileData[id - 1].tableColumns);
    setTableData(tileData[id - 1].data);
    setActiveTab(id);
  };

  const renderTiles = () =>
    tileData?.map((item) => {
      return (
        <div
          key={item.id}
          onClick={() => handleTileClick(item.id)}
          className={`cursor-pointer p-2 rounded-md grid grid-cols-3 h-32 gap-8 ${
            activeTab === item.id ? "border-b-2 border-pink" : ""
          }`}
          style={{ backgroundColor: item.color }}
        >
          <span className="dashboard-tab-icon text-white">{item.icon}</span>
          <div className="flex flex-col items-center justify-center gap-1 col-span-2">
            <h3 className="font-semibold text-2xl text-white text-left w-full">54</h3>
            <div className="w-full text-white text-left">
              {item.title}
            </div>
          </div>
        </div>
      );
    });

  useEffect(() => {
    populateData();
  }, [populateData]);

  return (
    <div className="w-4/6 border mx-auto p-4 flex flex-col gap-6">
      <h1 className="font-semibold text-3xl text-center">Dashboard</h1>
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {renderTiles()}
      </section>

      <section>
        <TableComponent dataSource={tableData} columns={tableColumns} />
      </section>
    </div>
  );
};

export default MainDashboard;
