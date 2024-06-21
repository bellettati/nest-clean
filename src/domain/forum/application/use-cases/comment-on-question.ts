import { Either, left, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface CommentOnQuestionUseCaseInput {
    authorId: string
    questionId: string
    content: string
}

type CommentOnQuestionUseCaseOutput = Either<
    ResourceNotFoundError,
    {
        questionComment: QuestionComment
    }
>

export class CommentOnQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionCommentsRepository: QuestionCommentsRepository
    ) {}

    async execute({
        authorId,
        questionId,
        content,
    }: CommentOnQuestionUseCaseInput): Promise<CommentOnQuestionUseCaseOutput> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        const questionComment = QuestionComment.create({
            authorId: new UniqueEntityId(authorId),
            questionId: question.id,
            content,
        })

        await this.questionCommentsRepository.create(questionComment)

        return right({ questionComment })
    }
}
