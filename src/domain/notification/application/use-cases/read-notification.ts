import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Notification } from '../../enterprise/entities/notification'

interface ReadNotificationUseCaseInput {
    notificationId: string
    recipientId: string
}

type ReadNotificationUseCaseOutput = Either<
    ResourceNotFoundError | NotAllowedError,
    { notification: Notification }
>

export class ReadNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) {}

    async execute({
        notificationId,
        recipientId,
    }: ReadNotificationUseCaseInput): Promise<ReadNotificationUseCaseOutput> {
        const notification = await this.notificationsRepository.findById(
            notificationId
        )

        if (!notification) {
            return left(new ResourceNotFoundError())
        }

        if (notification.recipientId.toString() !== recipientId) {
            return left(new NotAllowedError())
        }

        notification.read()

        await this.notificationsRepository.save(notification)

        return right({ notification })
    }
}
