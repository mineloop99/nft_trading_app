import { useContractFunction } from "../../utils";
import { utils } from "ethers";
import Market from "../../chain-info/contracts/Market.json";
import { Contract } from "@ethersproject/contracts";
export const useBuyNft = (marketContractAddress: string) => {
  const marketAbi = Market.abi;
  const marketInfterface = new utils.Interface(marketAbi);
  const marketContract = new Contract(marketContractAddress, marketInfterface);
  // Check Price
  const { send: checkBuySend, state: checkBuyState } = useContractFunction(
    marketContract,
    "getAmoutListing",
    {
      transactionName: "Check amount Nft",
    }
  );
  // Buy
  const { send: buyNftSend, state: buyNftState } = useContractFunction(
    marketContract,
    "buyToken",
    {
      transactionName: "Buy Nft",
    }
  );
  const buyNft = (tokenId: string) => {
    checkBuySend(tokenId);
    if (
      checkBuyState.status === "Success" &&
      checkBuyState.transaction !== undefined
    ) {
      let overrides = {
        value: checkBuyState.transaction.toString(),
      };
      buyNftSend(tokenId, overrides);
    }
  };

  return { buyNft, buyNftState };
};
