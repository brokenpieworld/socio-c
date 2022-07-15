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
    const { address } = req.body;
    const text = "SELECT * FROM users WHERE connected_address=$1";
    const values = [address];

    const res = await client.query(text, values);

    if (res.rows[0]) {
      var uid = res.rows[0].id;
      var appcode = res.rows[0].appcode;
    } else {
      var appcode = md5(address + Date.now());
      var text2 =
        "INSERT INTO users(connected_address,appcode) VALUES ($1,$2) RETURNING *";
      var values2 = [address, appcode];
      var resp = await client.query(text2, values2);
      var uid = resp.rows[0].id;
    }

    result.status(200).json({
      status: true,
      message: {
        uid: uid,
        appcode: appcode,
      },
    });
  }
}
