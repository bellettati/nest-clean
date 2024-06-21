import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseInput {
    instructorId: string
    questionId: string
    content: string
    attachmentIds: string[]
}

type AnswerQuestionUseCaseOutput = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async execute({
        questionId,
        instructorId,
        content,
        attachmentIds,
    }: AnswerQuestionUseCaseInput): Promise<AnswerQuestionUseCaseOutput> {
        const answer = Answer.create({
            authorId: new UniqueEntityId(instructorId),
            questionId: new UniqueEntityId(questionId),
            content,
        })

        const attachments = attachmentIds.map((attachmentId) =>
            AnswerAttachment.create({
                answerId: answer.id,
                attachmentId: new UniqueEntityId(attachmentId),
            })
        )
        const attachmentList = new AnswerAttachmentList(attachments)

        answer.attachments = attachmentList

        await this.answersRepository.create(answer)

        return right({ answer })
    }
}
