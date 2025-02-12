import React, { useState, useEffect, useMemo } from "react";
import TableComponent from "../../../components/DKG_Table";

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tileData, setTileData] = useState([]);

  // Define your tile data locally
  const dashboardTiles = [
    {
      id: 1,
      title: "Report 1",
      icon: "", // You can use an emoji, icon component, or image.
      color: "#3498db",
      // Define table columns for tile 1 (without filters)
      tableColumns: [
        { title: "Order Id", dataIndex: "col1", key: "col1" },
        { title: "Mode of Procurement", dataIndex: "col2", key: "col2" },
        { title: "Under AMC", dataIndex: "col3", key: "col3" },
        { title: "AMC expiry date", dataIndex: "col4", key: "col4" },
        { title: "AMC for", dataIndex: "col5", key: "col5" },
        { title: "End User", dataIndex: "col6", key: "col6" },
        { title: "No. of Participants", dataIndex: "col7", key: "col7" },
        { title: "Value", dataIndex: "col8", key: "col8" },
        { title: "Location", dataIndex: "col9", key: "col9"},
        { title: "Vendor Name", dataIndex: "col10", key: "col10"},
        { title: "Previously renewed AMCs", dataIndex: "col11", key: "col11"},
        { title: "Category Security", dataIndex: "col12", key: "col12"},
        { title: "Validity of Security", dataIndex: "col13", key: "col13"},
      ],
      // Define table data for tile 1
      data: [
        {
          id: 1,
          col1: "011",
            col2: "012",
            col3: "013",
            col4: "014",
            col5: "015",
            col6: "016",
            col7: "017",
            col8: "018",
            col9: "019",
            col10: "0100",
            col11: "0111",
            col12: "0112",
            col13: "0113",
        },
        {
          id: 2,
          col1: "011",
            col2: "012",
            col3: "013",
            col4: "014",
            col5: "015",
            col6: "016",
            col7: "017",
            col8: "018",
            col9: "019",
            col10: "0100",
            col11: "0111",
            col12: "0112",
            col13: "0113",
        },
        {
          id: 3,
          col1: "011",
            col2: "012",
            col3: "013",
            col4: "014",
            col5: "015",
            col6: "016",
            col7: "017",
            col8: "018",
            col9: "019",
            col10: "0100",
            col11: "0111",
            col12: "0112",
            col13: "0113",
        },
      ],
    },
    {
      id: 2,
      title: "Report 2",
      icon: "",
      color: "#e67e22",
      tableColumns: [
        { title: "Order Id", dataIndex: "col1", key: "col1" },
        { title: "Mode of Procurement", dataIndex: "col2", key: "col2" },
        { title: "Under AMC", dataIndex: "col3", key: "col3" },
        { title: "AMC expiry date", dataIndex: "col4", key: "col4" },
        { title: "AMC for", dataIndex: "col5", key: "col5" },
        { title: "End User", dataIndex: "col6", key: "col6" },
        { title: "No. of Participants", dataIndex: "col7", key: "col7" },
        { title: "Value", dataIndex: "col8", key: "col8" },
        { title: "Location", dataIndex: "col9", key: "col9"},
        { title: "Vendor Name", dataIndex: "col10", key: "col10"},
        { title: "Previously renewed AMCs", dataIndex: "col11", key: "col11"},
        { title: "Category Security", dataIndex: "col12", key: "col12"},
        { title: "Validity of Security", dataIndex: "col13", key: "col13"},
      ],
      data: [
        {
            id: 1,
            col1: "011",
            col2: "012",
            col3: "013",
            col4: "014",
            col5: "015",
            col6: "016",
            col7: "017",
            col8: "018",
            col9: "019",
            col10: "0100",
            col11: "0111",
            col12: "0112",
            col13: "0113",
          },
          {
            id: 2,
            col1: "011",
            col2: "012",
            col3: "013",
            col4: "014",
            col5: "015",
            col6: "016",
            col7: "017",
            col8: "018",
            col9: "019",
            col10: "0100",
            col11: "0111",
            col12: "0112",
            col13: "0113",
          },
          {
            id: 3,
            col1: "011",
            col2: "012",
            col3: "013",
            col4: "014",
            col5: "015",
            col6: "016",
            col7: "017",
            col8: "018",
            col9: "019",
            col10: "0100",
            col11: "0111",
            col12: "0112",
            col13: "0113",
          },
      ],
    },
    {
      id: 3,
      title: "Report 3",
      icon: "",
      color: "#2ecc71",
      tableColumns: [
        { title: "Order Id", dataIndex: "col1", key: "col1" },
        { title: "Mode of Procurement", dataIndex: "col2", key: "col2" },
        { title: "Under AMC", dataIndex: "col3", key: "col3" },
        { title: "AMC expiry date", dataIndex: "col4", key: "col4" },
        { title: "AMC for", dataIndex: "col5", key: "col5" },
        { title: "End User", dataIndex: "col6", key: "col6" },
        { title: "No. of Participants", dataIndex: "col7", key: "col7" },
        { title: "Value", dataIndex: "col8", key: "col8" },
        { title: "Location", dataIndex: "col9", key: "col9"},
        { title: "Vendor Name", dataIndex: "col10", key: "col10"},
        { title: "Previously renewed AMCs", dataIndex: "col11", key: "col11"},
        { title: "Category Security", dataIndex: "col12", key: "col12"},
        { title: "Validity of Security", dataIndex: "col13", key: "col13"},
      ],
      data: [
        {
            id: 1,
            col1: "011",
            col2: "012",
            col3: "013",
            col4: "014",
            col5: "015",
            col6: "016",
            col7: "017",
            col8: "018",
            col9: "019",
            col10: "0100",
            col11: "0111",
            col12: "0112",
            col13: "0113",
          },
          {
            id: 2,
            col1: "011",
            col2: "012",
            col3: "013",
            col4: "014",
            col5: "015",
            col6: "016",
            col7: "017",
            col8: "018",
            col9: "019",
            col10: "0100",
            col11: "0111",
            col12: "0112",
            col13: "0113",
          },
          {
            id: 3,
            col1: "011",
            col2: "012",
            col3: "013",
            col4: "014",
            col5: "015",
            col6: "016",
            col7: "017",
            col8: "018",
            col9: "019",
            col10: "0100",
            col11: "0111",
            col12: "0112",
            col13: "0113",
          },
      ],
    },
    // Add more tiles as needed...
  ];

  // On component mount, set the tile data and default table data/columns
  useEffect(() => {
    setTileData(dashboardTiles);
    if (dashboardTiles.length > 0) {
      setTableColumns(dashboardTiles[0].tableColumns);
      setTableData(dashboardTiles[0].data);
    }
  }, []);

  // When a tile is clicked, update the table columns and data
  const handleTileClick = (id) => {
    const tile = tileData.find((item) => item.id === id);
    if (tile) {
      setTableColumns(tile.tableColumns);
      setTableData(tile.data);
      setActiveTab(id);
    }
  };

  // Generate table columns with filters for the current tableData.
  // This example creates a filter list for each column based on unique values found in tableData.
  const filteredColumns = useMemo(() => {
    return tableColumns.map((column) => {
      const uniqueValues = Array.from(
        new Set(tableData.map((row) => row[column.dataIndex]))
      );
      return {
        ...column,
        // Define filter options for this column
        filters: uniqueValues.map((val) => ({ text: val, value: val })),
        // Basic filtering: check if the column's value contains the filter value.
        onFilter: (value, record) =>
          record[column.dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
      };
    });
  }, [tableData, tableColumns]);

  // Render the dashboard tiles
  const renderTiles = () =>
    tileData.map((item) => (
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
          {/* You can replace this hard-coded number with a dynamic value if needed */}
          <h3 className="font-semibold text-2xl text-white text-left w-full">
            54
          </h3>
          <div className="w-full text-white text-left">{item.title}</div>
        </div>
      </div>
    ));

  return (
    <div className="w-4/6 border mx-auto p-4 flex flex-col gap-6">
      <h1 className="font-semibold text-3xl text-center">Dashboard</h1>
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {renderTiles()}
      </section>
      <section>
        {/* Pass the filteredColumns to your TableComponent */}
        <TableComponent dataSource={tableData} columns={filteredColumns} />
      </section>
    </div>
  );
};

export default MainDashboard;
