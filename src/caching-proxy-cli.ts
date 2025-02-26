import express, { Express, Request, Response } from "express";
import { Command } from "commander";
import axios from "axios";
import { createClient } from "redis";

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

async function runServer(port: number, origin: string): Promise<void> {
    const app: Express = express();

    app.use(express.json());

    app.use(async (req: Request, res: Response) => {
        try {
            console.log(`Proxying request: ${req.method} ${req.url}`);

            const { body } = req;
            let data: object | string | null;

            data = await client.get(`proxy:${req.method}${origin}${req.url}${JSON.stringify(body)}`);

            if (!data) {
                const request = await axios({ method: req.method, url: `${origin}${req.url}`, data: body });
                data = request.data;
                res.setHeader("X-Cache", "MISS");
                await client.set(
                    `proxy:${req.method}${origin}${req.url}${JSON.stringify(body)}`,
                    JSON.stringify(data),
                    { EX: 3600 }
                );
            } else {
                data = JSON.parse(data);
                res.setHeader("X-Cache", "HIT");
            }

            res.send(data as object);
        } catch (error: any) {
            console.error("Proxy error:", error.message);
            res.status(500).send("Proxy error: " + error.message);
        }
    });

    app.listen(port, () => {
        console.log(`Proxy server running at http://localhost:${port}, forwarding to ${origin}`);
    });
}

const program = new Command();
let options: any;

program
    .name("caching-proxy")
    .description("CLI tool that starts a caching proxy server")
    .option("--port <number>", "Port on which the caching proxy server will run")
    .option("--origin <url>", "URL of the server to which the requests will be forwarded")
    .option("--clear-cache", "A way to clear the cache")
    .action((opts) => {
        options = opts;
    });

program.parse();

(async () => {
    try {
        const { port, origin, clearCache } = options;

        await client.connect();
        console.log("Connected to Redis successfully");

        if (clearCache) {
            await client.flushAll();
            console.log("Cache cleared successfully");
            process.exit(0);
        }

        if (port && origin) {
            await runServer(Number(port), origin);
        }
    } catch (error) {
        console.error(error);
    }
})();
