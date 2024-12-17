import { HistoryOutlined, DashboardOutlined, ForkOutlined, ControlOutlined } from '@ant-design/icons';

const stageHomeTabs = [
    {
      title: 'Rail Rolling Control',
      icon: <ControlOutlined />,
      link: "/stage/rollingControl"
    },
    {
      title: 'URM Rolling Verification',
      icon: <DashboardOutlined />,
      link: "/stage/rollingVerification"
    },
    {
      title: 'Rail Finishing Verification',
      icon: <HistoryOutlined />,
      link: "/stage/finishingVerification"
    },
    {
        title: 'HT Sequence',
        icon: <ForkOutlined />,
        link: "/stage/htSequence"
    },
]

export default stageHomeTabs;