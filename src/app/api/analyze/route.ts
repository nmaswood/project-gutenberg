import { NextRequest, NextResponse } from 'next/server';
import { analyzeSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received analysis request:', JSON.stringify(body, null, 2));

    const { content, analysisType } = analyzeSchema.parse(body);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not set');
    }

    const maxLength = 40000; 
    const truncatedContent = content.slice(0, maxLength);

    let prompt = '';
    switch (analysisType) {
      case 'summary':
        prompt = `Summarize the book in about 5 sentences:\n\n${truncatedContent}`;
        break;
      case 'sentiment':
        prompt = `Analyze the sentiment of the following text. Is it generally positive, negative, or neutral? Explain why:\n\n${truncatedContent}`;
        break;
      case 'characters':
        prompt = `Identify and list the main characters mentioned in the following text, if any:\n\n${truncatedContent}`;
        break;
      default:
        throw new Error('Invalid analysis type');
    }

    console.log('Sending request to OpenAI with prompt:', prompt.slice(0, 100) + '...');

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    console.log('Received response from OpenAI:', JSON.stringify(completion.choices[0].message, null, 2));

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error in text analysis:', error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input: ' + error.errors.map(e => e.message).join(', ') }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred', details: String(error) }, { status: 500 });
  }
}