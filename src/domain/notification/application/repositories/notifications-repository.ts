import { Notification } from '../../enterprise/entities/notification'

export interface NotificationsRepository {
    findById(id: string): Promise<null | Notification>
    create(notification: Notification): Promise<void>
    save(notification: Notification): Promise<void>
}
