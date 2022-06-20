import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Mail from "./components/Mail/Mail";
import EmailList from "./components/EmailList/EmailList";
import SendMail from "./components/SendMail/SendMail";
import { useSelector } from "react-redux";
import { selectSendMessageIsOpen } from "./features/mailSlice";
import GoToRootOnAccountChange, { connect, ConnectButton } from "./components/Connect/Connect";
import { useHistory } from "react-router-dom";
import { Signup } from "./components/Signup";
import { useLocation } from "react-router-dom";
import SentEmailList from "./components/SentEmailList/SentEmailList";

function App() {
  const sendMessageIsOpen = useSelector(selectSendMessageIsOpen);
  const [account, setAccount] = React.useState(null);

  const [inboxUnreadCount, setInboxUnreadCount] = useState(null);
  const [sentCount, setSentCount] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const networkData = useRef(null);
  const web3 = useRef(null);
  const contract = useRef(null);

  const history = useHistory();
  const location = useLocation();


  useEffect(() => {
    connect({ account, setAccount, networkData, web3, contract, history });
  }, []);

  useEffect(() => {
    const prepare = async () => {
      if (account) {
        const cost = await contract.current.methods
          .getUserInboxCost(account.address)
          .call();

        setAccount({ ...account, currentCost: cost });
      }
    };
    prepare();
  }, [account?.address, inboxUnreadCount]);

  if (location.pathname === "/signup") {
    return (
      <Signup
        account={account}
        setAccount={setAccount}
        networkData={networkData}
        web3={web3}
        contract={contract}
      />
    );
  }

  if (!account) {
    return (
      <ConnectButton
        account={account}
        setAccount={setAccount}
        networkData={networkData}
        web3={web3}
        contract={contract}
      />
    );
  }

  return (
    <div className="app">
      <Header account={account} web3={web3} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="app-body">
        <Router>
          <GoToRootOnAccountChange
            account={account}
            setAccount={setAccount}
            networkData={networkData}
            web3={web3}
            contract={contract}
          />
          <Sidebar
            account={account}
            setAccount={setAccount}
            networkData={networkData}
            web3={web3}
            contract={contract}
            inboxUnreadCount={inboxUnreadCount}
            setInboxUnreadCount={setInboxUnreadCount}
            sentCount={sentCount}
            setSentCount={setSentCount}
          />
          <Switch>
            <Route path="/mail" component={Mail}></Route>
            <Route path="/" exact>
              <EmailList
                account={account}
                setAccount={setAccount}
                networkData={networkData}
                web3={web3}
                contract={contract}
                inboxUnreadCount={inboxUnreadCount}
                setInboxUnreadCount={setInboxUnreadCount}
                searchTerm={searchTerm}
              />
            </Route>
            <Route path="/sent" exact>
              <SentEmailList
                account={account}
                setAccount={setAccount}
                networkData={networkData}
                web3={web3}
                contract={contract}
                inboxUnreadCount={inboxUnreadCount}
                setInboxUnreadCount={setInboxUnreadCount}
                sentCount={sentCount}
                searchTerm={searchTerm}
              />
            </Route>
          </Switch>
        </Router>
      </div>

      {sendMessageIsOpen && (
        <SendMail
          account={account}
          setAccount={setAccount}
          networkData={networkData}
          web3={web3}
          contract={contract}
          sentCount={sentCount}
          setSentCount={setSentCount}
        />
      )}
    </div>
  );
}

export default App;
