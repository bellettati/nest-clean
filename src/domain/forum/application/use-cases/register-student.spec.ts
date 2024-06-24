import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'
import { MockHasher } from 'test/cryptography/mock-hasher'
import { makeStudent } from 'test/factories/make-student'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

describe('Register Student Use Case', () => {
    let studentsRepository: InMemoryStudentsRepository
    let hasher: MockHasher
    let sut: RegisterStudentUseCase

    beforeEach(() => {
        studentsRepository = new InMemoryStudentsRepository()
        hasher = new MockHasher()
        sut = new RegisterStudentUseCase(studentsRepository, hasher)
    })

    it('should register password', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            email: 'john@doe.com',
            password: 'secure_password',
        })

        expect(result.isRight()).toBeTruthy()
        expect(studentsRepository.items[0].email).toEqual('john@doe.com')
    })

    it('should hash student password', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            email: 'john@doe.com',
            password: 'secure_password',
        })

        const hashedPassword = await hasher.hash('secure_password')

        expect(result.isRight()).toBeTruthy()
        expect(studentsRepository.items[0].password).toEqual(hashedPassword)
    })

    it('should not be able to register student with same email', async () => {
        const student = makeStudent({ email: 'john@doe.com' })
        studentsRepository.create(student)

        const result = await sut.execute({
            name: 'John Doe',
            email: 'john@doe.com',
            password: 'secure_password',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
    })
})
