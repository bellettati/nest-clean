import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

export class MockEncrypter implements Encrypter {
    async encrypt(payload: Record<string, unknown>) {
        return JSON.stringify(payload)
    }
}
