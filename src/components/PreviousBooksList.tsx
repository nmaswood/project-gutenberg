import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Book {
  id: string;
  title: string;
  author: string;
}

interface PreviousBooksListProps {
  books: Book[];
  onBookSelect: (id: string) => void;
}

export function PreviousBooksList({ books, onBookSelect }: PreviousBooksListProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Previously Accessed Books</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {books.map((book) => (
            <li key={book.id} className="flex justify-between items-center">
              <span>{book.title} by {book.author}</span>
              <Button variant="outline" onClick={() => onBookSelect(book.id)}>
                View
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}