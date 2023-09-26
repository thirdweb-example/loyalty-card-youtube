import type { AppProps } from "next/app";
import { ThirdwebProvider, paperWallet, smartWallet } from "@thirdweb-dev/react";
import "../styles/globals.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "mumbai";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId= {process.env.NEXT_PUBLIC_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[
        smartWallet({
          factoryAddress: "Your Factory Address",
          gasless: true,
          personalWallets: [
            paperWallet({
              paperClientId: "Your Paper Wallet Client ID",
            }),
          ]
        })
      ]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
