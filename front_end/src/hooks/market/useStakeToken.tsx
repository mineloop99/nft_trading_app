import { useEffect, useState } from "react";
import { useContractFunction, useEthers } from "../../utils";
import { utils } from "ethers";
import Staking from "../../chain-info/contracts/Staking.json";
import Nft from "../../chain-info/contracts/Nft.json";
import { Contract } from "@ethersproject/contracts";
import networkMapping from "../../chain-info/deployments/map.json";
import config from "../../config.json";

export const useStakeToken = (nftContractAddress: string) => {
  const { account } = useEthers();
  // address
  // abi
  // chainId
  const abi = Staking.abi;
  const stakingInterface = new utils.Interface(abi);
  const stakingAddress =
    networkMapping[config.rinkeby ? "4" : "1337"]["Staking"][0];
  const stakingContract = new Contract(stakingAddress, stakingInterface);

  const nftAbi = Nft.abi;
  const nftInfterface = new utils.Interface(nftAbi);
  const nftContract = new Contract(nftContractAddress, nftInfterface);
  // Check Approval For All
  const { send: checkApprovalSend, state: checkApprovalState } =
    useContractFunction(nftContract, "isApprovedForAll", {
      transactionName: "Check Approval For All Nft transfer",
    });
  // Approve For  All
  const { send: approveNftSend, state: approveAndStakeNftState } =
    useContractFunction(nftContract, "setApprovalForAll", {
      transactionName: "Approve Nft transfer",
    });
  // Stake
  const { send: stakeTokenSend, state: stakeTokenState } = useContractFunction(
    stakingContract,
    "enterStaking",
    {
      transactionName: "Stake Nft Token",
    }
  );
  // Unstake
  const { send: unstakeSend, state: unstakeState } = useContractFunction(
    stakingContract,
    "leaveStaking",
    {
      transactionName: "Un stake Nft Token",
    }
  );
  const unstake = () => {
    if (account !== undefined && account !== null) {
      unstakeSend();
    }
  };
  // Check Reward Debt
  const { send: callReward, state: rewardState } = useContractFunction(
    stakingContract,
    "getUserReward",
    {
      transactionName: "Get User Reward",
    }
  );
  const checkReward = () => {
    if (account !== undefined && account !== null) {
      callReward(account.address);
    }
  };
  // Claim Reward
  const { send: callClaimReward, state: claimRewardState } =
    useContractFunction(stakingContract, "claimReward", {
      transactionName: "Claim All Reward",
    });
  const claimReward = () => {
    if (account !== undefined && account !== null) {
      callClaimReward();
    }
  };
  // Execute
  const approveAndStake = async (tokenId: string) => {
    if (account !== undefined) {
      checkApprovalSend(account.address, stakingAddress);
    }
    if (
      checkApprovalState.status === "Success" &&
      !checkApprovalState.transaction
    ) {
      approveNftSend(stakingAddress, "true");
      stakeTokenSend(tokenId);
    } else if (checkApprovalState.transaction) {
      stakeTokenSend(tokenId);
    }
  };

  const [state, setState] = useState(approveAndStakeNftState);
  // Staking
  useEffect(() => {
    try {
      if (
        approveAndStakeNftState.status === "Success" ||
        checkApprovalState.transaction
      ) {
        setState(stakeTokenState);
      } else {
        setState(approveAndStakeNftState);
      }
    } catch {}
  }, [approveAndStakeNftState, checkApprovalState, stakeTokenState]);

  return {
    approveAndStake,
    state,
    unstake,
    unstakeState,
    checkReward,
    rewardState,
    claimReward,
    claimRewardState,
  };
};
