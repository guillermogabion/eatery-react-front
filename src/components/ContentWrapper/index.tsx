import { useState, useEffect } from "react"
import moment from "moment"
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { BsThreeDots } from "react-icons/bs";

const ContentWrapper = (props: any) => {
    const { name, content, hasMenu = true } = props
    return (
        <div className="contentWrapperContainer">
            <div className="contentWrapperContainerHeader">
                {name}
                {hasMenu ? <BsThreeDots size={25} /> : null}

            </div>
            <div className="contentWrapperContainerContent">
                {content}
            </div>
        </div>
    )
}

export default ContentWrapper
