import { NFT, ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
import { LOYALTY_CARD_CONTRACT_ADDRESS } from "../const/addresses";
import updateLoyaltyCard from "../lib/update-points";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

type NFTProps = {
    nft: NFT;
    tokenID: string;
};

export const NFTCard = ({ nft, tokenID }: NFTProps) => {
    const {
        contract
    } = useContract(LOYALTY_CARD_CONTRACT_ADDRESS);
    const {
        data: loyaltyCard,
        isLoading: loadingLoyaltyCard,
    } = useNFT(contract, tokenID);
    console.log(loyaltyCard?.metadata.name);
    console.log(loyaltyCard?.metadata.image);

    let [loyaltyCardPoints, setLoyaltyCardPoints] = useState(0);
    console.log(loyaltyCardPoints);

    useEffect(() => {
        // @ts-ignore
        setLoyaltyCardPoints(loyaltyCard?.metadata.attributes[0].value);
        console.log(loyaltyCardPoints);
    }, [loyaltyCard]);

    return (
        <div className={styles.loyaltyCard}>
            <ThirdwebNftMedia
                metadata={nft.metadata}
                height="100%"
                width="100%"
            />
            {nft.metadata.attributes && (
                <>
                    {/* @ts-ignore */}
                    {nft.metadata.attributes.map((attribute, index) => (
                        <div key={index} className={styles.loyaltyCardPoints}>
                            {attribute.trait_type}: {attribute.value}
                        </div>
                    ))}
                </>
            )}
            <button
                onClick={async () => {
                    await updateLoyaltyCard(nft, loyaltyCardPoints, tokenID);
                    //Refresh loyalty card points
                    // @ts-ignore
                    await setLoyaltyCardPoints(loyaltyCard?.metadata.attributes[0].value);
                }}
                className={styles.updatePointsBtn}
            >Update points</button>
        </div>
    );
};