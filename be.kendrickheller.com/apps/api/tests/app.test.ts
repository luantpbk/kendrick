import request from 'supertest';
import { app } from '../src/server';

describe('API Health and Generic Routing', () => {
    
    it('should return 401 for protected endpoints without token', async () => {
        // We test a known POST endpoint which requires admin role
        const res = await request(app).post('/api/product');
        expect(res.status).toBe(401);
    });

    it('should allow GET /api/product (public endpoint)', async () => {
        const res = await request(app).get('/api/product');
        expect(res.status).toBe(200);
    });

    it('should allow GET /api/news (public endpoint)', async () => {
        const res = await request(app).get('/api/news');
        expect(res.status).toBe(200);
    });

    it('should allow GET /api/audio-book (public endpoint)', async () => {
        const res = await request(app).get('/api/audio-book');
        expect(res.status).toBe(200);
    });
});

describe('Security / Login Flow', () => {
    it('should return 400 for empty login', async () => {
        const res = await request(app)
            .post('/security/login')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.errorMessage).toBe('Login info cannot be empty');
    });

    it('should return 400 for invalid credentials', async () => {
        const res = await request(app)
            .post('/security/login')
            .send({ loginName: 'invalid@example.com', password: 'wrongpassword' });
        expect(res.status).toBe(400);
        expect(res.body.errorMessage).toBe('Invalid username or password');
    });
});
