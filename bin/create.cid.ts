/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
import { CID } from 'multiformats/cid'
import * as json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'

export async function createCID(data: any): Promise<CID> {
    const value = { hello: 'world' }

    // Encoded Uint8array representation of `value` using the plain JSON IPLD codec
    const bytes = json.encode(value)

    // Hash Uint8array representation
    const hash = await sha256.digest(bytes)

    // Create CID (default base32)
    const cid = CID.create(1, json.code, hash)

    // cid.code --> 512 (0x0200) JSON IPLD codec)
    // cid.version --> 1
    // cid.multihash --> digest, including code (18 for sha2-256), digest size (32 bytes)
    // cid.bytes --> byte representation`
    console.log('Example CID: ', cid.toString())

        // const cid = CID.parse('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae')
        // const obj = await d.get(cid)

        // console.info(obj)
        // { hello: 'world' }

    return cid;
}
