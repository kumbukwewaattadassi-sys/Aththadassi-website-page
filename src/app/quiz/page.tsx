"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Trophy, 
  Medal, 
  Crown, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  BookOpen, 
  User, 
  Check, 
  Loader2, 
  AlertCircle,
  Gamepad2,
  Flame,
  Star,
  Timer,
  ChevronRight,
  Phone,
  UserCheck,
  BrainCircuit,
  Lock,
  LogOut,
  KeyRound,
  ShieldCheck,
  Calendar,
  X,
  Eye,
  EyeOff
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
  phone_number?: string;
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
const QUIZ_TIME_SECONDS = 600; // විනාඩි 10

const MONTH_NAMES = [
  "ජනවාරි (Jan)", "පෙබරවාරි (Feb)", "මාර්තු (Mar)", "අප්‍රේල් (Apr)",
  "මැයි (May)", "ජුනි (Jun)", "ජූලි (Jul)", "අගෝස්තු (Aug)",
  "සැප්තැම්බර් (Sep)", "ඔක්තෝබර් (Oct)", "නොවැම්බර් (Nov)", "දෙසැම්බර් (Dec)"
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function calculateDynamicIQ(history: ScoreRecord[]) {
  if (!history || history.length === 0) {
    return {
      iq: 0,
      percent: 0,
      status: "තවම ආරම්භ කර නැත",
      emoji: "🌱",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      lineGradient: "from-slate-300 to-slate-400"
    };
  }

  const totalScore = history.reduce((acc, c) => acc + Number(c.score || 0), 0);
  const avgScore = totalScore / history.length;
  const calculatedIQ = Math.round((avgScore * 10) + (history.length * 5));
  const percent = Math.min(Math.round((calculatedIQ / 150) * 100), 100);

  if (calculatedIQ >= 110) {
    return {
      iq: calculatedIQ,
      percent,
      status: "විශිෂ්ට බුද්ධි මට්ටම (Genius)",
      emoji: "🏆",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      lineGradient: "from-blue-600 via-indigo-600 to-purple-600"
    };
  } else if (calculatedIQ >= 75) {
    return {
      iq: calculatedIQ,
      percent,
      status: "ඉහළ බුද්ධි මට්ටම (Superior)",
      emoji: "⚡",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      lineGradient: "from-emerald-500 to-teal-600"
    };
  } else if (calculatedIQ >= 40) {
    return {
      iq: calculatedIQ,
      percent,
      status: "සාමාන්‍ය මට්ටම (Average)",
      emoji: "👍",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      lineGradient: "from-amber-400 to-orange-500"
    };
  }

  return {
    iq: calculatedIQ,
    percent: Math.max(percent, 8),
    status: "ආරම්භක මට්ටම (Developing)",
    emoji: "🎯",
    badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
    lineGradient: "from-rose-500 to-red-600"
  };
}

export default function QuizGamePage() {
  const [gameState, setGameState] = useState<'profile' | 'select-grade' | 'setup' | 'playing' | 'result'>('profile');

  // Authenticated Student State
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; pin: string; birth_date?: string } | null>(null);
  const [studentHistory, setStudentHistory] = useState<ScoreRecord[]>([]);

  // Auth Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-pin' | 'set-new-pin'>('login');
  
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPin, setFormPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Ready 3-Sec Countdown Modal State
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [startCount, setStartCount] = useState(3);

  // Birth Date Selectors
  const [birthYear, setBirthYear] = useState('2012');
  const [birthMonth, setBirthMonth] = useState('01');
  const [birthDay, setBirthDay] = useState('01');

  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Gameplay
  const [selectedGrade, setSelectedGrade] = useState(GRADES[4]);
  const [subject, setSubject] = useState(CORE_SUBJECTS[0]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Leaderboard (For PC View)
  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>([]);
  const [leaderboardSubject, setLeaderboardSubject] = useState(CORE_SUBJECTS[0]);

  const availableSubjects = (selectedGrade.value === "Grade 10" || selectedGrade.value === "Grade 11")
    ? ALL_SUBJECTS
    : CORE_SUBJECTS;

  const years = useMemo(() => {
    const list = [];
    for (let y = 2018; y >= 2005; y--) list.push(y.toString());
    return list;
  }, []);

  const days = useMemo(() => {
    const list = [];
    for (let d = 1; d <= 31; d++) list.push(d.toString().padStart(2, '0'));
    return list;
  }, []);

  const selectedBirthDate = `${birthYear}-${birthMonth}-${birthDay}`;

  // Screen scroll locking when auth modal is active
  useEffect(() => {
    if (showAuthModal || showCountdownModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAuthModal, showCountdownModal]);

  // Session Management
  useEffect(() => {
    const savedSession = localStorage.getItem('school_quiz_student_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.phone && parsed.pin && parsed.name) {
          setCurrentUser(parsed);
          fetchStudentHistory(parsed.phone);
          setShowAuthModal(false);
          return;
        }
      } catch {
        localStorage.removeItem('school_quiz_student_session');
      }
    }
    setShowAuthModal(true);
  }, []);

  // Leaderboard Fetch
  const fetchLeaderboardData = async (subj: string) => {
    try {
      const cleanSubj = subj.trim();
      const { data, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .ilike('subject', cleanSubj)
        .order('score', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(30);

      if (!error && data) {
        const uniquePlayers: ScoreRecord[] = [];
        const seenKeys = new Set<string>();

        for (const item of data) {
          const key = (item.phone_number ? item.phone_number.trim() : item.player_name.trim().toLowerCase());
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniquePlayers.push(item);
          }
        }
        setLeaderboard(uniquePlayers.slice(0, 10));
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    }
  };

  // Student Score History Fetch
  const fetchStudentHistory = async (phone: string) => {
    try {
      const cleanPhone = phone.trim();
      const { data, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .eq('phone_number', cleanPhone)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setStudentHistory(data);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(leaderboardSubject);
  }, [leaderboardSubject]);

  // 10-Minute Quiz Countdown
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

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const cleanPhone = formPhone.trim();
    const cleanPin = formPin.trim();

    if (!cleanPhone || cleanPhone.length < 9) {
      setAuthError("වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න.");
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        if (cleanPin.length !== 4) {
          setAuthError("රහස්‍ය PIN අංකය ඉලක්කම් 4ක් විය යුතුය.");
          setAuthLoading(false);
          return;
        }

        const { data: userRecord, error } = await supabase
          .from('student_users')
          .select('*')
          .eq('phone_number', cleanPhone)
          .maybeSingle();

        if (error || !userRecord) {
          setAuthError("මෙම දුරකථන අංකය ලියාපදිංචි කර නොමැත. 'නව ශිෂ්‍යයෙක්' තෝරා ලියාපදිංචි වන්න.");
          setAuthLoading(false);
          return;
        }

        if (userRecord.pin_code !== cleanPin) {
          setAuthError("ඔබ ඇතුළත් කළ රහස්‍ය PIN අංකය වැරදියි!");
          setAuthLoading(false);
          return;
        }

        const sessionData = { 
          name: userRecord.player_name, 
          phone: userRecord.phone_number, 
          pin: userRecord.pin_code,
          birth_date: userRecord.birth_date 
        };
        setCurrentUser(sessionData);
        localStorage.setItem('school_quiz_student_session', JSON.stringify(sessionData));
        await fetchStudentHistory(userRecord.phone_number);
        setShowAuthModal(false);
        setGameState('profile');

      } else if (authMode === 'register') {
        const cleanName = formName.trim();
        if (!cleanName) {
          setAuthError("ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න.");
          setAuthLoading(false);
          return;
        }

        if (cleanPin.length !== 4) {
          setAuthError("PIN අංකය ඉලක්කම් 4ක් විය යුතුය.");
          setAuthLoading(false);
          return;
        }

        const { data: checkUser } = await supabase
          .from('student_users')
          .select('id')
          .eq('phone_number', cleanPhone)
          .maybeSingle();

        if (checkUser) {
          setAuthError("මෙම දුරකථන අංකය දැනටමත් ඇත. 'Login' තෝරා ඇතුළු වන්න.");
          setAuthLoading(false);
          return;
        }

        const { error: insertError } = await supabase
          .from('student_users')
          .insert([{ 
            player_name: cleanName, 
            phone_number: cleanPhone, 
            pin_code: cleanPin,
            birth_date: selectedBirthDate
          }]);

        if (insertError) {
          setAuthError("ලියාපදිංචි වීමේ දෝෂයකි: " + insertError.message);
          setAuthLoading(false);
          return;
        }

        const sessionData = { 
          name: cleanName, 
          phone: cleanPhone, 
          pin: cleanPin,
          birth_date: selectedBirthDate 
        };
        setCurrentUser(sessionData);
        localStorage.setItem('school_quiz_student_session', JSON.stringify(sessionData));
        await fetchStudentHistory(cleanPhone);
        setShowAuthModal(false);
        setGameState('profile');

      } else if (authMode === 'forgot-pin') {
        const { data: userRecord, error } = await supabase
          .from('student_users')
          .select('*')
          .eq('phone_number', cleanPhone)
          .maybeSingle();

        if (error || !userRecord) {
          setAuthError("මෙම දුරකථන අංකය අප සතුව නැත.");
          setAuthLoading(false);
          return;
        }

        if (userRecord.birth_date !== selectedBirthDate) {
          setAuthError("ඔබ තෝරාගත් උපන් දිනය වැරදියි! නැවත පරීක්ෂා කරන්න.");
          setAuthLoading(false);
          return;
        }

        setAuthMode('set-new-pin');
        setAuthSuccess("උපන් දිනය තහවුරු විය! දැන් නව 4-Digit PIN අංකයක් ඇතුළත් කරන්න.");

      } else if (authMode === 'set-new-pin') {
        if (newPin.trim().length !== 4) {
          setAuthError("නව PIN අංකය ඉලක්කම් 4ක් විය යුතුය.");
          setAuthLoading(false);
          return;
        }

        const { error: updateError } = await supabase
          .from('student_users')
          .update({ pin_code: newPin.trim() })
          .eq('phone_number', cleanPhone);

        if (updateError) {
          setAuthError("PIN යාවත්කාලීන කිරීමේ දෝෂයකි: " + updateError.message);
          setAuthLoading(false);
          return;
        }

        setAuthSuccess("PIN අංකය සාර්ථකව වෙනස් විය! දැන් නව PIN එකෙන් Login වන්න.");
        setFormPin(newPin.trim());
        setAuthMode('login');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "නැවත උත්සාහ කරන්න";
      setAuthError("දෝෂයක් ඇති විය: " + errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('school_quiz_student_session');
    setCurrentUser(null);
    setStudentHistory([]);
    setFormPhone('');
    setFormPin('');
    setFormName('');
    setNewPin('');
    setShowAuthModal(true);
    setAuthMode('login');
  };

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
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

        const formattedQuestions: Question[] = randomQuestions.map((item: { id: string; question: string; options: string | string[]; correct_index: number | string }) => {
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
        setLoading(false);

        setShowCountdownModal(true);
        setStartCount(3);

        const countdownInterval = setInterval(() => {
          setStartCount((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setShowCountdownModal(false);
              setGameState('playing');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } else {
        setFetchError(`සමාවන්න, ${selectedGrade.label} සඳහා ${subject} ප්‍රශ්න තවම ඇතුළත් කර නොමැත!`);
        setLoading(false);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "නැවත උත්සාහ කරන්න";
      setFetchError("දෝෂයක් ඇති විය: " + errorMessage);
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

  // ලකුණු 0 ක් ආවත්, ඕනෑම විෂයක් ලියූ විට 100% History Add & Update වන Logic එක
  const handleFinishQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!currentUser) return;
    setSubmitting(true);
    
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_index) finalScore += 1;
    });

    const cleanName = currentUser.name.trim();
    const cleanPhone = currentUser.phone.trim();
    const cleanGrade = selectedGrade.value.trim();
    const cleanSubj = subject.trim();

    try {
      const { data: existingRecords } = await supabase
        .from('quiz_scores')
        .select('id, score')
        .eq('phone_number', cleanPhone)
        .eq('subject', cleanSubj);

      if (existingRecords && existingRecords.length > 0) {
        const existingRecord = existingRecords[0];
        // කලින් ලකුණට වඩා වැඩි ලකුණක් ගත් විට update කරයි (කලින් 0 නම් අලුත් ලකුණ වැටේ)
        const updatedScore = Math.max(finalScore, Number(existingRecord.score || 0));

        await supabase
          .from('quiz_scores')
          .update({
            player_name: cleanName,
            score: updatedScore,
            grade: cleanGrade,
            created_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id);
      } else {
        // ලකුණු 0ක් ආවත් අනිවාර්යයෙන්ම Database එකට record එක add වේ
        await supabase
          .from('quiz_scores')
          .insert([
            {
              player_name: cleanName,
              phone_number: cleanPhone,
              pin_code: currentUser.pin,
              grade: cleanGrade,
              subject: cleanSubj,
              score: finalScore,
            }
          ]);
      }

      setLeaderboardSubject(cleanSubj);
      await fetchLeaderboardData(cleanSubj);
      await fetchStudentHistory(cleanPhone);
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
  const iqMetrics = calculateDynamicIQ(studentHistory);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const restRanks = leaderboard.slice(3);

  return (
    /* pt-24 sm:pt-28 මඟින් Mobile හි Fixed Navbar එකට යටවීම සම්පූර්ණයෙන්ම වළක්වා ඉඩ ලබා දී ඇත */
    <div className="min-h-screen bg-[#F0FDF4]/70 pt-24 sm:pt-28 lg:pt-32 pb-10 px-3 sm:px-6 lg:px-8 max-w-xl lg:max-w-7xl mx-auto transform-gpu subpixel-antialiased">
      <div className="w-full space-y-3.5 sm:space-y-6">

        {/* Global Gamified Header */}
        <header className="flex flex-row items-center justify-between gap-3 bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-sm transform-gpu will-change-transform">
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-sm shrink-0">
              <Gamepad2 className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full truncate">
                  Aththadassi Quest
                </span>
                <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-bold text-amber-600">
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" /> Live Arena
                </span>
              </div>
              <h1 className="text-xs sm:text-2xl font-black text-slate-900 truncate tracking-tight">
                School Quiz Arena
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                onClick={() => setGameState('profile')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs shadow-sm transition-all active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] sm:text-xs shadow-sm transition-all active:scale-95"
              >
                <Lock className="w-3 h-3" />
                <span>Login</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Grid: Mobile (single column), Desktop (7:5 two columns with Leaderboard) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* ================= LEFT COLUMN: GAME FRAME ================= */}
          <div className="lg:col-span-7 flex flex-col justify-start">

            {/* STAGE 1: PROFILE & DYNAMIC IQ METRIC */}
            {gameState === 'profile' && (
              <div className="h-full bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-7 shadow-sm space-y-4 sm:space-y-5">
                
                {/* User Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md font-black">
                      <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-sm sm:text-lg font-black text-slate-900 truncate max-w-[170px] sm:max-w-none">
                          {currentUser?.name || "ශිෂ්‍ය ගිණුම"}
                        </h2>
                        <span className="text-[9px] sm:text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" /> Secured
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5">{currentUser?.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 text-[11px] sm:text-xs font-bold"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>

                {/* ── 1. DYNAMIC IQ METRIC DASHBOARD ── */}
                <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50/60 border border-blue-100/90 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                        <BrainCircuit className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wide block truncate">
                          බුද්ධි මට්ටම් දර්ශකය (Dynamic IQ)
                        </span>
                        <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium block truncate">
                          විෂයයන් {studentHistory.length} ක ලකුණු මත පදනම්ව
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-baseline gap-1 bg-white border border-slate-200/90 shadow-2xs px-2.5 py-0.5 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">IQ:</span>
                        <span className="text-sm sm:text-base font-black text-blue-700 font-mono">{iqMetrics.iq}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="space-y-1.5 pt-3">
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80 shadow-inner">
                      <div 
                        className={`h-full bg-gradient-to-r ${iqMetrics.lineGradient} rounded-full transition-all duration-700 ease-out shadow-xs`}
                        style={{ width: `${iqMetrics.percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold px-0.5 font-mono">
                      <span>0 (Start)</span>
                      <span>50 (Developing)</span>
                      <span>100+ (Master)</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100/90">
                    <span className="text-[11px] font-bold text-slate-500">වත්මන් තත්ත්වය:</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10.5px] font-black shadow-2xs ${iqMetrics.badgeColor}`}>
                      <span>{iqMetrics.emoji}</span>
                      <span>{iqMetrics.status}</span>
                    </span>
                  </div>
                </div>

                {/* ── 2. MAIN ACTION BUTTON ── */}
                <button
                  onClick={() => {
                    if (!currentUser) {
                      setShowAuthModal(true);
                    } else {
                      setGameState('select-grade');
                    }
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>අලුත් Game එකක් Play කරන්න</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* ── 3. HISTORY RECORD (PC සහ Mobile දෙකෙහිම පෙන්වයි) ── */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] sm:text-xs font-black text-slate-700 block">
                    පෙර ලකුණු ලේඛනය (History):
                  </span>

                  {studentHistory.length === 0 ? (
                    <div className="py-5 text-center text-[11px] sm:text-xs font-bold text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                      ඔබ තවම ප්‍රශ්නාවලියක් කර නොමැත. දැන්ම ආරම්භ කරන්න!
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[170px] sm:max-h-[220px] overflow-y-auto pr-1">
                      {studentHistory.map((rec) => (
                        <div key={rec.id} className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-[11px] sm:text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{rec.subject}</span>
                            <span className="text-[9.5px] sm:text-[10px] text-slate-400 ml-1.5">({rec.grade})</span>
                          </div>
                          <span className="font-black text-slate-900">{rec.score}/10 pts</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* STAGE 2: GRADE SELECTION SCREEN */}
            {gameState === 'select-grade' && (
              <div className="h-full bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] sm:text-xs font-extrabold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block">
                      පියවර 1: ශ්‍රේණිය
                    </span>
                    <h2 className="text-sm sm:text-xl font-black text-slate-900 mt-1">
                      ඔබගේ ශ්‍රේණිය තෝරන්න 🎯
                    </h2>
                  </div>

                  <button
                    onClick={() => setGameState('profile')}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {GRADES.map((g) => (
                    <div
                      key={g.value}
                      onClick={() => {
                        setSelectedGrade(g);
                        setSubject(CORE_SUBJECTS[0]);
                        setGameState('setup');
                      }}
                      className="group flex items-center justify-between p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50/20 shadow-xs cursor-pointer transition-all active:scale-[0.98] relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500" />
                      <span className="text-xs sm:text-sm font-bold text-slate-800 pl-2">
                        {g.label}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-rose-600">
                        <span>ප්‍රශ්නෝත්තර</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STAGE 3: SUBJECT SELECTION */}
            {gameState === 'setup' && (
              <div className="h-full bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] sm:text-xs font-extrabold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block">
                      පියවර 2: විෂය
                    </span>
                    <h2 className="text-sm sm:text-2xl font-black text-slate-900 mt-1">
                      {selectedGrade.label} - විෂය තෝරන්න 🚀
                    </h2>
                  </div>

                  <button
                    onClick={() => setGameState('select-grade')}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                {fetchError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{fetchError}</span>
                  </div>
                )}

                <form onSubmit={handleStartQuiz} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" /> විෂය (Subject)
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-emerald-600 transition-all cursor-pointer"
                    >
                      {availableSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>ප්‍රශ්න සූදානම් වෙමින් පවතී...</span>
                      </>
                    ) : (
                      <>
                        <span>Game එක ආරම්භ කරන්න (10 Mins Speed)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* STAGE 4: PLAYING FRAME */}
            {gameState === 'playing' && questions.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-black">
                    <div className="flex items-center gap-1.5 truncate max-w-[45%]">
                      {currentIndex === 0 && (
                        <button
                          type="button"
                          onClick={() => setGameState('setup')}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] sm:text-[11px] flex items-center gap-1 shadow-sm active:scale-95 shrink-0"
                        >
                          <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                      )}
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] sm:text-xs truncate">
                        {subject}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600 text-white font-mono text-xs font-black tracking-wider shrink-0 shadow-sm">
                      <Timer className="w-3.5 h-3.5 text-blue-200 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>{formatTime(timeLeft)}</span>
                    </div>

                    <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs">
                      Q <strong className="text-emerald-700">{currentIndex + 1}</strong>/{questions.length}
                    </span>
                  </div>

                  <div className="w-full h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-200 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 space-y-3.5 sm:space-y-4 shadow-sm">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-100 text-blue-800 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5">
                      {currentIndex + 1}
                    </div>
                    <h2 className="text-xs sm:text-base lg:text-lg font-black text-slate-900 leading-snug">
                      {questions[currentIndex].question}
                    </h2>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5">
                    {questions[currentIndex].options.map((opt, optIdx) => {
                      const isSelected = userAnswers[currentIndex] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
                            timeLeft <= 0 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'
                          } ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-sm' 
                              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                            isSelected ? 'bg-blue-600 text-white scale-105' : 'border border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />}
                          </div>

                          <span className="text-xs sm:text-sm font-bold leading-snug">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={currentIndex === 0 || submitting || timeLeft <= 0}
                      onClick={() => setCurrentIndex(currentIndex - 1)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                    >
                      <ArrowLeft className="w-3 h-3" /> Prev
                    </button>

                    {currentIndex < questions.length - 1 ? (
                      <button
                        type="button"
                        disabled={timeLeft <= 0}
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                        className="inline-flex items-center gap-1 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-sm active:scale-95"
                      >
                        Next <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleFinishQuiz}
                        className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-sm disabled:opacity-50 active:scale-95"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
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

            {/* STAGE 5: RESULT SCREEN WITH DETAILED REVIEW */}
            {gameState === 'result' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white border-2 border-amber-300 rounded-2xl sm:rounded-[2.5rem] p-5 text-center space-y-2 shadow-sm">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-sm">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-base sm:text-xl font-black text-slate-900">විශිෂ්ටයි {currentUser?.name}! 🎉</h2>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {totalCorrect} <span className="text-base sm:text-xl text-slate-400 font-bold">/ {questions.length}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1 sm:pt-2">
                    <button
                      onClick={() => setGameState('profile')}
                      className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-sm active:scale-95"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" /> IQ Profile
                    </button>
                    <button
                      onClick={() => setGameState('select-grade')}
                      className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-sm active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> තවත් වටයක්
                    </button>
                  </div>
                </div>

                {/* Review Questions & Answers */}
                <div className="bg-white border border-emerald-100 sm:border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-2.5 shadow-sm">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    පිළිතුරු සමාලෝචනය (Review Answers)
                  </h3>

                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {questions.map((q, idx) => {
                      const userChoice = userAnswers[idx];
                      const isCorrect = userChoice === q.correct_index;
                      return (
                        <div key={q.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                          <div className="flex items-start justify-between gap-1.5">
                            <h4 className="font-bold text-slate-900 leading-snug">
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

                          <div className="space-y-0.5 text-[11px] font-semibold">
                            <p className={isCorrect ? 'text-emerald-700' : 'text-rose-600'}>
                              ඔබේ පිළිතුර: {userChoice !== undefined ? q.options[userChoice] : 'කාලය අවසන් විය'}
                            </p>
                            {!isCorrect && (
                              <p className="text-slate-800 font-bold bg-amber-50 border border-amber-200 p-1 rounded-md">
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

          {/* ================= RIGHT COLUMN: LIVE LEADERBOARD (DESKTOP ONLY) ================= */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-start">
            <div className="h-full bg-white border-2 border-emerald-100 rounded-[2.5rem] p-7 shadow-sm flex flex-col justify-between space-y-4 transform-gpu">
              
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Realtime Rankings</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">ඉහළම ලකුණු ලබාගත් සිසුන්</p>
                    </div>
                  </div>

                  <select
                    value={leaderboardSubject}
                    onChange={(e) => setLeaderboardSubject(e.target.value)}
                    className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1 text-xs font-black text-emerald-900 focus:outline-none cursor-pointer"
                  >
                    {ALL_SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {leaderboard.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs font-bold">
                    මෙම විෂය සඳහා තවම ලකුණු නැත.<br />දැන්ම ප්‍රථමයා වන්න!
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    
                    {/* Top 3 Cards Podium */}
                    <div className="grid grid-cols-3 gap-2 text-center items-end">
                      
                      {/* 2nd Place */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-between min-h-[125px] shadow-sm">
                        <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center font-black mb-0.5">
                          <Medal className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase">2nd</span>
                        <h4 className="font-black text-slate-900 text-[10px] truncate w-full mt-0.5">
                          {top2 ? top2.player_name : "-"}
                        </h4>
                        <span className="text-[8px] text-slate-400 font-semibold truncate w-full">
                          {top2 ? top2.grade : ""}
                        </span>
                        <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-200 text-slate-900 font-black text-[9px]">
                          {top2 ? `${top2.score}/10` : "-"}
                        </span>
                      </div>

                      {/* 1st Place */}
                      <div className="bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 rounded-xl p-2 flex flex-col items-center justify-between min-h-[140px] shadow-sm relative">
                        <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400 absolute -top-2 left-1/2 -translate-x-1/2" />
                        <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black mb-0.5 shadow-sm">
                          <Medal className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span className="text-[8px] font-black text-amber-600 uppercase">1st Gold</span>
                        <h4 className="font-black text-slate-900 text-[11px] truncate w-full mt-0.5">
                          {top1 ? top1.player_name : "-"}
                        </h4>
                        <span className="text-[8px] text-slate-500 font-bold truncate w-full">
                          {top1 ? top1.grade : ""}
                        </span>
                        <span className="mt-1 px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] shadow-sm">
                          {top1 ? `${top1.score}/10` : "-"}
                        </span>
                      </div>

                      {/* 3rd Place */}
                      <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-2 flex flex-col items-center justify-between min-h-[125px] shadow-sm">
                        <div className="w-6 h-6 rounded-md bg-amber-800/15 text-amber-800 flex items-center justify-center font-black mb-0.5">
                          <Medal className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[8px] font-black text-amber-800 uppercase">3rd</span>
                        <h4 className="font-black text-slate-900 text-[10px] truncate w-full mt-0.5">
                          {top3 ? top3.player_name : "-"}
                        </h4>
                        <span className="text-[8px] text-slate-400 font-semibold truncate w-full">
                          {top3 ? top3.grade : ""}
                        </span>
                        <span className="mt-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[9px]">
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
                              className="flex items-center justify-between p-1.5 rounded-lg border border-slate-100 bg-white text-xs"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="w-4 h-4 rounded bg-slate-100 text-slate-600 font-mono text-[9px] font-black flex items-center justify-center shrink-0">
                                  #{rank}
                                </span>
                                <div className="truncate">
                                  <h5 className="font-bold text-slate-900 truncate leading-tight text-[10px]">{item.player_name}</h5>
                                  <span className="text-[8px] text-slate-400 font-medium">{item.grade}</span>
                                </div>
                              </div>
                              <span className="font-black text-slate-800 shrink-0 ml-1.5 text-[11px]">
                                {item.score} <span className="text-[8px] text-slate-400 font-normal">pts</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                )}
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center text-[9px] font-bold text-slate-500">
                🔒 උපන් දිනය සහ 4-Digit PIN මඟින් ඔබේ ලකුණු ආරක්ෂිතයි.
              </div>

            </div>
          </div>

        </main>

        {/* ================= 3-SECOND READY COUNTDOWN POPUP ================= */}
        {showCountdownModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl border-2 border-emerald-300 max-w-sm w-full p-6 text-center space-y-3.5 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto text-2xl font-black shadow-md animate-bounce">
                {startCount}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">තරගයට සූදානම් වන්න! 🚀</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  පිළිතුරු ලියා අවසන් වූ පසු ඔබේ ලකුණු සහ නිවැරදි පිළිතුරු සියල්ල ලැබේ!
                </p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-xl text-[11px] font-bold text-emerald-800">
                ⏳ සම්පූර්ණ කාලය: විනාඩි 10 යි
              </div>
            </div>
          </div>
        )}

        {/* ================= SECURE AUTH POPUP ================= */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="bg-white rounded-[2rem] border-2 border-emerald-100 max-w-sm sm:max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-3 sm:space-y-4 max-h-[92vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 sm:pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {authMode === 'login' && 'ශිෂ්‍ය පිවිසුම (Login)'}
                    {authMode === 'register' && 'නව ශිෂ්‍ය ලියාපදිංචිය'}
                    {authMode === 'forgot-pin' && 'PIN අංකය නැවත ලබා ගැනීම'}
                    {authMode === 'set-new-pin' && 'නව PIN අංකයක් සැකසීම'}
                  </h3>
                </div>

                {currentUser && (
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>

              {(authMode === 'login' || authMode === 'register') && (
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError(null);
                      setAuthSuccess(null);
                    }}
                    className={`py-1.5 sm:py-2 rounded-lg text-xs font-black transition-all ${
                      authMode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    දැනටමත් ගිණුමක් ඇත
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError(null);
                      setAuthSuccess(null);
                    }}
                    className={`py-1.5 sm:py-2 rounded-lg text-xs font-black transition-all ${
                      authMode === 'register' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    නව ශිෂ්‍යයෙක් (Register)
                  </button>
                </div>
              )}

              {authError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 sm:p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 sm:p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3 sm:space-y-3.5">
                
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-700" /> ඔබගේ සම්පූර්ණ නම (Your Name)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="උදා: කසුන් පෙරේරා"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                )}

                {authMode !== 'set-new-pin' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-700" /> දුරකථන අංකය (Mobile Number)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="උදා: 0712345678"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                    />
                  </div>
                )}

                {(authMode === 'register' || authMode === 'forgot-pin') && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" /> උපන් දිනය (Select Birth Date)
                    </label>
                    
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      <select
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-1.5 py-1.5 sm:px-2 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        {years.map(y => <option key={y} value={y}>{y} වසර</option>)}
                      </select>

                      <select
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-1.5 py-1.5 sm:px-2 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        {MONTH_NAMES.map((m, idx) => (
                          <option key={idx} value={(idx + 1).toString().padStart(2, '0')}>
                            {m}
                          </option>
                        ))}
                      </select>

                      <select
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-1.5 py-1.5 sm:px-2 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        {days.map(d => <option key={d} value={d}>{d} දින</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {(authMode === 'login' || authMode === 'register') && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-700" /> රහස්‍ය 4-Digit PIN
                      </label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('forgot-pin');
                            setAuthError(null);
                            setAuthSuccess(null);
                          }}
                          className="text-[10.5px] font-bold text-blue-600 hover:underline"
                        >
                          PIN අමතකද?
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        type={showPin ? "text" : "password"}
                        maxLength={4}
                        required
                        placeholder={showPin ? "1234" : "••••"}
                        value={formPin}
                        onChange={(e) => setFormPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-2 sm:py-2.5 text-slate-900 font-black text-center tracking-widest text-sm sm:text-base focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                        title={showPin ? "Hide PIN" : "Show PIN"}
                      >
                        {showPin ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {authMode === 'set-new-pin' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-700" /> නව 4-Digit PIN අංකය (New PIN)
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? "text" : "password"}
                        maxLength={4}
                        required
                        placeholder={showPin ? "1234" : "••••"}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-2 sm:py-2.5 text-slate-900 font-black text-center tracking-widest text-sm sm:text-base focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                      >
                        {showPin ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-3 sm:mt-4 transform-gpu"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>පරීක්ෂා කරමින් පවතී...</span>
                    </>
                  ) : (
                    <>
                      {authMode === 'login' && <span>ගිණුමට පිවිසෙන්න (Login)</span>}
                      {authMode === 'register' && <span>ලියාපදිංචි වී පිවිසෙන්න</span>}
                      {authMode === 'forgot-pin' && <span>උපන් දිනය තහවුරු කරන්න</span>}
                      {authMode === 'set-new-pin' && <span>නව PIN අංකය සුරකින්න</span>}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {(authMode === 'forgot-pin' || authMode === 'set-new-pin') && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError(null);
                      setAuthSuccess(null);
                    }}
                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 pt-1.5"
                  >
                    ← නැවත Login වෙත යන්න
                  </button>
                )}
              </form>

              <div className="pt-1.5 text-center text-[10px] text-slate-400">
                ⭐ ඔබගේ පිවිසුම මෙම උපාංගයේ ස්වයංක්‍රීයව සුරැකී පවතී.
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}