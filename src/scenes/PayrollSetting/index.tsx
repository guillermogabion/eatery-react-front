
import { Tabs, Tab } from "react-bootstrap"
import Recurring from "./recurring"
import Adjustment from "./adjustment"
import Overtime from "./overtime"
import ContainerWrapper from "../../components/ContainerWrapper"
import Mandatory from "./mandatories"

export const PayrollSetting = (props: any) => {
    return (
        <ContainerWrapper contents={<>
            <div className="w-100 px-5 py-5">
              <div>
                <div className="w-100 pt-2">
                    <Tabs defaultActiveKey="tab1" id="my-tabs">
                        <Tab eventKey="tab1" title="Mandatories">
                            <Mandatory />
                        </Tab>
                        <Tab eventKey="tab2" title="Adjustments">
                            <Adjustment/>
                        </Tab>
                        <Tab eventKey="tab3" title="Recurring">
                            <Recurring/>
                        </Tab>
                        <Tab eventKey="tab4" title="Overtime Setting">
                            <Overtime />
                        </Tab>
                    </Tabs>
                    </div>
                </div>

            </div>
        </>} />        
    )
}
