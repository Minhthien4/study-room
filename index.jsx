import React, { useState, useEffect, useRef } from "react";
import {
  Library,
  Trash2,
  Flame,
  ArrowLeft,
  Lock,
  Link,
  Music,
  Settings,
  ExternalLink,
  Plus,
  X,
  Play,
  FileText,
  PlusCircle,
  AlertTriangle,
  Info,
  Youtube,
  Clock,
  MoreVertical,
  CheckCircle,
  Calendar,
  CalendarDays,
  CheckSquare,
  Target,
  Palette,
  Layout,
  List,
  PauseCircle,
  PlayCircle,
  StopCircle,
  XCircle,
  BarChart3,
  Unlock,
  Check,
  ChevronRight,
  FlaskConical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// --- Utility: Confetti Loader ---
const useConfetti = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const fire = () => {
    if (window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a78bfa", "#60a5fa", "#34d399"],
      });
    }
  };
  return fire;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- HELPER: DATE LOGIC ---
const getDateStr = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};

const getCurrentWeekDates = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const numDay = dayOfWeek === 0 ? 7 : dayOfWeek;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - numDay + 1);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDates.push({
      dateStr: getDateStr(d),
      dayId: i === 6 ? 0 : i + 1,
      label: i === 6 ? "CN" : `Thứ ${i + 2}`,
      shortLabel: i === 6 ? "CN" : `T${i + 2}`,
      dateObj: d,
    });
  }
  return weekDates;
};

// --- HELPER: SMART SCHEDULE LOGIC ---
const getSmartSchedule = (room) => {
  const weekDates = getCurrentWeekDates();
  const scheduledDayIds = room.schedule || [];
  const todayStr = getDateStr(new Date());

  const history = []; // Completed or Missed
  const queue = []; // Today (pending) or Future

  weekDates.forEach((d) => {
    if (scheduledDayIds.includes(d.dayId)) {
      const isDone = room.history && room.history.includes(d.dateStr);
      const isPast = d.dateStr < todayStr;
      const isToday = d.dateStr === todayStr;

      if (isDone) {
        history.push({ ...d, status: "done" });
      } else if (isPast) {
        history.push({ ...d, status: "missed" });
      } else {
        queue.push({ ...d, status: isToday ? "today" : "future" });
      }
    }
  });

  const totalScheduled = scheduledDayIds.length;
  const completedCount = history.filter((h) => h.status === "done").length;
  const percent =
    totalScheduled > 0
      ? Math.round((completedCount / totalScheduled) * 100)
      : 0;

  return { history, queue, percent, completedCount, totalScheduled };
};

const isPlanningDay = () => {
  return new Date().getDay() === 0;
};

// --- THEME SYSTEM ---
const THEMES = {
  indigo: {
    label: "Deep Focus",
    bg: "#0f172a",
    gradient: "from-indigo-900 to-slate-900",
    cardGradient: "from-indigo-500/20 to-blue-600/10",
    accent: "indigo",
    button:
      "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/30",
  },
  cyber: {
    label: "Cyberpunk",
    bg: "#090014",
    gradient: "from-fuchsia-900 via-purple-900 to-black",
    cardGradient: "from-fuchsia-500/20 to-purple-600/10",
    accent: "fuchsia",
    button:
      "bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-fuchsia-500/30",
  },
  ocean: {
    label: "Ocean",
    bg: "#021019",
    gradient: "from-cyan-900 to-blue-900",
    cardGradient: "from-cyan-500/20 to-blue-600/10",
    accent: "cyan",
    button: "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-500/30",
  },
  forest: {
    label: "Forest",
    bg: "#051208",
    gradient: "from-emerald-900 to-green-900",
    cardGradient: "from-emerald-500/20 to-green-600/10",
    accent: "emerald",
    button:
      "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30",
  },
  sunset: {
    label: "Sunset",
    bg: "#1a0b0b",
    gradient: "from-orange-900 to-red-900",
    cardGradient: "from-orange-500/20 to-red-600/10",
    accent: "orange",
    button: "bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/30",
  },
  minimal: {
    label: "Minimal",
    bg: "#171717",
    gradient: "from-neutral-800 to-neutral-900",
    cardGradient: "from-white/10 to-white/5",
    accent: "slate",
    button: "bg-gradient-to-br from-slate-600 to-slate-800 shadow-slate-500/30",
  },
};

// --- Branding Component with Demo Toggle ---
const Branding = ({ demoMode, setDemoMode }) => (
  <div className="absolute top-8 right-10 z-50 flex items-center gap-6 opacity-90 transition-opacity">
    {/* Demo Toggle */}
    <div
      className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 cursor-pointer hover:bg-black/60 transition-colors pointer-events-auto"
      onClick={() => setDemoMode(!demoMode)}
    >
      <FlaskConical
        size={14}
        className={demoMode ? "text-yellow-400" : "text-slate-500"}
      />
      <span
        className={`text-[10px] font-bold uppercase tracking-wider ${
          demoMode ? "text-yellow-400" : "text-slate-500"
        }`}
      >
        {demoMode ? "Demo: Unlocked Scheduling" : "Official Mode"}
      </span>
      {demoMode ? (
        <ToggleRight size={18} className="text-yellow-400" />
      ) : (
        <ToggleLeft size={18} className="text-slate-500" />
      )}
    </div>

    <div className="flex items-center gap-4 pointer-events-none">
      <div className="text-right hidden sm:block">
        <h3 className="text-white font-bold text-lg leading-none tracking-tight drop-shadow-md">
          Thiện
        </h3>
        <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold mt-1">
          Workspace
        </p>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-lg shadow-indigo-500/20">
        <div className="w-full h-full rounded-xl bg-slate-900/90 backdrop-blur flex items-center justify-center">
          <span className="text-white font-bold text-xl">T</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Helper: RGB Ring Title Component ---
const RGBRingTitle = ({ text, size = "large" }) => (
  <div className="relative inline-block max-w-full">
    <div
      className="absolute inset-0 rounded-2xl pointer-events-none z-0"
      style={{
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        padding: "3px",
      }}
    >
      <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#ff0000,#ffa500,#ffff00,#008000,#0000ff,#4b0082,#ee82ee,#ff0000)] animate-[spin_3s_linear_infinite]" />
    </div>

    <div
      className={`relative z-10 flex items-center justify-center ${
        size === "large" ? "px-8 py-5" : "px-5 py-3"
      } rounded-2xl bg-black/10 backdrop-blur-[2px] border border-white/5`}
    >
      <h2
        className={`${
          size === "large" ? "text-3xl md:text-4xl" : "text-xl"
        } font-black text-white tracking-tight truncate drop-shadow-2xl`}
      >
        {text}
      </h2>
    </div>
  </div>
);

// --- Helper: Smart Schedule Display Component ---
const SmartScheduleDisplay = ({
  history,
  queue,
  percent,
  total,
  completed,
}) => (
  <div className="w-full mt-6 flex-1 flex flex-col">
    {/* Progress Bar Header */}
    <div className="mb-4">
      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
        <span>Tiến độ tuần</span>
        <span className={percent === 100 ? "text-green-400" : ""}>
          {completed}/{total}
        </span>
      </div>
      <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            percent === 100
              ? "bg-green-400"
              : "bg-gradient-to-r from-indigo-500 to-purple-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>

    {/* Split Columns */}
    <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
      {/* Col 1: History (Result) */}
      <div className="bg-black/20 rounded-xl p-2.5 border border-white/5 flex flex-col overflow-hidden">
        <h4 className="text-[9px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1 shrink-0">
          <BarChart3 size={10} /> Kết quả
        </h4>
        <div className="space-y-1.5 overflow-y-auto custom-scrollbar pr-1 flex-1">
          {history.length === 0 && (
            <p className="text-[9px] text-slate-700 italic text-center mt-2">
              Chưa có...
            </p>
          )}
          {history.map((day, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between text-[10px] px-2 py-1.5 rounded-lg border ${
                day.status === "done"
                  ? "bg-green-500/10 border-green-500/10 text-green-300"
                  : "bg-red-500/10 border-red-500/10 text-red-300"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold">{day.shortLabel}</span>
                {day.status === "done" ? (
                  <CheckCircle size={10} />
                ) : (
                  <XCircle size={10} />
                )}
              </div>
              <span className="opacity-60 font-mono">
                {day.status === "done" ? "OK" : "MISSED"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Col 2: Queue (Plan) */}
      <div className="bg-black/20 rounded-xl p-2.5 border border-white/5 flex flex-col overflow-hidden">
        <h4 className="text-[9px] font-bold text-indigo-400 uppercase mb-2 flex items-center gap-1 shrink-0">
          <List size={10} /> Kế hoạch
        </h4>
        <div className="space-y-1.5 overflow-y-auto custom-scrollbar pr-1 flex-1">
          {queue.length === 0 && (
            <p className="text-[9px] text-slate-700 italic text-center mt-2">
              Hết lịch!
            </p>
          )}
          {queue.map((day, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between text-[10px] px-2 py-1.5 rounded-lg border ${
                day.status === "today"
                  ? "bg-indigo-500/20 border-indigo-500/30 text-white animate-pulse"
                  : "bg-white/5 border-white/5 text-slate-500"
              }`}
            >
              <span className="font-bold">{day.shortLabel}</span>
              {day.status === "today" ? (
                <span className="text-[8px] bg-indigo-500 px-1 rounded text-white font-bold">
                  HÔM NAY
                </span>
              ) : (
                <span className="opacity-30 flex items-center">
                  <ChevronRight size={8} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- Modal Component ---
const Modal = ({
  isOpen,
  title,
  message,
  type,
  content,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-[#1e1e24] border border-white/10 w-full max-w-sm rounded-[32px] p-8 shadow-2xl transform transition-all scale-100">
        <div className="flex items-center gap-4 mb-6">
          {type === "confirm" ? (
            <div className="w-12 h-12 flex items-center justify-center bg-red-500/20 text-red-400 rounded-2xl">
              <AlertTriangle size={24} />
            </div>
          ) : type === "schedule" ? (
            <div className="w-12 h-12 flex items-center justify-center bg-purple-500/20 text-purple-400 rounded-2xl">
              <CalendarDays size={24} />
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 text-blue-400 rounded-2xl">
              <Info size={24} />
            </div>
          )}
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>

        {content ? (
          <div className="mb-8">{content}</div>
        ) : (
          <p className="text-slate-300 mb-8 leading-relaxed text-base">
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 text-slate-400 hover:text-white transition-colors font-medium text-sm rounded-xl hover:bg-white/5"
            >
              Hủy bỏ
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-8 py-3 rounded-2xl text-white font-bold shadow-lg transition-transform hover:scale-105 text-sm ${
              type === "confirm"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {type === "confirm" ? "Xác nhận" : "Lưu lại"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Schedule & Task Logic ---
const DAYS = [
  { id: 1, label: "T2" },
  { id: 2, label: "T3" },
  { id: 3, label: "T4" },
  { id: 4, label: "T5" },
  { id: 5, label: "T6" },
  { id: 6, label: "T7" },
  { id: 0, label: "CN" },
];

// --- Sub-components ---

const Dashboard = ({ rooms, onCreate, onDelete, onEnter, demoMode }) => {
  const [newRoomName, setNewRoomName] = useState("");
  const today = new Date().getDay();
  const todayStr = getDateStr(new Date());

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    onCreate(newRoomName);
    setNewRoomName("");
  };

  return (
    <div className="max-w-7xl mx-auto p-8 animate-[fadeIn_0.5s_ease-out] relative">
      <header className="mb-12 pt-24">
        <h1 className="text-6xl font-bold mb-4 text-white tracking-tighter">
          Hello,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Thiện
          </span>
        </h1>
        <p className="text-slate-400 text-xl font-light">
          {demoMode ? (
            <span className="text-yellow-400 font-bold flex items-center gap-2">
              <FlaskConical size={18} /> Chế độ Demo: Đã mở khóa xếp lịch!
            </span>
          ) : (
            "Quản lý kỷ luật và tiến độ tuần của bạn."
          )}
        </p>
      </header>

      {/* Main Grid Layout for Tidy Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Card - Designed to match Room Cards */}
        <div className="bg-white/5 border border-white/5 rounded-[32px] p-6 flex flex-col justify-center items-center text-center hover:bg-white/10 transition-all group h-[380px] border-dashed relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30 relative z-10">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">
            Môn học mới
          </h3>
          <p className="text-slate-400 text-xs font-medium mb-8 max-w-[200px] relative z-10">
            Thêm không gian tập trung để bắt đầu chuỗi kỷ luật mới
          </p>
          <form
            onSubmit={handleCreate}
            className="w-full max-w-[240px] relative z-10"
          >
            <input
              type="text"
              placeholder="Nhập tên môn..."
              className="w-full bg-black/30 border-none rounded-2xl p-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 rounded-xl text-white hover:bg-indigo-400 transition-colors shadow-lg"
            >
              <PlusCircle size={18} />
            </button>
          </form>
        </div>

        {/* Room Cards */}
        {rooms.map((room) => {
          const historyList = room.history || [];
          const isDoneToday = historyList.includes(todayStr);
          const todayDayId = new Date().getDay();
          const isScheduledToday =
            room.schedule && room.schedule.includes(todayDayId);
          const isTodayActive = isScheduledToday && !isDoneToday;
          const theme = THEMES[room.theme || "indigo"];

          // Use smart schedule logic
          const { history, queue, percent, completedCount, totalScheduled } =
            getSmartSchedule(room);

          return (
            <div
              key={room.id}
              onClick={() => onEnter(room.id)}
              className={`relative p-6 rounded-[32px] cursor-pointer transition-all duration-300 group overflow-hidden border border-white/5 hover:scale-[1.02] shadow-xl h-[380px] flex flex-col bg-gradient-to-br ${theme.cardGradient}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              {/* Active Today Glow */}
              {isTodayActive && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 shadow-[0_0_20px_rgba(129,140,248,0.5)]"></div>
              )}

              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {isTodayActive && (
                      <span className="text-[9px] font-black bg-white text-indigo-600 px-2 py-0.5 rounded-md animate-pulse">
                        HÔM NAY
                      </span>
                    )}
                    {isDoneToday && (
                      <span className="text-[9px] font-black bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md flex items-center gap-1 border border-green-500/20">
                        <Check size={10} /> DONE
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => onDelete(room.id, e)}
                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Title */}
                <div className="mb-2">
                  <RGBRingTitle text={room.name} size="medium" />
                </div>

                {/* SMART SCHEDULE & PROGRESS */}
                <SmartScheduleDisplay
                  history={history}
                  queue={queue}
                  percent={percent}
                  completed={completedCount}
                  total={totalScheduled}
                />

                {/* Footer Stats */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame
                      size={14}
                      className={
                        room.streak > 0
                          ? "text-orange-400 fill-orange-400"
                          : "text-slate-600"
                      }
                    />
                    <span
                      className={`text-sm font-bold ${
                        room.streak > 0 ? "text-white" : "text-slate-500"
                      }`}
                    >
                      {room.streak}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-white">
                    {theme.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ... MusicPlayer remains same ...
const MusicPlayer = ({
  playlist,
  onUpdatePlaylist,
  showModal,
  themeAccent,
}) => {
  const [url, setUrl] = useState("");

  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleAdd = () => {
    const id = getYouTubeId(url);
    if (id) {
      const thumb = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
      onUpdatePlaylist([
        ...playlist,
        {
          id: generateId(),
          videoId: id,
          thumbnail: thumb,
          title: `Track ${playlist.length + 1}`,
        },
      ]);
      setUrl("");
    } else {
      showModal("Lỗi Link", "Link YouTube không hợp lệ!", "alert");
    }
  };

  const removeTrack = (e, id) => {
    e.stopPropagation();
    onUpdatePlaylist(playlist.filter((p) => p.id !== id));
  };

  const openTrack = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 bg-white/5 p-4 rounded-2xl text-xs border border-white/5 focus:border-white/20 outline-none text-white placeholder-slate-500 transition-all font-medium"
          placeholder="Dán Link YouTube vào đây..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className={`bg-${themeAccent}-600 hover:bg-${themeAccent}-500 text-white p-4 rounded-2xl transition-colors shadow-lg`}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {playlist.map((track) => (
          <div
            key={track.id}
            onClick={() => openTrack(track.videoId)}
            className="group flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-black overflow-hidden relative shrink-0 shadow-md">
              <img
                src={track.thumbnail}
                alt="thumb"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <Play size={10} className="fill-white text-white ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">
                YouTube Track
              </p>
              <p className="text-slate-500 text-[10px] truncate font-mono mt-0.5">
                {track.videoId}
              </p>
            </div>
            <button
              onClick={(e) => removeTrack(e, track.id)}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 bg-white/5 rounded-lg"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {playlist.length === 0 && (
          <div className="text-center text-slate-500 text-xs py-10 opacity-50">
            Chưa có bài nhạc nào
          </div>
        )}
      </div>
    </div>
  );
};

const TaskList = ({
  tasks,
  onUpdateTasks,
  dailyGoal,
  onUpdateGoal,
  themeAccent,
  onManualComplete,
  isDoneToday,
}) => {
  const [newTask, setNewTask] = useState("");

  const addTask = (e) => {
    if (e.key === "Enter" && newTask.trim()) {
      onUpdateTasks([
        ...tasks,
        { id: generateId(), text: newTask, completed: false },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (taskId) => {
    onUpdateTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (taskId) => {
    onUpdateTasks(tasks.filter((t) => t.id !== taskId));
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <div
        className={`bg-gradient-to-r from-${themeAccent}-500/10 to-transparent border border-${themeAccent}-500/20 p-6 rounded-[24px]`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className={`flex items-center gap-2 text-${themeAccent}-400`}>
            <Target size={18} />
            <span className="text-xs font-black uppercase tracking-widest">
              Mục tiêu duy nhất
            </span>
          </div>

          <button
            onClick={onManualComplete}
            disabled={isDoneToday}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              isDoneToday
                ? "bg-green-500/20 text-green-400 cursor-default"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            {isDoneToday ? (
              <>
                <CheckCircle size={12} /> ĐÃ CHECK-IN
              </>
            ) : (
              "MARK DONE"
            )}
          </button>
        </div>
        <input
          className="w-full bg-transparent border-none text-white font-bold placeholder-white/20 focus:outline-none text-2xl"
          placeholder="Hôm nay phải làm gì..."
          value={dailyGoal || ""}
          onChange={(e) => onUpdateGoal(e.target.value)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">
            Checklist
          </h3>
          <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-md text-slate-300">
            {tasks.filter((t) => t.completed).length}/{tasks.length}
          </span>
        </div>

        <div className="relative mb-4">
          <input
            className="w-full bg-white/5 p-4 rounded-2xl text-sm text-white border border-white/5 focus:border-white/20 outline-none placeholder-slate-500 font-medium"
            placeholder="Thêm đầu việc nhỏ..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={addTask}
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 rounded-lg text-slate-400 hover:text-white"
            onClick={() => addTask({ key: "Enter" })}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                task.completed
                  ? "bg-green-500/5 border-green-500/10 opacity-50"
                  : "bg-white/5 border-white/5 hover:bg-white/10"
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                  task.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-slate-600 hover:border-white bg-transparent"
                }`}
              >
                {task.completed && (
                  <CheckCircle
                    size={14}
                    className="fill-white text-green-500"
                  />
                )}
              </button>
              <span
                className={`flex-1 text-sm font-medium ${
                  task.completed
                    ? "line-through text-slate-500"
                    : "text-slate-200"
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 p-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-xs text-slate-600 text-center py-4 italic">
              Chưa có checklist nào.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ScheduleSetter = ({
  schedule,
  onUpdateSchedule,
  themeAccent,
  demoMode,
}) => {
  const isUnlocked = demoMode || isPlanningDay();

  const toggleDay = (id) => {
    if (!isUnlocked) return;
    if (schedule.includes(id)) {
      onUpdateSchedule(schedule.filter((d) => d !== id));
    } else {
      onUpdateSchedule([...schedule, id]);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider">
          Lịch học cố định
        </h3>
        {!isUnlocked && (
          <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
            <Lock size={10} /> ĐÃ KHÓA (MỞ VÀO CN)
          </span>
        )}
        {isUnlocked && (
          <span
            className={`text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded ${
              demoMode
                ? "text-yellow-400 bg-yellow-400/10"
                : "text-green-400 bg-green-500/10"
            }`}
          >
            {demoMode ? (
              <>
                <FlaskConical size={10} /> DEMO UNLOCKED
              </>
            ) : (
              <>
                <Unlock size={10} /> ĐANG MỞ (CHỦ NHẬT)
              </>
            )}
          </span>
        )}
      </div>

      <div
        className={`flex justify-between gap-2 bg-black/20 p-2 rounded-2xl ${
          !isUnlocked ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {DAYS.map((day) => {
          const isSelected = schedule.includes(day.id);
          return (
            <button
              key={day.id}
              onClick={() => toggleDay(day.id)}
              disabled={!isUnlocked}
              className={`flex-1 h-12 rounded-xl text-[10px] font-black transition-all flex flex-col items-center justify-center gap-1 ${
                isSelected
                  ? `bg-${themeAccent}-500 text-white shadow-lg`
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              {day.label}
            </button>
          );
        })}
      </div>
      {!isUnlocked && (
        <p className="text-[10px] text-slate-500 mt-2 text-center italic">
          Bạn chỉ có thể thay đổi lịch vào Chủ Nhật hàng tuần để rèn kỷ luật.
        </p>
      )}
    </div>
  );
};

// --- Room View ---

const RoomView = ({
  room,
  onUpdate,
  onExit,
  showModal,
  fireConfetti,
  demoMode,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [setupTime, setSetupTime] = useState(25);
  const [activeTab, setActiveTab] = useState("plan");
  const textareaRef = useRef(null);

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkName, setNewLinkName] = useState("");

  const themeKey = room.theme || "indigo";
  const currentTheme = THEMES[themeKey] || THEMES.indigo;

  const today = new Date().getDay();
  const todayStr = getDateStr(new Date());
  const history = room.history || [];
  const isDoneToday = history.includes(todayStr);
  const isScheduledToday = room.schedule && room.schedule.includes(today);
  const {
    history: schedHistory,
    queue,
    percent,
    completedCount,
    totalScheduled,
  } = getSmartSchedule(room);

  // Focus Button Logic: Official behavior. Demo mode ONLY unlocks schedule editing, NOT focus check.
  const canStartFocus = isScheduledToday;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [room.notes]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newVal = prev - 1;
          localStorage.setItem(
            "active_session",
            JSON.stringify({
              roomId: room.id,
              isRunning: true,
              timeLeft: newVal,
            })
          );
          return newVal;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsPaused(false);
      clearInterval(interval);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft]);

  const startTimer = () => {
    const seconds = setupTime * 60;
    setTimeLeft(seconds);
    setIsRunning(true);
    setIsPaused(false);
    localStorage.setItem(
      "active_session",
      JSON.stringify({ roomId: room.id, isRunning: true, timeLeft: seconds })
    );
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const completeSession = () => {
    if (!history.includes(todayStr)) {
      onUpdate({
        streak: room.streak + 1,
        history: [...history, todayStr],
      });
    }
  };

  const handleSessionComplete = () => {
    fireConfetti();
    completeSession();
    localStorage.removeItem("active_session");

    let msg = `Bạn đã hoàn thành phiên học. Chuỗi: ${room.streak + 1} 🔥`;
    if (room.dailyGoal) {
      msg += `\nĐừng quên đánh dấu hoàn thành mục tiêu: "${room.dailyGoal}"`;
    }
    showModal("Tuyệt vời!", msg, "alert");
  };

  const handleManualComplete = async () => {
    if (
      await showModal(
        "Xác nhận",
        "Đánh dấu đã học xong hôm nay (không cần chạy timer)?",
        "confirm"
      )
    ) {
      fireConfetti();
      completeSession();
    }
  };

  const handleExit = async () => {
    if (isRunning) {
      if (
        await showModal(
          "Đang tập trung!",
          "Thoát bây giờ sẽ mất chuỗi. Chắc chắn thoát?",
          "confirm"
        )
      ) {
        localStorage.removeItem("active_session");
        onExit();
      }
    } else {
      onExit();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const addLink = () => {
    if (!newLinkUrl) return;
    const updatedLinks = [
      ...room.links,
      {
        id: generateId(),
        url: newLinkUrl.startsWith("http")
          ? newLinkUrl
          : `https://${newLinkUrl}`,
        name: newLinkName || newLinkUrl,
      },
    ];
    onUpdate({ links: updatedLinks });
    setNewLinkUrl("");
    setNewLinkName("");
    setShowLinkInput(false);
  };
  const removeLink = (id) =>
    onUpdate({ links: room.links.filter((l) => l.id !== id) });

  return (
    <div className="h-screen text-slate-200 overflow-hidden flex relative font-sans transition-all duration-700 bg-black">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-80 duration-1000 transition-all`}
      ></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

      <Branding demoMode={demoMode} setDemoMode={() => {}} />

      {/* LEFT SIDEBAR */}
      <aside
        className={`w-[360px] bg-black/20 backdrop-blur-2xl border-r border-white/5 flex flex-col z-20 shadow-2xl relative transition-opacity duration-300 ${
          isRunning && !isPaused
            ? "pointer-events-none opacity-50 grayscale"
            : ""
        }`}
      >
        <div className="p-8 pb-4">
          <button
            onClick={handleExit}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold mb-8 uppercase tracking-wider pointer-events-auto"
          >
            <div className="p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <ArrowLeft size={14} />
            </div>{" "}
            Dashboard
          </button>

          {canStartFocus && !isDoneToday && (
            <div className="mb-3 text-[10px] font-black text-green-400 flex items-center gap-1.5 animate-pulse uppercase tracking-widest bg-green-500/10 w-fit px-2 py-1 rounded">
              <Calendar size={10} /> Hôm nay có lịch
            </div>
          )}
          {isDoneToday && (
            <div className="mb-3 text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest bg-white/5 w-fit px-2 py-1 rounded">
              <CheckCircle size={10} /> Đã hoàn thành
            </div>
          )}

          <div className="mb-4">
            <RGBRingTitle text={room.name} size="large" />
          </div>

          {/* Smart Schedule Inside Room */}
          <SmartScheduleDisplay
            history={schedHistory}
            queue={queue}
            percent={percent}
            completed={completedCount}
            total={totalScheduled}
          />

          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mt-6">
            <Flame
              size={16}
              className={
                room.streak > 0 ? "text-orange-500 fill-orange-500" : ""
              }
            />
            <span>Streak: {room.streak}</span>
          </div>
        </div>

        {/* TIMER CARD */}
        <div
          className={`px-8 py-4 ${
            isRunning ? "pointer-events-auto opacity-100 grayscale-0" : ""
          }`}
        >
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-center relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <div className="text-6xl font-mono font-bold text-white mb-4 tracking-tighter tabular-nums drop-shadow-2xl">
                {isRunning ? (
                  formatTime(timeLeft)
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <input
                      type="number"
                      value={setupTime}
                      onChange={(e) => setSetupTime(Number(e.target.value))}
                      className="w-24 bg-transparent text-center focus:border-b-2 focus:border-white outline-none"
                    />
                    <span className="text-base font-sans text-slate-400 font-normal mt-4">
                      m
                    </span>
                  </div>
                )}
              </div>

              {!isRunning ? (
                canStartFocus && !isDoneToday ? (
                  <button
                    onClick={startTimer}
                    className={`w-full py-4 rounded-2xl font-bold text-base text-white ${currentTheme.button} transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95`}
                  >
                    START FOCUS
                  </button>
                ) : (
                  <div className="w-full py-4 bg-white/5 text-slate-500 rounded-2xl font-bold text-sm border border-white/5 flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock size={16} />{" "}
                    {isDoneToday ? "ĐÃ HOÀN THÀNH" : "CHƯA ĐẾN LỊCH"}
                  </div>
                )
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={pauseTimer}
                    className={`flex-1 py-3 rounded-2xl font-bold text-sm border border-white/10 flex items-center justify-center gap-2 transition-colors ${
                      isPaused
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {isPaused ? (
                      <PlayCircle size={18} />
                    ) : (
                      <PauseCircle size={18} />
                    )}
                    {isPaused ? "RESUME" : "PAUSE"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex px-8 gap-1 mb-6">
          {[
            { id: "plan", icon: List, label: "Plan" },
            { id: "links", icon: Link, label: "Links" },
            { id: "music", icon: Music, label: "Music" },
            { id: "settings", icon: Settings, label: "Style" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${
                activeTab === tab.id
                  ? `bg-white text-black shadow-lg shadow-white/10`
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon size={20} />
            </button>
          ))}
        </div>

        {/* SIDEBAR CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          {activeTab === "plan" && (
            <div>
              <ScheduleSetter
                schedule={room.schedule || []}
                onUpdateSchedule={(s) => onUpdate({ schedule: s })}
                themeAccent={currentTheme.accent}
                demoMode={demoMode}
              />
              <div className="w-full h-px bg-white/10 my-6"></div>
              <TaskList
                tasks={room.tasks || []}
                onUpdateTasks={(t) => onUpdate({ tasks: t })}
                dailyGoal={room.dailyGoal}
                onUpdateGoal={(g) => onUpdate({ dailyGoal: g })}
                themeAccent={currentTheme.accent}
                onManualComplete={handleManualComplete}
                isDoneToday={isDoneToday}
              />
            </div>
          )}
          {activeTab === "links" && (
            <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                  Tài liệu
                </h3>
                <button
                  onClick={() => setShowLinkInput(!showLinkInput)}
                  className={`text-${currentTheme.accent}-400 hover:text-white text-xs font-bold px-3 py-1 bg-white/5 rounded-lg transition-colors`}
                >
                  + Thêm
                </button>
              </div>
              {showLinkInput && (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3 mb-4">
                  <input
                    className="w-full bg-black/20 p-3 rounded-xl text-xs text-white outline-none border border-transparent focus:border-white/20"
                    placeholder="Tên..."
                    value={newLinkName}
                    onChange={(e) => setNewLinkName(e.target.value)}
                  />
                  <input
                    className="w-full bg-black/20 p-3 rounded-xl text-xs text-white outline-none border border-transparent focus:border-white/20"
                    placeholder="https://..."
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                  <button
                    onClick={addLink}
                    className={`w-full ${currentTheme.button} py-2 rounded-xl text-xs font-bold text-white`}
                  >
                    Lưu Link
                  </button>
                </div>
              )}
              <div className="space-y-2">
                {room.links.length === 0 && (
                  <p className="text-slate-500 text-xs text-center py-4">
                    Chưa có tài liệu nào.
                  </p>
                )}
                {room.links.map((link) => (
                  <div
                    key={link.id}
                    className="group bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 flex items-center justify-between transition-all hover:translate-x-1"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 truncate flex-1"
                    >
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                        <ExternalLink size={14} />
                      </div>
                      <span className="text-sm text-slate-300 font-bold truncate group-hover:text-white transition-colors">
                        {link.name}
                      </span>
                    </a>
                    <button
                      onClick={() => removeLink(link.id)}
                      className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 bg-black/20 p-2 rounded-lg transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "music" && (
            <div className="animate-[fadeIn_0.3s_ease-out] h-full">
              <MusicPlayer
                playlist={room.playlist || []}
                onUpdatePlaylist={(list) => onUpdate({ playlist: list })}
                showModal={showModal}
                themeAccent={currentTheme.accent}
              />
            </div>
          )}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-4 px-1">
                  Giao diện (Theme)
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => onUpdate({ theme: key })}
                      className={`relative overflow-hidden p-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between group ${
                        room.theme === key
                          ? "border-white bg-white/10 text-white"
                          : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-20 group-hover:opacity-40 transition-opacity`}
                      ></div>
                      <div className="flex items-center gap-3 relative z-10">
                        <div
                          className="w-4 h-4 rounded-full shadow-lg"
                          style={{ backgroundColor: theme.bg }}
                        ></div>
                        {theme.label}
                      </div>
                      {room.theme === key && (
                        <CheckCircle
                          size={16}
                          className="text-white relative z-10"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-4 px-1">
                  Màu chữ Note
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    "#e2e8f0",
                    "#94a3b8",
                    "#ffffff",
                    "#86efac",
                    "#fde047",
                    "#fca5a5",
                    "#d8b4fe",
                    "#93c5fd",
                    "#fdba74",
                    "#000000",
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdate({ noteTextColor: c })}
                      className={`aspect-square rounded-xl border-2 transition-all flex items-center justify-center ${
                        room.noteTextColor === c
                          ? "border-white scale-110 shadow-lg shadow-white/20"
                          : "border-transparent bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: c }}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative shadow-[inset_20px_0_50px_rgba(0,0,0,0.3)]">
        <div className="flex-1 p-12 md:p-16 flex flex-col h-full max-w-6xl mx-auto w-full animate-[fadeIn_0.5s_ease-out] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-8 opacity-40 hover:opacity-100 transition-opacity sticky top-0">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileText size={18} className="text-white" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-white">
              Focus Note
            </span>
          </div>

          <div className="flex-1 relative group min-h-[300px]">
            <textarea
              ref={textareaRef}
              value={room.notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder={`Viết gì đó cho mục tiêu: ${
                room.dailyGoal || "..."
              }`}
              className="w-full h-full resize-none bg-transparent text-xl md:text-2xl leading-relaxed focus:outline-none overflow-hidden transition-colors duration-500 placeholder-white/20 font-medium selection:bg-white/30"
              style={{
                color: room.noteTextColor || "#e2e8f0",
                fontFamily: '"Outfit", sans-serif',
                textShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            ></textarea>
          </div>
        </div>

        <div className="absolute bottom-6 right-8 text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>{" "}
          Auto-Saving
        </div>
      </main>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const fireConfetti = useConfetti();

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    content: null,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showModal = (title, message, type = "alert", onConfirm = () => {}) => {
    return new Promise((resolve) => {
      setModalConfig({
        isOpen: true,
        title,
        message,
        type,
        content: null,
        onConfirm: () => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          onConfirm();
          resolve(true);
        },
        onCancel: () => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  };

  useEffect(() => {
    const savedRooms = localStorage.getItem("focus_rooms");
    let parsedRooms = [];
    if (savedRooms) parsedRooms = JSON.parse(savedRooms);
    const activeSession = JSON.parse(localStorage.getItem("active_session"));
    if (activeSession && activeSession.isRunning) {
      const roomIndex = parsedRooms.findIndex(
        (r) => r.id === activeSession.roomId
      );
      if (roomIndex !== -1) {
        parsedRooms[roomIndex].streak = 0;
        setTimeout(
          () =>
            showModal(
              "Mất chuỗi!",
              `Bạn đã rời đi khi chưa hết giờ tại phòng "${parsedRooms[roomIndex].name}".`,
              "alert"
            ),
          500
        );
      }
      localStorage.removeItem("active_session");
    }
    setRooms(parsedRooms);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("focus_rooms", JSON.stringify(rooms));
  }, [rooms, isLoaded]);

  const createRoom = (name) => {
    setRooms([
      ...rooms,
      {
        id: generateId(),
        name,
        streak: 0,
        theme: "indigo",
        links: [],
        notes: "",
        noteTextColor: "#e2e8f0",
        playlist: [],
        schedule: [],
        tasks: [],
        dailyGoal: "",
        history: [],
      },
    ]);
  };

  const deleteRoom = async (id, e) => {
    e.stopPropagation();
    if (await showModal("Xóa phòng?", "Dữ liệu sẽ mất vĩnh viễn.", "confirm")) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  const updateRoomData = (roomId, newData) => {
    setRooms(rooms.map((r) => (r.id === roomId ? { ...r, ...newData } : r)));
  };

  if (!isLoaded)
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Loading Thiện's Space...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      <Modal {...modalConfig} />
      {currentRoomId ? (
        <RoomView
          room={rooms.find((r) => r.id === currentRoomId)}
          onUpdate={(data) => updateRoomData(currentRoomId, data)}
          onExit={() => setCurrentRoomId(null)}
          showModal={showModal}
          fireConfetti={fireConfetti}
          demoMode={demoMode}
        />
      ) : (
        <Dashboard
          rooms={rooms}
          onCreate={createRoom}
          onDelete={deleteRoom}
          onEnter={setCurrentRoomId}
          demoMode={demoMode}
        />
      )}
      {/* Branding with Toggle is rendered in child components, but we can also pass props if needed */}
      <Branding demoMode={demoMode} setDemoMode={setDemoMode} />
    </div>
  );
}
