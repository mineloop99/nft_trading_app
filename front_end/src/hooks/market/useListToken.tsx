import { useEffect, useState } from "react";
import { useContractFunction, useEthers } from "../../utils";
import { utils } from "ethers";
import Market from "../../chain-info/contracts/Market.json";
import Nft from "../../chain-info/contracts/Nft.json";
import { Contract } from "@ethersproject/contracts";
import networkMapping from "../../chain-info/deployments/map.json";
import config from "../../config.json";

export const useListToken = (nftContractAddress: string) => {
  const { account } = useEthers();
  // address
  // abi
  // chainId
  const abi = Market.abi;
  const marketInterface = new utils.Interface(abi);
  const marketAddress =
    networkMapping[config.rinkeby ? "4" : "1337"]["Market"][0];
  const marketContract = new Contract(marketAddress, marketInterface);

  const nftAbi = Nft.abi;
  const nftInfterface = new utils.Interface(nftAbi);
  const nftContract = new Contract(nftContractAddress, nftInfterface);
  // Check Approval For All
  const { send: checkApprovalSend, state: checkApprovalState } =
    useContractFunction(nftContract, "isApprovedForAll", {
      transactionName: "Check Approval For All Nft transfer",
    });
  // Approve For  All
  const { send: approveNftSend, state: approveAndListNftState } =
    useContractFunction(nftContract, "setApprovalForAll", {
      transactionName: "Approve Nft transfer",
    });
  // List
  const { send: listTokenSend, state: listTokenState } = useContractFunction(
    marketContract,
    "listToken",
    {
      transactionName: "List Token",
    }
  );
  const [priceToList, setPriceToList] = useState(["", ""]);

  // Execute
  const approveAndList = (tokenId: string, price: string) => {
    if (account !== undefined) {
      checkApprovalSend(account.address, marketAddress);
    }
    if (
      checkApprovalState.status === "Success" &&
      !checkApprovalState.transaction
    ) {
      approveNftSend(marketAddress, "true");
    }
    setPriceToList([tokenId, price.toString()]);
  };
  //useEffect
  useEffect(() => {
    if (account !== undefined) {
      checkApprovalSend(account.address, marketAddress);
    }
    if (
      checkApprovalState.status === "Success" &&
      checkApprovalState.transaction
    ) {
      setTokenListState(!tokenListState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceToList]);
  const [tokenListState, setTokenListState] = useState(false);
  //useEffect
  useEffect(() => {
    listTokenSend(nftContractAddress, priceToList[0], priceToList[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenListState]);

  const [state, setState] = useState(approveAndListNftState);

  useEffect(() => {
    try {
      if (
        approveAndListNftState.status === "Success" ||
        checkApprovalState.transaction
      ) {
        setState(listTokenState);
      } else {
        setState(approveAndListNftState);
      }
    } catch {}
  }, [approveAndListNftState, checkApprovalState, listTokenState]);
  return { approveAndList, state };
};
