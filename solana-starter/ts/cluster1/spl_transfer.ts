import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "./wallet/turbin3-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("Ds1b2UEWiD6czGQw98QhvRDqRAQtBaFrEkJxkB4wdAFs");

// Recipient address
const to = new PublicKey("D3W8LzU8okSAnNqScp27wqKPN9GbSCX76NY6HPE9dtCc");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );

        console.log(`From Token Account: ${fromTokenAccount.address.toBase58()}`);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );

        console.log(`To Token Account: ${toTokenAccount.address.toBase58()}`);

        // Transfer the new token to the "toTokenAccount" we just created
        const transferTx = await transfer(
            connection,
            keypair,
            fromTokenAccount.address,
            toTokenAccount.address,
            keypair.publicKey,
            1_000_000 
        );

        console.log(`Transfer Tx: ${transferTx}`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();