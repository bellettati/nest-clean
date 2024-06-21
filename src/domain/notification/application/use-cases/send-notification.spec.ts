import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification Use Case', () => {
    beforeEach(() => {
        notificationsRepository = new InMemoryNotificationsRepository()
        sut = new SendNotificationUseCase(notificationsRepository)
    })

    it('should create a notification', async () => {
        const result = await sut.execute({
            recipientId: 'recipient-1',
            title: 'Notification Title',
            content: 'Notification content',
        })

        expect(result.isRight()).toBeTruthy()
        expect(notificationsRepository.items[0]).toEqual(
            result.value?.notification
        )
    })
})
