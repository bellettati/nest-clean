import { Either, left, right } from './either'

function doSomething(isSuccess: boolean): Either<string, number> {
    if (isSuccess) {
        return right(1)
    }

    return left('error')
}

test('success result', () => {
    const result = doSomething(true)

    expect(result.isRight()).toBeTruthy()
})

test('error result', () => {
    const result = doSomething(false)

    expect(result.isLeft()).toBeTruthy()
})
