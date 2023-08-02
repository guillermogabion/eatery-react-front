import { useState, useEffect } from "react"
import moment from "moment"
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

const TableComponent = (props: any) => {
    const { tableHeaders } = props
    return (
        <div>
            <Table responsive>
                <thead>
                    <tr>
                        {tableHeaders.map((data: any, index: any) => {
                            return (
                                <th key={index} style={{ width: 'auto' }}>{data}</th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <td key={index}>Table cell {index}</td>
                        ))}
                    </tr>
                    <tr>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <td key={index}>Table cell {index}</td>
                        ))}
                    </tr>
                    <tr>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <td key={index}>Table cell {index}</td>
                        ))}
                    </tr>
                    <tr>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <td key={index}>Table cell {index}</td>
                        ))}
                    </tr>
                    <tr>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <td key={index}>Table cell {index}</td>
                        ))}
                    </tr>
                </tbody>
            </Table>
            <div className="d-flex justify-content-end">
                <div>
                    <Pagination>
                        {/* <Pagination.First  /> */}
                        <Pagination.Prev onClick={() => {
                            alert("hey")
                        }} />
                        <Pagination.Item active={true}>{1}</Pagination.Item>
                        <Pagination.Item>{2}</Pagination.Item>
                        <Pagination.Item>{3}</Pagination.Item>
                        <Pagination.Item>{4}</Pagination.Item>
                        <Pagination.Item>{5}</Pagination.Item>
                        {/* <Pagination.Ellipsis /> */}

                        {/* <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Item disabled>{14}</Pagination.Item>

                    <Pagination.Ellipsis />
                    <Pagination.Item>{20}</Pagination.Item> */}
                        <Pagination.Next />
                        {/* <Pagination.Last /> */}
                    </Pagination>
                    <div className="text-center text-muted">
                        1-5 of 65 items
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TableComponent
