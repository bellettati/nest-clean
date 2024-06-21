import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment On Question Use Case', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(
            answerAttachmentsRepository
        )
        answerCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new CommentOnAnswerUseCase(
            answersRepository,
            answerCommentsRepository
        )
    })

    it('should create a question comment', async () => {
        const answer = makeAnswer()
        answersRepository.create(answer)

        const result = await sut.execute({
            authorId: 'author-1',
            answerId: answer.id.toString(),
            content: 'test comment',
        })

        expect(result.isRight()).toBeTruthy()
        expect(answerCommentsRepository.items[0].content).toEqual(
            'test comment'
        )
    })
})
