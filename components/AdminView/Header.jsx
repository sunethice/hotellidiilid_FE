import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const Header = ({hdTitle}) => {

    const onSignoutClick = () => {
        console.log('signout clicked')
    }

    return (
        <Navbar className="sticky-top-admin navBar w-100" expand="lg" style={{backgroundColor:"#2c2c2c"}}>
            <Navbar.Brand style={{marginLeft:"1.5rem", color:"#25aae1"}}>{hdTitle}</Navbar.Brand>
            <Navbar.Collapse className="order-3" id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link
                        className="px-3"
                        href=""
                        onClick={() => onSignoutClick()}
                    >
                        Signout
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
