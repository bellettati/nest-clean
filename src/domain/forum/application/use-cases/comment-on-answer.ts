import { Either, left, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface CommentOnAnswerUseCaseInput {
    authorId: string
    answerId: string
    content: string
}

type CommentOnAnswerUseCaseOutput = Either<
    ResourceNotFoundError,
    {
        answerComment: AnswerComment
    }
>

export class CommentOnAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerCommentsRepository: AnswerCommentsRepository
    ) {}

    async execute({
        authorId,
        answerId,
        content,
    }: CommentOnAnswerUseCaseInput): Promise<CommentOnAnswerUseCaseOutput> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        const answerComment = AnswerComment.create({
            authorId: new UniqueEntityId(authorId),
            answerId: answer.id,
            content,
        })

        await this.answerCommentsRepository.create(answerComment)

        return right({ answerComment })
    }
}
