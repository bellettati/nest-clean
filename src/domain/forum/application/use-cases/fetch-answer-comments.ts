import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseInput {
    answerId: string
    page: number
}
type FetchAnswerCommentsUseCaseOutput = Either<
    null,
    {
        answerComments: AnswerComment[]
    }
>

export class FetchAnswerCommentsUseCase {
    constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

    async execute({
        page,
        answerId,
    }: FetchAnswerCommentsUseCaseInput): Promise<FetchAnswerCommentsUseCaseOutput> {
        const answerComments =
            await this.answerCommentsRepository.findManyByAnswerId(
                { page },
                answerId
            )

        return right({ answerComments })
    }
}
