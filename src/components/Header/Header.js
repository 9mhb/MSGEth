import React from "react";
import "./Header.css";
import { IconButton, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
//import { useSelector, useDispatch } from "react-redux";
//import { selectUser, logout } from "../../features/userSlice";
//import { auth } from "../../firebase.js";
import logo from "./png.png";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function Header({ account, web3, searchTerm, setSearchTerm }) {
  return (
    <div className="header">
      <div className="header-left">
        <IconButton>{/* <MenuIcon /> */}</IconButton>
        <img src={logo} alt="logo" className="img" />
      </div>
      <div className="header-middle">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search mail"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
      <div className="header-right">
        <h2>{account.username}</h2>
        <Typography variant="caption">
          Cost:{" "}
          {web3.current.utils.fromWei(account.currentCost.toString(), "ether")}{" "}
          ETH
        </Typography>
      </div>
    </div>
  );
}

export default Header;
