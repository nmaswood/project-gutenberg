import { NextRequest } from 'next/server';
import { GET } from '@/app/api/book/[id]/route';

global.fetch = jest.fn();

describe('Book API Route', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return book data for a valid book ID', async () => {
    const mockBookContent = 'This is the book content';
    const mockMetadata = '<h1 itemprop="name">Test Book</h1><a itemprop="creator">Test Author</a>';

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/files/')) {
        return Promise.resolve({ ok: true, text: () => Promise.resolve(mockBookContent) });
      } else if (url.includes('/ebooks/')) {
        return Promise.resolve({ ok: true, text: () => Promise.resolve(mockMetadata) });
      }
    });

    const request = new NextRequest('http://localhost/api/book/1234');
    const response = await GET(request, { params: { id: '1234' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id', '1234');
    expect(data).toHaveProperty('title', 'Test Book');
    expect(data).toHaveProperty('author', 'Test Author');
    expect(data).toHaveProperty('preview');
    expect(data).toHaveProperty('fullContent');
  });

  it('should return an error for an invalid book ID', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({ ok: false })
    );

    const request = new NextRequest('http://localhost/api/book/invalid');
    const response = await GET(request, { params: { id: 'invalid' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});