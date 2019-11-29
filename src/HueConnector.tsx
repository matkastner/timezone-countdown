import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import hueConnect, { getBridge } from "./hue";

const HueBridge: React.FC = () => {
  const [bridge, setBridge] = useState<string | null>(null);

  getBridge().then(setBridge);

  if (!bridge) {
    return (
      <div>
        No bridge found. Check that you are connected to the same WiFi and try
        again later.
      </div>
    );
  }

  return <div>Found bridge: {bridge}.</div>;
};

const HueConnector: React.FC = () => {
  const [hueBridge, setBridge] = useState<string | null>(
    localStorage.getItem("hue-bridge")
  );
  const [loadingBridge, setLoadingBridge] = useState(false);

  const [hueUsername, setUsername] = useState<string | null>(
    localStorage.getItem("hue-username")
  );
  const [loadingUsername, setLoadingUsername] = useState(false);

  if (!hueBridge) {
    getBridge().then(setBridge);
  }

  const createUser = () => {
    setLoadingUsername(true);

    hueConnect()
      .then(setUsername)
      .then(() => setLoadingUsername(false));
  };

  return (
    <Card className="m-3">
      <Card.Header>Connect to Hue</Card.Header>
      <Card.Body>
        {loadingBridge && <div>Looking for a hue bridge...</div>}
        {hueBridge && <div>Found bridge: {hueBridge}</div>}
        {loadingUsername && (
          <div>Creating a new user, please press the link button...</div>
        )}
        {hueUsername ? (
          <div>Found user: {hueUsername}</div>
        ) : (
          <button onClick={createUser}>Connect hue bridge...</button>
        )}
      </Card.Body>
    </Card>
  );
};

export default HueConnector;
