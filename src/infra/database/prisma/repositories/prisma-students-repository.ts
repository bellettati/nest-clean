import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { Student } from '@/domain/forum/enterprise/entities/student'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string) {
        const student = await this.prisma.user.findUnique({ where: { email } })

        if (!student) {
            return null
        }

        return PrismaStudentMapper.toDomain(student)
    }

    async create(student: Student) {
        await this.prisma.user.create({
            data: PrismaStudentMapper.toRaw(student),
        })
    }
}
