import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
    beforeEach(() => {
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository
        )
        sut = new GetQuestionBySlugUseCase(questionsRepository)
    })

    it('should get question by slug', async () => {
        const newQuestion = makeQuestion({ slug: Slug.create('test-slug') })
        questionsRepository.create(newQuestion)

        const result = await sut.execute({ slug: 'test-slug' })

        expect(result.value).toMatchObject({ question: newQuestion })
    })
})
