import React, { Component } from "react";
import AdminLayout from "../../components/AdminView/AdminLayout";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import GeneralMarkup from "../../components/AdminView/GeneralMarkup";
import DestinationMarkup from "../../components/AdminView/DestinationMarkup";

class ProfitMarkupSetup extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render() {        
        return (
            <AdminLayout id="MarkupTabWrap" headerTitle={"Profit Markup Setup"}>
                <Tabs className="nav_tabs" defaultActiveKey="first">
                    <Tab className="nav_link" eventKey="first" title="General Markup">
                        <GeneralMarkup></GeneralMarkup>
                    </Tab>
                    <Tab className="nav_link" eventKey="second" title="Destination Markup">
                        <DestinationMarkup></DestinationMarkup>
                    </Tab>
                </Tabs>
            </AdminLayout>);
    }
}

export default ProfitMarkupSetup;