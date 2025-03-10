import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(private createQuestionUseCase: CreateQuestionUseCase) {}

    @Post()
    async handle(
        @CurrentUser() user: UserPayload,
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    ) {
        const { sub: authorId } = user
        const { title, content } = body

        await this.createQuestionUseCase.execute({
            title,
            content,
            authorId,
            attachmentIds: [],
        })
    }
}
