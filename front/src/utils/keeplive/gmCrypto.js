import { SM4 } from 'gm-crypto';

// Any string of 32 hexadecimal digits
const key = 'e724785f2ed90902b5d7f0202919b9a8';

export function encrypt(message) {
  const ret = SM4.encrypt(message, key, {
    inputEncoding: 'utf8',
    outputEncoding: 'base64'
  });
  return ret;
}

export function decrypt(message) {
  return SM4.decrypt(message, key, {
    inputEncoding: 'base64',
    outputEncoding: 'utf8'
  });
}
