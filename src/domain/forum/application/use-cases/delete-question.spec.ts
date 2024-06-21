import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question Use Case', () => {
    beforeEach(() => {
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository
        )
        sut = new DeleteQuestionUseCase(questionsRepository)
    })

    it('should delete a question', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityId('author-1') },
            new UniqueEntityId('question-1')
        )

        const questionAttachmentOne = makeQuestionAttachment({
            questionId: question.id,
        })
        const questionAttachmentTwo = makeQuestionAttachment({
            questionId: question.id,
        })

        question.attachments = new QuestionAttachmentList([
            questionAttachmentOne,
            questionAttachmentTwo,
        ])

        questionsRepository.create(question)
        questionAttachmentsRepository.items.push(
            questionAttachmentOne,
            questionAttachmentTwo
        )

        const result = await sut.execute({
            authorId: 'author-1',
            questionId: 'question-1',
        })

        expect(result.isRight()).toBeTruthy()
        expect(questionsRepository.items).toHaveLength(0)
        expect(questionAttachmentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete question from another author', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityId('author-1') },
            new UniqueEntityId('question-1')
        )
        questionsRepository.create(question)

        const result = await sut.execute({
            authorId: 'author-2',
            questionId: 'question-1',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
