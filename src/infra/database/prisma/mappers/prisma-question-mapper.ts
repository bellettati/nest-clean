import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Prisma, Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion): Question {
        return Question.create(
            {
                title: raw.title,
                content: raw.content,
                authorId: new UniqueEntityId(raw.id),
                bestAnswerId: raw.bestAnswerId
                    ? new UniqueEntityId(raw.bestAnswerId)
                    : null,
                slug: Slug.create(raw.slug),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityId(raw.id),
        )
    }

    static toRaw(domain: Question): Prisma.QuestionUncheckedCreateInput {
        return {
            id: domain.id.toString(),
            authorId: domain.authorId.toString(),
            title: domain.title,
            slug: domain.slug.value,
            content: domain.content,
            bestAnswerId: domain.bestAnswerId
                ? domain.bestAnswerId.toString()
                : null,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        }
    }
}
