import { useState, useEffect } from "react";
import {
  Input,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSendNft } from "../../../hooks";

export const SendNftForm: React.FC<{
  tokenAddress: string;
}> = (props) => {
  // Set Nft Id and recipient address
  const [nftId, setnftId] = useState<number | string | Array<number | string>>(
    ""
  );
  const [recipient, setnRecipient] = useState<string>("");
  const handleInputTokenIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTokenId = event.target.value === "" ? "" : event.target.value;
    setnftId(newTokenId);
  };
  const handleInputReceipientChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAddress = event.target.value === "" ? "" : event.target.value;
    setnRecipient(newAddress);
  };
  // Approve and List call
  const { sendNft, sendNftState } = useSendNft(props.tokenAddress);
  const handleSendNftSubmit = () => {
    return sendNft(String(recipient), String(nftId));
  };

  const isMining = sendNftState.status === "Mining";
  const [showSendNftSuccess, setShowSendNftSuccess] = useState(false);
  const handleCloseSnack = () => {
    setShowSendNftSuccess(false);
  };
  useEffect(() => {
    if (sendNftState.status === "Success") {
      setShowSendNftSuccess(true);
    }
  }, [sendNftState]);
  return (
    <>
      <div>
        <div>
          <h5>Recipient Address</h5>
          <Input onChange={handleInputReceipientChange} />
        </div>
        <div>
          <h5>Token Id</h5>
          <Input onChange={handleInputTokenIdChange} />
        </div>
        <br />
        <div>
          <Button
            onClick={handleSendNftSubmit}
            variant="contained"
            color="primary"
            size="large"
          >
            {isMining ? (
              <CircularProgress color="secondary" size={26} />
            ) : (
              "Send Token!"
            )}
          </Button>
        </div>
      </div>
      <Snackbar
        open={showSendNftSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Sended Nft Succeed!
        </Alert>
      </Snackbar>
    </>
  );
};
