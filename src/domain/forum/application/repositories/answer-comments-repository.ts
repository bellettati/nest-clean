import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswerCommentsRepository {
    abstract findById(id: string): Promise<AnswerComment | null>
    abstract findManyByAnswerId(
        params: PaginationParams,
        answerId: string,
    ): Promise<AnswerComment[]>
    abstract create(answerComment: AnswerComment): Promise<void>
    abstract delete(answer: AnswerComment): Promise<void>
}
