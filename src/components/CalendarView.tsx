import { useState, useEffect } from 'react';
import { WorkItem } from '../types';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, ListTodo, Filter } from 'lucide-react';

type ViewMode = 'harian' | 'mingguan' | 'bulanan';

export function CalendarView() {
  const [tasks, setTasks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('bulanan');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/tasks`)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  const currentMonth = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  
  // Dummy day name for daily view
  const currentDay = new Date().toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-brand-bg">
        <div className="text-brand-orange font-bold animate-pulse">Memuat kalender...</div>
    </div>
  );

  const filteredTasks = tasks.filter(task => {
    if (filterPriority === 'all') return true;
    return task.priority?.toLowerCase() === filterPriority.toLowerCase();
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-brand-bg">
      <div className="bg-white px-6 pt-6 pb-2 shrink-0 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-text mb-2 tracking-tight">Kalender</h2>
            <p className="text-gray-500 mb-6 max-w-2xl">Lihat jadwal dan tenggat waktu tugas Anda yang akan datang.</p>
          </div>
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
             <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-gray-200">
               <button 
                 onClick={() => setViewMode('harian')}
                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'harian' ? 'bg-white text-brand-text shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 Harian
               </button>
               <button 
                 onClick={() => setViewMode('mingguan')}
                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'mingguan' ? 'bg-white text-brand-text shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 Mingguan
               </button>
               <button 
                 onClick={() => setViewMode('bulanan')}
                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'bulanan' ? 'bg-white text-brand-text shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 Bulanan
               </button>
             </div>
             
             <div className="flex items-center gap-2">
                 <button className="p-3 bg-white border-2 border-gray-200 border-b-4 rounded-2xl text-gray-600 hover:bg-gray-50 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all">
                    <ChevronLeft size={20} />
                 </button>
                 <button className="px-4 py-3 sm:px-5 bg-white border-2 border-gray-200 border-b-4 rounded-2xl font-extrabold text-brand-text hover:bg-gray-50 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all flex items-center gap-2">
                    <CalendarIcon size={18} className="text-brand-orange" /> <span className="hidden sm:inline">{viewMode === 'harian' ? currentDay : currentMonth}</span><span className="sm:hidden">Hari Ini</span>
                 </button>
                 <button className="p-3 bg-white border-2 border-gray-200 border-b-4 rounded-2xl text-gray-600 hover:bg-gray-50 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all">
                    <ChevronRight size={20} />
                 </button>
                 
                 <div className="relative ml-2">
                    <button 
                      onClick={() => setShowFilter(!showFilter)}
                      className="p-3 bg-white border-2 border-gray-200 border-b-4 rounded-2xl text-gray-600 hover:bg-gray-50 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center relative"
                    >
                        <Filter size={20} />
                        {filterPriority !== 'all' && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-orange"></span>
                        )}
                    </button>
                    {showFilter && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-100 border-b-4 rounded-2xl shadow-lg z-20 p-2">
                        <div className="text-xs font-bold text-gray-400 mb-2 px-2 uppercase">Prioritas</div>
                        <button 
                          onClick={() => { setFilterPriority('all'); setShowFilter(false); }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold mb-1 transition-colors ${filterPriority === 'all' ? 'bg-brand-orange/10 text-brand-orange' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          Semua
                        </button>
                        <button 
                          onClick={() => { setFilterPriority('high'); setShowFilter(false); }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold mb-1 transition-colors ${filterPriority === 'high' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          Tinggi
                        </button>
                        <button 
                          onClick={() => { setFilterPriority('medium'); setShowFilter(false); }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold mb-1 transition-colors ${filterPriority === 'medium' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          Menengah
                        </button>
                        <button 
                          onClick={() => { setFilterPriority('low'); setShowFilter(false); }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${filterPriority === 'low' ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          Rendah
                        </button>
                      </div>
                    )}
                 </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
            <h4 className="text-sm font-extrabold text-gray-500 mb-6 uppercase tracking-wider flex items-center gap-2">
                <ListTodo size={18} /> Batas Waktu Mendatang (Simulasi)
            </h4>
            
            <div className={`grid gap-4 ${viewMode === 'harian' ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
              {filteredTasks.length === 0 ? (
                <div className="md:col-span-2 bg-white p-10 text-center rounded-3xl border-2 border-gray-100 border-b-4 shadow-sm">
                    <p className="text-gray-500 font-medium">Tidak ada tugas untuk ditampilkan di kalender.</p>
                    {filterPriority !== 'all' && (
                      <button onClick={() => setFilterPriority('all')} className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors">
                        Hapus Filter
                      </button>
                    )}
                </div>
              ) : (
                filteredTasks.slice(0, viewMode === 'harian' ? 4 : viewMode === 'mingguan' ? 6 : 8).map((task, i) => (
                  <div key={task.id} className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-gray-100 border-b-4 shadow-sm flex items-start gap-4 sm:gap-5 hover:-translate-y-1 hover:border-gray-200 transition-all cursor-pointer">
                     <div className="bg-brand-bg px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-center shrink-0 border-2 border-gray-100">
                         <div className="text-xs sm:text-sm font-black text-red-500 uppercase tracking-widest">{currentMonth.substring(0, 3)}</div>
                         <div className="text-xl sm:text-2xl font-black text-brand-text leading-none mt-1">{viewMode === 'harian' ? new Date().getDate() : 20 + i}</div>
                     </div>
                     <div className="flex-1 pt-1 min-w-0">
                         <h5 className="font-extrabold text-brand-text text-base sm:text-lg leading-tight mb-2 truncate">{task.title}</h5>
                         <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-1 text-xs sm:text-sm font-bold text-gray-500">
                             <span className="flex items-center gap-1.5 text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                                 {task.workspace?.name}
                             </span>
                             <span className="flex items-center gap-1.5">
                                <Clock size={14} /> 17:00
                             </span>
                             <span className={`px-2 py-0.5 rounded-md text-xs uppercase tracking-wider ${
                                task.priority === 'High' ? 'bg-red-100 text-red-600' :
                                task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {task.priority || 'Normal'}
                              </span>
                         </div>
                     </div>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
