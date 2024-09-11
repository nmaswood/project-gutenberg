import { bookIdSchema, analyzeSchema, searchQuerySchema } from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('bookIdSchema', () => {
    it('should pass for valid book IDs', () => {
      expect(() => bookIdSchema.parse('1234')).not.toThrow();
    });

    it('should fail for empty book IDs', () => {
      expect(() => bookIdSchema.parse('')).toThrow();
    });
  });

  describe('analyzeSchema', () => {
    it('should pass for valid analysis requests', () => {
      expect(() => analyzeSchema.parse({ content: 'Some content', analysisType: 'summary' })).not.toThrow();
    });

    it('should fail for invalid analysis types', () => {
      expect(() => analyzeSchema.parse({ content: 'Some content', analysisType: 'invalid' })).toThrow();
    });

    it('should fail for empty content', () => {
      expect(() => analyzeSchema.parse({ content: '', analysisType: 'summary' })).toThrow();
    });
  });

  describe('searchQuerySchema', () => {
    it('should pass for valid search queries', () => {
      expect(() => searchQuerySchema.parse('Shakespeare')).not.toThrow();
    });

    it('should fail for empty search queries', () => {
      expect(() => searchQuerySchema.parse('')).toThrow();
    });

    it('should fail for search queries that are too long', () => {
      const longQuery = 'a'.repeat(101);
      expect(() => searchQuerySchema.parse(longQuery)).toThrow();
    });
  });
});