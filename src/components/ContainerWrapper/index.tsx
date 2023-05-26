import DashboardMenu from "../DashboardMenu";
import UserTopMenu from "../UserTopMenu";

const ContainerWrapper = (props: any) => {
    const { contents } = props
    return (
        <div className="body">
            <div className="wraper">
                <div className="w-100">
                    <div className="contentContainer row p-0 m-0" style={{ minHeight: '100vh' }}>
                        <DashboardMenu />
                        <div className="col-md-12 col-lg-10 p-0 m-0">
                            <div className="topHeader">
                                <UserTopMenu />
                            </div>
                            {contents}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContainerWrapper
