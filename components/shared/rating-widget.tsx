"use client";
import { Star } from "lucide-react";
import React, { useState } from "react";

import { useRateCaregiver } from "@/lib/queries/use-caregiver-query";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export interface RatingData {
  caregiver_id: number;
  rating: number;
  feedback: string;
}

type Props = {
  caregiverId: number;
  //   onSubmit: (data: RatingData) => Promise<void>;
};
export const RatingWidget = ({ caregiverId }: Props) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  //   const [isPending, setisPending] = useState<boolean>(false);

  const { isPending, mutateAsync } = useRateCaregiver();
  const handleStarClick = (starIndex: number) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex: number) => {
    setHoveredRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    try {
      await mutateAsync({
        caregiver_id: caregiverId,
        rating,
        feedback: feedback.trim(),
      });

      // Reset form after successful submission
      setRating(0);
      setFeedback("");
    } catch (error) {
      console.error("Rating submission failed:", error);
    }
  };

  const getStarColor = (starIndex: number): string => {
    const activeRating = hoveredRating || rating;
    if (starIndex <= activeRating) {
      return "#FFD700"; // Gold color for filled stars
    }
    return "#E2E4E9"; // Default gray color
  };

  const getRatingText = (): string => {
    const activeRating = hoveredRating || rating;
    const ratingTexts: Record<number, string> = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return ratingTexts[activeRating] || "";
  };

  const handleFeedbackChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setFeedback(e.target.value);
  };
  return (
    <div className="space-y-4 rounded-md border border-[#E8E8E8] bg-white p-6">
      <div>
        <h6 className="text-base font-medium text-[#333]">Rating</h6>
        <p className="text-sm font-normal text-[#66666b]">
          How many stars would you rate your caregiver
        </p>
      </div>
      <div className="flex items-center gap-[12px]">
        {[1, 2, 3, 4, 5].map((starIndex: number) => (
          <button
            key={starIndex}
            type="button"
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            onMouseLeave={handleStarLeave}
            className="flex size-[40px] cursor-pointer items-center justify-center rounded-[5px] border border-blue-50 transition-all duration-150 hover:border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            disabled={isPending}
            aria-label={`Rate ${starIndex} star${starIndex !== 1 ? "s" : ""}`}
          >
            <Star
              className="size-6 transition-colors duration-150"
              style={{ color: getStarColor(starIndex) }}
              fill={
                starIndex <= (hoveredRating || rating)
                  ? getStarColor(starIndex)
                  : "none"
              }
            />
          </button>
        ))}
      </div>
      {(rating > 0 || hoveredRating > 0) && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#333]">
            {hoveredRating || rating} star
            {(hoveredRating || rating) !== 1 ? "s" : ""}
          </span>
          <span className="text-sm text-[#66666b]">({getRatingText()})</span>
        </div>
      )}
      <div className="relative space-y-3">
        <Label className="block text-sm font-medium text-[#333]">
          Leave a feedback (optional)
        </Label>
        <Textarea
          rows={10}
          placeholder="Type review"
          value={feedback}
          onChange={handleFeedbackChange}
          className="h-[90px] w-full resize-none rounded-md border border-blue-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none"
          disabled={isPending}
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {feedback.length}/500 characters
          </span>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isPending}
            className="flex h-[42px] w-[138px] items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
            type="button"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Sending...</span>
              </div>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
