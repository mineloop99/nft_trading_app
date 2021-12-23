import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
declare let window: any;

export type Account = {
  address: string;
  etherBalance: string;
  isConnected: false;
};

export function useEthers() {
  const [account, setAccount] = useState<Account>();
  const handleConnect = () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {})
      .catch((error: any) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log("Please connect to MetaMask.");
        } else {
          console.error(error);
        }
      });
  };
  const [state, setState] = useState("");

  useEffect(() => {
    async function fetchData() {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      let address = await signer.getAddress();
      let balance = String(formatEther(await provider.getBalance(address)));
      let isConnected = window.ethereum.isConnected();
      let _account: Account = {
        address: address,
        etherBalance: balance,
        isConnected: isConnected,
      };
      setAccount(_account);
      return address;
    }
    fetchData();
  }, [state]);
  window.ethereum.on("accountsChanged", function (account: any) {
    setState(account);
  });
  window.ethereum.on("chainChanged", function (chainId: string) {
    setState(chainId);
  });
  return { handleConnect, state, account };
}
