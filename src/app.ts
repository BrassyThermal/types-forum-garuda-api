import { CreateServer } from "./Infrastructures/http/CreateServer";
import { injection } from "./Infrastructures/injection";

(async () => {
  const server = await CreateServer(injection);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
