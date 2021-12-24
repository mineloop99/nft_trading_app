import { useState, useEffect } from "react";
import {
  Input,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useBuyNft } from "../../../hooks";

export const BuyNftForm: React.FC<{
  marketAddress: string;
}> = (props) => {
  // Set Nft Name
  const [nftName, setnftName] = useState<
    number | string | Array<number | string>
  >("");
  const handleInputTokenIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTokenId = event.target.value === "" ? "" : event.target.value;
    setnftName(newTokenId);
  };

  // Approve and List call
  const { buyNft, buyNftState } = useBuyNft(props.marketAddress);
  const handleBuyNftSubmit = () => {
    return buyNft(String(nftName));
  };

  const isMining = buyNftState.status === "Mining";
  const [showBuyNftSuccess, setShowBuyNftSuccess] = useState(false);
  const handleCloseSnack = () => {
    setShowBuyNftSuccess(false);
  };
  useEffect(() => {
    if (buyNftState.status === "Success") {
      setShowBuyNftSuccess(true);
    }
  }, [buyNftState]);
  return (
    <>
      <div>
        <div>
          <h6>Token Id</h6>
          <Input onChange={handleInputTokenIdChange} />
        </div>
        <br />
        <div>
          <Button
            onClick={handleBuyNftSubmit}
            variant="contained"
            color="primary"
            size="large"
          >
            {isMining ? (
              <CircularProgress color="secondary" size={26} />
            ) : (
              "Buy Token!"
            )}
          </Button>
        </div>
      </div>
      <Snackbar
        open={showBuyNftSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Buyed Nft Succeed!
        </Alert>
      </Snackbar>
    </>
  );
};
