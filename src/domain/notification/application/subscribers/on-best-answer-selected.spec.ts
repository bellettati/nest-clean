import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { OnBestAnswerSelected } from './on-best-answer-selected'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import {
    SendNotificationUseCase,
    SendNotificationUseCaseInput,
    SendNotificationUseCaseOutput,
} from '../use-cases/send-notification'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
    [SendNotificationUseCaseInput],
    Promise<SendNotificationUseCaseOutput>
>

describe('On Best Answer Selected', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(
            answerAttachmentsRepository
        )
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository
        )
        notificationsRepository = new InMemoryNotificationsRepository()
        sendNotification = new SendNotificationUseCase(notificationsRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

        new OnBestAnswerSelected(answersRepository, sendNotification)
    })

    it('it should send notification when new best answer is selected', async () => {
        const question = makeQuestion()
        questionsRepository.create(question)

        const answer = makeAnswer({ questionId: question.id })
        answersRepository.create(answer)

        question.bestAnswerId = answer.id
        questionsRepository.save(question)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})
