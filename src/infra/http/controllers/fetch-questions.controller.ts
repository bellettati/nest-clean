import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

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
    constructor(private prisma: PrismaService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async handle(@Query('page', queryValidationPipe) page: PageQuerySchema) {
        const questions = await this.prisma.question.findMany({
            skip: (page - 1) * 20,
            take: page * 20,
        })

        return { questions }
    }
}
