import { Client } from "pg";
import { ethers } from "ethers";

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
client.connect();

export default async function handler(req, result) {
  if (req.method === "POST") {
    const { id, appcode, amount } = req.body;
    const text = "SELECT * FROM users WHERE id=$1 and appcode=$2";
    const values = [id, appcode];

    const res = await client.query(text, values);

    if (res.rows[0]) {
      var address = res.rows[0].connected_address;
      var provider = new ethers.providers.InfuraProvider(
        "homestead",
        "087d2c64d0f241abbfac8bdf83107768"
      );
      var wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
      let walletSigner = wallet.connect(provider);
      var tx = {
        to: address,
        value: ethers.utils.parseEther(amount),
        gasLimit: 150000,
        gasPrice: await provider.getGasPrice(),
      };
      var detail = await walletSigner.sendTransaction(tx);

      result.status(200).json({
        status: true,
        message: "Tokens has been credited",
      });
    } else {
      result.status(200).json({
        status: false,
        message: "Invalid Login Detail",
      });
    }
  }
}
