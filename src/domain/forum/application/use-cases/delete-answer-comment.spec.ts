import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment Use Case', () => {
    beforeEach(() => {
        answerCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new DeleteAnswerCommentUseCase(answerCommentsRepository)
    })

    it('should delete answer comment', async () => {
        const answerComment = makeAnswerComment()
        answerCommentsRepository.create(answerComment)

        await sut.execute({
            authorId: answerComment.authorId.toString(),
            answerCommentId: answerComment.id.toString(),
        })

        expect(answerCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete answer comment from another user', async () => {
        const answerComment = makeAnswerComment({
            authorId: new UniqueEntityId('author-1'),
        })

        await answerCommentsRepository.create(answerComment)

        const result = await sut.execute({
            authorId: 'author-2',
            answerCommentId: answerComment.id.toString(),
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
