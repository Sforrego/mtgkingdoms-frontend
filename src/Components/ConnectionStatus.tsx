import { useAppContext } from '../Context/AppContext';
import { IfElse, OnTrue, OnFalse } from "conditional-jsx";

export const ConnectionStatus = () => {
  const { isConnected } = useAppContext();

  return (
    <IfElse condition={isConnected}>
      <OnTrue key="Connected">
        <div className="greenCircle" title="Connected to the server."/>
      </OnTrue>
      <OnFalse key="notConnected">
        <div className="redCircle" title="Disconnected from the server."/>
      </OnFalse>
    </IfElse>
  );
};