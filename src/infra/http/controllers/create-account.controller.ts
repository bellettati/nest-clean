import { InternalServerErrorException, UsePipes } from '@nestjs/common'
import { Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
    constructor(private registerStudentUseCase: RegisterStudentUseCase) {}

    @Post()
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body: CreateAccountBodySchema) {
        const { name, email, password } = body

        const result = await this.registerStudentUseCase.execute({
            name,
            email,
            password,
        })

        if (result.isLeft()) {
            throw new InternalServerErrorException()
        }
    }
}
