import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvents } from './domain-events'
import { DomainEvent } from './domain-event'

class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date
    private aggregate: CustomAggregate

    constructor(aggregate: CustomAggregate) {
        this.aggregate = aggregate
        this.ocurredAt = new Date()
    }

    public getAggregateId(): UniqueEntityId {
        return this.aggregate.id
    }
}

class CustomAggregate extends AggregateRoot<unknown> {
    static create() {
        const aggregate = new CustomAggregate(null)

        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

        return aggregate
    }
}

describe('Domain Events', () => {
    it('should dispatch and listen to events', () => {
        const callbackSpy = vi.fn()

        DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

        const aggregate = CustomAggregate.create()

        expect(aggregate.domainEvents).toHaveLength(1)

        DomainEvents.dispatchEventsForAggregate(aggregate.id)

        expect(callbackSpy).toHaveBeenCalled()
        expect(aggregate.domainEvents).toHaveLength(0)
    })
})
