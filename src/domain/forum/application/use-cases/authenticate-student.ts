import { Either, left, right } from '@/core/either'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { StudentsRepository } from '../repositories/students-repository'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { Injectable } from '@nestjs/common'

interface AuthenticateStudentUseCaseInput {
    email: string
    password: string
}

type AuthenticateStudentUseCaseOutput = Either<
    InvalidCredentialsError,
    { accessToken: string }
>

@Injectable()
export class AuthenticateStudentUseCase {
    constructor(
        private studentsRepository: StudentsRepository,
        private hashComparer: HashComparer,
        private encrypter: Encrypter,
    ) {}

    async execute({
        email,
        password,
    }: AuthenticateStudentUseCaseInput): Promise<AuthenticateStudentUseCaseOutput> {
        const user = await this.studentsRepository.findByEmail(email)

        if (!user) {
            return left(new InvalidCredentialsError())
        }

        const passwordIsValid = await this.hashComparer.compare(
            password,
            user.password,
        )

        if (!passwordIsValid) {
            return left(new InvalidCredentialsError())
        }

        const accessToken = await this.encrypter.encrypt({
            sub: user.id.toString(),
        })

        return right({ accessToken })
    }
}
