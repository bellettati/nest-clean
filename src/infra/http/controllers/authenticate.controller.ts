import {
    Body,
    Controller,
    InternalServerErrorException,
    Post,
} from '@nestjs/common'
import { z } from 'zod'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'

const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
    constructor(
        private authenticateStudentUseCase: AuthenticateStudentUseCase,
    ) {}
    @Post()
    async handle(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body

        const result = await this.authenticateStudentUseCase.execute({
            email,
            password,
        })

        if (result.isLeft()) {
            throw new InternalServerErrorException()
        }

        return {
            access_token: result.value.accessToken,
        }
    }
}
