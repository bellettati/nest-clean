import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment Use Case', () => {
    beforeEach(() => {
        questionCommentsRepository = new InMemoryQuestionCommentsRepository()
        sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
    })

    it('should delete question comment', async () => {
        const questionComment = makeQuestionComment()
        questionCommentsRepository.create(questionComment)

        const result = await sut.execute({
            authorId: questionComment.authorId.toString(),
            questionCommentId: questionComment.id.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        expect(questionCommentsRepository.items).toHaveLength(0)
    })

    it('should not delete question comment from another author', async () => {
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityId('author-1'),
        })
        questionCommentsRepository.create(questionComment)

        const result = await sut.execute({
            authorId: 'author-2',
            questionCommentId: questionComment.id.toString(),
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
