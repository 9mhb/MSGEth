import { Button } from "@material-ui/core";
import React from "react";
import "./Connect.css";
import logo from "./png.png";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import { ethers } from "ethers";
import MsgEth from "../../abis/MSGETH.json";

export const connect = async ({
  account,
  setAccount,
  networkData,
  web3,
  contract,
  history,
}) => {
  // Load web3, accounts, and contract
  if (window.ethereum) {
    web3.current = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (web3.current) {
    web3.current = new Web3(web3.current.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }

  const networkId = await web3.current.eth.net.getId();
  networkData.current = MsgEth.networks[networkId];

  // Load contract
  contract.current = new web3.current.eth.Contract(
    MsgEth.abi,
    networkData.current.address
  );

  // Load metamask account
  const accounts = await web3.current.eth.getAccounts();
  //the address connected to metaMask
  const user = await contract.current.methods.UsersMap(accounts[0]).call();
  if (user.username !== "") {
    setAccount({ ...user, address: accounts[0] });
  } else {
    setAccount({ ...user, address: accounts[0] });
    history.push("/signup");
  }

  const { ethereum } = window;
  ethereum.on("accountsChanged", async (accounts) => {
    if (accounts.length !== 0) {
      const newAccount = accounts[0];
      const user = await contract.current.methods.UsersMap(newAccount).call();
      if (user.username !== "") {
        setAccount({ ...user, address: accounts[0] });
      } else {
        setAccount({ ...user, address: accounts[0] });
        history.push("/signup");
      }
    } else {
      setAccount(null);
    }
  });
};

export const ConnectButton = ({
  account,
  setAccount,
  networkData,
  web3,
  contract,
}) => {
  const history = useHistory();
  return (
    
    <div className="login-containar">
      <h2>Welcome to</h2>
      <div>
        
        <img src={logo} alt="logo" style={{ paddingLeft: 12 }} height={150} />
       
        
        <Button
          variant="contained"
          style={{display:"block",
                  backgroundColor:"rgb(67 67 67)",
                  color:"white",
                  marginLeft: "60px"}}
          onClick={() =>
            connect({
              account,
              setAccount,
              networkData,
              web3,
              contract,
              history,
            })
            
          }
        >
          Connect Wallet
        </Button>

      </div>
      <br></br>
      <div className="content">
          <h4>This is a decentralized application to send messages via blockchain</h4>
          <h5>To use this dApp here's a simple manual:</h5>
          <p>First! <a href="https://metamask.io/">Install MetaMask Wallet</a></p>
          <p>After connecting with your wallet, you will need to SignUp with your Username </p>
          <p>This Username will be shown to others when you send them messages so please make it meaningful</p>
          <p>You will be  able to send messages to others using their wallet public key</p>
          <p>Also you will see your Inbox messages and Sent messages </p>
          <p>Once you open a message from your inbox, it will be marked as read </p>
          <p>You will see the unread messages with Bold font, and the read messages will be with light font</p>
          <p>If you see a light font message in the Sent messages, this means that the reciever has read your message</p>
        </div>
    </div>
  );
};

function Connect({ account, setAccount, networkData, web3, contract }) {
  const history = useHistory();

  useEffect(() => {
    if (account) {
      history.push("/");
    }
  }, [account?.address]);

  return null;
}

export default Connect;
