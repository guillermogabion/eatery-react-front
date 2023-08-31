import React, { useState } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Card } from "react-bootstrap";



const SquadDirectory = () => {
    return (
        <Card style={{ width: "18rem" }}>
            <Card.Title>Squad Directory</Card.Title>
            <Card.Body>
            <div>
                <h3>I am Squad Directory</h3>
            </div>
            </Card.Body>
        </Card>
       
    )
}

export default SquadDirectory