import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
    findById(id: string): Promise<QuestionComment | null>
    findManyByQuestionId(
        params: PaginationParams,
        questionId: string
    ): Promise<QuestionComment[]>
    create(questionComment: QuestionComment): Promise<void>
    delete(questionComment: QuestionComment): Promise<void>
}
