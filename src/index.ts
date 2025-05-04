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
server.tool("buy-stock", 
  { stock: z.string(), qty: z.number() },
  async ({ stock, qty }) => {
    placeOrder(stock, qty, "BUY");
    return {
      content: [{ type: "text", text: "Stock has been bought" }]
    }
  }
);

// Sell stock tool
server.tool("sell-stock", 
  { stock: z.string(), qty: z.number() },
  async ({ stock, qty }) => {
    placeOrder(stock, qty, "SELL");
    return {
      content: [{ type: "text", text: "Stock has been sold" }]
    }
  }
);

// Get positions tool
server.tool("get-positions", 
  {},
  async () => {
    const positions = await getHoldings();
    return {
      content: [{ 
        type: "text", 
        text: positions
          ? `Current positions: ${JSON.stringify(positions)}` 
          : "You don't have any open positions" 
      }]
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
