import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let notificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification Use Case', () => {
    beforeEach(() => {
        notificationsRepository = new InMemoryNotificationsRepository()
        sut = new ReadNotificationUseCase(notificationsRepository)
    })

    it('should set notification as read', async () => {
        const notification = makeNotification()

        notificationsRepository.create(notification)

        const result = await sut.execute({
            notificationId: notification.id.toString(),
            recipientId: notification.recipientId.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        expect(notificationsRepository.items[0].readAt).toEqual(
            expect.any(Date)
        )
    })

    it('should not read notification from another user', async () => {
        const notification = makeNotification({
            recipientId: new UniqueEntityId('recipient-1'),
        })

        notificationsRepository.create(notification)

        const result = await sut.execute({
            notificationId: notification.id.toString(),
            recipientId: 'recipient-2',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
