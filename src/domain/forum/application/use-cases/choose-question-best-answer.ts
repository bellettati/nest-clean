import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface ChooseQuestionBestAnswerUseCaseInput {
    authorId: string
    answerId: string
}
type ChooseQuestionBestAnswerUseCaseOutput = Either<
    ResourceNotFoundError | NotAllowedError,
    object
>

export class ChooseQuestionBestAnswerUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private answersRepository: AnswersRepository
    ) {}

    async execute({
        authorId,
        answerId,
    }: ChooseQuestionBestAnswerUseCaseInput): Promise<ChooseQuestionBestAnswerUseCaseOutput> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        const question = await this.questionsRepository.findById(
            answer.questionId.toString()
        )

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (question.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }

        question.bestAnswerId = answer.id

        await this.questionsRepository.save(question)

        return right({})
    }
}
