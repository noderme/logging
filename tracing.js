//const opentelemetry = require("@opentelemetry/api");
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
//const { ConsoleSpanExporter, BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");

// Optionally register automatic instrumentation libraries
registerInstrumentations({
  instrumentations: [],
});

const resource =
  Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "node-server",
      [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0",
    })
  );

const provider = new NodeTracerProvider({
    resource: resource,
});


const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");

provider.addSpanProcessor(new BatchSpanProcessor(new ZipkinExporter()));

const exporter = new ZipkinExporter()
const processor = new BatchSpanProcessor(exporter);
provider.addSpanProcessor(processor);

provider.register();