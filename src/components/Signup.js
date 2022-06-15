import { Button, Input, OutlinedInput, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Signup.css"
import logo from "./Connect/png.png";
export const Signup = ({
  account,
  setAccount,
  networkData,
  web3,
  contract,
}) => {
  const [username, setUsername] = React.useState("");

  const history = useHistory();

  const handleSignup = async (e) => {
    try {
      await contract.current.methods.addUser(username).send({
        from: account.address,
      });
      setAccount({ ...account, username });
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // height: 300,
        flexDirection: "column",
      }}
    >
      <img style={{ paddingLeft: 12 }} src={logo} alt="logo" height={150} />
      <Typography variant="h4">Signup</Typography>
      <OutlinedInput
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="john_doe"
        style={{
          // padding: 12,
          marginBlock: 16
        }}
      />
      <Button
        variant="contained"
        style={{
          // padding: 12,
        }}
        onClick={handleSignup}
      >
        Signup
      </Button>
    </div>
  );
};
