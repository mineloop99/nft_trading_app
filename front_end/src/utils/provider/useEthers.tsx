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
    checkNetwork();
  });
  window.ethereum.on("chainChanged", function (chainId: string) {
    setState(chainId);
    checkNetwork();
  });
  // Check if MetaMask is installed
 // MetaMask injects the global API into window.ethereum
  const checkNetwork = async() => {
    if (window.ethereum) {
      try {
        // check if the chain to connect to is installed
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x4' }], // chainId must be in hexadecimal numbers
        });
      } catch (error:any) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x4',
                  rpcUrl: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
    } else {
      // if no window.ethereum then MetaMask is not installed
      alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    } 
  }
  return { handleConnect, state, account,checkNetwork };
}
