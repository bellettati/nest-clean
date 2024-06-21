import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
        answerAttachmentsRepository
    )
    sut = new AnswerQuestionUseCase(answersRepository)
})

describe('Answer Question Use Case', () => {
    it('should create an answer', async () => {
        const result = await sut.execute({
            questionId: 'question-01',
            instructorId: 'instructor-01',
            content: 'answer content',
            attachmentIds: ['1', '2'],
        })

        expect(result.isRight()).toBeTruthy()
        expect(answersRepository.items[0]).toEqual(result.value?.answer)
        expect(answersRepository.items[0].attachments.getItems()).toHaveLength(
            2
        )
        expect(answersRepository.items[0].attachments.getItems()).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
        ])
    })
})
