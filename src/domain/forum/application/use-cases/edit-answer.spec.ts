import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(
            answerAttachmentsRepository
        )
        sut = new EditAnswerUseCase(answersRepository)
    })

    it('should be able to update answer', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityId('author-1') },
            new UniqueEntityId('answer-1')
        )
        const answerAttachmentOne = makeAnswerAttachment({
            answerId: answer.id,
            attachmentId: new UniqueEntityId('1'),
        })
        const answerAttachmentTwo = makeAnswerAttachment({
            answerId: answer.id,
            attachmentId: new UniqueEntityId('2'),
        })
        answer.attachments = new AnswerAttachmentList([
            answerAttachmentOne,
            answerAttachmentTwo,
        ])
        answersRepository.create(answer)

        const result = await sut.execute({
            authorId: 'author-1',
            answerId: 'answer-1',
            content: 'Updated content',
            attachmentIds: ['1', '3'],
        })

        expect(result.isRight()).toBeTruthy()
        expect(answersRepository.items[0]).toEqual(
            expect.objectContaining({
                content: 'Updated content',
            })
        )
        expect(answersRepository.items[0].attachments.getItems()).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
        ])
    })

    it('should not edit answer from another user', async () => {
        const answer = makeAnswer({ authorId: new UniqueEntityId('author-1') })
        answersRepository.create(answer)

        const result = await sut.execute({
            authorId: 'author-2',
            answerId: answer.id.toString(),
            content: 'Updated content',
            attachmentIds: [],
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
