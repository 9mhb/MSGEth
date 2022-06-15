import { IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./SentEmailList.css";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import EmailRow from "../EmailRow/EmailRow";
import { db } from "../../firebase";

function SentEmailList({
  account,
  setAccount,
  networkData,
  web3,
  contract,
  sentCount,
  searchTerm
}) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    readMessages();
  }, [account?.address, sentCount]);

  const readMessages = async () => {
    try {
      const rawMessages = await contract.current.methods
        .readSentMessage(account.address)
        .call();

      const messages = rawMessages
        .map((rawMessage) => {
          return {
            MessageId: rawMessage.MessageId,
            from: rawMessage.from,
            status: rawMessage.status,
            text: rawMessage.text,
            timeStamp: rawMessage.timeStamp,
            to: rawMessage.to,
            sender: rawMessage.sender,
            reciever: rawMessage.reciever,
          };
        })
        .sort((a, b) => {
          return b.timeStamp - a.timeStamp;
        });

      setMessages(messages);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="emailList">
      <div className="emailList-list">
        {messages
          .filter((m) => m.reciever.username.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((message) => (
            <EmailRow
              isInSentTab
              id={message.MessageId}
              key={message.reciever.username + message.MessageId}
              username={message.reciever.username}
              subject={message.text}
              description={message.text}
              to={message.to}
              from={message.from}
              time={new Date(parseInt(message.timeStamp) * 1000).toLocaleString()}
              isUnread={!message.status}
              account={account}
              setAccount={setAccount}
              networkData={networkData}
              web3={web3}
              contract={contract}
            />
          ))}
        {messages.length === 0 && (
          <div className="emailList-noMessages">
            <p>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SentEmailList;
