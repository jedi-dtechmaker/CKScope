import { ClientPublicTestnet } from '@ckb-ccc/core';

// Creates a CCC client against CKB public testnet.
// An explicit URL is required: ClientPublicTestnet's built-in default endpoints
// can be slow/unreachable, so we default to the known-good public RPC and allow
// overriding with CKB_RPC_URL (e.g. a local node).
export function createClient(): ClientPublicTestnet {
  const url = process.env.CKB_RPC_URL ?? 'https://testnet.ckb.dev/';
  return new ClientPublicTestnet({ url });
}
