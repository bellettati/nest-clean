import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Prisma, User as PrismaStudent } from '@prisma/client'

export class PrismaStudentMapper {
    static toDomain(raw: PrismaStudent): Student {
        return Student.create(
            {
                name: raw.name,
                email: raw.email,
                password: raw.password,
            },
            new UniqueEntityId(raw.id),
        )
    }

    static toRaw(student: Student): Prisma.UserUncheckedCreateInput {
        return {
            id: student.id.toString(),
            name: student.name,
            email: student.email,
            password: student.password,
        }
    }
}
