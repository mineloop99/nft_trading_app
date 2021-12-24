import { useContractFunction, useEthers } from "../../utils";
import { utils } from "ethers";
import Nft from "../../chain-info/contracts/Nft.json";
import { Contract } from "@ethersproject/contracts";

export const useSendNft = (nftContractAddress: string) => {
  const { account } = useEthers();
  const nftAbi = Nft.abi;
  const nftInfterface = new utils.Interface(nftAbi);
  const nftContract = new Contract(nftContractAddress, nftInfterface);
  // approve
  const { send: sendNftSend, state: sendNftState } = useContractFunction(
    nftContract,
    "transferFrom",
    {
      transactionName: "Send Nft",
    }
  );
  const sendNft = (receipent: string, tokenId: string) => {
    if (account !== undefined) {
      return sendNftSend(account.address, receipent, tokenId);
    }
  };

  return { sendNft, sendNftState };
};
