"use client";

import { useState } from "react";
import type { Question } from "@/app/lib/questions";

type Props = {
  question: Question;
  selectedAnswer?: number | null;
  onAnswerSelect?: (questionId: string, answerIndex: number, isCorrect: boolean) => void;
};

export default function QuestionCard({ question, selectedAnswer, onAnswerSelect }: Props) {
  const [showExplanation, setShowExplanation] = useState(false);

  const isCorrect = selectedAnswer === question.answerIndex;
  const answered = selectedAnswer !== null && selectedAnswer !== undefined;

  const handleSelect = (index: number) => {
    if (!answered) {
      onAnswerSelect?.(question.id, index, index === question.answerIndex);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-sm text-slate-300">{question.stem}</p>

      <ul className="mt-4 space-y-3">
        {question.options.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          const isAnswer = i === question.answerIndex;

          let borderColor = "border-slate-700";
          let bgColor = "bg-slate-800/40 hover:bg-slate-800/60";

          if (answered) {
            if (isAnswer) {
              borderColor = "border-green-600";
              bgColor = "bg-green-900/30";
            } else if (isSelected && !isCorrect) {
              borderColor = "border-red-600";
              bgColor = "bg-red-900/30";
            }
          } else if (isSelected) {
            borderColor = "border-sky-500";
            bgColor = "bg-sky-900/20";
          }

          return (
            <li key={i}>
              <button
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`w-full rounded-md border px-4 py-3 text-left text-sm text-slate-100 transition ${borderColor} ${bgColor} ${
                  !answered ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 flex items-center justify-center ${
                      answered
                        ? isAnswer
                          ? "border-green-600 bg-green-600"
                          : isSelected && !isCorrect
                          ? "border-red-600 bg-red-600"
                          : "border-slate-600"
                        : isSelected
                        ? "border-sky-500 bg-sky-500"
                        : "border-slate-600"
                    }`}
                  >
                    {answered && isAnswer && (
                      <span className="text-white text-xs">✓</span>
                    )}
                    {answered && isSelected && !isCorrect && (
                      <span className="text-white text-xs">✗</span>
                    )}
                  </div>
                  <span className="flex-1">{opt}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <div className="mt-4 space-y-3">
          <div
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              isCorrect
                ? "bg-green-900/30 text-green-300"
                : "bg-red-900/30 text-red-300"
            }`}
          >
            {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
          </div>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full rounded-md border border-sky-600 bg-sky-900/20 px-4 py-2 text-sm text-sky-300 hover:bg-sky-900/40 transition"
          >
            {showExplanation ? "Hide" : "Show"} Explanation
          </button>

          {showExplanation && (
            <div className="rounded-md border border-slate-700 bg-slate-800/40 px-4 py-3 text-sm text-slate-200">
              <p className="font-semibold text-slate-300 mb-2">Explanation:</p>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
