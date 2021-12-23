import { useEthers } from "../../utils";
import { ethers, utils } from "ethers";
import Nft from "../../chain-info/contracts/Nft.json";
import { Contract } from "@ethersproject/contracts";
import { useState } from "react";

declare let window: any;
export const useNftShow = (nftContractAddress: string) => {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const [tokenId, setTokenId] = useState("");
  const { account } = useEthers();
  const nftAbi = Nft.abi;
  const nftInfterface = new utils.Interface(nftAbi);
  const nftContract = new Contract(nftContractAddress, nftInfterface, provider);
  if (account !== undefined) {
    nftContract.on("Transfer", (_, __, _tokenId) => {
      setTokenId(String(_tokenId));
    });
  }
  return tokenId;
};
