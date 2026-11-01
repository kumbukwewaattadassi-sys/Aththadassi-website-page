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
  Loader2 
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  image_url: string;
  description: string;
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

  // News Form
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'ක්‍රීඩා',
    author: 'Media Unit',
    date: new Date().toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' }),
    image_url: '',
    description: '',
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
    // Fetch News
    const { data: nData } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (nData) setNewsList(nData);

    // Fetch Videos
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

    if (editingNewsId) {
      // Update
      const { error } = await supabase
        .from('news')
        .update(newsForm)
        .eq('id', editingNewsId);

      if (error) {
        setMessage({ text: 'යාවත්කාලීන කිරීම අසාර්ථකයි: ' + error.message, type: 'error' });
      } else {
        setMessage({ text: 'පුවත සාර්ථකව සංස්කරණය කරන ලදී!', type: 'success' });
        resetNewsForm();
        loadData();
      }
    } else {
      // Insert
      const { error } = await supabase.from('news').insert([newsForm]);
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
    setNewsForm({
      title: item.title,
      category: item.category,
      author: item.author,
      date: item.date,
      image_url: item.image_url,
      description: item.description,
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

  // 5. News: Toggle Status (Draft <-> Published)
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
      category: 'ක්‍රීඩා',
      author: 'Media Unit',
      date: new Date().toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' }),
      image_url: '',
      description: '',
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
      setVideoList(videoList.map(v => v.id === item.id ? { ...v, status: newStatus } : v));
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
    <div className="min-h-screen bg-[#011a14] text-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-white">Aththadassi K Vidyalaya Admin</h1>
          <p className="text-emerald-300/70 text-sm mt-1">පුවත් සහ වීඩියෝ Edit, Draft සහ Delete කළමනාකරණය</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-[#022c22] p-1.5 rounded-2xl border border-emerald-800/80 max-w-md mx-auto">
          <button
            onClick={() => { setActiveTab('news'); setMessage(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'news' ? 'bg-[#065F46] text-white shadow-md' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <Newspaper className="w-4 h-4" /> පුවත් / නිවේදන ({newsList.length})
          </button>
          <button
            onClick={() => { setActiveTab('video'); setMessage(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'video' ? 'bg-[#065F46] text-white shadow-md' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" /> YouTube වීඩියෝ ({videoList.length})
          </button>
        </div>

        {/* Status Alert */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 text-sm max-w-3xl mx-auto ${
            message.type === 'success' 
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-600/50' 
              : 'bg-red-950/90 text-red-300 border border-red-700/50'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* ===================== 1. NEWS TAB ===================== */}
        {activeTab === 'news' && (
          <div className="space-y-10">
            {/* News Form (Add / Edit) */}
            <form onSubmit={handleNewsSubmit} className="bg-[#022c22]/90 border border-emerald-800/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {editingNewsId ? <Edit3 className="w-5 h-5 text-amber-400" /> : <PlusCircle className="w-5 h-5 text-emerald-400" />}
                  {editingNewsId ? 'පුවත සංස්කරණය කරන්න (Edit)' : 'නව පුවතක් හෝ නිවේදනයක් පළ කරන්න'}
                </h2>
                {editingNewsId && (
                  <button type="button" onClick={resetNewsForm} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                    <X className="w-4 h-4" /> අවලංගු කරන්න
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">පුවත් මාතෘකාව (Title)</label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="මාතෘකාව ඇතුළත් කරන්න"
                  className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">වර්ගය (Category)</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="ක්‍රීඩා">ක්‍රීඩා</option>
                    <option value="අධ්‍යාපන">අධ්‍යාපන</option>
                    <option value="උත්සව">උත්සව</option>
                    <option value="නිවේදන">නිවේදන</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">කර්තෘ / අංශය</label>
                  <input
                    type="text"
                    required
                    value={newsForm.author}
                    onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                    className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">තත්ත්වය (Status)</label>
                  <select
                    value={newsForm.status}
                    onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as any })}
                    className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="published">පළ කරන්න (Published)</option>
                    <option value="draft">කෙටුම්පතක් (Draft)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">පින්තූර Link එක (Image URL)</label>
                <input
                  type="url"
                  required
                  value={newsForm.image_url}
                  onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">විස්තරය (Content / Description)</label>
                <textarea
                  rows={3}
                  required
                  value={newsForm.description}
                  onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })}
                  className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'සුරකිමින් පවතී...' : (editingNewsId ? 'වෙනස්කම් සුරකින්න (Save Changes)' : 'පුවත එකතු කරන්න')}
              </button>
            </form>

            {/* News Manage Table / List */}
            <div className="bg-[#022c22]/90 border border-emerald-800/60 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4">දැනට ඇති පුවත් ලැයිස්තුව</h3>
              {fetching ? (
                <div className="py-8 text-center text-emerald-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
              ) : newsList.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-6">කිසිදු පුවතක් හමු නොවීය.</p>
              ) : (
                <div className="divide-y divide-emerald-800/50">
                  {newsList.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image_url} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-900" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.status === 'draft' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {item.status === 'draft' ? 'Draft' : 'Live'}
                            </span>
                            <span className="text-xs text-slate-400">{item.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{item.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => toggleNewsStatus(item)}
                          title={item.status === 'published' ? 'Draft කරන්න' : 'Publish කරන්න'}
                          className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs flex items-center gap-1"
                        >
                          {item.status === 'published' ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                        </button>
                        <button
                          onClick={() => startEditNews(item)}
                          className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNews(item.id)}
                          className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300"
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
          <div className="space-y-10">
            {/* Video Form (Add / Edit) */}
            <form onSubmit={handleVideoSubmit} className="bg-[#022c22]/90 border border-emerald-800/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {editingVideoId ? <Edit3 className="w-5 h-5 text-amber-400" /> : <PlusCircle className="w-5 h-5 text-red-400" />}
                  {editingVideoId ? 'වීඩියෝව සංස්කරණය කරන්න (Edit)' : 'නව YouTube වීඩියෝවක් එක් කරන්න'}
                </h2>
                {editingVideoId && (
                  <button type="button" onClick={resetVideoForm} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                    <X className="w-4 h-4" /> අවලංගු කරන්න
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">වීඩියෝ මාතෘකාව (Title)</label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">කාණ්ඩය</label>
                  <input
                    type="text"
                    required
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                    className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">ධාවන කාලය</label>
                  <input
                    type="text"
                    required
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">තත්ත්වය (Status)</label>
                  <select
                    value={videoForm.status}
                    onChange={(e) => setVideoForm({ ...videoForm, status: e.target.value as any })}
                    className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="published">පළ කරන්න (Published)</option>
                    <option value="draft">කෙටුම්පතක් (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">YouTube Link (URL)</label>
                  <input
                    type="url"
                    required
                    value={videoForm.youtube_url}
                    onChange={(e) => setVideoForm({ ...videoForm, youtube_url: e.target.value })}
                    className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Thumbnail URL</label>
                  <input
                    type="url"
                    required
                    value={videoForm.thumbnail_url}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                    className="w-full bg-[#011a14] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'සුරකිමින් පවතී...' : (editingVideoId ? 'වීඩියෝව යාවත්කාලීන කරන්න' : 'වීඩියෝව පළ කරන්න')}
              </button>
            </form>

            {/* Video Manage List */}
            <div className="bg-[#022c22]/90 border border-emerald-800/60 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4">දැනට ඇති වීඩියෝ ලැයිස්තුව</h3>
              {fetching ? (
                <div className="py-8 text-center text-red-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
              ) : videoList.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-6">කිසිදු වීඩියෝවක් හමු නොවීය.</p>
              ) : (
                <div className="divide-y divide-emerald-800/50">
                  {videoList.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={item.thumbnail_url} alt="" className="w-16 h-10 rounded-lg object-cover shrink-0 bg-slate-900" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.status === 'draft' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {item.status === 'draft' ? 'Draft' : 'Live'}
                            </span>
                            <span className="text-xs text-slate-400">{item.duration}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{item.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => toggleVideoStatus(item)}
                          title={item.status === 'published' ? 'Draft කරන්න' : 'Publish කරන්න'}
                          className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200"
                        >
                          {item.status === 'published' ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                        </button>
                        <button
                          onClick={() => startEditVideo(item)}
                          className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteVideo(item.id)}
                          className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300"
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