import { makeAnswer } from 'test/factories/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import {
    SendNotificationUseCase,
    SendNotificationUseCaseInput,
    SendNotificationUseCaseOutput,
} from '../use-cases/send-notification'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeQuestion } from 'test/factories/make-question'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
    [SendNotificationUseCaseInput],
    Promise<SendNotificationUseCaseOutput>
>

describe('On Answer Created', () => {
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
        notificationsRepository = new InMemoryNotificationsRepository()
        sendNotification = new SendNotificationUseCase(notificationsRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

        new OnAnswerCreated(questionsRepository, sendNotification)
    })

    it('should send a notification when an answer is created', async () => {
        const question = makeQuestion()
        questionsRepository.create(question)

        const answer = makeAnswer({ questionId: question.id })
        answersRepository.create(answer)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})
