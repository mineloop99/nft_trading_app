import { Button } from "@mui/material";
import { useEthers } from "../../../utils";
import networkMapping from "../../../chain-info/deployments/map.json";

export const Header: React.FC = () => {
  const { handleConnect, account } = useEthers();
  const nftContract =
    "https://rinkeby.etherscan.io/address/" + networkMapping["4"]["Nft"][0];
  const marketContract =
    "https://rinkeby.etherscan.io/address/" + networkMapping["4"]["Market"][0];
  const rewardTokenContract =
    "https://rinkeby.etherscan.io/address/" +
    networkMapping["4"]["RewardToken"][0];
  const stakingContract =
    "https://rinkeby.etherscan.io/address/" + networkMapping["4"]["Staking"][0];

  return (
    <>
      {account !== undefined ? (
        <></>
      ) : (
        <Button onClick={handleConnect} color="primary" variant="contained">
          Connect
        </Button>
      )}
      <div>
        Token Contract:
        <a href={nftContract} target="_blank" rel="noreferrer">
          {networkMapping["4"]["Nft"][0]}
        </a>
        Market Listing Contract:
        <a href={marketContract} target="_blank" rel="noreferrer">
          {networkMapping["4"]["Market"][0]}
        </a>
        Reward Token Contract:
        <a href={rewardTokenContract} target="_blank" rel="noreferrer">
          {networkMapping["4"]["RewardToken"][0]}
        </a>
        Staking Pool Contract:
        <a href={stakingContract} target="_blank" rel="noreferrer">
          {networkMapping["4"]["Staking"][0]}
        </a>
      </div>
      {account !== undefined ? (
        <div>
          {account.address && <p>Account: {account.address}</p>}
          {account.etherBalance && <p>Balance: {account.etherBalance}</p>}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
