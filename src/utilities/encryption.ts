import crypto from 'crypto'

const secret_key = "supersecretKey"
const ecnryption_method = "aes256"

// Encrypt data
export const CryptoUtil = {
    encryptData: (data: string) => {
        const cipher = crypto.createCipher(ecnryption_method, secret_key)
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    },
    decryptData(encryptedData: string) {
        const buff = Buffer.from(encryptedData, 'base64')
        const decipher = crypto.createDecipher(ecnryption_method, secret_key)
        return (
            decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8')
        )
    }
}