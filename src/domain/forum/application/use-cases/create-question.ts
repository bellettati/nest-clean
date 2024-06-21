import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'

interface CreateQuestionUseCaseInput {
    authorId: string
    title: string
    content: string
    attachmentIds: string[]
}
type CreateQuestionUseCaseOutput = Either<
    null,
    {
        question: Question
    }
>

@Injectable()
export class CreateQuestionUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({
        authorId,
        title,
        content,
        attachmentIds,
    }: CreateQuestionUseCaseInput): Promise<CreateQuestionUseCaseOutput> {
        const question = Question.create({
            authorId: new UniqueEntityId(authorId),
            title,
            content,
        })

        const questionAttachments = attachmentIds.map((attachmentId) =>
            QuestionAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                questionId: question.id,
            }),
        )

        question.attachments = new QuestionAttachmentList(questionAttachments)

        await this.questionsRepository.create(question)

        return right({ question })
    }
}
