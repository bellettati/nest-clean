import {
    QuestionComment,
    QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeQuestionComment(
    override: Partial<QuestionCommentProps> = {},
    id?: UniqueEntityId
) {
    const questionComment = QuestionComment.create(
        {
            questionId: new UniqueEntityId(),
            authorId: new UniqueEntityId(),
            content: faker.lorem.text(),
            ...override,
        },
        id
    )

    return questionComment
}
