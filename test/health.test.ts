import { describe, expect, it } from 'bun:test'
import { app } from '../src/app'

describe('health test', () => {
    const test_app = app
    it('should response with ok', async () => {
        const response = await test_app
            .handle(new Request('http://localhost/api/health'))
            .then((res: any) => res.status)
        expect(response).toBe(200)
    })
})