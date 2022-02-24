import type { NextApiRequest, NextApiResponse } from 'next';
import { CosmWasmClient } from 'secretjs';

/*
This endpoint will connect to the test network using the URL. 
*/
export default async function connect(
  _req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const url = 'http://bootstrap.supernova.enigma.co:1317';

    const client = new CosmWasmClient(url);
    const nodeInfo = await client.restClient.nodeInfo();
    const { version } = nodeInfo.application_version;
    res.status(200).json(version);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
