"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Newspaper, 
  Video, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  X,
  Loader2,
  ExternalLink,
  Images,
  Link as LinkIcon
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
  views: string;
  status: 'published' | 'draft';
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'news' | 'video'>('news');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data Lists
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);

  // Editing State
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // News Form (Updated with Subtitle, Link & Gallery)
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
    gallery: '', // Comma-separated URLs
    status: 'published' as 'published' | 'draft',
  });

  // Video Form
  const [videoForm, setVideoForm] = useState({
    title: '',
    category: 'Sports & Athletics',
    youtube_url: '',
    thumbnail_url: '',
    duration: '10:00',
    views: '1K views',
    status: 'published' as 'published' | 'draft',
  });

  // 1. Fetch All Data
  const loadData = async () => {
    setFetching(true);
    const { data: nData } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (nData) setNewsList(nData);

    const { data: vData } = await supabase
      .from('youtube_videos')
      .select('*')
      .order('created_at', { ascending: false });
    if (vData) setVideoList(vData);

    setFetching(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. News: Add or Update
  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Gallery string එක array එකක් බවට හැරවීම
    const parsedGallery = newsForm.gallery
      ? newsForm.gallery
          .split(/[\n,]+/)
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
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
      const { error } = await supabase
        .from('news')
        .update(payload)
        .eq('id', editingNewsId);

      if (error) {
        setMessage({ text: 'යාවත්කාලීන කිරීම අසාර්ථකයි: ' + error.message, type: 'error' });
      } else {
        setMessage({ text: 'පුවත සාර්ථකව සංස්කරණය කරන ලදී!', type: 'success' });
        resetNewsForm();
        loadData();
      }
    } else {
      const { error } = await supabase.from('news').insert([payload]);
      if (error) {
        setMessage({ text: 'දෝෂයක් ඇති විය: ' + error.message, type: 'error' });
      } else {
        setMessage({ text: 'පුවත සාර්ථකව ඇතුළත් කරන ලදී!', type: 'success' });
        resetNewsForm();
        loadData();
      }
    }
    setLoading(false);
  };

  // 3. News: Edit Click
  const startEditNews = (item: NewsItem) => {
    setEditingNewsId(item.id);

    let galleryStr = '';
    if (Array.isArray(item.gallery)) {
      galleryStr = item.gallery.join(',\n');
    } else if (typeof item.gallery === 'string') {
      galleryStr = item.gallery;
    }

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

  // 4. News: Delete
  const deleteNews = async (id: string) => {
    if (!confirm('මෙම පුවත සම්පූර්ණයෙන්ම මකා දැමීමට අවශ්‍යද?')) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) {
      setNewsList(newsList.filter(n => n.id !== id));
      setMessage({ text: 'පුවත සාර්ථකව මකා දමන ලදී!', type: 'success' });
    }
  };

  // 5. News: Toggle Status
  const toggleNewsStatus = async (item: NewsItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase.from('news').update({ status: newStatus }).eq('id', item.id);
    if (!error) {
      setNewsList(newsList.map(n => n.id === item.id ? { ...n, status: newStatus } : n));
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

  // 6. Video: Add or Update
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (editingVideoId) {
      const { error } = await supabase
        .from('youtube_videos')
        .update(videoForm)
        .eq('id', editingVideoId);

      if (error) {
        setMessage({ text: 'වීඩියෝව යාවත්කාලීන කිරීම අසාර්ථකයි: ' + error.message, type: 'error' });
      } else {
        setMessage({ text: 'වීඩියෝව සාර්ථකව සංස්කරණය කරන ලදී!', type: 'success' });
        resetVideoForm();
        loadData();
      }
    } else {
      const { error } = await supabase.from('youtube_videos').insert([videoForm]);
      if (error) {
        setMessage({ text: 'දෝෂයක් ඇති විය: ' + error.message, type: 'error' });
      } else {
        setMessage({ text: 'වීඩියෝව සාර්ථකව ඇතුළත් කරන ලදී!', type: 'success' });
        resetVideoForm();
        loadData();
      }
    }
    setLoading(false);
  };

  const startEditVideo = (item: VideoItem) => {
    setEditingVideoId(item.id);
    setVideoForm({
      title: item.title,
      category: item.category,
      youtube_url: item.youtube_url,
      thumbnail_url: item.thumbnail_url,
      duration: item.duration,
      views: item.views,
      status: item.status || 'published',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('මෙම වීඩියෝව සම්පූර්ණයෙන්ම මකා දැමීමට අවශ්‍යද?')) return;
    const { error } = await supabase.from('youtube_videos').delete().eq('id', id);
    if (!error) {
      setVideoList(videoList.filter(v => v.id !== id));
      setMessage({ text: 'වීඩියෝව සාර්ථකව මකා දමන ලදී!', type: 'success' });
    }
  };

  const toggleVideoStatus = async (item: VideoItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase.from('youtube_videos').update({ status: newStatus }).eq('id', item.id);
    if (!error) {
      setVideoList(videoList.map(v => v.id === item.id ? { ...v, status: newStatus } : n));
    }
  };

  const resetVideoForm = () => {
    setEditingVideoId(null);
    setVideoForm({
      title: '',
      category: 'Sports & Athletics',
      youtube_url: '',
      thumbnail_url: '',
      duration: '10:00',
      views: '1K views',
      status: 'published',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
            Admin Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Aththadassi K Vidyalaya Admin
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            පුවත්, ලිපි සහ YouTube වීඩියෝ සංස්කරණය හා කළමනාකරණය
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
          <button
            onClick={() => { setActiveTab('news'); setMessage(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'news' 
                ? 'bg-[#065F46] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-4 h-4" /> පුවත් / ලිපි ({newsList.length})
          </button>
          <button
            onClick={() => { setActiveTab('video'); setMessage(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'video' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" /> වීඩියෝ ({videoList.length})
          </button>
        </div>

        {/* Status Alert */}
        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm max-w-3xl mx-auto shadow-sm ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            <span className="font-semibold">{message.text}</span>
          </div>
        )}

        {/* ===================== 1. NEWS TAB ===================== */}
        {activeTab === 'news' && (
          <div className="space-y-8">
            {/* News Form */}
            <form onSubmit={handleNewsSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  {editingNewsId ? <Edit3 className="w-5 h-5 text-amber-500" /> : <PlusCircle className="w-5 h-5 text-emerald-600" />}
                  {editingNewsId ? 'පුවත සංස්කරණය (Edit Article)' : 'නව පුවතක් හෝ ලිපියක් එක් කරන්න'}
                </h2>
                {editingNewsId && (
                  <button type="button" onClick={resetNewsForm} className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1">
                    <X className="w-4 h-4" /> අවලංගු කරන්න
                  </button>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">පුවත් ප්‍රධාන මාතෘකාව (Main Title) *</label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="උදා: වාර්ෂික අධ්‍යාපන විනෝද චාරිකාව සාර්ථකව නිමාවෙයි"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Subtitle / Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">උප මාතෘකාව / කැපීපෙනෙන සාරාංශය (Subtitle / Highlight Box)</label>
                <input
                  type="text"
                  value={newsForm.subtitle}
                  onChange={(e) => setNewsForm({ ...newsForm, subtitle: e.target.value })}
                  placeholder="උදා: සිසු දරු දැරියන් සහ ගුරුභවතුන් එක්ව මහත් උද්‍යෝගයෙන් සහභාගී වූ අමතක නොවන දිනක්"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Category, Author, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">වර්ගය (Category)</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  >
                    <option value="ක්‍රීඩා">ක්‍රීඩා</option>
                    <option value="අධ්‍යාපන">අධ්‍යාපන</option>
                    <option value="උත්සව">උත්සව</option>
                    <option value="චාරිකා">චාරිකා</option>
                    <option value="නිවේදන">නිවේදන</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">කර්තෘ / අංශය</label>
                  <input
                    type="text"
                    required
                    value={newsForm.author}
                    onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">තත්ත්වය (Status)</label>
                  <select
                    value={newsForm.status}
                    onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  >
                    <option value="published">පළ කරන්න (Published)</option>
                    <option value="draft">කෙටුම්පතක් (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Main Cover Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ප්‍රධාන ආවරණ පින්තූරය (Featured Cover Image URL) *</label>
                <input
                  type="url"
                  required
                  value={newsForm.image_url}
                  onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Description / Content (Paragraphs) */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">සම්පූර්ණ විස්තරය (Description / Paragraphs) *</label>
                  <span className="text-[10px] text-slate-400 font-medium">නව ඡේදයක් සඳහා Enter ඔබන්න</span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={newsForm.description}
                  onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })}
                  placeholder="පුවතේ විස්තරය මෙතැන ලියන්න. ඡේද වෙන් කිරීමට Enter (New Line) යොදන්න..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors leading-relaxed"
                />
              </div>

              {/* External Action Button / Link */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>අමතර පිවිසුම් බොත්තම (Optional Action Button)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">බොත්තමේ පාඨය (Button Label)</label>
                    <input
                      type="text"
                      value={newsForm.link_label}
                      onChange={(e) => setNewsForm({ ...newsForm, link_label: e.target.value })}
                      placeholder="උදා: PDF චක්‍රලේඛය බාගත කරන්න"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">යොමුවන Link එක (Destination URL)</label>
                    <input
                      type="url"
                      value={newsForm.link_url}
                      onChange={(e) => setNewsForm({ ...newsForm, link_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Gallery Images */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Images className="w-3.5 h-3.5 text-emerald-700" />
                    <span>අමතර ඡායාරූප එකතුව (Photo Gallery URLs)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Comma (,) හෝ New Line මඟින් වෙන් කරන්න</span>
                </div>
                <textarea
                  rows={3}
                  value={newsForm.gallery}
                  onChange={(e) => setNewsForm({ ...newsForm, gallery: e.target.value })}
                  placeholder="https://image1.jpg,&#10;https://image2.jpg,&#10;https://image3.jpg"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-50 text-sm"
              >
                {loading ? 'සුරකිමින් පවතී...' : (editingNewsId ? 'වෙනස්කම් සුරකින්න (Save Changes)' : 'පුවත පළ කරන්න')}
              </button>
            </form>

            {/* News Manage Table / List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">දැනට පළ කර ඇති පුවත් ({newsList.length})</h3>
                <span className="text-xs text-slate-400 font-medium">Live / Draft කළමනාකරණය</span>
              </div>

              {fetching ? (
                <div className="py-12 text-center text-emerald-700">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </div>
              ) : newsList.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-8">කිසිදු පුවතක් හමු නොවීය.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {newsList.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={item.image_url} 
                          alt="" 
                          className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.status === 'draft' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {item.status === 'draft' ? 'Draft' : 'Live'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                            <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1 truncate max-w-md">{item.title}</h4>
                          {item.subtitle && (
                            <p className="text-xs text-slate-500 truncate max-w-md">{item.subtitle}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => toggleNewsStatus(item)}
                          title={item.status === 'published' ? 'Draft කරන්න' : 'Publish කරන්න'}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          {item.status === 'published' ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                        </button>
                        <button
                          onClick={() => startEditNews(item)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-emerald-800" />
                        </button>
                        <button
                          onClick={() => deleteNews(item.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== 2. YOUTUBE VIDEO TAB ===================== */}
        {activeTab === 'video' && (
          <div className="space-y-8">
            {/* Video Form */}
            <form onSubmit={handleVideoSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  {editingVideoId ? <Edit3 className="w-5 h-5 text-amber-500" /> : <PlusCircle className="w-5 h-5 text-red-600" />}
                  {editingVideoId ? 'වීඩියෝව සංස්කරණය (Edit Video)' : 'නව YouTube වීඩියෝවක් එක් කරන්න'}
                </h2>
                {editingVideoId && (
                  <button type="button" onClick={resetVideoForm} className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1">
                    <X className="w-4 h-4" /> අවලංගු කරන්න
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">වීඩියෝ මාතෘකාව (Title) *</label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="උදා: 2026 වාර්ෂික නිවාසාන්තර මලල ක්‍රීඩා උළෙල"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">කාණ්ඩය</label>
                  <input
                    type="text"
                    required
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ධාවන කාලය</label>
                  <input
                    type="text"
                    required
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">තත්ත්වය (Status)</label>
                  <select
                    value={videoForm.status}
                    onChange={(e) => setVideoForm({ ...videoForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                  >
                    <option value="published">පළ කරන්න (Published)</option>
                    <option value="draft">කෙටුම්පතක් (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">YouTube Link (URL) *</label>
                  <input
                    type="url"
                    required
                    value={videoForm.youtube_url}
                    onChange={(e) => setVideoForm({ ...videoForm, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Thumbnail URL *</label>
                  <input
                    type="url"
                    required
                    value={videoForm.thumbnail_url}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                    placeholder="https://img.youtube.com/vi/.../mqdefault.jpg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-50 text-sm"
              >
                {loading ? 'සුරකිමින් පවතී...' : (editingVideoId ? 'වීඩියෝව යාවත්කාලීන කරන්න' : 'වීඩියෝව පළ කරන්න')}
              </button>
            </form>

            {/* Video Manage List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">දැනට ඇති වීඩියෝ ({videoList.length})</h3>
                <span className="text-xs text-slate-400 font-medium">YouTube Channel Feed</span>
              </div>

              {fetching ? (
                <div className="py-12 text-center text-red-600">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </div>
              ) : videoList.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-8">කිසිදු වීඩියෝවක් හමු නොවීය.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {videoList.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={item.thumbnail_url} 
                          alt="" 
                          className="w-16 h-10 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-200" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.status === 'draft' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {item.status === 'draft' ? 'Draft' : 'Live'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{item.duration}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1 truncate max-w-md">{item.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => toggleVideoStatus(item)}
                          title={item.status === 'published' ? 'Draft කරන්න' : 'Publish කරන්න'}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          {item.status === 'published' ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                        </button>
                        <button
                          onClick={() => startEditVideo(item)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-emerald-800" />
                        </button>
                        <button
                          onClick={() => deleteVideo(item.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}