
import { Tabs, Tab } from "react-bootstrap"
import Recurring from "./recurring"
import Adjustment from "./adjustment"
import Overtime from "./overtime"
import ContainerWrapper from "../../components/ContainerWrapper"
import Mandatory from "./mandatories"
import Settings from "./settings"

export const PayrollSetting = (props: any) => {
    return (
        <ContainerWrapper contents={<>
            <div className="w-100 px-3 py-5">
              <div>
                <div className="w-100 pt-2">
                    <Tabs defaultActiveKey="tab1" id="my-tabs">
                        <Tab id="payrollsetting_mandatories_tab" eventKey="tab1" title="Mandatories">
                            <Mandatory />
                        </Tab>
                        <Tab id="payrollsetting_adjustments_tab" eventKey="tab2" title="Earnings & Allowances ">
                            <Adjustment/>
                        </Tab>
                        <Tab id="payrollsetting_recurring_tab" eventKey="tab3" title="Deduction or Loan">
                            <Recurring/>
                        </Tab>
                        <Tab id="payrollsetting_overtimesetting_tab" eventKey="tab4" title="Overtime Settings">
                            <Overtime />
                        </Tab>
                        <Tab id="payrollsetting_settings_tab" eventKey="tab5" title="Work Calendar Settings">
                            <Settings />
                        </Tab>
                    </Tabs>
                    </div>
                </div>

            </div>
        </>} />        
    )
}
