import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface EditAnswerUseCaseInput {
    authorId: string
    answerId: string
    content: string
    attachmentIds: string[]
}
type EditAnswerUseCaseOutput = Either<
    ResourceNotFoundError | NotAllowedError,
    object
>

export class EditAnswerUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async execute({
        authorId,
        answerId,
        content,
        attachmentIds,
    }: EditAnswerUseCaseInput): Promise<EditAnswerUseCaseOutput> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        if (answer.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }

        const attachments = attachmentIds.map((attachmentId) =>
            AnswerAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                answerId: answer.id,
            })
        )

        answer.content = content
        answer.attachments.update(attachments)

        await this.answersRepository.save(answer)

        return right({})
    }
}
