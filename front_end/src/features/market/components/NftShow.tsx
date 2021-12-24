import { utils } from "ethers";
import { useNftShow } from "../../../hooks";
import { useEthers } from "../../../utils";

const openseaUrl =
  "https://testnets.opensea.io/assets?offset=0&limit=20&asset_contract_address=";
const openseaAssetlUrl = "https://testnets.opensea.io/";
export const NftShow: React.FC<{
  tokenAddress: string;
  marketAddress: string;
}> = (props) => {
  const tokenId = useNftShow(props.tokenAddress);
  const { account } = useEthers();
  const openseaUrlCombine = openseaUrl + props.tokenAddress;
  var openseaPersonalUrlCombine;
  if (account !== undefined) {
    openseaPersonalUrlCombine = openseaAssetlUrl + account.address;
  }
  var openseaContractlUrlCombine;
  if (account !== undefined) {
    openseaContractlUrlCombine = openseaAssetlUrl + props.marketAddress;
  }

  console.log("TokenId: " + tokenId);
  return (
    <>
      {tokenId === undefined || account === undefined ? (
        <></>
      ) : (
        <>
          <div>
            <h3>
              {"Latest Token ID Minted: " +
                (tokenId === null ? "Undefined" : String(tokenId))}
            </h3>
          </div>
          <a href={openseaUrlCombine} target="_blank" rel="noreferrer">
            All Token
          </a>
          <br />
          <a href={openseaPersonalUrlCombine} target="_blank" rel="noreferrer">
            Your Token
          </a>
          <br />
          <a href={openseaContractlUrlCombine} target="_blank" rel="noreferrer">
            Listed Token
          </a>
          <br />
        </>
      )}
    </>
  );
};
