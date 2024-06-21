import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersUseCaseInput {
    page: number
    questionId: string
}
type FetchQuestionAnswersUseCaseOutput = Either<
    null,
    {
        answers: Answer[]
    }
>

export class FetchQuestionAnswersUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async execute({
        page,
        questionId,
    }: FetchQuestionAnswersUseCaseInput): Promise<FetchQuestionAnswersUseCaseOutput> {
        const answers = await this.answersRepository.findManyByQuestionId(
            { page },
            questionId
        )

        return right({ answers })
    }
}
