import React, { useContext } from 'react'
import { Input } from 'antd';
import {HomeOutlined, IdcardOutlined, FileTextOutlined, RobotOutlined, LineChartOutlined, ProfileOutlined, UserOutlined} from '@ant-design/icons';
// import Home from './home/Form1';
// import Duty from './duty/Form2';
// import Records from './records/Form3';
// import AiSystem from './aiSystem/Form4';
// import DataAnalysis from './dataAnalysis/Form5';
// import IsoReports from './isoReports/IsoReports';
// import Admin from './admin/Admin';
import { ActiveTabContext } from '../../context/dashboardActiveTabContext';
import Form1 from './indentCreation/Form1';
import Form2 from './indentApproval/Form2';
import Form3 from './indentModification/Form3';
import Form4 from './tenderRequest/Form4';
import Form5 from './tenderEvaluation/Form5';
import Form6 from './communityNomination/Form6';
import Form7 from './purchaseOrder/Form7';
import Form8 from './approvalWorkflow/Form8';
import Form9 from './performanceWarranty/Form9';
import Form10 from './deliveryTracking/Form10';

const { Search } = Input;


const dashboardTabItems = [
//   {
//     id: 1,
//     title: 'Indent Creation Form',
//     // icon: <HomeOutlined />
//     icon: <FileTextOutlined />
//   },
//   {
//     id: 2,
//     title: 'Indent Approval Form',
//     // icon: <IdcardOutlined />
//     icon: <FileTextOutlined />
//   },
//   {
//     id: 3,
//     title: 'Indent Modification Form',
//     icon: <FileTextOutlined />
//   },
//   {
//     id: 4,
//     title: 'Tender Request Form',
//     // icon: <RobotOutlined />
//     icon: <FileTextOutlined />
//   },
//   {
//     id: 5,
//     title: 'Tender Evaluation Input Form',
//     // icon: <LineChartOutlined />,
//     icon: <FileTextOutlined />
//   },
// //   {
// //     id: 6,
// //     title: 'ISO Reports',
// //     icon: <ProfileOutlined />
// //   },
// //   {
// //     id: 7,
// //     title: 'Admin',
// //     icon: <UserOutlined />
// //   },
]

const Dashboard = () => {
  // const [activeTab, setActiveTab] = useState(1)
  const {activeTab, setActiveTab} = useContext(ActiveTabContext)

  const renderDashboardTabItems = () => 
    dashboardTabItems.map(item=> {
      return (
        <div 
          key={item.id} 
          onClick={() => setActiveTab(item.id)}
          className={`cursor-pointer ${activeTab === item.id ? 'border-b-2 border-pink' : ''}`}
        >
          <span className='dashboard-tab-icon'>{item.icon}</span> <br />
          <div className='text-center w-full'>{item.title}</div>
          </div>
      )
    })

    const renderTab = () => {
      switch (activeTab){
        case 1:
          return <Form1 />
        case 2:
          return <Form2 />
        case 3:
          return <Form3 />
        case 4:
          return <Form4 />
        case 5:
          return <Form5 />
        case 6:
          return <Form6 />
        case 7:
          return <Form7 />
        case 8:
            return <Form8/>
        case 9:
            return <Form9 />
        case 10:
            return <Form10 />
        default:
          break
      }
    }

  return (
    <div className='flex flex-col mt-15 gap-4 md:gap-8 bg-white p-2 w-full md:w-4/5 mx-auto h-[100vh] md:h-fit overflow-y-auto'>
    {/* <section>
      <Search placeholder='Search' className='dashboard-search' />
    </section> */}
    <section>
    {/* <div className="dashboard-tabs grid grid-cols-4 gap-4 bg-darkBlue rounded text-offWhite p-4">
      {renderDashboardTabItems()}
    </div> */}
    </section>
    <section>
      {renderTab()}
    </section>
    </div>
  )
}

export default Dashboard