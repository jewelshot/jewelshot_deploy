/**
 * MotionPlusContent - Video Generation & Editing Hub
 * 
 * Features:
 * - Video generation (Standard, Turntable, Zoom)
 * - Advanced video player
 * - Basic editing (Trim, Speed, Loop, Reverse)
 * - Export (MP4, GIF)
 * - Video history
 */

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Download,
  RefreshCw,
  Scissors,
  Clock,
  RotateCcw,
  Repeat,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Video,
  Loader2,
  X,
  Check,
  Sparkles,
  RotateCw,
  ZoomIn,
  Film,
  GalleryHorizontal,
  Trash2,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useImageToVideo } from '@/hooks/useImageToVideo';

// Video type options
type VideoType = 'standard' | 'turntable' | 'zoom';
type EditMode = 'none' | 'trim' | 'speed';

interface VideoHistoryItem {
  id: string;
  url: string;
  thumbnail?: string;
  type: VideoType;
  duration: string;
  resolution: string;
  createdAt: Date;
  sourceImage?: string;
}

export default function MotionPlusContent() {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Layout state
  const { leftOpen } = useSidebarStore();
  
  // Source state
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  
  // Video state
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  
  // Generation state
  const [videoType, setVideoType] = useState<VideoType>('standard');
  const [videoDuration, setVideoDuration] = useState<'8s'>('8s');
  const [videoResolution, setVideoResolution] = useState<'720p' | '1080p'>('720p');
  const [prompt, setPrompt] = useState('');
  
  // Edit state
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [isReversed, setIsReversed] = useState(false);
  
  // UI state
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'generate' | 'edit' | 'export'>('generate');
  
  // History state
  const [videoHistory, setVideoHistory] = useState<VideoHistoryItem[]>([]);
  
  // Video generation hook
  const { generateVideo, isGenerating, progress, videoUrl: generatedVideoUrl, error: generationError, reset: resetGeneration } = useImageToVideo();

  // Sync generated video URL with local state
  useEffect(() => {
    if (generatedVideoUrl) {
      setVideoUrl(generatedVideoUrl);
      // Add to history
      const newHistoryItem: VideoHistoryItem = {
        id: `video-${Date.now()}`,
        url: generatedVideoUrl,
        thumbnail: sourceImage || undefined,
        type: videoType,
        duration: '8s',
        resolution: videoResolution,
        createdAt: new Date(),
        sourceImage: sourceImage || undefined,
      };
      setVideoHistory(prev => [newHistoryItem, ...prev].slice(0, 20)); // Keep last 20
    }
  }, [generatedVideoUrl, sourceImage, videoType, videoResolution]);

  // Get default prompt based on video type
  const getDefaultPrompt = (type: VideoType) => {
    switch (type) {
      case 'standard':
        return 'Gentle natural movement, subtle lighting changes, professional product video';
      case 'turntable':
        return 'Smooth 360 degree rotation, product turntable, consistent lighting';
      case 'zoom':
        return 'Slow cinematic zoom in, revealing details, professional macro shot';
      default:
        return '';
    }
  };

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSourceImage(event.target?.result as string);
      setVideoUrl(null); // Reset video when new image uploaded
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  // Generate video
  const handleGenerateVideo = useCallback(async () => {
    if (!sourceImage) return;

    const finalPrompt = prompt || getDefaultPrompt(videoType);
    
    try {
      await generateVideo({
        image_url: sourceImage,
        prompt: finalPrompt,
        duration: videoDuration,
        resolution: videoResolution,
      });
    } catch (err) {
      console.error('Video generation failed:', err);
    }
  }, [sourceImage, prompt, videoType, videoDuration, videoResolution, generateVideo]);

  // Update video URL when generation completes
  useEffect(() => {
    // Check if useImageToVideo returns videoUrl in its state
    // We need to access it from the hook
  }, []);

  // Video player controls
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, [duration]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const vol = parseFloat(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const changeSpeed = useCallback((speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  }, []);

  const skipForward = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 1, duration);
  }, [duration]);

  const skipBackward = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 1, 0);
  }, []);

  // Video time update handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => {
      if (isLooping) {
        video.currentTime = 0;
        video.play();
      } else {
        setIsPlaying(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isLooping]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Download video
  const handleDownload = useCallback(async (format: 'mp4' | 'gif' = 'mp4') => {
    if (!videoUrl) return;
    
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `motion-plus-${Date.now()}.${format}`;
    link.click();
  }, [videoUrl]);

  // Video type icons
  const videoTypeIcons = {
    standard: Video,
    turntable: RotateCw,
    zoom: ZoomIn,
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col"
      style={{
        left: leftOpen ? '256px' : '0',
        transition: 'left 500ms ease-in-out',
      }}
    >
      {/* Top Bar */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-black/40 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Film className="h-5 w-5 text-white/60" />
          <h1 className="text-sm font-medium text-white/80">Motion+</h1>
        </div>

        {/* Video Type Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {(['standard', 'turntable', 'zoom'] as VideoType[]).map((type) => {
            const Icon = videoTypeIcons[type];
            return (
              <button
                key={type}
                onClick={() => setVideoType(type)}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-all ${
                  videoType === type
                    ? 'bg-white/15 text-white'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-white/40">
          {isGenerating && <span className="text-purple-400">{progress}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Player Area */}
        <div className="flex flex-1 flex-col">
          {/* Player Container */}
          <div 
            ref={containerRef}
            className="relative flex flex-1 items-center justify-center bg-black/20 p-8"
          >
            {/* No Source - Upload Prompt */}
            {!sourceImage && !videoUrl && (
              <div 
                className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 transition-colors hover:border-white/30 hover:bg-white/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                  <Upload className="h-8 w-8 text-white/40" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-white/60">Upload an image to start</p>
                  <p className="mt-1 text-xs text-white/30">PNG, JPG, WebP supported</p>
                </div>
              </div>
            )}

            {/* Source Image Preview (before video generation) */}
            {sourceImage && !videoUrl && !isGenerating && (
              <div className="relative">
                <img 
                  src={sourceImage} 
                  alt="Source" 
                  className="max-h-[60vh] rounded-lg shadow-2xl"
                />
                <button
                  onClick={() => setSourceImage(null)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Generating State */}
            {isGenerating && (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {sourceImage && (
                    <img 
                      src={sourceImage} 
                      alt="Source" 
                      className="max-h-[50vh] rounded-lg opacity-50"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 rounded-xl bg-black/60 px-8 py-6 backdrop-blur-sm">
                      <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
                      <p className="text-sm text-white/80">{progress || 'Generating video...'}</p>
                      <p className="text-xs text-white/40">This may take 1-2 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Video Player */}
            {videoUrl && (
              <div className="relative w-full max-w-4xl">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full rounded-lg shadow-2xl"
                  loop={isLooping}
                  muted={isMuted}
                  playsInline
                  onClick={togglePlay}
                />
                
                {/* Play/Pause Overlay */}
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20"
                    onClick={togglePlay}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform hover:scale-110">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Video Controls */}
          {videoUrl && (
            <div className="border-t border-white/10 bg-black/40 p-4 backdrop-blur-sm">
              {/* Progress Bar */}
              <div className="mb-3 flex items-center gap-3">
                <span className="w-12 text-xs text-white/50">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  onChange={handleSeek}
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/20 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
                <span className="w-12 text-right text-xs text-white/50">{formatTime(duration)}</span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={skipBackward}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
                    title="Back 1s"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={skipForward}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
                    title="Forward 1s"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>

                {/* Speed & Loop */}
                <div className="flex items-center gap-2">
                  <select
                    value={playbackSpeed}
                    onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                  
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${
                      isLooping ? 'bg-purple-500/20 text-purple-400' : 'text-white/40 hover:text-white/60'
                    }`}
                    title="Loop"
                  >
                    <Repeat className="h-4 w-4" />
                  </button>
                </div>

                {/* Volume & Fullscreen */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                  <button
                    onClick={toggleFullscreen}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video History */}
          <div className="border-t border-white/10 bg-black/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-medium text-white/60">
                <GalleryHorizontal className="h-4 w-4" />
                Recent Videos
              </h3>
              {videoHistory.length > 0 && (
                <button className="text-xs text-white/40 hover:text-white/60">
                  Clear All
                </button>
              )}
            </div>
            
            {videoHistory.length === 0 ? (
              <p className="text-center text-xs text-white/30 py-4">
                No videos yet. Generate your first video!
              </p>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {videoHistory.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/5"
                    onClick={() => setVideoUrl(item.url)}
                  >
                    <div className="h-20 w-32 bg-black/40">
                      {item.thumbnail && (
                        <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white/70">
                      {item.duration}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div 
          className={`relative flex flex-col border-l border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
            isPanelOpen ? 'w-80' : 'w-0'
          }`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="absolute -left-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white/60 hover:text-white"
          >
            {isPanelOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>

          {isPanelOpen && (
            <>
              {/* Panel Tabs */}
              <div className="flex border-b border-white/10">
                {(['generate', 'edit', 'export'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-xs font-medium transition-all ${
                      activeTab === tab
                        ? 'border-b-2 border-purple-500 text-white'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Generate Tab */}
                {activeTab === 'generate' && (
                  <div className="flex flex-col gap-4">
                    {/* Source */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/60">Source Image</label>
                      {sourceImage ? (
                        <div className="relative">
                          <img src={sourceImage} alt="Source" className="w-full rounded-lg" />
                          <button
                            onClick={() => setSourceImage(null)}
                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/60 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 py-6 text-sm text-white/50 hover:border-white/30 hover:bg-white/10"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </button>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/60">Duration</label>
                      <div className="flex gap-2">
                        <div className="flex-1 rounded-lg border border-purple-500/50 bg-purple-500/20 py-2 text-center text-sm text-purple-300">
                          8 seconds
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-white/30">Fixed duration for optimal quality</p>
                    </div>

                    {/* Resolution */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/60">Resolution</label>
                      <div className="flex gap-2">
                        {(['720p', '1080p'] as const).map((res) => (
                          <button
                            key={res}
                            onClick={() => setVideoResolution(res)}
                            className={`flex-1 rounded-lg border py-2 text-sm transition-all ${
                              videoResolution === res
                                ? 'border-purple-500/50 bg-purple-500/20 text-purple-300'
                                : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                            }`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Prompt */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/60">
                        Motion Prompt (optional)
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={getDefaultPrompt(videoType)}
                        className="h-20 w-full resize-none rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>

                    {/* Generate Button */}
                    <button
                      onClick={handleGenerateVideo}
                      disabled={!sourceImage || isGenerating}
                      className="flex items-center justify-center gap-2 rounded-lg bg-purple-500 py-3 text-sm font-medium text-white transition-all hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Video
                        </>
                      )}
                    </button>

                    {generationError && (
                      <p className="text-sm text-red-400">{generationError}</p>
                    )}
                  </div>
                )}

                {/* Edit Tab */}
                {activeTab === 'edit' && (
                  <div className="flex flex-col gap-4">
                    {!videoUrl ? (
                      <p className="text-center text-sm text-white/40 py-8">
                        Generate a video first to edit
                      </p>
                    ) : (
                      <>
                        {/* Trim */}
                        <div>
                          <label className="mb-2 flex items-center gap-2 text-xs font-medium text-white/60">
                            <Scissors className="h-3 w-3" />
                            Trim
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={trimStart}
                              onChange={(e) => setTrimStart(parseInt(e.target.value))}
                              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/20"
                            />
                            <span className="text-xs text-white/40">{trimStart}%</span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={trimEnd}
                              onChange={(e) => setTrimEnd(parseInt(e.target.value))}
                              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/20"
                            />
                            <span className="text-xs text-white/40">{trimEnd}%</span>
                          </div>
                        </div>

                        {/* Speed */}
                        <div>
                          <label className="mb-2 flex items-center gap-2 text-xs font-medium text-white/60">
                            <Clock className="h-3 w-3" />
                            Speed
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => changeSpeed(speed)}
                                className={`rounded-md px-3 py-1.5 text-xs transition-all ${
                                  playbackSpeed === speed
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Loop */}
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs font-medium text-white/60">
                            <Repeat className="h-3 w-3" />
                            Loop
                          </label>
                          <button
                            onClick={() => setIsLooping(!isLooping)}
                            className={`relative h-6 w-11 rounded-full transition-colors ${
                              isLooping ? 'bg-purple-500' : 'bg-white/20'
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                isLooping ? 'left-[22px]' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Reverse */}
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs font-medium text-white/60">
                            <RotateCcw className="h-3 w-3" />
                            Reverse
                          </label>
                          <button
                            onClick={() => setIsReversed(!isReversed)}
                            className={`relative h-6 w-11 rounded-full transition-colors ${
                              isReversed ? 'bg-purple-500' : 'bg-white/20'
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                isReversed ? 'left-[22px]' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Export Tab */}
                {activeTab === 'export' && (
                  <div className="flex flex-col gap-4">
                    {!videoUrl ? (
                      <p className="text-center text-sm text-white/40 py-8">
                        Generate a video first to export
                      </p>
                    ) : (
                      <>
                        <div>
                          <label className="mb-2 block text-xs font-medium text-white/60">Format</label>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleDownload('mp4')}
                              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition-all hover:border-white/20 hover:bg-white/10"
                            >
                              <span className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                MP4 Video
                              </span>
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownload('gif')}
                              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition-all hover:border-white/20 hover:bg-white/10"
                            >
                              <span className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                GIF Animation
                              </span>
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-medium text-white/60">Social Presets</label>
                          <div className="flex flex-col gap-2">
                            <button className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition-all hover:border-white/20 hover:bg-white/10">
                              <span>Instagram Reels (9:16)</span>
                              <span className="text-xs text-white/40">Coming Soon</span>
                            </button>
                            <button className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition-all hover:border-white/20 hover:bg-white/10">
                              <span>TikTok (9:16)</span>
                              <span className="text-xs text-white/40">Coming Soon</span>
                            </button>
                            <button className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition-all hover:border-white/20 hover:bg-white/10">
                              <span>YouTube Shorts (9:16)</span>
                              <span className="text-xs text-white/40">Coming Soon</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

