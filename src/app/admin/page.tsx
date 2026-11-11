"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Newspaper, 
  Video, 
  Trophy,
  GraduationCap,
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  X,
  Loader2,
  FileText,
  Plus,
  Trash,
  Link as LinkIcon,
  Images
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  author: string;
  date: string;
  image_url: string;
  description: string;
  link_url?: string;
  link_label?: string;
  gallery?: string[] | string;
  status: 'published' | 'draft';
}

interface VideoItem {
  id: string;
  title: string;
  category: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  status: 'published' | 'draft';
}

interface AchievementItem {
  id: string;
  title: string;
  category: string;
  place: string;
  winner_name: string;
  year: string;
  aspect_ratio: 'vertical' | 'landscape';
  image_url: string;
  description: string;
}

interface StudentScore {
  name: string;
  marks: string;
  status: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'news' | 'achievements' | 'exams' | 'admissions' | 'video'>('news');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Floating Toast Alert
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'loading' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'loading' = 'success', duration = 3500) => {
    setToast({ text, type });
    if (type !== 'loading') {
      setTimeout(() => setToast(null), duration);
    }
  };

  // Data Lists
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [achievementList, setAchievementList] = useState<AchievementItem[]>([]);

  // Editing States
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // 1. News Form State
  const [newsForm, setNewsForm] = useState({
    title: '',
    subtitle: '',
    category: 'ක්‍රීඩා',
    author: 'Media Unit',
    date: new Date().toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' }),
    image_url: '',
    description: '',
    link_url: '',
    link_label: 'වැඩිදුර තොරතුරු මෙතැනින්',
    gallery: '',
    status: 'published' as 'published' | 'draft',
  });

  // 2. Video Form State
  const [videoForm, setVideoForm] = useState({
    title: '',
    category: 'Sports & Athletics',
    youtube_url: '',
    thumbnail_url: '',
    duration: '10:00',
    status: 'published' as 'published' | 'draft',
  });

  // 3. Achievements Form State
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    category: 'සෞන්දර්ය හා කලා',
    place: '1st Place (රන් පදක්කම)',
    winner_name: '',
    year: '2026',
    aspect_ratio: 'vertical' as 'vertical' | 'landscape',
    image_url: '',
    description: '',
  });

  // 4. Exam Results State
  const [selectedExamType, setSelectedExamType] = useState<'scholarship' | 'ol'>('scholarship');
  const [examForm, setExamForm] = useState({
    year: '2026',
    pass_rate: '100%',
    cutoff_passes: 18,
    highest_marks: '194',
  });
  const [topStudents, setTopStudents] = useState<StudentScore[]>([
    { name: '', marks: '', status: '' }
  ]);

  // 5. Admissions State
  const [admissionSettings, setAdmissionSettings] = useState({
    is_open: false,
    academic_year: '2027',
    notice_title: 'නව සිසුන් ඇතුළත් කරගැනීම තවමත් ආරම්භ කර නොමැත',
    notice_description: '1 සහ 6 ශ්‍රේණි සඳහා සිසුන් ඇතුළත් කිරීම් ඉදිරි ජනවාරි මාසයේදී ආරම්භ වේ.',
    expected_open_date: '2027 ජනවාරි මස මුල් සතියේදී',
    grade1_pdf_url: '',
    grade1_pdf_storage_path: '',
    grade6_pdf_url: '',
    grade6_pdf_storage_path: '',
  });

  // Load All Data
  const loadData = async () => {
    setFetching(true);
    const [nData, vData, aData, admData] = await Promise.all([
      supabase.from('news').select('*').order('created_at', { ascending: false }),
      supabase.from('youtube_videos').select('*').order('created_at', { ascending: false }),
      supabase.from('achievements').select('*').order('created_at', { ascending: false }),
      supabase.from('admission_settings').select('*').eq('id', 'current_admission').maybeSingle()
    ]);

    if (nData.data) setNewsList(nData.data);
    if (vData.data) setVideoList(vData.data);
    if (aData.data) setAchievementList(aData.data);
    if (admData.data) setAdmissionSettings(admData.data);

    loadExamData('scholarship');
    setFetching(false);
  };

  const loadExamData = async (type: 'scholarship' | 'ol') => {
    const examName = type === 'scholarship' ? '5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගය' : 'අ.පො.ස. සාමාන්‍ය පෙළ (G.C.E. O/L)';
    const { data } = await supabase.from('academic_results').select('*').eq('exam_name', examName).maybeSingle();
    if (data) {
      setExamForm({
        year: data.year || '2026',
        pass_rate: data.pass_rate || '100%',
        cutoff_passes: data.cutoff_passes || 0,
        highest_marks: data.highest_marks || '',
      });
      setTopStudents(data.top_students && data.top_students.length > 0 ? data.top_students : [{ name: '', marks: '', status: '' }]);
    } else {
      setTopStudents([{ name: '', marks: '', status: '' }]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Storage Helper
  const uploadFileToStorage = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('school_media')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('school_media').getPublicUrl(fileName);
    return { url: data.publicUrl, path: fileName };
  };

  // News Handlers
  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('පුවත් ආවරණ පින්තූරය upload වෙමින් පවතී...', 'loading');
      const { url } = await uploadFileToStorage(file, 'news');
      setNewsForm(prev => ({ ...prev, image_url: url }));
      showToast('පින්තූරය සාර්ථකව Upload විය!');
    } catch (err: any) {
      showToast('Upload දෝෂයකි: ' + err.message, 'error');
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.image_url) {
      showToast('කරුණාකර ප්‍රධාන ආවරණ පින්තූරය upload කරන්න හෝ Link එකක් ලබාදෙන්න.', 'error');
      return;
    }
    setLoading(true);

    const parsedGallery = newsForm.gallery
      ? newsForm.gallery.split(/[\n,]+/).map((url) => url.trim()).filter((url) => url.length > 0)
      : [];

    const payload = {
      title: newsForm.title,
      subtitle: newsForm.subtitle,
      category: newsForm.category,
      author: newsForm.author,
      date: newsForm.date,
      image_url: newsForm.image_url,
      description: newsForm.description,
      link_url: newsForm.link_url,
      link_label: newsForm.link_label,
      gallery: parsedGallery,
      status: newsForm.status,
    };

    if (editingNewsId) {
      const { error } = await supabase.from('news').update(payload).eq('id', editingNewsId);
      if (error) showToast('යාවත්කාලීන කිරීම අසාර්ථකයි: ' + error.message, 'error');
      else {
        showToast('පුවත සාර්ථකව සංස්කරණය කරන ලදී!');
        resetNewsForm();
        loadData();
      }
    } else {
      const { error } = await supabase.from('news').insert([payload]);
      if (error) showToast('දෝෂයක් ඇති විය: ' + error.message, 'error');
      else {
        showToast('පුවත සාර්ථකව ඇතුළත් කරන ලදී!');
        resetNewsForm();
        loadData();
      }
    }
    setLoading(false);
  };

  const startEditNews = (item: NewsItem) => {
    setEditingNewsId(item.id);
    let galleryStr = Array.isArray(item.gallery) ? item.gallery.join(',\n') : (item.gallery || '');
    setNewsForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      category: item.category || 'ක්‍රීඩා',
      author: item.author || 'Media Unit',
      date: item.date || '',
      image_url: item.image_url || '',
      description: item.description || '',
      link_url: item.link_url || '',
      link_label: item.link_label || 'වැඩිදුර තොරතුරු මෙතැනින්',
      gallery: galleryStr,
      status: item.status || 'published',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteNews = async (id: string) => {
    if (!confirm('මෙම පුවත සම්පූර්ණයෙන්ම මකා දැමීමට අවශ්‍යද?')) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) {
      setNewsList(newsList.filter(n => n.id !== id));
      showToast('පුවත සාර්ථකව මකා දමන ලදී!');
    }
  };

  const toggleNewsStatus = async (item: NewsItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase.from('news').update({ status: newStatus }).eq('id', item.id);
    if (!error) {
      setNewsList(newsList.map(n => n.id === item.id ? { ...n, status: newStatus } : n));
      showToast(`පුවත ${newStatus === 'published' ? 'Live' : 'Draft'} තත්ත්වයට පත් කරන ලදී!`);
    }
  };

  const resetNewsForm = () => {
    setEditingNewsId(null);
    setNewsForm({
      title: '',
      subtitle: '',
      category: 'ක්‍රීඩා',
      author: 'Media Unit',
      date: new Date().toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' }),
      image_url: '',
      description: '',
      link_url: '',
      link_label: 'වැඩිදුර තොරතුරු මෙතැනින්',
      gallery: '',
      status: 'published',
    });
  };

  // Achievement Handlers
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('පෝස්ටරය upload වෙමින් පවතී...', 'loading');
      const { url } = await uploadFileToStorage(file, 'achievements');
      setAchievementForm(prev => ({ ...prev, image_url: url }));
      showToast('පෝස්ටරය සාර්ථකව Upload විය!');
    } catch (err: any) {
      showToast('Upload දෝෂයකි: ' + err.message, 'error');
    }
  };

  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementForm.image_url) {
      showToast('කරුණාකර පෝස්ටර් පින්තූරය upload කරන්න.', 'error');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('achievements').insert([achievementForm]);
    if (error) showToast('දෝෂයකි: ' + error.message, 'error');
    else {
      showToast('ජයග්‍රහණ පෝස්ටරය සාර්ථකව පළ විය!');
      setAchievementForm({
        title: '',
        category: 'සෞන්දර්ය හා කලා',
        place: '1st Place (රන් පදක්කම)',
        winner_name: '',
        year: '2026',
        aspect_ratio: 'vertical',
        image_url: '',
        description: '',
      });
      loadData();
    }
    setLoading(false);
  };

  // Exam Handlers
  const addStudentRow = () => {
    setTopStudents([...topStudents, { name: '', marks: '', status: '' }]);
  };

  const removeStudentRow = (index: number) => {
    setTopStudents(topStudents.filter((_, i) => i !== index));
  };

  const updateStudentRow = (index: number, field: keyof StudentScore, value: string) => {
    const updated = [...topStudents];
    updated[index][field] = value;
    setTopStudents(updated);
  };

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showToast('විභාග ලකුණු සුරකිමින් පවතී...', 'loading');

    const examName = selectedExamType === 'scholarship' ? '5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගය' : 'අ.පො.ස. සාමාන්‍ය පෙළ (G.C.E. O/L)';
    const validStudents = topStudents.filter(s => s.name.trim() !== '');

    const payload = {
      exam_name: examName,
      year: examForm.year,
      badge: selectedExamType === 'scholarship' ? 'Scholarship Results' : 'G.C.E. O/L Results',
      pass_rate: examForm.pass_rate,
      cutoff_passes: Number(examForm.cutoff_passes),
      highest_marks: examForm.highest_marks,
      top_students: validStudents
    };

    const { error } = await supabase.from('academic_results').upsert(payload, { onConflict: 'exam_name' });

    if (error) showToast('දෝෂයකි: ' + error.message, 'error');
    else showToast('විභාග ප්‍රතිඵල Table එක සාර්ථකව සුරකින ලදී!');
    
    setLoading(false);
  };

  // Admissions Handlers
  const toggleAdmissionStatus = async () => {
    const newStatus = !admissionSettings.is_open;
    setAdmissionSettings(prev => ({ ...prev, is_open: newStatus }));
    showToast(`ලියාපදිංචිය ${newStatus ? 'විවෘත (OPEN)' : 'වසා දැමීම (CLOSED)'} කරමින්...`, 'loading');

    const { error } = await supabase
      .from('admission_settings')
      .update({ is_open: newStatus, updated_at: new Date().toISOString() })
      .eq('id', 'current_admission');

    if (error) {
      showToast('Status වෙනස් කිරීම අසාර්ථකයි: ' + error.message, 'error');
      setAdmissionSettings(prev => ({ ...prev, is_open: !newStatus }));
    } else {
      showToast(`ලියාපදිංචි තත්ත්වය සාර්ථකව ${newStatus ? 'විවෘත (OPEN)' : 'වසා (CLOSED)'} කරන ලදී!`);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'grade1' | 'grade6') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast(`${type === 'grade1' ? '1 ශ්‍රේණිය' : '6 ශ්‍රේණිය'} PDF Upload වෙමින් පවතී...`, 'loading');

      const oldPath = type === 'grade1' ? admissionSettings.grade1_pdf_storage_path : admissionSettings.grade6_pdf_storage_path;
      if (oldPath) {
        await supabase.storage.from('school_media').remove([oldPath]);
      }

      const { url, path } = await uploadFileToStorage(file, `admissions/${type}`);

      const updateData = type === 'grade1'
        ? { grade1_pdf_url: url, grade1_pdf_storage_path: path }
        : { grade6_pdf_url: url, grade6_pdf_storage_path: path };

      await supabase.from('admission_settings').update(updateData).eq('id', 'current_admission');

      setAdmissionSettings(prev => ({ ...prev, ...updateData }));
      showToast('අයදුම්පත සාර්ථකව Upload විය! (පරණ ගොනුව ඉවත් විය)');
    } catch (err: any) {
      showToast('PDF දෝෂයකි: ' + err.message, 'error');
    }
  };

  // Video Handlers
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingVideoId) {
      const { error } = await supabase.from('youtube_videos').update(videoForm).eq('id', editingVideoId);
      if (error) showToast('වීඩියෝව සංස්කරණය අසාර්ථකයි: ' + error.message, 'error');
      else {
        showToast('වීඩියෝව සාර්ථකව සංස්කරණය කරන ලදී!');
        setEditingVideoId(null);
        setVideoForm({ title: '', category: 'Sports & Athletics', youtube_url: '', thumbnail_url: '', duration: '10:00', status: 'published' });
        loadData();
      }
    } else {
      const { error } = await supabase.from('youtube_videos').insert([videoForm]);
      if (error) showToast('දෝෂයක් ඇති විය: ' + error.message, 'error');
      else {
        showToast('වීඩියෝව සාර්ථකව ඇතුළත් කරන ලදී!');
        setVideoForm({ title: '', category: 'Sports & Athletics', youtube_url: '', thumbnail_url: '', duration: '10:00', status: 'published' });
        loadData();
      }
    }
    setLoading(false);
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('මෙම වීඩියෝව සම්පූර්ණයෙන්ම මකා දැමීමට අවශ්‍යද?')) return;
    const { error } = await supabase.from('youtube_videos').delete().eq('id', id);
    if (!error) {
      setVideoList(videoList.filter(v => v.id !== id));
      showToast('වීඩියෝව සාර්ථකව මකා දමන ලදී!');
    }
  };

  // Nav Items Definition
  const navTabs = [
    { key: 'news', label: 'පුවත්', count: newsList.length, icon: Newspaper, color: 'text-emerald-700', activeBg: 'bg-[#065F46]' },
    { key: 'achievements', label: 'Posters', count: achievementList.length, icon: Trophy, color: 'text-amber-500', activeBg: 'bg-amber-500' },
    { key: 'exams', label: 'විභාග', icon: GraduationCap, color: 'text-emerald-600', activeBg: 'bg-emerald-700' },
    { key: 'admissions', label: 'ලියාපදිංචි', icon: FileText, color: 'text-blue-600', activeBg: 'bg-blue-600' },
    { key: 'video', label: 'වීඩියෝ', count: videoList.length, icon: Video, color: 'text-red-600', activeBg: 'bg-red-600' },
  ] as const;

  const handleTabChange = (key: typeof activeTab) => {
    setActiveTab(key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // pb-28: Mobile පහළින් Curved Bar එකට Form එක යට වීම වැළැක්වීමට
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-20 md:pt-28 pb-28 md:pb-16 px-3.5 sm:px-6 lg:px-8 font-sans">
      
      {/* ── Toast Alert Popup ── */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-bounce">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-bold border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' :
            toast.type === 'error' ? 'bg-red-600 text-white border-red-500' :
            'bg-slate-900 text-amber-300 border-slate-700'
          }`}>
            {toast.type === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-amber-300" />}
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-white" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-white" />}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
            Admin Panel
          </span>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
            පාසල් වෙබ් අඩවි පාලක පුවරුව
          </h1>
          <p className="text-slate-500 text-xs">පුවත්, ජයග්‍රහණ, විභාග ලකුණු සහ ඇතුළත් කිරීම් සම්පූර්ණ කළමනාකරණය</p>
        </div>

        {/* ── DESKTOP ONLY TAB BAR (Mobile එකේදී සඟවා ඇත) ── */}
        <div className="hidden md:grid grid-cols-5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs gap-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isActive ? `${tab.activeBg} text-white shadow-xs` : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {'count' in tab && tab.count !== undefined && <span>({tab.count})</span>}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            1. TAB: NEWS & ARTICLES
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <form onSubmit={handleNewsSubmit} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b pb-2.5">
                <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  {editingNewsId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <PlusCircle className="w-4 h-4 text-emerald-600" />}
                  {editingNewsId ? 'පුවත සංස්කරණය (Edit Article)' : 'නව පුවතක් හෝ ලිපියක් එක් කරන්න'}
                </h2>
                {editingNewsId && (
                  <button type="button" onClick={resetNewsForm} className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> අවලංගු කරන්න
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ප්‍රධාන මාතෘකාව (Main Title) *</label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="උදා: වාර්ෂික අධ්‍යාපන විනෝද චාරිකාව සාර්ථකව නිමාවෙයි"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">උප මාතෘකාව / කැපීපෙනෙන සාරාංශය (Subtitle)</label>
                <input
                  type="text"
                  value={newsForm.subtitle}
                  onChange={(e) => setNewsForm({ ...newsForm, subtitle: e.target.value })}
                  placeholder="උදා: සිසු දරු දැරියන් සහ ගුරුභවතුන් එක්ව මහත් උද්‍යෝගයෙන් සහභාගී වූ අමතක නොවන දිනක්"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">වර්ගය (Category)</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  >
                    <option value="ක්‍රීඩා">ක්‍රීඩා</option>
                    <option value="අධ්‍යාපන">අධ්‍යාපන</option>
                    <option value="උත්සව">උත්සව</option>
                    <option value="චාරිකා">චාරිකා</option>
                    <option value="නිවේදන">නිවේදන</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">කර්තෘ / අංශය</label>
                  <input
                    type="text"
                    required
                    value={newsForm.author}
                    onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">තත්ත්වය (Status)</label>
                  <select
                    value={newsForm.status}
                    onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  >
                    <option value="published">පළ කරන්න (Published)</option>
                    <option value="draft">කෙටුම්පතක් (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 border-2 border-dashed border-emerald-500/40 bg-emerald-50/20 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">ප්‍රධාන ආවරණ පින්තූරය (Cover Image) Upload කරන්න:</label>
                  {newsForm.image_url && <span className="text-[10px] text-emerald-700 font-bold">✅ පින්තූරය තෝරා ඇත</span>}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewsImageUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
                {newsForm.image_url && (
                  <div className="pt-1 flex items-center gap-2">
                    <img src={newsForm.image_url} alt="Cover Preview" className="w-16 h-12 rounded-lg object-cover border" />
                    <input
                      type="url"
                      value={newsForm.image_url}
                      onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                      placeholder="Image URL"
                      className="flex-1 bg-white border rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">සම්පූර්ණ විස්තරය (Description / Paragraphs) *</label>
                <textarea
                  rows={5}
                  required
                  value={newsForm.description}
                  onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })}
                  placeholder="පුවතේ විස්තරය මෙතැන ලියන්න. ඡේද වෙන් කිරීමට Enter ඔබන්න..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>අමතර පිවිසුම් බොත්තම / Social Media Link (Optional)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={newsForm.link_label}
                    onChange={(e) => setNewsForm({ ...newsForm, link_label: e.target.value })}
                    placeholder="බොත්තමේ පාඨය (උදා: Facebook Post එක බලන්න)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 text-xs"
                  />
                  <input
                    type="url"
                    value={newsForm.link_url}
                    onChange={(e) => setNewsForm({ ...newsForm, link_url: e.target.value })}
                    placeholder="Destination Link (https://...)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Images className="w-3.5 h-3.5 text-emerald-700" />
                    <span>අමතර ඡායාරූප එකතුව (Photo Gallery URLs)</span>
                  </div>
                  <span className="text-[9.5px] text-slate-400">Comma (,) හෝ New Line මඟින් වෙන් කරන්න</span>
                </div>
                <textarea
                  rows={2}
                  value={newsForm.gallery}
                  onChange={(e) => setNewsForm({ ...newsForm, gallery: e.target.value })}
                  placeholder="https://image1.jpg, https://image2.jpg"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 sm:py-3 rounded-xl transition-all shadow-xs active:scale-[0.99] disabled:opacity-50 text-xs sm:text-sm"
              >
                {loading ? 'සුරකිමින් පවතී...' : (editingNewsId ? 'වෙනස්කම් සුරකින්න (Save Changes)' : 'පුවත පළ කරන්න')}
              </button>
            </form>

            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 pb-2 border-b">
                දැනට පළ කර ඇති පුවත් ({newsList.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {newsList.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={item.image_url} alt="" className="w-11 h-11 rounded-xl object-cover bg-slate-100 border shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded ${
                            item.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.status === 'draft' ? 'Draft' : 'Live'}
                          </span>
                          <span className="text-[9.5px] text-slate-400">{item.date}</span>
                          <span className="text-[9px] text-slate-600 bg-slate-100 px-1 py-0.2 rounded font-semibold">{item.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleNewsStatus(item)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600">
                        {item.status === 'published' ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                      <button onClick={() => startEditNews(item)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-800">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteNews(item.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            2. TAB: ACHIEVEMENTS (DIRECT POSTER IMAGE UPLOAD)
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <form onSubmit={handleAchievementSubmit} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xs">
              <div className="border-b pb-2 flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  නව ජයග්‍රහණ පෝස්ටරයක් එක් කරන්න
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">තරගයේ නම (Title) *</label>
                <input
                  type="text"
                  required
                  value={achievementForm.title}
                  onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                  placeholder="උදා: සමස්ත ලංකා කථික තරගාවලිය"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">දිනාගත් ස්ථානය *</label>
                  <input
                    type="text"
                    required
                    value={achievementForm.place}
                    onChange={(e) => setAchievementForm({ ...achievementForm, place: e.target.value })}
                    placeholder="උදා: 1st Place (රන් පදක්කම)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ජයග්‍රාහී සිසුවාගේ නම *</label>
                  <input
                    type="text"
                    required
                    value={achievementForm.winner_name}
                    onChange={(e) => setAchievementForm({ ...achievementForm, winner_name: e.target.value })}
                    placeholder="උදා: චමත් සංදීප (ශ්‍රේණිය 11)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">වර්ෂය</label>
                  <input
                    type="text"
                    required
                    value={achievementForm.year}
                    onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">පෝස්ටර් Frame Size එක තෝරන්න:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAchievementForm({ ...achievementForm, aspect_ratio: 'vertical' })}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      achievementForm.aspect_ratio === 'vertical'
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    📱 TikTok (9:16 Vertical Flyer)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAchievementForm({ ...achievementForm, aspect_ratio: 'landscape' })}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      achievementForm.aspect_ratio === 'landscape'
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    🖥️ YouTube (16:9 Landscape)
                  </button>
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-emerald-500/40 bg-emerald-50/30 rounded-2xl text-center space-y-2">
                <p className="text-xs font-bold text-slate-800">පෝස්ටර් පින්තූරය කෙළින්ම මෙතැනින් Upload කරන්න:</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
                {achievementForm.image_url && (
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <img src={achievementForm.image_url} alt="Preview" className="w-16 h-16 rounded-xl object-cover border" />
                    <span className="text-xs font-bold text-emerald-700">✅ පින්තූරය තෝරාගෙන ඇත!</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs sm:text-sm shadow-xs"
              >
                {loading ? 'සුරකිමින් පවතී...' : 'ජයග්‍රහණ පෝස්ටරය පළ කරන්න'}
              </button>
            </form>

            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 pb-2 border-b">දැනට ඇති ජයග්‍රහණ ({achievementList.length})</h4>
              <div className="divide-y">
                {achievementList.map(a => (
                  <div key={a.id} className="py-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={a.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 border" />
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">{a.place}</span>
                        <p className="text-xs font-bold text-slate-900 truncate">{a.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">👤 {a.winner_name}</p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (confirm('මෙම පෝස්ටරය මකා දැමීමට අවශ්‍යද?')) {
                          await supabase.from('achievements').delete().eq('id', a.id);
                          loadData();
                          showToast('පෝස්ටරය මකා දමන ලදී!');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            3. TAB: EXAM RESULTS
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="flex bg-slate-200 p-1 rounded-2xl max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => { setSelectedExamType('scholarship'); loadExamData('scholarship'); }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedExamType === 'scholarship' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                🎒 5 ශිෂ්‍යත්ව විභාගය
              </button>
              <button
                type="button"
                onClick={() => { setSelectedExamType('ol'); loadExamData('ol'); }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedExamType === 'ol' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                🎓 සාමාන්‍ය පෙළ (O/L)
              </button>
            </div>

            <form onSubmit={handleExamSubmit} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xs">
              <div className="border-b pb-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {selectedExamType === 'scholarship' ? '5 ශ්‍රේණිය ශිෂ්‍යත්ව ප්‍රතිඵල Table එක' : 'අ.පො.ස. සාමාන්‍ය පෙළ (O/L) ප්‍රතිඵල Table එක'}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">වර්ෂය</label>
                  <input
                    type="text"
                    required
                    value={examForm.year}
                    onChange={(e) => setExamForm({ ...examForm, year: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">සමත් ප්‍රතිශතය</label>
                  <input
                    type="text"
                    required
                    value={examForm.pass_rate}
                    onChange={(e) => setExamForm({ ...examForm, pass_rate: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">කඩඉම් ඉක්මවූ ගණන</label>
                  <input
                    type="number"
                    required
                    value={examForm.cutoff_passes}
                    onChange={(e) => setExamForm({ ...examForm, cutoff_passes: Number(e.target.value) })}
                    className="w-full bg-slate-50 border rounded-xl px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ඉහළම ලකුණු / සාමාර්ථ</label>
                  <input
                    type="text"
                    required
                    value={examForm.highest_marks}
                    onChange={(e) => setExamForm({ ...examForm, highest_marks: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900">විශිෂ්ට සාමාර්ථ ගත් සිසුන්ගේ Table එක:</label>
                  <button
                    type="button"
                    onClick={addStudentRow}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-[#065F46] text-xs font-bold hover:bg-emerald-200"
                  >
                    <Plus className="w-3.5 h-3.5" /> + පේළියක් එක් කරන්න
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                  <div className="grid grid-cols-12 gap-2 p-2.5 bg-slate-200/70 text-[11px] font-bold text-slate-700">
                    <span className="col-span-5">ශිෂ්‍යයාගේ සම්පූර්ණ නම</span>
                    <span className="col-span-3">ලකුණු / ප්‍රතිඵලය</span>
                    <span className="col-span-3">විශේෂ තත්ත්වය</span>
                    <span className="col-span-1 text-center">ඉවත්</span>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {topStudents.map((st, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 p-2 items-center bg-white">
                        <input
                          type="text"
                          placeholder="සිසුවාගේ නම"
                          value={st.name}
                          onChange={(e) => updateStudentRow(idx, 'name', e.target.value)}
                          className="col-span-5 bg-slate-50 border rounded-lg px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="උදා: 194 හෝ 9 A"
                          value={st.marks}
                          onChange={(e) => updateStudentRow(idx, 'marks', e.target.value)}
                          className="col-span-3 bg-slate-50 border rounded-lg px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="උදා: දිස්ත්‍රික් ප්‍රමුඛ"
                          value={st.status}
                          onChange={(e) => updateStudentRow(idx, 'status', e.target.value)}
                          className="col-span-3 bg-slate-50 border rounded-lg px-2 py-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeStudentRow(idx)}
                          className="col-span-1 flex justify-center text-red-500 hover:text-red-700"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#065F46] hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-xs"
              >
                {loading ? 'සුරකිමින් පවතී...' : 'විභාග ලකුණු Table එක සුරකින්න'}
              </button>
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            4. TAB: ADMISSIONS
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'admissions' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">ලියාපදිංචිය විවෘත කිරීම / වසා දැමීම</h3>
                  <p className="text-xs text-slate-500">ජනවාරි වන තෙක් වසා තැබීමට හෝ විවෘත කිරීමට මෙතැන ඔබන්න</p>
                </div>
                
                <button
                  type="button"
                  onClick={toggleAdmissionStatus}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black shadow-sm transition-transform active:scale-95 ${
                    admissionSettings.is_open ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  <span>{admissionSettings.is_open ? 'විවෘතයි (OPEN)' : 'වසා ඇත (CLOSED)'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    1 ශ්‍රේණිය අයදුම්පත (PDF)
                  </span>
                  {admissionSettings.grade1_pdf_url ? (
                    <p className="text-[11px] text-emerald-700 font-bold truncate">✅ දැනට PDF ගොනුවක් ඇත</p>
                  ) : (
                    <p className="text-[10px] text-slate-400">PDF එකක් තවම නැත</p>
                  )}
                  
                  <label className="cursor-pointer block text-center py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold">
                    <span>අලුත් PDF එකක් තෝරන්න</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handlePdfUpload(e, 'grade1')}
                    />
                  </label>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    6 ශ්‍රේණිය අයදුම්පත (PDF)
                  </span>
                  {admissionSettings.grade6_pdf_url ? (
                    <p className="text-[11px] text-emerald-700 font-bold truncate">✅ දැනට PDF ගොනුවක් ඇත</p>
                  ) : (
                    <p className="text-[10px] text-slate-400">PDF එකක් තවම නැත</p>
                  )}
                  
                  <label className="cursor-pointer block text-center py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold">
                    <span>අලුත් PDF එකක් තෝරන්න</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handlePdfUpload(e, 'grade6')}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            5. TAB: YOUTUBE VIDEOS
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'video' && (
          <div className="space-y-6">
            <form onSubmit={handleVideoSubmit} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b pb-2.5">
                <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  {editingVideoId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <PlusCircle className="w-4 h-4 text-red-600" />}
                  {editingVideoId ? 'වීඩියෝව සංස්කරණය (Edit Video)' : 'නව YouTube වීඩියෝවක් එක් කරන්න'}
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">වීඩියෝ මාතෘකාව (Title) *</label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="උදා: 2026 වාර්ෂික නිවාසාන්තර මලල ක්‍රීඩා උළෙල"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">කාණ්ඩය</label>
                  <input
                    type="text"
                    required
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ධාවන කාලය</label>
                  <input
                    type="text"
                    required
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">තත්ත්වය</label>
                  <select
                    value={videoForm.status}
                    onChange={(e) => setVideoForm({ ...videoForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  >
                    <option value="published">පළ කරන්න (Published)</option>
                    <option value="draft">කෙටුම්පතක් (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">YouTube Link (URL) *</label>
                  <input
                    type="url"
                    required
                    value={videoForm.youtube_url}
                    onChange={(e) => setVideoForm({ ...videoForm, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thumbnail URL *</label>
                  <input
                    type="url"
                    required
                    value={videoForm.thumbnail_url}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                    placeholder="https://img.youtube.com/vi/.../mqdefault.jpg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-xs"
              >
                {editingVideoId ? 'වීඩියෝව යාවත්කාලීන කරන්න' : 'වීඩියෝව පළ කරන්න'}
              </button>
            </form>

            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 pb-2 border-b">
                දැනට ඇති වීඩියෝ ({videoList.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {videoList.map(item => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={item.thumbnail_url} alt="" className="w-12 h-8 rounded-lg object-cover bg-slate-100 border" />
                      <div className="min-w-0">
                        <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full ${
                          item.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'draft' ? 'Draft' : 'Live'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => { setEditingVideoId(item.id); setVideoForm(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-1.5 rounded-lg bg-slate-100 text-emerald-800">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteVideo(item.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── 📱 FLOATING CURVED BOTTOM DOCK (MOBILE ONLY) ── */}
      <div className="md:hidden fixed bottom-4 inset-x-3 z-40">
        <div className="bg-slate-900/90 backdrop-blur-lg border border-white/15 shadow-2xl rounded-[28px] p-1.5 flex items-center justify-around">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 active:scale-90 ${
                  isActive 
                    ? 'bg-white/15 text-white shadow-inner font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                  {tab.label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}