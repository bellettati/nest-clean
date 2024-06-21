import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Many Recent Questions Use Case', () => {
    beforeEach(() => {
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository
        )
        sut = new FetchRecentQuestionsUseCase(questionsRepository)
    })

    it('should fetch recent questions', async () => {
        await questionsRepository.create(
            makeQuestion({ createdAt: new Date(2024, 0, 20) })
        )
        await questionsRepository.create(
            makeQuestion({ createdAt: new Date(2024, 0, 18) })
        )
        await questionsRepository.create(
            makeQuestion({ createdAt: new Date(2024, 0, 24) })
        )

        const result = await sut.execute({ page: 1 })

        expect(result.isRight()).toBeTruthy()
        expect(result.value?.questions).toEqual([
            expect.objectContaining({ createdAt: new Date(2024, 0, 24) }),
            expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
            expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
        ])
    })
    it('should fetch recent questions paginated', async () => {
        for (let i = 0; i < 25; i++) {
            await questionsRepository.create(makeQuestion())
        }

        const result = await sut.execute({ page: 2 })

        expect(result.isRight()).toBeTruthy()
        expect(result.value?.questions).toHaveLength(5)
    })
})
