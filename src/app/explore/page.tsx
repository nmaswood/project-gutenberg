'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PreviousBooksList } from "@/components/PreviousBooksList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { bookIdSchema, analyzeSchema } from '@/lib/validations'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { useToast } from "@/hooks/use-toast"

interface BookData {
  id: string;
  title: string;
  author: string;
  language: string;
  preview: string;
  fullContent: string;
  fullContentUrl: string;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4 bg-red-100 border border-red-400 rounded-md">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong:</h2>
      <pre className="mt-2 text-sm text-red-600">{error.message}</pre>
      <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
    </div>
  )
}

export default function ExplorePage() {

  const [bookId, setBookId] = useState('')
  const [previousBooks, setPreviousBooks] = useState<BookData[]>([])

  useEffect(() => {
    const storedBooks = localStorage.getItem('previousBooks')
    if (storedBooks) {
      setPreviousBooks(JSON.parse(storedBooks))
    }
  }, [])

  const { data, error, isLoading, refetch } = useQuery<BookData>({
    queryKey: ['book', bookId],
    queryFn: async () => {
      try {
        bookIdSchema.parse(bookId);
        const response = await fetch(`/api/book/${bookId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch book');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching book:', error);
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
      }
    },
    enabled: false,
  });

  const { toast } = useToast()

  const analysisMutation = useMutation({
    mutationFn: async ({ content, analysisType }: { content: string, analysisType: string }) => {
      try {
        console.log('Sending analysis request:', { analysisType, contentLength: content.length });
        analyzeSchema.parse({ content, analysisType });
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, analysisType }),
        });
        const data = await response.json();
        if (!response.ok) {
          console.error('Analysis API error:', data);
          throw new Error(data.error || 'Failed to analyze text');
        }
        return data;
      } catch (error) {
        console.error('Analysis error:', error);
        if (error instanceof Error) {
          throw new Error(`Analysis failed: ${error.message}`);
        }
        throw new Error('An unexpected error occurred during analysis');
      }
    },
    onError: (error) => {
      console.error('Analysis mutation error:', error);
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      });
    },
  });

  const handleExplore = () => {
    if (bookId) {
      refetch();
    }
  }

  const handlePreviousBookSelect = (id: string) => {
    setBookId(id);
    refetch();
  }

  const handleAnalysis = (type: string) => {
    if (data) {
      const contentToAnalyze = data.fullContent || data.preview;
      analysisMutation.mutate({ content: contentToAnalyze, analysisType: type });
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Explore Books</h1>
        <div className="flex space-x-2 mb-6">
          <Input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="Enter Book ID"
            className="flex-grow"
          />
          <Button onClick={handleExplore} disabled={isLoading || !bookId}>
            {isLoading ? 'Loading...' : 'Explore'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {(error as Error).message}
            </AlertDescription>
          </Alert>
        )}

        {data && (
          <Card className="w-full mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Author:</p>
                  <p>{data.author}</p>
                </div>
                <div>
                  <p className="font-semibold">Language:</p>
                  <p>{data.language}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-semibold">Preview:</p>
                <p className="mt-2 text-sm text-gray-600">{data.preview}</p>
              </div>
              <Button asChild className="mb-4">
                <a href={data.fullContentUrl} target="_blank" rel="noopener noreferrer">
                  View Full Content
                </a>
              </Button>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                  <TabsTrigger value="characters">Characters</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                  <Button onClick={() => handleAnalysis('summary')} disabled={analysisMutation.isPending}>
                    Generate Summary
                  </Button>
                </TabsContent>
                <TabsContent value="sentiment">
                  <Button onClick={() => handleAnalysis('sentiment')} disabled={analysisMutation.isPending}>
                    Analyze Sentiment
                  </Button>
                </TabsContent>
                <TabsContent value="characters">
                  <Button onClick={() => handleAnalysis('characters')} disabled={analysisMutation.isPending}>
                    Identify Characters
                  </Button>
                </TabsContent>
              </Tabs>
              {analysisMutation.isPending && <p>Analyzing...</p>}
              {analysisMutation.isError && (
                <Alert variant="destructive" className="mt-4">
                <AlertTitle>Analysis Error</AlertTitle>
                <AlertDescription>
                    {analysisMutation.error instanceof Error 
                    ? analysisMutation.error.message 
                    : 'An unexpected error occurred during analysis. Please try again.'}
                </AlertDescription>
                </Alert>
            )}
              {analysisMutation.isSuccess && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Analysis Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{analysisMutation.data.result}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        <PreviousBooksList books={previousBooks} onBookSelect={handlePreviousBookSelect} />
      </div>
    </ErrorBoundary>
  )
}