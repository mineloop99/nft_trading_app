import { Button } from "@mui/material";
import { useEthers } from "../../../utils";

export const Header: React.FC = () => {
  const { handleConnect, account } = useEthers();

  return (
    <>
      {account !== undefined ? (
        <></>
      ) : (
        <Button onClick={handleConnect} color="primary" variant="contained">
          Connect
        </Button>
      )}

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
