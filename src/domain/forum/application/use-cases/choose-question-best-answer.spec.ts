import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer Use Case', () => {
    beforeEach(() => {
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository
        )
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(
            answerAttachmentsRepository
        )
        sut = new ChooseQuestionBestAnswerUseCase(
            questionsRepository,
            answersRepository
        )
    })

    it('should set a best answer', async () => {
        const question = makeQuestion()
        questionsRepository.create(question)

        const answer = makeAnswer({ questionId: question.id })
        answersRepository.create(answer)

        const result = await sut.execute({
            authorId: question.authorId.toString(),
            answerId: answer.id.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id)
    })

    it('should not be able to set best answer from another author', async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityId('author-1'),
        })
        questionsRepository.create(question)

        const answer = makeAnswer({ questionId: question.id })
        answersRepository.create(answer)

        const result = await sut.execute({
            authorId: 'author-2',
            answerId: answer.id.toString(),
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
