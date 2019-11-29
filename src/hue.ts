import retry from "async-retry";

interface Bridge {
  id: string;
  internalipaddress: string;
}

interface CreateUserResponse {
  error?: {
    type: number;
    address: string;
    description: string;
  };
  success?: {
    username: string;
  };
}

const hexToHue = (hex: string = "#ffffff") => {
  hex = hex.replace("#", "");

  const rgb = {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };

  var r =
      rgb.r > 0.04045
        ? Math.pow((rgb.r + 0.055) / (1.0 + 0.055), 2.4)
        : rgb.r / 12.92,
    g =
      rgb.g > 0.04045
        ? Math.pow((rgb.g + 0.055) / (1.0 + 0.055), 2.4)
        : rgb.g / 12.92,
    b =
      rgb.b > 0.04045
        ? Math.pow((rgb.b + 0.055) / (1.0 + 0.055), 2.4)
        : rgb.b / 12.92,
    X = r * 0.4360747 + g * 0.3850649 + b * 0.0930804,
    Y = r * 0.2225045 + g * 0.7168786 + b * 0.0406169,
    Z = r * 0.0139322 + g * 0.0971045 + b * 0.7141733,
    cx = X / (X + Y + Z),
    cy = Y / (X + Y + Z);

  cx = isNaN(cx) ? 0.0 : cx;
  cy = isNaN(cy) ? 0.0 : cy;

  return [cx, cy];
};

const findBridge = async () => {
  const hueBridge = localStorage.getItem("hue-bridge");

  if (hueBridge) return hueBridge;

  const bridges = await fetch("https://discovery.meethue.com").then(response =>
    response.json()
  );

  if (bridges.length < 1) {
    throw new Error("No bridges found. Try again later.");
  }

  localStorage.removeItem("hue-username");
  localStorage.setItem("hue-bridge", bridges[0].internalipaddress);
  return bridges[0].internalipaddress;
};

const createUser = async (bridge: string): Promise<string> => {
  const hueUsername = localStorage.getItem("hue-username");

  if (hueUsername) {
    const test = await fetch(`http://${bridge}/api/${hueUsername}`);

    if (test.status === 200) {
      return hueUsername;
    }
  }

  return await retry(async bail => {
    const createUserResponse: ReadonlyArray<CreateUserResponse> = await fetch(
      `http://${bridge}/api`,
      {
        method: "POST",
        body: JSON.stringify({ devicetype: "see-you-next-timezone" })
      }
    ).then(response => response.json());

    if (!createUserResponse || createUserResponse.length < 1) {
      throw new Error("Bad response");
    }

    if (!createUserResponse[0].success) {
      throw new Error(
        createUserResponse[0].error
          ? createUserResponse[0].error.description
          : "Unknown error."
      );
    }

    localStorage.setItem(
      "hue-username",
      createUserResponse[0].success.username
    );
    return createUserResponse[0].success.username;
  });
};

export const getBridge = async () => {
  if (localStorage.getItem("hue-bridge")) {
    return localStorage.getItem("hue-bridge");
  }

  return await findBridge();
};

const getHueUsername = async () => {
  if (localStorage.getItem("hue-username")) {
    return localStorage.getItem("hue-username");
  }

  return await hueConnect();
};

export const getHueApi = async (): Promise<string> =>
  `http://${await getBridge()}/api/${await getHueUsername()}`;

const hueConnect = async () => {
  const bridge = await findBridge();
  return await createUser(bridge);
};

export const setLightColour = async (hex: string) => {
  fetch(`${await getHueApi()}/lights/1/state`, {
    method: "PUT",
    body: JSON.stringify({ xy: hexToHue(hex) })
  }).catch(() => {
    localStorage.removeItem("hue-bridge");
    localStorage.removeItem("hue-username");
  });
};

export default hueConnect;
