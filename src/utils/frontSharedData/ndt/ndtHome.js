import { FileSearchOutlined, ExperimentOutlined, EyeOutlined, PieChartOutlined }from '@ant-design/icons';

const ndtHomeTabs = [
    {
      title: 'NDT Calibration',
      icon: <EyeOutlined />,
      link: "/ndt/calibration"
    },
    {
      title: 'Shift Summary',
      icon: <FileSearchOutlined />,
      link: "/ndt/summary"
    },
    {
      title: 'NDT Report',
      icon: <PieChartOutlined />,
      link: "/ndt/report"
    },
    {
        title: 'Test Sample Marking',
        icon: <ExperimentOutlined />,
        link: "/stage/testSampleMarkingList"
    },
]

export default ndtHomeTabs;