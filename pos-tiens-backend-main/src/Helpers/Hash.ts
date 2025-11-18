import * as crypto from 'crypto';

const algorithm = 'aes-256-ctr'
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
const iv = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3"

const encryptionIV = crypto
  .createHash('sha512')
  .update(iv)
  .digest('hex')
  .substring(0, 16)


export const encrypt = (date: string | null = null) => {
  if (!date) {
    const now = new Date().getTime()
    const in2Days = now + 2 * 24 * 60 * 60 * 1000
    const newDate = new Date(in2Days)
    date = newDate.toISOString()
  } else {
    const dateRegex = new RegExp(/\d{4}-\d{2}-\d{2}/);
    if (!dateRegex.test(date)) {
      throw new Error("Invalid date format");
    }
    const newDate = new Date(date)
    date = newDate.toISOString()
  }

  const cipher = crypto.createCipheriv(algorithm, secretKey, encryptionIV)
  const encrypted = Buffer.concat([cipher.update(date), cipher.final()])
  return encrypted.toString('hex')
}

export const decrypt = (hash: string) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, encryptionIV)
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()])
  return decrpyted.toString()
}