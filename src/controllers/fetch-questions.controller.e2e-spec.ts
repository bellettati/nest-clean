import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch Questions Controller (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[GET] /questions', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'secure_password',
            },
        })

        await prisma.question.createMany({
            data: [
                {
                    title: 'Question Title',
                    content: 'Some question content',
                    slug: 'question-title',
                    authorId: user.id,
                },
                {
                    title: 'New Question Title',
                    content: 'Another question content',
                    slug: 'new-question-title',
                    authorId: user.id,
                },
            ],
        })

        const accessToken = jwt.sign({ sub: user.id })

        const response = await request(app.getHttpServer())
            .get('/questions')
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.questions).toHaveLength(2)
    })
})
