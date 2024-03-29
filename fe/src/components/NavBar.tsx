import React, { Component } from "react";

import {
  Alignment,
  Classes,
  Navbar,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";
import { Link } from "react-router-dom";

import "./NavBar.css";

class NavBar extends Component {
  public render(): React.ReactNode {

    const navLinkClassesWithIcon = (iconName: string) =>
      `${Classes.MINIMAL} ${Classes.BUTTON} ${Classes.iconClass(iconName)}`;

    return (
      <Navbar className={"NavBar"}>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Inox &lt;-&gt; Rusted</NavbarHeading>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <Link
            className={navLinkClassesWithIcon("heat-grid")}
            to={"/overview"}>
            Overview
          </Link>
          <Link
            className={navLinkClassesWithIcon("map")}
            to={"/location"}>
            Location
          </Link>
          <Link
            className={navLinkClassesWithIcon("satellite")}
            to={"/control"}>
            Control
          </Link>
          <Link
            className={navLinkClassesWithIcon("cog")}
            to={"/settings"}>
            Settings
          </Link>
          <Link
            className={navLinkClassesWithIcon("user")}
            to={"/login"}>
            Account
          </Link>
        </NavbarGroup>
      </Navbar>
    );
  }
}

export default NavBar;
