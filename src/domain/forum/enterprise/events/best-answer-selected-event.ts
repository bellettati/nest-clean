import { DomainEvent } from '@/core/events/domain-event'
import { Question } from '../entities/question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class BestAnswerSelectedEvent implements DomainEvent {
    public ocurredAt: Date
    public question: Question
    public bestAnswerId: UniqueEntityId

    constructor(question: Question, bestAnswerId: UniqueEntityId) {
        this.ocurredAt = new Date()
        this.question = question
        this.bestAnswerId = bestAnswerId
    }

    getAggregateId() {
        return this.question.id
    }
}
