import { useState } from "react";
import DashboardMenu from "../DashboardMenu";
import UserTopMenu from "../UserTopMenu";

const ContainerWrapper = (props: any) => {
    const { contents } = props
    const [isSideBarActive, setIsSideBarActive] = useState(false);

    let active = "h-full w-[100%] md:w-[45%] sm:w-[45%] lg:w-[385px] lg:relative fixed z-20 sideBarMenu sideBarMenuActive"
    let inactive = "h-full w-[100%] md:w-[45%] sm:w-[45%] lg:w-[385px] lg:relative fixed z-20 sideBarMenu"
    
    return (
        <div className="body">
            <div className="contentContainer flex w-full p-0 m-0 overflow-hidden" >
                <div 
                    className={isSideBarActive ? active : inactive}>
                    <DashboardMenu onToggle={()=> {
                        setIsSideBarActive(false)
                    } } />
                </div>
                <div className="w-full relative h-full overflow-auto">
                    <div className="bg-white w-full px-8 py-3 flex">
                        <UserTopMenu onToggle={() => {
                            setIsSideBarActive(true)
                        }} />
                    </div>
                    <div className="bg-[#F2F3FB] overflow-auto h-full relative" style={{minHeight: '91vh'}}>
                        {contents}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContainerWrapper
