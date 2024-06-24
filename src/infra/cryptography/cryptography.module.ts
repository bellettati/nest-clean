import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { BcryptHasher } from './bcrypt-hasher'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'

@Module({
    providers: [
        {
            provide: HashGenerator,
            useClass: BcryptHasher,
        },
        {
            provide: HashComparer,
            useClass: BcryptHasher,
        },
        {
            provide: Encrypter,
            useClass: JwtEncrypter,
        },
    ],
    exports: [HashGenerator, HashComparer, Encrypter],
})
export class CryptogrpahyModule {}
