import { useState, useEffect, type FormEvent, type MouseEvent } from 'react';
import { WorkItem, Workspace, Status } from '../types';
import { 
  CheckCircle, 
  Clock, 
  Calendar as CalendarIcon, 
  Filter, 
  X, 
  FolderKanban, 
  ExternalLink, 
  Trash2, 
  AlertCircle,
  Check
} from 'lucide-react';

interface MyTasksViewProps {
  workspaces?: Workspace[];
  onNavigateToTask?: (workspaceId: string, taskId: string) => void;
  onNavigateToWorkspace?: (workspaceId: string) => void;
}

export function MyTasksView({ workspaces = [], onNavigateToTask, onNavigateToWorkspace }: MyTasksViewProps) {
  const [tasks, setTasks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterWorkspace, setFilterWorkspace] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilter, setShowFilter] = useState(false);

  // Task edit modal
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

  // When selected task changes, fetch workspace statuses
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

  const isTaskCompleted = (task: WorkItem) => {
    const sName = (task.status?.name || '').toLowerCase();
    return sName.includes('selesai') || sName.includes('done') || sName.includes('deal') || sName.includes('terjual');
  };

  // Toggle complete task
  const handleToggleComplete = async (e: MouseEvent, task: WorkItem) => {
    e.stopPropagation();
    try {
      // Fetch statuses for this workspace
      const wsRes = await fetch(`${import.meta.env.BASE_URL}api/workspaces/${task.workspaceId}`);
      if (!wsRes.ok) return;
      const wsData = await wsRes.json();
      const statuses: Status[] = wsData.statuses || [];
      if (statuses.length === 0) return;

      const completed = isTaskCompleted(task);
      let targetStatus: Status | undefined;

      if (completed) {
        // Move back to first status
        targetStatus = statuses.slice().sort((a, b) => a.order - b.order)[0];
      } else {
        // Find completion status
        targetStatus = statuses.find(s => {
          const name = s.name.toLowerCase();
          return name.includes('selesai') || name.includes('done') || name.includes('deal') || name.includes('terjual');
        }) || statuses.slice().sort((a, b) => b.order - a.order)[0];
      }

      if (!targetStatus) return;

      // Optimistic update
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, statusId: targetStatus!.id, status: targetStatus } : t));

      await fetch(`${import.meta.env.BASE_URL}api/work-items/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusId: targetStatus.id })
      });

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Save task from modal
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

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Hapus tugas ini?")) {
      try {
        await fetch(`${import.meta.env.BASE_URL}api/work-items/${taskId}`, { method: 'DELETE' });
        setSelectedTask(null);
        fetchTasks();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Helper date renderer
  const renderDueDateBadge = (dueDateStr?: string | null, isDone = false) => {
    if (!dueDateStr) {
      return (
        <span className="flex items-center gap-1 text-gray-400 text-xs font-semibold">
          <Clock size={13} />
          <span>Belum diatur</span>
        </span>
      );
    }

    const d = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(d);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((taskDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    const formatted = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    if (diffDays < 0 && !isDone) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold text-red-600 bg-red-50 border border-red-200">
          <AlertCircle size={13} />
          <span>Terlambat ({formatted})</span>
        </span>
      );
    }

    if (diffDays === 0 && !isDone) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200">
          <Clock size={13} />
          <span>Hari Ini</span>
        </span>
      );
    }

    if (diffDays === 1 && !isDone) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
          <Clock size={13} />
          <span>Besok</span>
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1 text-gray-500 text-xs font-semibold">
        <CalendarIcon size={13} />
        <span>Batas: {formatted}</span>
      </span>
    );
  };

  const renderTaskLabels = (labelsJson: string | null | undefined) => {
    if (!labelsJson) return null;
    try {
      const parsed = JSON.parse(labelsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return (
          <div className="flex flex-wrap gap-1 mt-2">
            {parsed.map((lbl: { name: string; color: string }, idx: number) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs"
                style={{ backgroundColor: lbl.color || '#3b82f6' }}
              >
                {lbl.name}
              </span>
            ))}
          </div>
        );
      }
    } catch (e) {}
    return null;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="text-brand-orange font-bold">Memuat tugas Anda...</p>
        </div>
      </div>
    );
  }

  // Filter logic
  const filteredTasks = tasks.filter(task => {
    if (filterWorkspace !== 'all' && task.workspaceId !== filterWorkspace) return false;

    if (filterPriority !== 'all') {
      const p = (task.priority || '').toLowerCase();
      if (filterPriority === 'high' && !(p === 'tinggi' || p === 'mendesak' || p === 'high')) return false;
      if (filterPriority === 'medium' && !(p === 'sedang' || p === 'medium')) return false;
      if (filterPriority === 'low' && !(p === 'rendah' || p === 'low')) return false;
    }

    if (filterStatus !== 'all') {
      const completed = isTaskCompleted(task);
      if (filterStatus === 'incomplete' && completed) return false;
      if (filterStatus === 'completed' && !completed) return false;
    }

    return true;
  });

  const completedCount = tasks.filter(isTaskCompleted).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-brand-bg">
      {/* Header Bar */}
      <div className="bg-white px-6 pt-6 pb-4 shrink-0 relative overflow-hidden border-b border-gray-100 shadow-2xs">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full">
                Ringkasan Pekerjaan
              </span>
              <span className="text-xs text-gray-400 font-bold">•</span>
              <span className="text-xs text-gray-500 font-bold">
                {pendingCount} Perlu Dikerjakan, {completedCount} Selesai
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">Tugas Saya</h2>
            <p className="text-xs md:text-sm text-gray-500 max-w-2xl mt-0.5">
              Pantau dan kelola seluruh tugas yang tersinkronisasi langsung dengan ruang kerja dan kalender Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 relative">
            {/* Filter Ruang Kerja Shortcut */}
            <div className="flex items-center gap-1.5 bg-gray-50 border-2 border-gray-200 rounded-2xl px-3 py-1.5 shadow-2xs">
              <FolderKanban size={15} className="text-brand-orange" />
              <select
                value={filterWorkspace}
                onChange={(e) => setFilterWorkspace(e.target.value)}
                className="bg-transparent text-xs font-bold text-brand-text outline-none cursor-pointer"
              >
                <option value="all">Semua Ruang Kerja</option>
                {workspaces.map(ws => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </select>
            </div>

            {/* Filter Status Quick Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-gray-200 shadow-2xs">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'all' ? 'bg-white text-brand-text shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Semua ({tasks.length})
              </button>
              <button 
                onClick={() => setFilterStatus('incomplete')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'incomplete' ? 'bg-white text-brand-text shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Belum Selesai ({pendingCount})
              </button>
              <button 
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'completed' ? 'bg-white text-brand-text shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Selesai ({completedCount})
              </button>
            </div>

            {/* Filter Priority Dropdown Button */}
            <div className="relative">
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-gray-200 border-b-4 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-50 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Filter size={14} />
                <span>Prioritas</span>
                {filterPriority !== 'all' && (
                  <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                )}
              </button>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-100 border-b-4 rounded-2xl shadow-lg z-20 p-2">
                  <div className="text-[10px] font-bold text-gray-400 mb-1.5 px-2 uppercase">Prioritas</div>
                  <button 
                    onClick={() => { setFilterPriority('all'); setShowFilter(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold mb-1 transition-colors ${filterPriority === 'all' ? 'bg-brand-orange/10 text-brand-orange' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Semua Prioritas
                  </button>
                  <button 
                    onClick={() => { setFilterPriority('high'); setShowFilter(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold mb-1 transition-colors ${filterPriority === 'high' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Tinggi / Mendesak
                  </button>
                  <button 
                    onClick={() => { setFilterPriority('medium'); setShowFilter(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold mb-1 transition-colors ${filterPriority === 'medium' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Menengah
                  </button>
                  <button 
                    onClick={() => { setFilterPriority('low'); setShowFilter(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filterPriority === 'low' ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Rendah
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border-2 border-gray-100 border-b-4 shadow-sm">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-brand-text mb-1">Tidak Ada Tugas Ditemukan</h3>
              <p className="text-gray-500 text-xs sm:text-sm font-medium">
                {filterStatus === 'incomplete' 
                  ? 'Semua tugas telah selesai dikerjakan!' 
                  : 'Tidak ada tugas yang sesuai dengan kriteria filter saat ini.'}
              </p>
              {(filterPriority !== 'all' || filterWorkspace !== 'all' || filterStatus !== 'all') && (
                <button 
                  onClick={() => {
                    setFilterPriority('all');
                    setFilterWorkspace('all');
                    setFilterStatus('all');
                  }} 
                  className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => {
                const done = isTaskCompleted(task);

                return (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTask(task)}
                    className={`bg-white p-4 sm:p-5 rounded-3xl border-2 border-gray-100 border-b-4 shadow-sm hover:border-gray-200 hover:-translate-y-0.5 transition-all flex items-center gap-4 group cursor-pointer ${
                      done ? 'bg-gray-50/70 border-gray-100 opacity-75' : ''
                    }`}
                  >
                    {/* Completion Checkmark Button */}
                    <button 
                      onClick={(e) => handleToggleComplete(e, task)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        done 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                          : 'border-gray-200 hover:border-emerald-500 text-transparent hover:text-emerald-500 bg-gray-50 hover:bg-emerald-50'
                      }`}
                      title={done ? 'Tandai belum selesai' : 'Tandai selesai'}
                    >
                      <Check size={18} className={done ? 'opacity-100 stroke-[3]' : 'opacity-0 group-hover:opacity-100'} />
                    </button>

                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-extrabold text-brand-text text-base mb-1 truncate ${
                        done ? 'line-through text-gray-400' : ''
                      }`}>
                        {task.title}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-gray-500">
                        {/* Workspace Pill */}
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 truncate max-w-[130px] sm:max-w-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                          <span className="truncate">{task.workspace?.name}</span>
                        </span>

                        {/* Real Due Date Badge */}
                        {renderDueDateBadge(task.dueDate, done)}

                        {/* Priority Badge */}
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          task.priority === 'High' || task.priority === 'Tinggi' || task.priority === 'Mendesak' ? 'bg-red-100 text-red-600' :
                          task.priority === 'Medium' || task.priority === 'Sedang' ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {task.priority || 'Normal'}
                        </span>
                      </div>

                      {renderTaskLabels(task.labels)}
                    </div>

                    {/* Status & Shortcut Action */}
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-gray-50 rounded-xl border-2 border-gray-100 text-xs font-extrabold text-gray-600 hidden sm:block">
                        {task.status?.name}
                      </div>

                      {onNavigateToTask && task.workspaceId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToTask(task.workspaceId, task.id);
                          }}
                          className="p-2 text-gray-400 hover:text-brand-orange hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                          title="Buka di Ruang Kerja"
                        >
                          <ExternalLink size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: DETAIL & EDIT TUGAS */}
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
