import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
        questionAttachmentsRepository
    )
    sut = new CreateQuestionUseCase(questionsRepository)
})

describe('Create Question', () => {
    it('should create a question', async () => {
        const result = await sut.execute({
            authorId: 'author-01',
            title: 'Question Title',
            content: 'Question content',
            attachmentIds: ['1', '2'],
        })

        expect(result.isRight()).toBeTruthy()
        expect(questionsRepository.items[0]).toEqual(result.value?.question)
        expect(
            questionsRepository.items[0].attachments.getItems()
        ).toHaveLength(2)
        expect(questionsRepository.items[0].attachments.getItems()).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
        ])
    })
})
