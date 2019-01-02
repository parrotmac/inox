import React, {Component} from 'react'
import {Link} from "react-router-dom";
import {
    Alignment,
    Button,
    Classes,
    H5,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Switch,
} from "@blueprintjs/core";

class NavBar extends Component {
    render(): JSX.Element {
        return (
            <div>
                <Navbar>
                    <NavbarGroup align={Alignment.LEFT}>
                        <NavbarHeading>Blueprint</NavbarHeading>
                        <NavbarDivider />

                <Link className={`${Classes.MINIMAL} ${Classes.BUTTON} ${Classes.iconClass("key")}`} to={"/login"}>
                    Login
                </Link>
                <Link className={`${Classes.MINIMAL} ${Classes.BUTTON} ${Classes.iconClass("home")}`} to={"/"}>
                    Home
                </Link>

                        {/*<Button className={Classes.MINIMAL} icon="home" text="Home" />*/}
                        {/*<Button className={Classes.MINIMAL} icon="document" text="Files" />*/}
                    </NavbarGroup>
                </Navbar>
            </div>
        )
    }
}

export default NavBar