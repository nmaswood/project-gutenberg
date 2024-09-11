import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const bookSchema = z.object({
  id: z.string().min(1),
});

async function fetchContent(id: string) {
  const urls = [
    `https://www.gutenberg.org/files/${id}/${id}.txt`,
    `https://www.gutenberg.org/files/${id}/${id}-0.txt`,
  ];

  for (const url of urls) {
    const response = await fetch(url);
    if (response.ok) {
      return response.text();
    }
  }

  throw new Error('Failed to fetch book content');
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = bookSchema.parse(params);

    const metadataUrl = `https://www.gutenberg.org/ebooks/${id}`;

    const [content, metadataResponse] = await Promise.all([
      fetchContent(id),
      fetch(metadataUrl),
    ]);

    if (!metadataResponse.ok) {
      console.error(`Failed to fetch metadata for book ${id}`);
      return NextResponse.json({ error: 'Failed to fetch book metadata' }, { status: 404 });
    }

    const metadataHtml = await metadataResponse.text();

    const title = metadataHtml.match(/<h1 itemprop="name">(.*?)<\/h1>/)?.[1] || `Book ${id}`;
    const author = metadataHtml.match(/<a.*?itemprop="creator".*?>(.*?)<\/a>/)?.[1] || 'Unknown';
    const language = metadataHtml.match(/<tr><th>Language<\/th><td>(.*?)<\/td><\/tr>/)?.[1] || 'Unknown';

    return NextResponse.json({
      id,
      title,
      author,
      language,
      preview: content.slice(0, 1000), // First 1000 characters for preview
      fullContent: content,
      fullContentUrl: `https://www.gutenberg.org/ebooks/${id}`,
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}