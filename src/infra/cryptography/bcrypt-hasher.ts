import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
    private HASH_SALT_LENGTH = 8

    async hash(plain: string) {
        return await bcryptHash(plain, this.HASH_SALT_LENGTH)
    }

    async compare(plain: string, hash: string) {
        return await bcryptCompare(plain, hash)
    }
}
