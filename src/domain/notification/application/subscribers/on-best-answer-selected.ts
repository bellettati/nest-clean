import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { BestAnswerSelectedEvent } from '@/domain/forum/enterprise/events/best-answer-selected-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

export class OnBestAnswerSelected implements EventHandler {
    constructor(
        private answersRepository: AnswersRepository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions() {
        DomainEvents.register(
            this.sendBestAnswerNotification.bind(this),
            BestAnswerSelectedEvent.name
        )
    }

    private async sendBestAnswerNotification({
        question,
        bestAnswerId,
    }: BestAnswerSelectedEvent) {
        const answer = await this.answersRepository.findById(
            bestAnswerId.toString()
        )

        if (!answer) {
            return
        }

        await this.sendNotification.execute({
            recipientId: answer.authorId.toString(),
            title: 'Your answer has been selected as best answer!',
            content: `The answer you submitted on "${question.title
                .substring(0, 20)
                .concat('...')}", has been chosen by the author`,
        })
    }
}
