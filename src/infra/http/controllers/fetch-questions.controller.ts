import {
    Controller,
    Get,
    InternalServerErrorException,
    Query,
    UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { HttpQuestionPresenter } from '../presenters/http-question-presenter'

const pageQuerySchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

type PageQuerySchema = z.infer<typeof pageQuerySchema>

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema)

@Controller('/questions')
export class FetchQuestionsController {
    constructor(
        private fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async handle(@Query('page', queryValidationPipe) page: PageQuerySchema) {
        const result = await this.fetchRecentQuestionsUseCase.execute({
            page,
        })

        if (result.isLeft()) {
            throw new InternalServerErrorException()
        }

        const questions = result.value.questions.map((question) =>
            HttpQuestionPresenter.toHTTP(question),
        )

        return { questions }
    }
}
