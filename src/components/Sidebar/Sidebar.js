import { Button, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/Inbox";
import NearMeIcon from "@material-ui/icons/NearMe";
import SidebarOption from "./SidebarOption";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openSendMessage } from "../../features/mailSlice";

function Sidebar({
  account,
  setAccount,
  networkData,
  web3,
  contract,
  inboxUnreadCount,
  setInboxUnreadCount,
  sentCount,
  setSentCount,
}) {
  const dispatch = useDispatch();

  const location = useLocation()

  useEffect(() => {
    const prepare = async () => {
      if (account) {
        // To calculate the number of unread messages to show on the sidebar
        const unreadCount = await contract.current.methods
          .calculateUnreadMessages(account.address)
          .call();

        setInboxUnreadCount(unreadCount);
        // To calculate the number of sent messages to show on the sidebar
        const sentCount = await contract.current.methods
          .calculateSentMessages(account.address)
          .call();

        setSentCount(sentCount);
      }
    };
    prepare();
  }, [account?.address]);

  return (
    <div className="sidebar">
      <Button
        className="sidebar-compose"
        onClick={() => dispatch(openSendMessage())}
        startIcon={<AddIcon fontSize="large" />}
      >
        Compose
      </Button>
      <Link to="/" className="sidebar-link">
        <SidebarOption
          Icon={InboxIcon}
          title="Inbox"
          number={inboxUnreadCount}
          selected={location.pathname === "/"}
        />
      </Link>

      <Link to="/sent" className="sidebar-link">
        <SidebarOption
          Icon={NearMeIcon}
          title="Sent"
          number={sentCount}
          selected={location.pathname === "/sent"}
        />
      </Link>
      <div className="sidebar-footer">
        <div className="sidebar-footerIcons"></div>
      </div>
    </div>
  );
}

export default Sidebar;
