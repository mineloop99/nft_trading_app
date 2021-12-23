import networkMapping from "../../chain-info/deployments/map.json";
import { Header, ListForm, MintForm, NftShow } from "./components";
import config from "../../config.json";
export const Market: React.FC = () => {
  const tokenAddress = networkMapping[config.rinkeby ? "4" : "1337"]["Nft"][0];
  const marketAddress =
    networkMapping[config.rinkeby ? "4" : "1337"]["Market"][0];

  return (
    <>
      <Header />
      <h2>Mint Token!</h2>
      <MintForm tokenAddress={tokenAddress} />
      <h2>List Token!</h2>
      <ListForm tokenAddress={tokenAddress} />
      <h2>Token Show!</h2>
      <NftShow tokenAddress={tokenAddress} marketAddress={marketAddress} />
    </>
  );
};
