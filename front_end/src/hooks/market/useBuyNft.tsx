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
    const a = async () => {
      var result = await checkBuySend();
      console.log(result);
    };
    a();
    return buyNftSend(tokenId, { value: checkBuyState.transaction });
  };

  return { buyNft, buyNftState };
};
