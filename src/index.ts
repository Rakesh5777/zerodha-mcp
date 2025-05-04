import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getHoldings, placeOrder } from "./trade";

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

// Add an addition tool
// server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
//   content: [{ type: "text", text: String(a + b) }],
// }));

// Add a dynamic greeting resource
// server.resource(
//   "greeting",
//   new ResourceTemplate("greeting://{name}", { list: undefined }),
//   async (uri, { name }) => ({
//     contents: [
//       {
//         uri: uri.href,
//         text: `Hello, ${name}!`,
//       },
//     ],
//   })
// );

// Buy stock tool
server.tool(
  "buy-stock",
  "Purchases a specified quantity of a stock. Use this tool when the user wants to buy shares of a specific company.",
  {
    stock: z
      .string()
      .describe(
        "The stock symbol/ticker of the company to buy (e.g., AAPL, MSFT, RELIANCE)"
      ),
    qty: z
      .number()
      .describe("The number of shares to buy (must be a positive integer)"),
  },
  async ({ stock, qty }) => {
    try {
      placeOrder(stock, qty, "BUY");
      return {
        content: [{ type: "text", text: "Stock has been bought" }],
      };
    } catch (error) {
      return { content: [{ type: "text", text: "Error buying stock", error }] };
    }
  }
);

// Sell stock tool
server.tool(
  "sell-stock",
  "Sells a specified quantity of a stock from the user's portfolio. Use this when the user wants to sell shares they own.",
  {
    stock: z
      .string()
      .describe(
        "The stock symbol/ticker of the company to sell (e.g., AAPL, MSFT, RELIANCE)"
      ),
    qty: z
      .number()
      .describe(
        "The number of shares to sell (must be a positive integer and not exceed holdings)"
      ),
  },
  async ({ stock, qty }) => {
    try {
      placeOrder(stock, qty, "SELL");
      return {
        content: [{ type: "text", text: "Stock has been sold successfully" }],
      };
    } catch (error) {
      return { content: [{ type: "text", text: "Error selling stock", error }] };
    }
  }
);

// Get positions tool
server.tool(
  "get-positions",
  "Retrieves the user's current stock holdings and positions. Use this when the user wants to check their portfolio or current investments.",
  {},
  async () => {
    try {
      const positions = await getHoldings();
      return {
        content: [
          {
            type: "text",
            text: positions
              ? `Current positions: ${JSON.stringify(positions)}`
              : "You don't have any open positions",
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: "Error retrieving positions", error }],
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
