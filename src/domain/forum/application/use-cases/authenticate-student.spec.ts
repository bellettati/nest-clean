import { MockEncrypter } from 'test/cryptography/mock-encrypter'
import { MockHasher } from 'test/cryptography/mock-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Student Use Case', () => {
    let studentsRepository: InMemoryStudentsRepository
    let hasher: MockHasher
    let encrypter: MockEncrypter
    let sut: AuthenticateStudentUseCase

    beforeEach(() => {
        studentsRepository = new InMemoryStudentsRepository()
        hasher = new MockHasher()
        encrypter = new MockEncrypter()
        sut = new AuthenticateStudentUseCase(
            studentsRepository,
            hasher,
            encrypter,
        )
    })

    it('should authenticate student', async () => {
        const student = makeStudent({
            email: 'john@doe.com',
            password: await hasher.hash('secure_password'),
        })
        studentsRepository.create(student)

        const result = await sut.execute({
            email: 'john@doe.com',
            password: 'secure_password',
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toMatchObject({
            accessToken: expect.any(String),
        })
    })

    it('should not authenticate non existing student', async () => {
        const result = await sut.execute({
            email: 'john@doe.com',
            password: 'secure_password',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not authenticate with wrong password input', async () => {
        const student = makeStudent({
            email: 'john@doe.com',
            password: await hasher.hash('secure_password'),
        })
        studentsRepository.create(student)

        const result = await sut.execute({
            email: 'john@doe.com',
            password: 'wrong_password',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(InvalidCredentialsError)
    })
})
