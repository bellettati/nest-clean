import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecentQuestionsUseCaseInput {
    page: number
}

type FetchRecentQuestionsUseCaseOutput = Either<
    null,
    {
        questions: Question[]
    }
>

@Injectable()
export class FetchRecentQuestionsUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({
        page,
    }: FetchRecentQuestionsUseCaseInput): Promise<FetchRecentQuestionsUseCaseOutput> {
        const questions = await this.questionsRepository.findManyRecent({
            page,
        })

        return right({ questions })
    }
}
