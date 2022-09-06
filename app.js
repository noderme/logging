const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");

// Redis connection
const { Client } = require("redis-om");

const client = new Client();
(async function () {
  await client
    .open("redis://localhost:6379")
    .catch((err) => console.error(err));

  console.log("connecion success");
  // await client.close();
})();

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    // optional - url default value is http://localhost:4318/v1/traces
    url: "http://localhost:4318/v1/traces",
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {},
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();

const express = require("express");

setTimeout(() => {
  const PORT = process.env.PORT || "8080";
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.get("/test", async (req, res) => {
    // Get redis cache
    const cache = await client.execute(["GET", "From cache"]);
    if (cache) {
   //   const ttl = await client.execute(["TTL", "From cache"]);
      res.send({ Cache: cache});
    } else {
      await client.execute(["SETEX", "From cache", Number(200), "Hello world"]);
      res.send("Hello World");
    }
  });

  app.listen(parseInt(PORT, 10), () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
  });
}, 2000);
