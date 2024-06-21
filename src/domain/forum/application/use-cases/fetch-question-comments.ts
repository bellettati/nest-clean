import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchQuestionCommentsUseCaseInput {
    questionId: string
    page: number
}
type FetchQuestionCommentsUseCaseOutput = Either<
    null,
    {
        questionComments: QuestionComment[]
    }
>

export class FetchQuestionCommentsUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionCommentsRepository: QuestionCommentsRepository
    ) {}

    async execute({
        page,
        questionId,
    }: FetchQuestionCommentsUseCaseInput): Promise<FetchQuestionCommentsUseCaseOutput> {
        const questionComments =
            await this.questionCommentsRepository.findManyByQuestionId(
                { page },
                questionId
            )

        return right({ questionComments })
    }
}
