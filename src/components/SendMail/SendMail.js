import React, { useState } from "react";
import "./SendMail.css";
import Web3 from "web3";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { closeSendMessage } from "../../features/mailSlice";
import { db } from "../../firebase";
import firebase from "firebase";

function SendMail({
  account,
  setAccount,
  networkData,
  web3,
  contract,
  sentCount,
  setSentCount,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const [recieverCost, setRecieverCost] = useState(null);
  const [receiverUsername,setUserName]= useState(null);

  const onSubmit = async (formData) => {

    try {
      //Calculate Cost
      const cost = await contract.current.methods
        .getUserInboxCost(formData.to)
        .call();
      //Send message based on the calculated Cost (Wei)
      await contract.current.methods
        .sendMessage(formData.message, formData.to)
        .send({
          from: account.address,
          value: cost,
        });

      setSentCount(parseInt(sentCount) + 1);
    } catch (error) {
      alert("The user is not registered")
    }

    dispatch(closeSendMessage());
  };

  return (
    <div className="sendMail">
      <div className="sendMail-header">
        <h3>New Message</h3>
        <CloseIcon
          onClick={() => dispatch(closeSendMessage())}
          className="sendMail-close"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          name="to"
          placeholder="To"
          type="text"
          onChange={(e) => {
            register("to", {
              required: true,
              validate: (value) =>
                web3.current?.utils.isAddress(value) &&
                value !== account.address,
            }).onChange(e);
            const run = async () => {
              if (
                web3.current?.utils.isAddress(e.target.value) &&
                e.target.value !== account.address
              ) {
                const isUser = await contract.current.methods.isUser(
                  e.target.value
                );
                if (isUser) {
                  const cost = await contract.current.methods
                    .getUserInboxCost(e.target.value)
                    .call();
                  const receiverName= await contract.current.methods
                    .getUsername(e.target.value)
                    .call();  

                  setRecieverCost(cost);
                  setUserName(receiverName)
                }
              }
            };
            run();
          }}
        />
        {recieverCost && (
          <div className="sendMail-recieverCost">
            <p>
              Reciever cost:{" "}
              <span>
                {web3.current.utils.fromWei(recieverCost.toString(), "ether")}{" "}
                ETH
              </span>
              <br/>
              Reciever name:{" "}
              <span>
                {receiverUsername}{" "}
                
              </span>
            </p>
          </div>
        )}
        {errors.to && (
          <p className="sendMail-error">Reciever address is invalid</p>
        )}
        <textarea
          name="message"
          placeholder="Message"
          type="text"
          className="sendMail-message"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <p className="sendMail-error">Message is Required!</p>
        )}
        <div className="sendMail-options">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="sendMail-send"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SendMail;
