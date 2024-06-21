import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryQuestionsRepository implements QuestionsRepository {
    public items: Question[] = []

    constructor(
        private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    ) {}

    async findById(id: string) {
        const question = this.items.find((item) => item.id.toString() === id)

        if (!question) {
            return null
        }

        return question
    }

    async findBySlug(slug: string) {
        const question = this.items.find((item) => item.slug.value === slug)

        if (!question) {
            return null
        }

        return question
    }

    async findManyRecent({ page }: PaginationParams) {
        const questions = this.items
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page - 1) * 20, page * 20)

        return questions
    }

    async create(question: Question) {
        this.items.push(question)
    }

    async save(question: Question) {
        const questionIndex = this.items.findIndex(
            (item) => item.id.toString() === question.id.toString(),
        )
        this.items[questionIndex] = question

        DomainEvents.dispatchEventsForAggregate(question.id)
    }

    async delete(question: Question) {
        this.questionAttachmentsRepository.deleteManyByQuestionId(
            question.id.toString(),
        )
        const questionIndex = this.items.indexOf(question)
        this.items.splice(questionIndex, 1)
    }
}
