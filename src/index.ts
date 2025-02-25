import express, { Express } from "express";
import { Command } from "commander";

const program = new Command();
let options: any;

program
    .name("caching-proxy")
    .description("CLI tool that starts a caching proxy server")
    .requiredOption("--port <number>", "Port on which the caching proxy server will run")
    .requiredOption("--origin <url>", "URL of the server to which the requests will be forwarded")
    .action((opts) => {
        options = opts;
    });

program.parse();

const app: Express = express();
const { port, origin } = options;

app.listen(port);

