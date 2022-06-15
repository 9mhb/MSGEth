import React from "react";
import "./Mail.css";
import { useHistory } from "react-router-dom";
import { selectOpenMail } from "../../features/mailSlice";
import { useSelector } from "react-redux";

function Mail() {
  const history = useHistory();

  const selectedMail = useSelector(selectOpenMail);
  return (
    <div className="mail">
      <div className="mail-body">
        <div className="mail-bodyHeader">
        {selectedMail?.isInSentTab ? ( 
          <p><span className="bloding">To:</span> {selectedMail?.username}</p>
        ): (
          <p><span className="bloding">from:</span> {selectedMail?.username}</p>
        )}
        <p className="mail-time">{selectedMail?.time}</p>
        </div>

        <div></div>

        <div className="mail-message">
          {selectedMail?.isInSentTab ? (
            <p className="bloding"> Address: {selectedMail?.to}</p>
          ) : (
            <p className="bloding"> Address: {selectedMail?.from}</p>
          )}
          <p>{selectedMail?.description}</p>
        </div>
      </div>
    </div>
  );
}

export default Mail;
