import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question Use Case', () => {
    beforeEach(() => {
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository
        )
        sut = new EditQuestionUseCase(
            questionsRepository,
            questionAttachmentsRepository
        )
    })

    it('should update question', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityId('author-1') },
            new UniqueEntityId('question-1')
        )

        const questionAttachmentOne = makeQuestionAttachment({
            attachmentId: new UniqueEntityId('1'),
            questionId: question.id,
        })
        const questionAttachmentTwo = makeQuestionAttachment({
            attachmentId: new UniqueEntityId('2'),
            questionId: question.id,
        })

        questionAttachmentsRepository.items.push(
            questionAttachmentOne,
            questionAttachmentTwo
        )

        question.attachments = new QuestionAttachmentList([
            questionAttachmentOne,
            questionAttachmentTwo,
        ])

        questionsRepository.create(question)

        const result = await sut.execute({
            authorId: 'author-1',
            questionId: 'question-1',
            title: 'Updated Title',
            content: 'Updated content',
            attachmentIds: ['1', '3'],
        })

        expect(result.isRight()).toBeTruthy()
        expect(questionsRepository.items[0]).toEqual(
            expect.objectContaining({
                title: 'Updated Title',
                content: 'Updated content',
            })
        )
        expect(
            questionsRepository.items[0].attachments.getItems()
        ).toHaveLength(2)
        expect(questionsRepository.items[0].attachments.getItems()).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
        ])
    })

    it('should not updated question from another user', async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityId('author-1'),
        })

        questionsRepository.create(question)

        const result = await sut.execute({
            authorId: 'author-2',
            questionId: question.id.toString(),
            title: 'Updated Title',
            content: 'Updated content',
            attachmentIds: [],
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
