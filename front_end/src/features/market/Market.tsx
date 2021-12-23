import { MintForm } from "./components/MintForm";
import { ListForm } from "./components/ListForm";
import networkMapping from "../../chain-info/deployments/map.json";
import { Header } from "./components/Header";

export const Market: React.FC = () => {
  const tokenAddress = networkMapping["4"]["Nft"][0];

  return (
    <>
      <Header />
      <MintForm tokenAddress={tokenAddress} />
      <ListForm tokenAddress={tokenAddress} />
    </>
  );
};
