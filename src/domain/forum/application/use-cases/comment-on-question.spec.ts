import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment On Question Use Case', () => {
    beforeEach(() => {
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository,
        )
        questionCommentsRepository = new InMemoryQuestionCommentsRepository()
        sut = new CommentOnQuestionUseCase(
            questionsRepository,
            questionCommentsRepository,
        )
    })

    it('should create a question comment', async () => {
        const question = makeQuestion()
        questionsRepository.create(question)

        const result = await sut.execute({
            authorId: 'author-1',
            questionId: question.id.toString(),
            content: 'test comment',
        })

        expect(result.isRight()).toBeTruthy()
        expect(questionCommentsRepository.items[0].content).toEqual(
            'test comment',
        )
    })
})
