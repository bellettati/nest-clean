import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteAnswerUseCaseInput {
    authorId: string
    answerId: string
}

type DeleteAnswerUseCaseOutput = Either<
    ResourceNotFoundError | NotAllowedError,
    object
>

export class DeleteAnswerUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async execute({
        authorId,
        answerId,
    }: DeleteAnswerUseCaseInput): Promise<DeleteAnswerUseCaseOutput> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        if (answer.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }

        await this.answersRepository.delete(answer)

        return right({})
    }
}
