import { ConnectWallet, Web3Button, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { LOYALTY_CARD_CONTRACT_ADDRESS } from "../const/addresses";
import { NFTCard } from "../components/nft";

const Home: NextPage = () => {
  const address = useAddress();
  const {
    contract
  } = useContract(LOYALTY_CARD_CONTRACT_ADDRESS);
  const {
    data: nfts,
    isLoading: nftsLoading,
  } = useOwnedNFTs(contract, address);

  const claimLoyaltyCard = async () => {
    try {

      const signedPayloadReq = await fetch("/api/generate-sig", {
        method: "POST",
        body: JSON.stringify({
          address,
        }),
      });
      
      console.log("Got response from server");
      const json =  await signedPayloadReq.json();

      if (!signedPayloadReq.ok) {
        alert(json.error);
      }

      const signedPayload = json.signedPayload;

      const loyaltyCard = await contract?.erc721.signature.mint(signedPayload);
      alert("Loyalty Card cliamed!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <ConnectWallet 
            modalSize="wide"
            btnTitle="Login"
          />
          {address ? (
            <>
              {!nftsLoading && (
                nfts && nfts.length > 0 ? (
                  nfts.map((nft) => (
                    <NFTCard
                      key={nft.metadata.id}
                      nft={nft}
                      tokenID={nft.metadata.id}
                    />
                  ))
                ) : (
                  <>
                    <p>No Loyalty Card</p>
                    <Web3Button
                      contractAddress={LOYALTY_CARD_CONTRACT_ADDRESS}
                      action={() => claimLoyaltyCard()}
                    >Claim Loyalty Card</Web3Button>
                  </>
                  
                )
              )}
            </>
          ) : (
            <p>Login to view loyalty card.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
