import md5 from "md5";
import { Client } from "pg";

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
