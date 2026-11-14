// ==========================================
// MARSBOUND: MARS ACADEMY (10 INTERACTIVE LESSONS + QUIZZES)
// ==========================================

import React, { useState } from 'react';
import { ACADEMY_LESSONS, AcademyLesson, QuizQuestion } from '../data/lessons';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lightbulb,
  Award,
  Wind,
  ThermometerSnowflake,
  ShieldAlert,
  SunDim,
  Sprout,
  Radio,
  Droplets,
  ShieldCheck,
  Activity,
  Users,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Wind,
  ThermometerSnowflake,
  ShieldAlert,
  SunDim,
  Sprout,
  Radio,
  Droplets,
  ShieldCheck,
  Activity,
  Users,
};

interface Props {
  onQuizPassed?: (lessonId: string) => void;
}

export const Academy: React.FC<Props> = ({ onQuizPassed }) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(ACADEMY_LESSONS[0].id);
  const [activeQuizQuestionIndex, setActiveQuizQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const activeLesson: AcademyLesson =
    ACADEMY_LESSONS.find((l) => l.id === selectedLessonId) || ACADEMY_LESSONS[0];
  const Icon = ICON_MAP[activeLesson.iconName] || BookOpen;
  const currentQuestion: QuizQuestion | undefined = activeLesson.quiz[activeQuizQuestionIndex];

  const handleLessonSelect = (id: string) => {
    setSelectedLessonId(id);
    setActiveQuizQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleOptionSelect = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuizQuestionIndex < activeLesson.quiz.length - 1) {
      setActiveQuizQuestionIndex((idx) => idx + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
      if (onQuizPassed && score + (selectedOption === currentQuestion?.correctIndex ? 1 : 0) >= 1) {
        onQuizPassed(activeLesson.id);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                NASA STEM TRAINING GROUND
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                10 LESSONS
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white mt-0.5">
              Mars Academy: Space Science for Pioneers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Learn the real physics, biology, and chemistry behind surviving on Mars!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lessons Directory */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
            EXPLORE LESSON MODULES
          </div>

          <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {ACADEMY_LESSONS.map((lesson) => {
              const LessonIcon = ICON_MAP[lesson.iconName] || BookOpen;
              const isSelected = selectedLessonId === lesson.id;

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-neon-cyan'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className={`p-1.5 rounded-lg border ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <LessonIcon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">{lesson.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Lesson {lesson.number} • {lesson.readTime}
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Lesson View & Quiz */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Lesson Card */}
          <div className="p-6 rounded-2xl border border-cyan-800/40 bg-slate-900/90 space-y-5 shadow-2xl">
            {/* Lesson Title Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-neon-orange">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono text-orange-400 font-bold uppercase">
                    LESSON {activeLesson.number} OF 10 • CATEGORY: {activeLesson.category.toUpperCase()}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
                    {activeLesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {activeLesson.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Simple Explanation (Child friendly) */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>The Big Idea (Simple Explanation)</span>
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                {activeLesson.simpleExplanation}
              </p>
            </div>

            {/* In-Depth NASA Science */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>How NASA Engineers Handle This</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-purple-950/20 p-4 rounded-xl border border-purple-900/40">
                {activeLesson.inDepthScience}
              </p>
            </div>

            {/* "Did You Know?" Fun Fact */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono font-bold uppercase text-amber-300">
                  Did You Know?
                </span>
                <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed">
                  {activeLesson.interestingFact}
                </p>
              </div>
            </div>

            {/* Connection to Game Decisions */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono font-bold uppercase text-cyan-300">
                  How This Connects to Gameplay in MARSBOUND
                </span>
                <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed">
                  {activeLesson.gameConnection}
                </p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE KNOWLEDGE MINI-QUIZ */}
          <div className="p-6 rounded-2xl border border-cyan-800/40 bg-slate-900/90 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold font-display text-white">
                  Astronaut Knowledge Check (Quiz)
                </h4>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Question {activeQuizQuestionIndex + 1} of {activeLesson.quiz.length}
              </span>
            </div>

            {!quizCompleted && currentQuestion ? (
              <div className="space-y-4">
                <h5 className="text-sm sm:text-base font-bold text-slate-100 font-display">
                  {currentQuestion.question}
                </h5>

                {/* Option Buttons */}
                <div className="space-y-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = isAnswerSubmitted && idx === currentQuestion.correctIndex;
                    const isWrong =
                      isAnswerSubmitted && isSelected && idx !== currentQuestion.correctIndex;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : isWrong
                            ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                            : isSelected
                            ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 font-semibold'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{option}</span>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                        {isWrong && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Feedback */}
                {isAnswerSubmitted && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                      selectedOption === currentQuestion.correctIndex
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    }`}
                  >
                    <div className="font-bold font-mono mb-1">
                      {selectedOption === currentQuestion.correctIndex
                        ? '🎉 Correct! Great job, Astronaut!'
                        : '❌ Not quite, keep learning!'}
                    </div>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}

                {/* Submit / Next Button */}
                <div className="flex justify-end pt-2">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className={`px-6 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider ${
                        selectedOption !== null
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-neon-cyan cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-neon-orange hover:scale-105 transition-all"
                    >
                      {activeQuizQuestionIndex < activeLesson.quiz.length - 1
                        ? 'Next Question'
                        : 'Complete Lesson Quiz'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Finished Screen */
              <div className="p-6 text-center space-y-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <div className="text-4xl">🏆</div>
                <h5 className="text-lg font-bold font-display text-white">
                  Lesson Quiz Complete!
                </h5>
                <p className="text-xs text-slate-300">
                  You earned <strong className="text-emerald-400">{score}</strong> /{' '}
                  {activeLesson.quiz.length} points!
                </p>
                <button
                  onClick={() => {
                    setActiveQuizQuestionIndex(0);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                    setScore(0);
                    setQuizCompleted(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold hover:bg-slate-700"
                >
                  Retake Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
