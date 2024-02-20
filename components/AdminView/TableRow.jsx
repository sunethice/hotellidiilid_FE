import React, { Component } from "react";
// import "../../../css/AdminTransfer.css";

class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <tr>
                {Object.values(this.props.tableRow).map((row) =>{
                    return <td key={this.props.key} className={this.props.className?this.props.className:""}>{row}</td>;
                })}
            </tr>
        );
    }
}

export default TableRow;
