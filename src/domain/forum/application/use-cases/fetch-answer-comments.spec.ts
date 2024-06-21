import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(
            answerAttachmentsRepository
        )
        answerCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
    })

    it('should fetch answer comments', async () => {
        const answer = makeAnswer()
        answersRepository.create(answer)

        answerCommentsRepository.create(
            makeAnswerComment({ answerId: answer.id })
        )
        answerCommentsRepository.create(
            makeAnswerComment({ answerId: answer.id })
        )
        answerCommentsRepository.create(
            makeAnswerComment({ answerId: answer.id })
        )

        const result = await sut.execute({
            page: 1,
            answerId: answer.id.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value?.answerComments).toHaveLength(3)
    })

    it('should fetch paginated answer comments', async () => {
        const answer = makeAnswer()
        answersRepository.create(answer)

        for (let i = 0; i < 25; i++) {
            answerCommentsRepository.create(
                makeAnswerComment({ answerId: answer.id })
            )
        }

        const result = await sut.execute({
            page: 2,
            answerId: answer.id.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value?.answerComments).toHaveLength(5)
    })
})
