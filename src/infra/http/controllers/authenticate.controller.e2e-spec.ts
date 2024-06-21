import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate Controller (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)

        await app.init()
    })

    test('[POST] /sessions', async () => {
        await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: await hash('secure_password', 8),
            },
        })

        const response = await request(app.getHttpServer())
            .post('/sessions')
            .send({
                email: 'john@doe.com',
                password: 'secure_password',
            })

        expect(response.statusCode)
        expect(response.body).toMatchObject({
            access_token: expect.any(String),
        })
    })
})
