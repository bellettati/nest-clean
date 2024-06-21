import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
    constructor(
        private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
    ) {}

    public items: Answer[] = []

    async findById(id: string) {
        const answer = this.items.find((item) => item.id.toString() === id)

        if (!answer) {
            return null
        }

        return answer
    }

    async findManyByQuestionId({ page }: PaginationParams, questionId: string) {
        return this.items
            .filter((item) => item.questionId.toString() === questionId)
            .slice((page - 1) * 20, page * 20)
    }

    async create(answer: Answer) {
        this.items.push(answer)
        DomainEvents.dispatchEventsForAggregate(answer.id)
    }

    async save(answer: Answer) {
        const answerIndex = this.items.findIndex(
            (item) => item.id.toString() === answer.id.toString()
        )
        this.items[answerIndex] = answer
        DomainEvents.dispatchEventsForAggregate(answer.id)
    }

    async delete(answer: Answer) {
        await this.answerAttachmentsRepository.deleteManyByAnswerId(
            answer.id.toString()
        )
        const answerIndex = this.items.indexOf(answer)
        this.items.splice(answerIndex, 1)
    }
}
