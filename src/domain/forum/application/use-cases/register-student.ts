import { Either, left, right } from '@/core/either'
import { StudentsRepository } from '../repositories/students-repository'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { Student } from '../../enterprise/entities/student'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentUseCaseInput {
    name: string
    email: string
    password: string
}

type RegisterStudentUseCaseOutput = Either<
    StudentAlreadyExistsError,
    { student: Student }
>

@Injectable()
export class RegisterStudentUseCase {
    constructor(
        private studentsRepository: StudentsRepository,
        private hashGenerator: HashGenerator,
    ) {}

    async execute({
        name,
        email,
        password,
    }: RegisterStudentUseCaseInput): Promise<RegisterStudentUseCaseOutput> {
        const emailAlreadyRegistered =
            await this.studentsRepository.findByEmail(email)

        if (emailAlreadyRegistered) {
            return left(new StudentAlreadyExistsError(email))
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        const student = Student.create({
            name,
            email,
            password: hashedPassword,
        })

        await this.studentsRepository.create(student)

        return right({ student })
    }
}
