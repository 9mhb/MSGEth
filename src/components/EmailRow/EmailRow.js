import { Checkbox } from "@material-ui/core";
import React from "react";
import "./EmailRow.css";
import { useHistory } from "react-router-dom";
import { selectMail } from "../../features/mailSlice";
import { useDispatch } from "react-redux";

function EmailRow({
  id,
  username,
  subject,
  description,
  time,
  isUnread,
  account,
  setAccount,
  networkData,
  web3,
  contract,
  inboxUnreadCount,
  setInboxUnreadCount,
  isInSentTab,
  from,
  to
}) {
  const history = useHistory();
  const dispatch = useDispatch();

  const openMail = async () => {
    dispatch(
      selectMail({
        id,
        username,
        subject,
        description,
        time,
        from,
        to,
        isInSentTab
      })
    );
    if (isUnread && !isInSentTab) {
      await contract.current.methods
        .changeStatus(account.address, id, true)
        .send({ from: account.address });
      setInboxUnreadCount(inboxUnreadCount > 0 ? inboxUnreadCount - 1 : 0);
    }
    history.push("/mail");
  };

  return (
    <div onClick={openMail} className="emailRow">
      <h3
        style={{ fontWeight: isUnread ? "bold" : "normal" }}
        className="emailRow-title"
      >
        {username}
      </h3>
      <div className="emailRow-message">
        <h4 style={{ fontWeight: isUnread ? "bold" : "normal" }}>{subject}</h4>
      </div>
      <p
        className="emailRow-time"
        style={{ fontWeight: isUnread ? "bold" : "normal" }}
      >
        {time}
      </p>
    </div>
  );
}

export default EmailRow;
