import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt-strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(private prisma: PrismaService) {}

    @Post()
    async handle(
        @CurrentUser() user: UserPayload,
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    ) {
        const { sub: authorId } = user
        const { title, content } = body

        await this.prisma.question.create({
            data: {
                title,
                content,
                slug: this.convertToSlug(title),
                authorId,
            },
        })
    }

    private convertToSlug(value: string): string {
        return value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
    }
}
