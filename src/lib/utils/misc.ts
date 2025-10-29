import { decode, encode } from 'js-base64'

const ID_PREFIX = 'APP_ID'

export function encodeId(id: number) {
  return encode(`${ID_PREFIX}${id}`, true)
}

export function decodeId(encodedId?: string) {
  if (!encodedId) return undefined
  const decoded = decode(encodedId)
  const nonPrefixed = decoded.replace(ID_PREFIX, '')
  const id = parseInt(nonPrefixed, 10)
  if (Number.isNaN(id)) {
    throw new Error(`Invalid encoded ID: ${encodedId}`)
  }
  return id
}
