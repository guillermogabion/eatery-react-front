import React, { useEffect, useState } from "react";

const SortComp = ({ sort, sortDir, sortName }: any) => {
    return sort == sortName ? (
        <span className="order">
            {sortDir == "DESC" ? (
                <span className="dropdown">
                    <span className="caret" style={{ margin: "10px 0px 10px 5px" }}></span>
                </span>
            ) : (
                <span className="dropup">
                    <span className="caret" style={{ margin: "10px 0px" }}></span>
                </span>
            )}
        </span>
    ) : (
        <span className="order">
            <span className="dropdown">
                <span
                    className="caret"
                    style={{
                        margin: "10px 0px 10px 5px",
                        color: "rgb(150 148 148)",
                    }}></span>
            </span>
            <span className="dropup">
                <span
                    className="caret"
                    style={{
                        margin: "10px 0px",
                        color: "rgb(150 148 148)",
                    }}></span>
            </span>
        </span>
    )
}

export default SortComp