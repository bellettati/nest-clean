import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export abstract class QuestionCommentsRepository {
    abstract findById(id: string): Promise<QuestionComment | null>
    abstract findManyByQuestionId(
        params: PaginationParams,
        questionId: string,
    ): Promise<QuestionComment[]>
    abstract create(questionComment: QuestionComment): Promise<void>
    abstract delete(questionComment: QuestionComment): Promise<void>
}
