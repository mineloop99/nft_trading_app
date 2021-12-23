import { utils } from "ethers";
import { useNftShow } from "../../../hooks/market/useNftShow";
import { useEthers } from "../../../utils";

export const NftShow: React.FC<{ tokenAddress: string }> = (props) => {
  const tokenId = useNftShow(props.tokenAddress);

  console.log("TokenId: " + tokenId);
  return (
    <>
      {tokenId === undefined ? (
        <></>
      ) : (
        <h3>{"Last Token ID Minted:" + String(tokenId)}</h3>
      )}
    </>
  );
};
