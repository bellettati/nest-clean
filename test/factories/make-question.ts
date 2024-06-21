import { Question } from '@/domain/forum/enterprise/entities/question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeQuestion(
    override: Partial<Question> = {},
    id?: UniqueEntityId
) {
    const question = Question.create(
        {
            authorId: new UniqueEntityId(),
            title: faker.lorem.sentence(),
            content: faker.lorem.text(),
            ...override,
        },
        id
    )

    return question
}
