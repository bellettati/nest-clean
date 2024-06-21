import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
    constructor(private prisma: PrismaService) {}

    async findById(id: string) {
        const question = await this.prisma.question.findUnique({
            where: { id },
        })

        if (!question) {
            return null
        }

        return PrismaQuestionMapper.toDomain(question)
    }

    async findBySlug(slug: string) {
        const question = await this.prisma.question.findUnique({
            where: { slug },
        })

        if (!question) {
            return null
        }

        return PrismaQuestionMapper.toDomain(question)
    }

    async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
        const questions = await this.prisma.question.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            skip: (page - 1) * 20,
            take: 20,
        })

        return questions.map((question) =>
            PrismaQuestionMapper.toDomain(question),
        )
    }

    async create(question: Question): Promise<void> {
        await this.prisma.question.create({
            data: PrismaQuestionMapper.toRaw(question),
        })
    }

    async save(question: Question): Promise<void> {
        await this.prisma.question.update({
            where: { id: question.id.toString() },
            data: PrismaQuestionMapper.toRaw(question),
        })
    }

    async delete(question: Question): Promise<void> {
        await this.prisma.question.delete({
            where: { id: question.id.toString() },
        })
    }
}
