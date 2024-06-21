import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface EditQuestionUseCaseInput {
    authorId: string
    questionId: string
    title?: string
    content?: string
    attachmentIds: string[]
}

type EditQuestionUseCaseOutput = Either<
    ResourceNotFoundError | NotAllowedError,
    object
>

export class EditQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionAttachmentsRepository: QuestionAttachmentsRepository
    ) {}

    async execute({
        authorId,
        questionId,
        title,
        content,
        attachmentIds,
    }: EditQuestionUseCaseInput): Promise<EditQuestionUseCaseOutput> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (question.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }

        const questionAttachments = attachmentIds.map((attachmentId) =>
            QuestionAttachment.create({
                questionId: question.id,
                attachmentId: new UniqueEntityId(attachmentId),
            })
        )

        question.title = title ?? question.title
        question.content = content ?? question.content
        question.attachments.update(questionAttachments)

        await this.questionsRepository.save(question)

        return right({})
    }
}
