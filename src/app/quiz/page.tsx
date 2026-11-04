"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Trophy, 
  Medal, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  User, 
  Check, 
  Loader2, 
  AlertCircle,
  Crown,
  Gamepad2,
  Flame,
  Star,
  Timer,
  ChevronRight
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
}

interface ScoreRecord {
  id: string;
  player_name: string;
  grade: string;
  subject: string;
  score: number;
  created_at: string;
}

const GRADES = [
  { label: "ශ්‍රේණිය 6", value: "Grade 6" },
  { label: "ශ්‍රේණිය 7", value: "Grade 7" },
  { label: "ශ්‍රේණිය 8", value: "Grade 8" },
  { label: "ශ්‍රේණිය 9", value: "Grade 9" },
  { label: "ශ්‍රේණිය 10", value: "Grade 10" },
  { label: "ශ්‍රේණිය 11", value: "Grade 11" }
];

const CORE_SUBJECTS = [
  "විද්‍යාව", 
  "ගණිතය", 
  "ඉතිහාසය", 
  "සිංහල", 
  "ඉංග්‍රීසි", 
  "තොරතුරු තාක්ෂණය (ICT)"
];

const BASKET_SUBJECTS = [
  "වාණිජ සහ ගිණුම්කරණය",
  "චිත්‍ර",
  "සංගීතය",
  "සාහිත්‍ය රසාස්වාදය"
];

const ALL_SUBJECTS = [...CORE_SUBJECTS, ...BASKET_SUBJECTS];
const QUIZ_TIME_SECONDS = 240;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizGamePage() {
  const [gameState, setGameState] = useState<'select-grade' | 'setup' | 'playing' | 'result'>('select-grade');
  
  const [selectedGrade, setSelectedGrade] = useState(GRADES[4]);
  const [subject, setSubject] = useState(CORE_SUBJECTS[0]);
  const [playerName, setPlayerName] = useState('');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>([]);
  const [leaderboardSubject, setLeaderboardSubject] = useState(CORE_SUBJECTS[0]);

  const availableSubjects = (selectedGrade.value === "Grade 10" || selectedGrade.value === "Grade 11")
    ? ALL_SUBJECTS
    : CORE_SUBJECTS;

  const fetchLeaderboardData = async (subj: string) => {
    try {
      const cleanSubj = subj.trim();
      const { data, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .ilike('subject', cleanSubj)
        .order('score', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(10);

      if (!error && data) {
        setLeaderboard(data);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(leaderboardSubject);
  }, [leaderboardSubject]);

  useEffect(() => {
    if (gameState === 'playing') {
      setTimeLeft(QUIZ_TIME_SECONDS);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleGradeSelect = (g: typeof GRADES[0]) => {
    setSelectedGrade(g);
    setSubject(CORE_SUBJECTS[0]);
    setGameState('setup');
  };

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setLoading(true);
    setFetchError(null);

    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('grade', selectedGrade.value.trim())
        .eq('subject', subject.trim());

      if (error) {
        setFetchError("දත්ත පද්ධති දෝෂයකි: " + error.message);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const randomQuestions = shuffleArray(data).slice(0, 10);

        const formattedQuestions: Question[] = randomQuestions.map((item: any) => {
          const rawOptions: string[] = typeof item.options === 'string'
            ? JSON.parse(item.options)
            : item.options;
          
          const originalCorrectIndex = Number(item.correct_index);
          const correctAnswerText = rawOptions[originalCorrectIndex];
          const shuffledOptions = shuffleArray(rawOptions);
          const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

          return {
            id: item.id,
            question: item.question,
            options: shuffledOptions,
            correct_index: newCorrectIndex >= 0 ? newCorrectIndex : 0,
          };
        });

        setQuestions(formattedQuestions);
        setCurrentIndex(0);
        setUserAnswers({});
        setGameState('playing');
        setLeaderboardSubject(subject);
      } else {
        setFetchError(`සමාවන්න, ${selectedGrade.label} සඳහා ${subject} ප්‍රශ්න තවම ඇතුළත් කර නොමැත!`);
      }
    } catch (err: any) {
      setFetchError("දෝෂයක් ඇති විය: " + (err?.message || "නැවත උත්සාහ කරන්න"));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (timeLeft <= 0 || submitting) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const handleFinishQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_index) finalScore += 1;
    });

    try {
      const { error } = await supabase.from('quiz_scores').insert([
        {
          player_name: playerName.trim(),
          grade: selectedGrade.value.trim(),
          subject: subject.trim(),
          score: finalScore,
        }
      ]);

      if (error) {
        console.error("Score save error:", error.message);
      }

      setLeaderboardSubject(subject);
      await fetchLeaderboardData(subject);
    } catch (err) {
      console.error("Failed to submit score:", err);
    } finally {
      setSubmitting(false);
      setGameState('result');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const totalCorrect = questions.filter((q, idx) => userAnswers[idx] === q.correct_index).length;

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const restRanks = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#F0FDF4]/70 pt-20 sm:pt-28 pb-10 px-3 sm:px-6 lg:px-8 transform-gpu subpixel-antialiased selection:bg-emerald-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* Header Bar */}
        <header className="flex flex-row items-center justify-between gap-3 bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm transform-gpu will-change-transform">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-sm shrink-0">
              <Gamepad2 className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full truncate">
                  Aththadassi Quest
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-amber-600">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Live
                </span>
              </div>
              <h1 className="text-sm sm:text-2xl font-black text-slate-900 truncate tracking-tight">
                Quiz Arena
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-[10px] sm:text-xs shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 hidden sm:inline" />
            <span>4 Mins Speed</span>
          </div>
        </header>

        {/* Main Grid: Mobile single-column, Desktop 7:5 */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* ================= LEFT COLUMN: GAME FRAME ================= */}
          <div className="lg:col-span-7 flex flex-col justify-start">

            {/* STAGE 0: GRADE SELECTION SCREEN */}
            {gameState === 'select-grade' && (
              <div className="h-full bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6 transform-gpu will-change-transform">
                <div className="space-y-1 border-b border-slate-100 pb-3 sm:pb-4">
                  <span className="text-[10px] sm:text-xs font-extrabold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block">
                    පියවර 1: ශ්‍රේණිය
                  </span>
                  <h2 className="text-base sm:text-2xl font-black text-slate-900">
                    ඔබගේ ශ්‍රේණිය තෝරන්න 🎯
                  </h2>
                  <p className="text-slate-500 text-[11px] sm:text-sm">
                    ප්‍රශ්නාවලියට සහභාගී වීමට පන්තිය තෝරන්න:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5">
                  {GRADES.map((g) => (
                    <div
                      key={g.value}
                      onClick={() => handleGradeSelect(g)}
                      className="group flex items-center justify-between p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-150 sm:border-2 hover:border-rose-400 hover:bg-rose-50/20 shadow-sm cursor-pointer transition-all duration-150 relative overflow-hidden select-none active:scale-[0.98] transform-gpu will-change-transform"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-2 sm:w-2.5 bg-rose-500 group-hover:bg-rose-600 transition-colors" />

                      <div className="flex items-center gap-2.5 pl-2 sm:pl-3">
                        <span className="text-xs sm:text-base font-bold text-slate-800 group-hover:text-rose-950">
                          {g.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-slate-400 group-hover:text-rose-600">
                        <span>ප්‍රශ්නෝත්තර</span>
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STAGE 1: SETUP FORM */}
            {gameState === 'setup' && (
              <div className="h-full bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm flex flex-col justify-between space-y-4 sm:space-y-6 transform-gpu will-change-transform">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-extrabold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block">
                      පියවර 2: ක්‍රීඩකයා හා විෂය
                    </span>
                    <button
                      onClick={() => setGameState('select-grade')}
                      className="text-[11px] sm:text-xs font-bold text-slate-500 hover:text-emerald-700 underline flex items-center gap-1 active:scale-95"
                    >
                      <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> මාරු කරන්න
                    </button>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                    {selectedGrade.label} සඳහා සූදානම්ද? 🚀
                  </h2>
                  <p className="text-slate-500 text-[11px] sm:text-sm">
                    නම ඇතුළත් කර විෂය තෝරන්න. විනාඩි 4 කවුන්ටරය තුළ ප්‍රශ්න 10 සම්පූර්ණ කරන්න!
                  </p>
                </div>

                {fetchError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{fetchError}</span>
                  </div>
                )}

                <form onSubmit={handleStartQuiz} className="space-y-3.5 sm:space-y-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-700" /> නම (Your Name)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="උදා: කසුන් පෙරේරා"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3.5 py-2.5 sm:py-3 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-700" /> ශ්‍රේණිය
                      </label>
                      <div className="w-full bg-slate-100 border border-slate-200 rounded-xl sm:rounded-2xl px-3.5 py-2.5 sm:py-3 text-slate-700 font-black text-xs sm:text-sm">
                        {selectedGrade.label}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700" /> විෂය (Subject)
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3.5 py-2.5 sm:py-3 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-emerald-600 transition-all cursor-pointer"
                      >
                        {availableSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs sm:text-base disabled:opacity-50 mt-2 transform-gpu will-change-transform"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>ප්‍රශ්න සූදානම් වෙමින් පවතී...</span>
                      </>
                    ) : (
                      <>
                        <span>Game එක ආරම්භ කරන්න (Start Test)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* STAGE 2: PLAYING FRAME */}
            {gameState === 'playing' && questions.length > 0 && (
              <div className="space-y-3 sm:space-y-4 transform-gpu will-change-transform">
                <div className="bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-black">
                    <div className="flex items-center gap-1.5 truncate max-w-[45%]">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 truncate">
                        {selectedGrade.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 truncate">
                        {subject}
                      </span>
                    </div>

                    {/* VIBRANT BOLD BLUE COUNTDOWN COUNTER */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600 text-white shadow-sm border border-blue-400 font-mono text-xs font-black tracking-wider shrink-0 transform-gpu">
                      <Timer className="w-3.5 h-3.5 text-blue-200 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>{formatTime(timeLeft)}</span>
                    </div>

                    <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
                      Q <strong className="text-emerald-700">{currentIndex + 1}</strong>/{questions.length}
                    </span>
                  </div>

                  <div className="w-full h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-200 ease-out transform-gpu will-change-transform"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-100 text-blue-800 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5">
                      {currentIndex + 1}
                    </div>
                    <h2 className="text-xs sm:text-lg font-black text-slate-900 leading-snug">
                      {questions[currentIndex].question}
                    </h2>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2 sm:space-y-2.5">
                    {questions[currentIndex].options.map((opt, optIdx) => {
                      const isSelected = userAnswers[currentIndex] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-150 transform-gpu will-change-transform ${
                            timeLeft <= 0 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'
                          } ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-sm' 
                              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                            isSelected 
                              ? 'bg-blue-600 text-white scale-105' 
                              : 'border border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />}
                          </div>

                          <span className="text-xs sm:text-sm font-bold leading-snug">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={currentIndex === 0 || submitting || timeLeft <= 0}
                      onClick={() => setCurrentIndex(currentIndex - 1)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 text-[11px] sm:text-xs font-black text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                    >
                      <ArrowLeft className="w-3 h-3" /> Prev
                    </button>

                    {currentIndex < questions.length - 1 ? (
                      <button
                        type="button"
                        disabled={timeLeft <= 0}
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                        className="inline-flex items-center gap-1 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] sm:text-xs font-black transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                      >
                        Next <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleFinishQuiz}
                        className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-black transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>සුරකිමින්...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit</span>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: RESULTS */}
            {gameState === 'result' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-150 transform-gpu will-change-transform">
                <div className="bg-white border-2 border-amber-300 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 text-center space-y-2.5 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-sm">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl font-black text-slate-900">විශිෂ්ටයි {playerName}! 🎉</h2>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-semibold">{selectedGrade.label} • {subject}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {totalCorrect} <span className="text-lg sm:text-xl text-slate-400 font-bold">/ {questions.length}</span>
                  </div>
                  <div>
                    <button
                      onClick={() => setGameState('select-grade')}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-black transition-all active:scale-95 shadow-sm"
                    >
                      <RotateCcw className="w-3 h-3" /> තවත් වටයක් Play කරන්න
                    </button>
                  </div>
                </div>

                {/* Review Questions Box */}
                <div className="bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-[2.5rem] p-3.5 sm:p-5 space-y-2.5">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    පිළිතුරු සමාලෝචනය (Review)
                  </h3>

                  <div className="space-y-2 max-h-[350px] overflow-y-auto overscroll-contain pr-1">
                    {questions.map((q, idx) => {
                      const userChoice = userAnswers[idx];
                      const isCorrect = userChoice === q.correct_index;
                      return (
                        <div key={q.id} className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-snug">
                              {idx + 1}. {q.question}
                            </h4>
                            {isCorrect ? (
                              <span className="text-[9px] sm:text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                                ✔ හරි
                              </span>
                            ) : (
                              <span className="text-[9px] sm:text-[10px] font-black text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                                ✖ වැරදියි
                              </span>
                            )}
                          </div>

                          <div className="text-[10px] sm:text-[11px] font-semibold space-y-0.5">
                            <p className={isCorrect ? 'text-emerald-700' : 'text-rose-600'}>
                              ඔබේ පිළිතුර: {userChoice !== undefined ? q.options[userChoice] : 'කාලය අවසන් විය'}
                            </p>
                            {!isCorrect && (
                              <p className="text-slate-700 font-bold">
                                නිවැරදි පිළිතුර: {q.options[q.correct_index]}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ================= RIGHT COLUMN: LIVE LEADERBOARD ================= */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="h-full bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-7 shadow-sm flex flex-col justify-between space-y-4 transform-gpu will-change-transform">
              
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 sm:pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900">Realtime Rankings</h3>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">ඉහළම ලකුණු ලබාගත් සිසුන්</p>
                    </div>
                  </div>

                  <select
                    value={leaderboardSubject}
                    onChange={(e) => setLeaderboardSubject(e.target.value)}
                    className="bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-black text-emerald-900 focus:outline-none cursor-pointer"
                  >
                    {ALL_SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {leaderboard.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-[11px] sm:text-xs font-bold">
                    මෙම විෂය සඳහා තවම ලකුණු නැත.<br />දැන්ම ප්‍රථමයා වන්න!
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    
                    {/* Balanced Podium Top 3 Cards */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center items-end">
                      
                      {/* 2nd Place */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-2 flex flex-col items-center justify-between min-h-[125px] sm:min-h-[145px] shadow-sm">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-black mb-0.5">
                          <Medal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                        <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase">2nd</span>
                        <h4 className="font-black text-slate-900 text-[10px] sm:text-[11px] truncate w-full mt-0.5">
                          {top2 ? top2.player_name : "-"}
                        </h4>
                        <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold truncate w-full">
                          {top2 ? top2.grade : ""}
                        </span>
                        <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-200 text-slate-900 font-black text-[9px] sm:text-[10px]">
                          {top2 ? `${top2.score}/10` : "-"}
                        </span>
                      </div>

                      {/* 1st Place */}
                      <div className="bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 rounded-xl sm:rounded-2xl p-2 flex flex-col items-center justify-between min-h-[140px] sm:min-h-[160px] shadow-sm relative">
                        <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400 absolute -top-2 left-1/2 -translate-x-1/2" />
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black mb-0.5 shadow-sm">
                          <Medal className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                        </div>
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-600 uppercase">1st Gold</span>
                        <h4 className="font-black text-slate-900 text-[11px] sm:text-xs truncate w-full mt-0.5">
                          {top1 ? top1.player_name : "-"}
                        </h4>
                        <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold truncate w-full">
                          {top1 ? top1.grade : ""}
                        </span>
                        <span className="mt-1 px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] sm:text-[11px] shadow-sm">
                          {top1 ? `${top1.score}/10` : "-"}
                        </span>
                      </div>

                      {/* 3rd Place */}
                      <div className="bg-amber-50/40 border border-amber-200 rounded-xl sm:rounded-2xl p-2 flex flex-col items-center justify-between min-h-[125px] sm:min-h-[145px] shadow-sm">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-amber-800/15 text-amber-800 flex items-center justify-center font-black mb-0.5">
                          <Medal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-800 uppercase">3rd</span>
                        <h4 className="font-black text-slate-900 text-[10px] sm:text-[11px] truncate w-full mt-0.5">
                          {top3 ? top3.player_name : "-"}
                        </h4>
                        <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold truncate w-full">
                          {top3 ? top3.grade : ""}
                        </span>
                        <span className="mt-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[9px] sm:text-[10px]">
                          {top3 ? `${top3.score}/10` : "-"}
                        </span>
                      </div>

                    </div>

                    {/* 4th Place Onwards Stack */}
                    {restRanks.length > 0 && (
                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        {restRanks.slice(0, 3).map((item, idx) => {
                          const rank = idx + 4;
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-100 hover:border-slate-200 bg-white transition-all text-xs"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-slate-100 text-slate-600 font-mono text-[9px] sm:text-[10px] font-black flex items-center justify-center shrink-0">
                                  #{rank}
                                </span>
                                <div className="truncate">
                                  <h5 className="font-bold text-slate-900 truncate leading-tight text-[10px] sm:text-[11px]">{item.player_name}</h5>
                                  <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium">{item.grade}</span>
                                </div>
                              </div>
                              <span className="font-black text-slate-800 shrink-0 ml-1.5 text-[11px] sm:text-xs">
                                {item.score} <span className="text-[8px] sm:text-[9px] text-slate-400 font-normal">pts</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                )}
              </div>

              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 text-center text-[9px] sm:text-[10px] font-bold text-slate-500">
                ⭐ ඉහළම ලකුණු ගන්නා සිසුන් ශ්‍රේණිගත කිරීම්වලට ස්වයංක්‍රීයව එක්වේ.
              </div>

            </div>
          </div>

        </main>

      </div>
    </div>
  );
}