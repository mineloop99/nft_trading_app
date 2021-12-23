import { Market } from "./features/market/Market";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

declare let window: any;

export const App: React.FC = () => {
  return <Market />;
};
export default App;
