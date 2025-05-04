import { KiteConnect } from "kiteconnect";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const apiKey = "xjtp3yz0bow8bm3j";
const apiSecret = "g84y0mb59baznwuiohm3biuj2bny971n";
let accessToken = "WjIwrFRj6dXFlmhCzDxo6ExqTHqcNehg";

const kc = new KiteConnect({ api_key: apiKey });

async function getProfile() {
  try {
    const profile = await kc.getProfile();
    // console.log("Profile:", profile);
  } catch (err) {
    console.error("Error getting profile:", err);
  }
}

export async function init() {
  try {
    kc.setAccessToken(accessToken);
    await getProfile();
  } catch (err) {
    console.error(err);
  }
}

export async function placeOrder(
  tradingsymbol: string,
  quantity: number,
  transactionType: "BUY" | "SELL"
) {
  try {
    kc.setAccessToken(accessToken);
    const order = await kc.placeOrder("regular", {
      exchange: "NSE",
      tradingsymbol,
      transaction_type: transactionType,
      quantity,
      product: "CNC",
      order_type: "MARKET",
    });
    return order;
  } catch (err) {
    console.error(`Error ${transactionType.toLowerCase()}ing stock:`, err);
  }
}

export async function getHoldings() {
  try {
    kc.setAccessToken(accessToken);
    const positions = await kc.getHoldings();
    return positions;
  } catch (err) {
    console.error("Error getting positions:", err);
  }
}

// Initialize on module load but without top-level await
(async function() {
  await init();
  // await getHoldings();
})().catch(console.error);
