import React from "react";
// import { ReactComponent as Logo } from "../assets/images/logo.svg";
import MyLogo from "../assets/images/iia-logo.png";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import IconBtn from "./DKG_IconBtn"
const Header = ({toggleCollapse}) => {
  const navigate = useNavigate();
  return (
    <header className="bg-offWhite shadow-md py-4 px-4 flex justify-between items-center sticky top-0 w-full z-20">
      <div className="flex gap-4 items-center">
        <span>
          <IconBtn icon={MenuOutlined} className="shadow-none"  onClick={toggleCollapse}/>
        </span>
        <span onClick={() => navigate('/')}>
          <img src={MyLogo} height={10} width={50} />
        </span>
      </div>
      <div className="flex gap-4">
        Hello User !
      </div>
    </header>
  );
};

export default Header;
