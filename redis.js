const { Client } = require("redis-om");

const client = new Client();
(async function () {
  await client
    .open("redis://localhost:6379")
    .catch((err) => console.error(err));

    console.log("connecion success")
  // await client.close();
})();
module.exports = client;
