'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  businessId: string;
}

export default function ReviewForm({ businessId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // In a real app, the token would be stored securely (e.g., in an HttpOnly cookie or context)
    // For this example, we'll assume it's in localStorage after login.
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      setError('You must be logged in to post a review.');
      setIsSubmitting(false);
      // Optionally redirect to login page
      // router.push('/login');
      return;
    }

    if (rating === 0 || comment.trim() === '') {
      setError('Please provide a rating and a comment.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId,
          rating,
          comment,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      // Reset form and refresh the page to show the new review
      setRating(0);
      setComment('');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-6 rounded-lg bg-gray-50">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mb-4">
        <label className="block font-medium mb-2">Your Rating</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block font-medium mb-2">Your Comment</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={4}
          placeholder="Share your experience..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
