import { Client } from "pg";
import { ethers } from "ethers";
import axios from "axios";

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
client.connect();

/// To send tokenm

export default async function handler(req, result) {
  if (req.method === "POST") {
    const { id, appcode, amount, coin } = req.body;
    var chain = "https://etherscan.io/tx/";
    const text = "SELECT * FROM users WHERE id=$1 and appcode=$2";
    const values = [id, appcode];
    const res = await client.query(text, values);
    var contractAbiFragment = [
      {
        name: "transfer",
        type: "function",
        inputs: [
          {
            name: "_to",
            type: "address",
          },
          {
            type: "uint256",
            name: "_tokens",
          },
        ],
        constant: false,
        outputs: [],
        payable: false,
      },
    ];

    if (res.rows[0]) {
      var address = res.rows[0].connected_address;
      var provider = new ethers.providers.JsonRpcProvider(
        "https://bsc-dataseed.binance.org/",
        { name: "binance", chainId: 56 }
      );
      // var provider = new ethers.providers.InfuraProvider(
      //   "homested",
      //   "apikey"
      // );
      var wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
      let walletSigner = wallet.connect(provider);
      var contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        contractAbiFragment,
        walletSigner
      );
      var numberOfDecimals = 18;
      var numberOfTokens = ethers.utils.parseUnits(amount, numberOfDecimals);
      const nowDate = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      // Send tokens
      try {
        var data = await contract.transfer(address, numberOfTokens);
        const txnhash = data.hash;
        var text2 =
          "INSERT INTO txns(address, amount, type, date, hash, chain,uid) VALUES ($1,$2, $3,$4,$5, $6,$7) RETURNING *";
        var values2 = [address, amount, "Credit", nowDate, txnhash, chain, id];
        await client.query(text2, values2);
        
//         May call thirdparty api if necessary

//         await axios.post("https://abcd.com/third-party-apy", {
//           address: address,
//           amount: amount,
//         });

        return result.status(200).json({
          status: true,
          message: "Tokens has been transferred",
          hash: txnhash,
        });
      } catch (e) {
        console.log(e);
        return result.status(200).json({
          status: false,
          message: "Some error occureed " + e,
        });
      }
    }
  }
}

/// To send Ether

// export default async function handler(req, result) {
//     if (req.method === "POST") {
//       const { id, appcode, amount } = req.body;
//       const text = "SELECT * FROM users WHERE id=$1 and appcode=$2";
//       const values = [id, appcode];
//       const res = await client.query(text, values);

//       if (res.rows[0]) {
//         var address = res.rows[0].connected_address;
//         var provider = new ethers.providers.InfuraProvider(
//           "ropsten",
//           "apikey"
//         );
//         var wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
//         let walletSigner = wallet.connect(provider);
//         var tx = {
//           to: address,
//           value: ethers.utils.parseEther(amount),
//           gasLimit: 150000,
//           gasPrice: await provider.getGasPrice(),
//         };
//         var detail = await walletSigner.sendTransaction(tx);
//         const txnhash = detail.hash;
//         console.log(txnhash);

//         result.status(200).json({
//           status: true,
//           message: "Tokens has been credited",
//         });
//       } else {
//         result.status(200).json({
//           status: false,
//           message: "Invalid Login Detail",
//         });
//       }
//     }
//   }
