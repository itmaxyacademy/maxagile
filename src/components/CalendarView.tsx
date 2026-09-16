import { useState, useEffect, type FormEvent } from 'react';
import { WorkItem, Workspace, Status } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ListTodo, 
  Filter, 
  CheckCircle, 
  ExternalLink, 
  X, 
  Plus, 
  Trash2, 
  FolderKanban, 
  Tag, 
  AlertCircle 
} from 'lucide-react';

type ViewMode = 'bulanan' | 'mingguan' | 'harian';

interface CalendarViewProps {
  workspaces?: Workspace[];
  onNavigateToTask?: (workspaceId: string, taskId: string) => void;
  onNavigateToWorkspace?: (workspaceId: string) => void;
}

export function CalendarView({ workspaces = [], onNavigateToTask, onNavigateToWorkspace }: CalendarViewProps) {
  const [tasks, setTasks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('bulanan');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filters
  const [filterWorkspace, setFilterWorkspace] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilter, setShowFilter] = useState(false);

  // Selected task modal for editing/viewing
  const [selectedTask, setSelectedTask] = useState<WorkItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState("Sedang");
  const [editDueDate, setEditDueDate] = useState("");
  const [editStatusId, setEditStatusId] = useState("");
  const [workspaceStatuses, setWorkspaceStatuses] = useState<Status[]>([]);
  const [savingTask, setSavingTask] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/tasks`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // When selected task changes, fetch workspace statuses to allow changing status
  useEffect(() => {
    if (selectedTask) {
      setEditTitle(selectedTask.title);
      setEditDesc(selectedTask.description || "");
      setEditPriority(selectedTask.priority || "Sedang");
      setEditDueDate(selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : "");
      setEditStatusId(selectedTask.statusId || "");

      fetch(`${import.meta.env.BASE_URL}api/workspaces/${selectedTask.workspaceId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.statuses) {
            setWorkspaceStatuses(data.statuses);
          }
        })
        .catch(console.error);
    }
  }, [selectedTask]);

  // Handle saving task from modal
  const handleSaveTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !editTitle.trim()) return;

    setSavingTask(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/work-items/${selectedTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDesc.trim(),
          priority: editPriority,
          statusId: editStatusId || null,
          dueDate: editDueDate ? new Date(editDueDate).toISOString() : null
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
        setSelectedTask(null);
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingTask(false);
    }
  };

  // Fast schedule for unscheduled task
  const handleQuickSetDueDate = async (task: WorkItem, newDate: string) => {
    if (!newDate) return;
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/work-items/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dueDate: new Date(newDate).toISOString()
        })
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      try {
        await fetch(`${import.meta.env.BASE_URL}api/work-items/${taskId}`, { method: 'DELETE' });
        setSelectedTask(null);
        fetchTasks();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Navigation handlers
  const handlePrev = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const d = currentDate.getDate();
    if (viewMode === 'bulanan') {
      setCurrentDate(new Date(y, m - 1, 1));
    } else if (viewMode === 'mingguan') {
      setCurrentDate(new Date(y, m, d - 7));
    } else {
      setCurrentDate(new Date(y, m, d - 1));
    }
  };

  const handleNext = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const d = currentDate.getDate();
    if (viewMode === 'bulanan') {
      setCurrentDate(new Date(y, m + 1, 1));
    } else if (viewMode === 'mingguan') {
      setCurrentDate(new Date(y, m, d + 7));
    } else {
      setCurrentDate(new Date(y, m, d + 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filtering
  const filteredTasks = tasks.filter(task => {
    if (filterWorkspace !== 'all' && task.workspaceId !== filterWorkspace) return false;
    
    if (filterPriority !== 'all') {
      const p = (task.priority || '').toLowerCase();
      if (filterPriority === 'high' && !(p === 'tinggi' || p === 'mendesak' || p === 'high')) return false;
      if (filterPriority === 'medium' && !(p === 'sedang' || p === 'medium')) return false;
      if (filterPriority === 'low' && !(p === 'rendah' || p === 'low')) return false;
    }

    if (filterStatus !== 'all') {
      const sName = (task.status?.name || '').toLowerCase();
      const isDone = sName.includes('selesai') || sName.includes('done') || sName.includes('deal') || sName.includes('terjual');
      if (filterStatus === 'completed' && !isDone) return false;
      if (filterStatus === 'incomplete' && isDone) return false;
    }

    return true;
  });

  const scheduledTasks = filteredTasks.filter(t => t.dueDate);
  const unscheduledTasks = filteredTasks.filter(t => !t.dueDate);

  // Month and Day Titles
  const currentMonthLabel = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  const currentDayLabel = currentDate.toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const todayStr = new Date().toISOString().split('T')[0];

  // Priority color helper
  const getPriorityBadge = (priority: string) => {
    const p = (priority || '').toLowerCase();
    if (p === 'tinggi' || p === 'mendesak' || p === 'high') {
      return 'bg-red-100 text-red-600 border border-red-200';
    }
    if (p === 'sedang' || p === 'medium') {
      return 'bg-orange-100 text-orange-600 border border-orange-200';
    }
    return 'bg-blue-100 text-blue-600 border border-blue-200';
  };

  // Generate Week Days for weekly view
  const getWeekDates = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(date.setDate(diff));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="text-brand-orange font-bold">Memuat data kalender & tugas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-brand-bg">
      {/* Header Bar */}
      <div className="bg-white px-6 pt-6 pb-4 shrink-0 relative overflow-hidden border-b border-gray-100 shadow-2xs">
        <div className="absolute right-0 top-0 w-80 h-80 bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full">
                Jadwal & Batas Waktu
              </span>
              <span className="text-xs text-gray-400 font-bold">•</span>
              <span className="text-xs text-gray-500 font-bold">
                {scheduledTasks.length} Terjadwal, {unscheduledTasks.length} Belum Diatur
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">Kalender</h2>
            <p className="text-xs md:text-sm text-gray-500 max-w-2xl mt-0.5">
              Pantau dan atur tenggat waktu seluruh tugas dari semua ruang kerja dalam satu tampilan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-gray-200 shadow-2xs">
              <button 
                onClick={() => setViewMode('harian')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'harian' ? 'bg-white text-brand-text shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Harian
              </button>
              <button 
                onClick={() => setViewMode('mingguan')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'mingguan' ? 'bg-white text-brand-text shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Mingguan
              </button>
              <button 
                onClick={() => setViewMode('bulanan')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'bulanan' ? 'bg-white text-brand-text shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bulanan
              </button>
            </div>
            
            {/* Date Navigation */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handlePrev}
                className="p-2.5 bg-white border-2 border-gray-200 border-b-4 rounded-xl text-gray-600 hover:bg-gray-50 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer"
                title="Sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleToday}
                className="px-3.5 py-2 bg-white border-2 border-gray-200 border-b-4 rounded-xl font-extrabold text-xs text-brand-text hover:bg-gray-50 active:border-b-2 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CalendarIcon size={14} className="text-brand-orange" /> 
                <span>{viewMode === 'harian' ? currentDayLabel : currentMonthLabel}</span>
              </button>
              <button 
                onClick={handleNext}
                className="p-2.5 bg-white border-2 border-gray-200 border-b-4 rounded-xl text-gray-600 hover:bg-gray-50 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer"
                title="Berikutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Filter Toggle Button */}
            <div className="relative">
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-gray-200 border-b-4 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer relative"
              >
                <Filter size={15} />
                <span>Filter</span>
                {(filterWorkspace !== 'all' || filterPriority !== 'all' || filterStatus !== 'all') && (
                  <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                )}
              </button>

              {/* Filter Dropdown Popover */}
              {showFilter && (
                <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-extrabold text-brand-text">Filter Kalender</span>
                    <button 
                      onClick={() => {
                        setFilterWorkspace('all');
                        setFilterPriority('all');
                        setFilterStatus('all');
                      }}
                      className="text-[10px] font-bold text-brand-orange hover:underline cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>

                  {/* Filter Ruang Kerja */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Ruang Kerja (Proyek)
                    </label>
                    <select
                      value={filterWorkspace}
                      onChange={(e) => setFilterWorkspace(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-bold text-brand-text outline-none focus:ring-1 focus:ring-brand-orange"
                    >
                      <option value="all">Semua Ruang Kerja</option>
                      {workspaces.map(ws => (
                        <option key={ws.id} value={ws.id}>{ws.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Prioritas */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Prioritas
                    </label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-bold text-brand-text outline-none focus:ring-1 focus:ring-brand-orange"
                    >
                      <option value="all">Semua Prioritas</option>
                      <option value="high">Tinggi / Mendesak</option>
                      <option value="medium">Menengah</option>
                      <option value="low">Rendah</option>
                    </select>
                  </div>

                  {/* Filter Status */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Status Penyelesaian
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-bold text-brand-text outline-none focus:ring-1 focus:ring-brand-orange"
                    >
                      <option value="all">Semua Status</option>
                      <option value="incomplete">Belum Selesai</option>
                      <option value="completed">Sudah Selesai</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setShowFilter(false)}
                    className="w-full py-2 bg-brand-text text-white text-xs font-bold rounded-xl hover:bg-black transition-colors cursor-pointer"
                  >
                    Terapkan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Body */}
      <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* TAMPILAN BULANAN (MONTHLY GRID) */}
          {viewMode === 'bulanan' && (
            <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-gray-100 border-b-4 shadow-sm">
              {/* Hari Header */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => (
                  <div key={idx} className="py-1.5">{day}</div>
                ))}
              </div>

              {/* Grid Tanggal */}
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const year = currentDate.getFullYear();
                  const month = currentDate.getMonth();
                  const firstDay = new Date(year, month, 1);
                  const lastDay = new Date(year, month + 1, 0);
                  const daysInMonth = lastDay.getDate();
                  
                  let startDayOfWeek = firstDay.getDay() - 1;
                  if (startDayOfWeek === -1) startDayOfWeek = 6;
                  
                  const cells = [];
                  const prevMonthLastDay = new Date(year, month, 0).getDate();
                  
                  for (let i = startDayOfWeek - 1; i >= 0; i--) {
                    const dayNum = prevMonthLastDay - i;
                    const d = new Date(year, month - 1, dayNum);
                    cells.push({ dayNum, isCurrentMonth: false, dStr: d.toISOString().split('T')[0] });
                  }
                  
                  for (let i = 1; i <= daysInMonth; i++) {
                    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                    cells.push({ dayNum: i, isCurrentMonth: true, dStr });
                  }
                  
                  const remaining = (7 - (cells.length % 7)) % 7;
                  for (let i = 1; i <= remaining; i++) {
                    const d = new Date(year, month + 1, i);
                    cells.push({ dayNum: i, isCurrentMonth: false, dStr: d.toISOString().split('T')[0] });
                  }

                  return cells.map((cell, idx) => {
                    const dayTasks = scheduledTasks.filter(item => item.dueDate && item.dueDate.split('T')[0] === cell.dStr);
                    const isToday = cell.dStr === todayStr;

                    return (
                      <div
                        key={idx}
                        className={`min-h-[115px] rounded-2xl p-2 border flex flex-col transition-all ${
                          cell.isCurrentMonth ? 'bg-gray-50/40 border-gray-100 hover:bg-white hover:border-brand-orange/40 hover:shadow-sm' : 'bg-gray-50/15 border-transparent opacity-40'
                        } ${isToday ? 'ring-2 ring-brand-orange border-brand-orange bg-orange-50/20' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-full ${
                            isToday ? 'bg-brand-orange text-white shadow-2xs' : cell.isCurrentMonth ? 'text-brand-text' : 'text-gray-400'
                          }`}>
                            {cell.dayNum}
                          </span>
                          {dayTasks.length > 0 && (
                            <span className="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded-md border border-gray-100 shadow-2xs">
                              {dayTasks.length}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px] no-scrollbar">
                          {dayTasks.map(task => {
                            const isDone = (task.status?.name || '').toLowerCase().includes('selesai') || (task.status?.name || '').toLowerCase().includes('done');
                            return (
                              <button
                                key={task.id}
                                onClick={() => setSelectedTask(task)}
                                className={`w-full text-left p-1.5 rounded-lg bg-white border border-gray-200/80 shadow-2xs hover:border-brand-orange hover:-translate-y-0.5 transition-all cursor-pointer group ${
                                  isDone ? 'opacity-60 line-through' : ''
                                }`}
                              >
                                <div className="flex items-center gap-1">
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    task.priority === 'Tinggi' || task.priority === 'Mendesak' || task.priority === 'High' ? 'bg-red-500' :
                                    task.priority === 'Sedang' || task.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
                                  }`}></span>
                                  <span className="text-[11px] font-bold text-brand-text truncate group-hover:text-brand-orange transition-colors">
                                    {task.title}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-[9px] text-gray-400 font-semibold mt-0.5">
                                  <span className="truncate max-w-[60px] text-brand-orange">{task.workspace?.name}</span>
                                  <span className="truncate max-w-[50px]">{task.status?.name}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* TAMPILAN MINGGUAN (WEEKLY VIEW) */}
          {viewMode === 'mingguan' && (
            <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-gray-100 border-b-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {getWeekDates(new Date(currentDate)).map((d, idx) => {
                  const dStr = d.toISOString().split('T')[0];
                  const dayTasks = scheduledTasks.filter(item => item.dueDate && item.dueDate.split('T')[0] === dStr);
                  const isToday = dStr === todayStr;

                  return (
                    <div 
                      key={idx} 
                      className={`rounded-2xl p-3 border flex flex-col min-h-[350px] ${
                        isToday ? 'bg-orange-50/20 border-brand-orange ring-1 ring-brand-orange' : 'bg-gray-50/40 border-gray-200'
                      }`}
                    >
                      <div className="text-center pb-2 border-b border-gray-200 mb-2">
                        <div className="text-[11px] font-extrabold text-gray-400 uppercase">
                          {d.toLocaleString('id-ID', { weekday: 'short' })}
                        </div>
                        <div className={`text-lg font-black mt-0.5 inline-block w-8 h-8 rounded-full leading-8 ${
                          isToday ? 'bg-brand-orange text-white' : 'text-brand-text'
                        }`}>
                          {d.getDate()}
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                        {dayTasks.length === 0 ? (
                          <div className="text-center py-8 text-[11px] text-gray-400 font-medium italic">
                            Tidak ada tugas
                          </div>
                        ) : (
                          dayTasks.map(task => (
                            <div
                              key={task.id}
                              onClick={() => setSelectedTask(task)}
                              className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs hover:border-brand-orange hover:shadow-xs transition-all cursor-pointer"
                            >
                              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${getPriorityBadge(task.priority)}`}>
                                {task.priority || 'Normal'}
                              </span>
                              <h5 className="text-xs font-bold text-brand-text mt-1 line-clamp-2">{task.title}</h5>
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold mt-2 pt-1 border-t border-gray-50">
                                <span className="truncate text-brand-orange">{task.workspace?.name}</span>
                                <span>{task.status?.name}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAMPILAN HARIAN (DAILY VIEW) */}
          {viewMode === 'harian' && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 border-2 border-gray-100 border-b-4 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <span className="text-[10px] font-extrabold text-brand-orange uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded">
                    Agenda Hari Ini
                  </span>
                  <h3 className="text-xl font-extrabold text-brand-text mt-1">{currentDayLabel}</h3>
                </div>
                <span className="text-xs font-bold text-gray-400">
                  {scheduledTasks.filter(item => item.dueDate && item.dueDate.split('T')[0] === currentDate.toISOString().split('T')[0]).length} Tugas
                </span>
              </div>

              {(() => {
                const dateStr = currentDate.toISOString().split('T')[0];
                const dayTasks = scheduledTasks.filter(item => item.dueDate && item.dueDate.split('T')[0] === dateStr);

                if (dayTasks.length === 0) {
                  return (
                    <div className="py-16 text-center">
                      <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-500">Tidak ada tugas dengan tenggat waktu pada hari ini.</p>
                      <p className="text-xs text-gray-400 mt-1">Anda dapat mengatur tanggal dari daftar tugas belum terjadwal di bawah.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {dayTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="bg-gray-50 hover:bg-white p-4 rounded-2xl border-2 border-gray-100 hover:border-brand-orange/40 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-3 h-3 rounded-full shrink-0 bg-brand-orange"></div>
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-sm text-brand-text truncate">{task.title}</h5>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-0.5">
                              <span className="text-brand-orange font-bold">{task.workspace?.name}</span>
                              <span>•</span>
                              <span>{task.status?.name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${getPriorityBadge(task.priority)}`}>
                            {task.priority || 'Normal'}
                          </span>
                          {onNavigateToTask && task.workspaceId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToTask(task.workspaceId, task.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                              title="Buka di Ruang Kerja"
                            >
                              <ExternalLink size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* BAGIAN TUGAS BELUM TERJADWAL (UNSCHEDULED TASKS) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 border-b-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-brand-orange" />
                <h4 className="text-base font-extrabold text-brand-text">
                  Tugas Tanpa Tenggat Waktu (Perlu Dijadwalkan)
                </h4>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {unscheduledTasks.length}
                </span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                Pilih tanggal langsung pada kartu untuk menjadwalkan ke kalender
              </span>
            </div>

            {unscheduledTasks.length === 0 ? (
              <div className="text-center py-8 text-sm font-semibold text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                🎉 Hebat! Seluruh tugas telah memiliki jadwal tenggat waktu.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unscheduledTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="bg-gray-50/70 hover:bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-brand-orange/50 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-extrabold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                          {task.workspace?.name}
                        </span>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${getPriorityBadge(task.priority)}`}>
                          {task.priority || 'Normal'}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-brand-text line-clamp-2">{task.title}</h5>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] font-bold text-gray-400 shrink-0">Tetapkan:</span>
                      <input
                        type="date"
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer"
                        onChange={(e) => handleQuickSetDueDate(task, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MODAL: DETAIL & EDIT TUGAS DARI KALENDER */}
      {selectedTask && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveTask} className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full">
                  {selectedTask.workspace?.name}
                </span>
                <h3 className="text-xl font-extrabold text-brand-text mt-1">Detail Tugas</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-brand-text p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Judul Tugas</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deskripsi</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Beri detail tugas..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium h-20 resize-none focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prioritas</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Mendesak">Mendesak</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status Proyek</label>
                  <select
                    value={editStatusId}
                    onChange={(e) => setEditStatusId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    {workspaceStatuses.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Batas Jatuh Tempo (Kalender)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  {editDueDate && (
                    <button
                      type="button"
                      onClick={() => setEditDueDate("")}
                      className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      Hapus Tanggal
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={14} /> Hapus
                </button>

                {onNavigateToTask && selectedTask.workspaceId && (
                  <button
                    type="button"
                    onClick={() => {
                      const wsId = selectedTask.workspaceId;
                      const taskId = selectedTask.id;
                      setSelectedTask(null);
                      onNavigateToTask(wsId, taskId);
                    }}
                    className="px-3 py-2 text-xs font-bold text-brand-orange hover:bg-orange-50 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink size={14} /> Buka di Ruang Kerja
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingTask}
                  className="px-5 py-2 text-xs font-extrabold text-white bg-brand-orange hover:bg-brand-orange/95 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {savingTask ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
