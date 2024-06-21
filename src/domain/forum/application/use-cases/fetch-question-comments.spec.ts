import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments Use Case', () => {
    beforeEach(() => {
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository,
        )
        questionCommentsRepository = new InMemoryQuestionCommentsRepository()
        sut = new FetchQuestionCommentsUseCase(
            questionsRepository,
            questionCommentsRepository,
        )
    })

    it('should fetch question comments', async () => {
        const question = makeQuestion()
        questionsRepository.create(question)

        questionCommentsRepository.create(
            makeQuestionComment({ questionId: question.id }),
        )
        questionCommentsRepository.create(
            makeQuestionComment({ questionId: question.id }),
        )
        questionCommentsRepository.create(
            makeQuestionComment({ questionId: question.id }),
        )

        const result = await sut.execute({
            page: 1,
            questionId: question.id.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value?.questionComments).toHaveLength(3)
    })

    it('should fetch question paginated question comments', async () => {
        const question = makeQuestion()
        questionsRepository.create(question)

        for (let i = 0; i < 25; i++) {
            questionCommentsRepository.create(
                makeQuestionComment({ questionId: question.id }),
            )
        }

        const result = await sut.execute({
            page: 2,
            questionId: question.id.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value?.questionComments).toHaveLength(5)
    })
})
