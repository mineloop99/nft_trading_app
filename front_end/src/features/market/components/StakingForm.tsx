import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Input,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useStakeToken } from "../../../hooks";

export const StakingForm: React.FC<{
  tokenAddress: string;
  marketAddress: string;
}> = (props) => {
  // Set Id
  const [nftId, setNftId] = useState<number | string | Array<number | string>>(
    0
  );
  const handleInputTokenIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTokenId =
      event.target.value === "" ? "" : Number(event.target.value);
    setNftId(newTokenId);
  };

  // Approve and Stake call
  const {
    approveAndStake,
    state: approveAndStakeState,
    unstake,
    unstakeState,
    checkReward,
    rewardState,
    claimReward,
    claimRewardState,
  } = useStakeToken(props.tokenAddress);
  const handleStakeSubmit = () => {
    return approveAndStake(String(nftId));
  };

  // Staking
  const isStaking = approveAndStakeState.status === "Mining";
  const [showNftApprovalSuccess, setShowNftApprovalSuccess] = useState(false);
  const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false);
  const [showStakeTokenError, setShowStakeTokenError] = useState(false);
  const handleCloseStakeSnack = () => {
    setShowNftApprovalSuccess(false);
    setShowStakeTokenSuccess(false);
    setShowStakeTokenError(false);
  };
  // Unstaking
  const isUnstaking = unstakeState.status === "Mining";
  const [showUnstakeSuccess, setShowUnstakeSuccess] = useState(false);
  const [showUnstakeError, setShowUnstakeError] = useState(false);
  const handleCloseUnstakeSnack = () => {
    setShowUnstakeSuccess(false);
    setShowUnstakeError(false);
  };
  const handleUnstake = () => {
    return unstake();
  };
  // Claiming
  const isClaiming = claimRewardState.status === "Mining";
  const [showClaimTokenSuccess, setShowClaimTokenSuccess] = useState(false);
  const [showClaimTokenError, setShowClaimTokenError] = useState(false);
  const handleCloseClaimSnack = () => {
    setShowClaimTokenSuccess(false);
    setShowClaimTokenError(false);
  };
  const handleClaimReward = () => {
    return claimReward();
  };

  //Staking State
  useEffect(() => {
    try {
      if (
        approveAndStakeState.transactionName === "Approve Nft transfer" &&
        approveAndStakeState.status === "Success"
      ) {
        setShowNftApprovalSuccess(true);
        setShowStakeTokenSuccess(false);
      }
      if (
        approveAndStakeState.transactionName === "Stake Nft Token" &&
        approveAndStakeState.status === "Success"
      ) {
        setShowNftApprovalSuccess(false);
        setShowStakeTokenSuccess(true);
      }
      if (
        approveAndStakeState.status === "Fail" ||
        approveAndStakeState.status === "Exception"
      ) {
        setShowStakeTokenError(true);
      }
    } catch {}
  }, [approveAndStakeState]);

  // Claiming State
  useEffect(() => {
    try {
      if (
        claimRewardState.transactionName === "Claim All Reward" &&
        claimRewardState.status === "Success"
      ) {
        setShowClaimTokenSuccess(true);
      }
      if (
        claimRewardState.status === "Fail" ||
        claimRewardState.status === "Exception"
      ) {
        setShowClaimTokenError(true);
      }
    } catch {}
  }, [claimRewardState]);
  return (
    <>
      <div>
        <div>
          <h6>Token Id</h6>
          <Input onChange={handleInputTokenIdChange} />
        </div>
        <div>
          {/* Stake */}
          <Button
            onClick={handleStakeSubmit}
            color="primary"
            size="large"
            disabled={isStaking}
          >
            {isStaking ? <CircularProgress size={26} /> : "Stake!!!"}
          </Button>
          {/* Unstake */}
          <Button
            onClick={handleUnstake}
            color="primary"
            size="large"
            disabled={isUnstaking}
          >
            {isUnstaking ? <CircularProgress size={26} /> : "Unstake!!!"}
          </Button>
        </div>

        <div>
          Reward Debt:{" "}
          {rewardState.transaction === undefined ||
          rewardState.transaction === null
            ? "Undefined"
            : rewardState.transaction.toString()}
          <Button onClick={checkReward} color="primary" size="small">
            {isClaiming ? <CircularProgress size={26} /> : "Show Reward!!!"}
          </Button>
          <tr></tr>
          <Button
            onClick={handleClaimReward}
            variant="contained"
            color="primary"
            size="large"
            disabled={isClaiming}
          >
            {isClaiming ? (
              <CircularProgress color="secondary" size={26} />
            ) : (
              "Claim Reward!!!"
            )}
          </Button>
        </div>
      </div>

      {/* Stake */}
      <Snackbar
        open={showNftApprovalSuccess}
        autoHideDuration={5000}
        onClose={handleCloseStakeSnack}
      >
        <Alert onClose={handleCloseStakeSnack} severity="success">
          NFT transfer approved! Now approve the 2nd transaction.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showStakeTokenSuccess}
        autoHideDuration={5000}
        onClose={handleCloseStakeSnack}
      >
        <Alert onClose={handleCloseStakeSnack} severity="success">
          Tokens Staked!
        </Alert>
      </Snackbar>
      {!approveAndStakeState.errorMessage ||
      approveAndStakeState.errorMessage.length === 0 ? (
        <></>
      ) : (
        <Snackbar
          open={showStakeTokenError}
          autoHideDuration={4000}
          onClose={handleCloseStakeSnack}
        >
          <Alert onClose={handleCloseStakeSnack} severity="error">
            {approveAndStakeState.errorMessage}
          </Alert>
        </Snackbar>
      )}

      {/* Claim */}
      <Snackbar
        open={showClaimTokenSuccess}
        autoHideDuration={5000}
        onClose={handleCloseClaimSnack}
      >
        <Alert onClose={handleCloseClaimSnack} severity="success">
          Tokens Claimed!
        </Alert>
      </Snackbar>
      {!claimRewardState.errorMessage ||
      claimRewardState.errorMessage.length === 0 ? (
        <></>
      ) : (
        <Snackbar
          open={showClaimTokenError}
          autoHideDuration={4000}
          onClose={handleCloseClaimSnack}
        >
          <Alert onClose={handleCloseClaimSnack} severity="error">
            {claimRewardState.errorMessage}
          </Alert>
        </Snackbar>
      )}
      {/* Unstake */}
      <Snackbar
        open={showUnstakeSuccess}
        autoHideDuration={5000}
        onClose={handleCloseUnstakeSnack}
      >
        <Alert onClose={handleCloseUnstakeSnack} severity="success">
          Tokens Claimed!
        </Alert>
      </Snackbar>
      {!unstakeState.errorMessage || unstakeState.errorMessage.length === 0 ? (
        <></>
      ) : (
        <Snackbar
          open={showUnstakeError}
          autoHideDuration={5000}
          onClose={handleCloseUnstakeSnack}
        >
          <Alert onClose={handleCloseUnstakeSnack} severity="error">
            {unstakeState.errorMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
