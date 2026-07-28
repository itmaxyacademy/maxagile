/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LayoutDashboard, CheckSquare, Calendar as CalendarIcon, Settings, FolderKanban, Plus, Menu, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Workspace, WorkItem } from './types';
import { WorkspaceView } from './components/WorkspaceView';
import { MyTasksView } from './components/MyTasksView';
import { CalendarView } from './components/CalendarView';
import { LearningHub } from './components/learning/LearningHub';
import { GraduationCap } from 'lucide-react';

export default function App() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<{ type: string; id?: string; name?: string; initialTaskId?: string }>({ type: 'dashboard' });
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceTemplate, setNewWorkspaceTemplate] = useState("Pendidikan");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [allTasks, setAllTasks] = useState<WorkItem[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setSearching(true);
      fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
          setAllTasks(data);
          setSearching(false);
        })
        .catch(() => setSearching(false));
    }
  }, [searchQuery]);

  const matchedWorkspaces = searchQuery.trim() === "" ? [] : workspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (ws.description && ws.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const matchedTasks = searchQuery.trim() === "" ? [] : allTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const templates = [
    "Pendidikan",
    "Pengajar",
    "Marketing",
    "Sales", 
    "Toko Kelontong",
    "UMKM",
    "Restoran",
    "Fotografer",
    "Mahasiswa",
    "IT / Software"
  ];

  const fetchWorkspaces = async () => {
    setLoading(true);
    const res = await fetch('/api/workspaces');
    if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    
    const res = await fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newWorkspaceName, description: "", type: newWorkspaceTemplate })
    });
    const newWorkspace = await res.json();
    setWorkspaces([...workspaces, newWorkspace]);
    setActiveView({ type: 'workspace', id: newWorkspace.id, name: newWorkspace.name });
    setShowNewWorkspaceModal(false);
    setNewWorkspaceName("");
    setNewWorkspaceTemplate("Pendidikan");
    setMobileMenuOpen(false);
  };

  const handleNavClick = (view: { type: string; id?: string; name?: string }) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeView.type) {
      case 'dashboard':
        return (
          <div className="flex-1 overflow-auto bg-white h-full relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 relative z-10 text-center">
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-brand-text mb-6 tracking-tight leading-tight">
                Kelola Pekerjaan Lebih Cerdas <br className="hidden md:block" />
                <span className="text-brand-orange">dengan MaxAgile</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                Tingkatkan produktivitas tim Anda menggunakan metodologi Agile. Mulai atur tugas dan pantau kemajuan pekerjaan hanya dalam hitungan detik tanpa hambatan.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button 
                  onClick={() => setShowNewWorkspaceModal(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-white rounded-full font-extrabold text-xl border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 shadow-lg shadow-brand-orange/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Mulai Buat Proyek
                </button>
                <button 
                  onClick={() => setActiveView({ type: 'learning' })}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-full font-extrabold text-xl border-2 border-gray-200 border-b-4 active:border-b-2 active:translate-y-1 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Pelajari Agile
                </button>
              </div>
            </div>

            {/* Ruang Kerja Anda Catalog */}
            <div className="max-w-4xl mx-auto px-6 pb-24 relative z-10">
              <div className="border-t border-gray-100 pt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold text-brand-text flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-brand-orange" />
                    Ruang Kerja Anda
                  </h2>
                  <button 
                    onClick={() => setShowNewWorkspaceModal(true)}
                    className="flex items-center gap-1.5 text-xs font-extrabold text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20 px-4.5 py-2.5 rounded-full transition-all cursor-pointer"
                  >
                    <Plus size={14} /> Tambah Ruang Kerja
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-sm text-gray-400 font-semibold animate-pulse">Memuat ruang kerja...</div>
                ) : workspaces.length === 0 ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                    <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 font-bold mb-4">Belum ada ruang kerja yang aktif.</p>
                    <button 
                      onClick={() => setShowNewWorkspaceModal(true)}
                      className="px-6 py-3 bg-brand-orange text-white rounded-full font-bold text-sm shadow-sm hover:bg-brand-orange/95 cursor-pointer"
                    >
                      Buat Ruang Kerja Pertama Anda
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {workspaces.map(ws => (
                      <button
                        key={ws.id}
                        onClick={() => setActiveView({ type: 'workspace', id: ws.id, name: ws.name })}
                        className="text-left bg-white p-6 rounded-3xl border-2 border-gray-100 border-b-4 hover:border-brand-orange/40 hover:-translate-y-1 transition-all group shadow-sm flex flex-col justify-between h-40 cursor-pointer"
                      >
                        <div>
                          <span className="text-[10px] font-extrabold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {ws.type}
                          </span>
                          <h3 className="font-extrabold text-lg text-brand-text group-hover:text-brand-orange transition-colors mt-3 line-clamp-1 leading-snug">
                            {ws.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {ws.description || `Kelola tugas ${ws.type} Anda dengan diagram alur kerja Agile.`}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-brand-orange transition-colors mt-4">
                          <span>Masuk Ruang Kerja</span>
                          <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}

                    {/* Quick Create Card */}
                    <button
                      onClick={() => setShowNewWorkspaceModal(true)}
                      className="text-center bg-gray-50/50 p-6 rounded-3xl border-2 border-dashed border-gray-200 hover:border-brand-orange/40 hover:bg-white transition-all flex flex-col items-center justify-center gap-3 h-40 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                        <Plus size={20} />
                      </div>
                      <div className="text-sm font-extrabold text-gray-500">Buat Ruang Kerja Baru</div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return <MyTasksView />;
      case 'calendar':
        return <CalendarView />;
      case 'learning':
        return <LearningHub />;
      case 'workspace':
        if (!activeView.id) return null;
        return <WorkspaceView 
                  key={activeView.id}
                  workspaceId={activeView.id} 
                  workspaceName={activeView.name || 'Workspace'} 
                  initialTaskId={activeView.initialTaskId}
                  onDeleteWorkspace={() => {
                     setActiveView({ type: 'dashboard' });
                     fetchWorkspaces();
                  }}
               />;
      case 'settings':
        return (
          <div className="flex-1 overflow-auto p-6 bg-brand-bg">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-md">
              <h3 className="font-medium text-lg mb-4 text-brand-text">Pengaturan Aplikasi</h3>
              <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                   <select className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-brand-orange text-sm">
                     <option>Terang (Bawaan)</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Basis Data</label>
                   <p className="text-sm text-gray-500">SQLite (Lokal)</p>
                 </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white text-brand-text font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-900/50 z-40" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        ${sidebarCollapsed ? "w-20" : "w-64"} bg-white flex flex-col border-r-2 border-gray-100 transition-all duration-300
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className={`p-5 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && <h1 className="text-xl font-bold flex items-center gap-2 text-brand-text">
            <CheckSquare className="w-6 h-6 text-brand-orange" />
            MaxAgile
          </h1>}
          <button className="md:hidden text-gray-500 hover:bg-gray-200 p-1 rounded-md" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
          <button className="hidden md:flex text-gray-400 hover:bg-gray-100 p-1.5 rounded-lg transition-colors" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
          {!sidebarCollapsed ? <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-3">Menu</div> : <div className="h-4 mt-4 mb-2"></div>}
          <NavItem collapsed={sidebarCollapsed} 
            icon={<LayoutDashboard size={18} />} 
            label="Home" 
            active={activeView.type === 'dashboard'} 
            onClick={() => handleNavClick({ type: 'dashboard' })} 
          />
          <NavItem collapsed={sidebarCollapsed} 
            icon={<CheckSquare size={18} />} 
            label="Tugas Saya" 
            active={activeView.type === 'tasks'} 
            onClick={() => handleNavClick({ type: 'tasks' })} 
          />
          <NavItem collapsed={sidebarCollapsed} 
            icon={<CalendarIcon size={18} />} 
            label="Kalender" 
            active={activeView.type === 'calendar'} 
            onClick={() => handleNavClick({ type: 'calendar' })} 
          />
          <NavItem collapsed={sidebarCollapsed} 
            icon={<GraduationCap size={18} />} 
            label="Pusat Pembelajaran" 
            active={activeView.type === 'learning'} 
            onClick={() => handleNavClick({ type: 'learning' })} 
          />
          
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-8 px-3 group`}>
            {!sidebarCollapsed && <span>Ruang Kerja</span>}
            <button onClick={() => setShowNewWorkspaceModal(true)} className={`text-gray-400 hover:text-brand-orange transition-opacity ${sidebarCollapsed ? "opacity-100 p-1 bg-gray-100 rounded-md" : "opacity-0 group-hover:opacity-100"}`}><Plus size={16} /></button>
          </div>
          
          {loading ? (
            (!sidebarCollapsed ? <div className="text-sm text-gray-500 py-2 px-3">Memuat...</div> : null)
          ) : workspaces.length === 0 ? (
            (!sidebarCollapsed ? <div className="text-sm text-gray-500 py-2 px-3">Belum ada ruang kerja.</div> : null)
          ) : (
            workspaces.map(ws => (
              <NavItem collapsed={sidebarCollapsed} 
                key={ws.id} 
                icon={<FolderKanban size={18} />} 
                label={ws.name} 
                active={activeView.type === 'workspace' && activeView.id === ws.id}
                onClick={() => handleNavClick({ type: 'workspace', id: ws.id, name: ws.name })}
              />
            ))
          )}
        </nav>
        
        <div className="p-3 border-t border-gray-200 bg-white">
          <NavItem collapsed={sidebarCollapsed} 
            icon={<Settings size={18} />} 
            label="Pengaturan" 
            active={activeView.type === 'settings'}
            onClick={() => handleNavClick({ type: 'settings' })}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white h-full relative overflow-hidden">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0 bg-white sticky top-0 z-30 gap-4">
          <div className="flex items-center min-w-0">
            <button 
              className="mr-3 md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg shrink-0"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-lg md:text-xl text-brand-text truncate capitalize">
              {activeView.type === 'tasks' ? 'Tugas Saya' : 
               activeView.type === 'dashboard' ? 'Home' : 
               activeView.type === 'calendar' ? 'Kalender' : 
               activeView.type === 'learning' ? 'Pusat Pembelajaran & Agile' : 
               activeView.type === 'settings' ? 'Pengaturan' : 
               activeView.type === 'workspace' ? `${activeView.name || 'Ruang Kerja'}` : activeView.type}
            </h2>
          </div>

          {/* Global Search Bar */}
          <div className="relative max-w-xs md:max-w-md flex-1 z-50">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari tugas atau ruang kerja..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent rounded-full pl-9 pr-4 py-1.5 text-sm transition-all outline-none"
            />
            
            {/* Search Results Dropdown */}
            {searchQuery.trim() !== "" && (
              <div className="absolute right-0 mt-2 w-72 md:w-[450px] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-96 flex flex-col">
                <div className="overflow-y-auto p-2 space-y-3 custom-scrollbar bg-white">
                  {searching ? (
                    <div className="p-4 text-center text-sm text-gray-500 animate-pulse">Mencari...</div>
                  ) : matchedWorkspaces.length === 0 && matchedTasks.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500 font-semibold">Tidak ada hasil ditemukan</div>
                  ) : (
                    <>
                      {matchedWorkspaces.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1">Ruang Kerja ({matchedWorkspaces.length})</div>
                          <div className="space-y-0.5">
                            {matchedWorkspaces.map(ws => (
                              <button
                                key={ws.id}
                                onClick={() => {
                                  setActiveView({ type: 'workspace', id: ws.id, name: ws.name });
                                  setSearchQuery("");
                                }}
                                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-brand-text hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                <FolderKanban size={14} className="text-brand-orange shrink-0" />
                                <span className="truncate">{ws.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {matchedTasks.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1">Tugas ({matchedTasks.length})</div>
                          <div className="space-y-0.5">
                            {matchedTasks.map(task => (
                              <button
                                key={task.id}
                                onClick={() => {
                                  setActiveView({ 
                                    type: 'workspace', 
                                    id: task.workspaceId, 
                                    name: task.workspace?.name || 'Workspace', 
                                    initialTaskId: task.id 
                                  });
                                  setSearchQuery("");
                                }}
                                className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors flex flex-col cursor-pointer"
                              >
                                <div className="flex items-center gap-2 justify-between w-full">
                                  <span className="font-semibold text-brand-text truncate">{task.title}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 ${
                                    task.priority === 'High' || task.priority === 'Mendesak' || task.priority === 'Tinggi' ? 'bg-red-100 text-red-600' :
                                    task.priority === 'Medium' || task.priority === 'Sedang' ? 'bg-orange-100 text-orange-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {task.priority || 'Normal'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mt-0.5">
                                  <span className="truncate">{task.workspace?.name}</span>
                                  <span>•</span>
                                  <span>{task.status?.name}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {renderContent()}
      </main>

      {/* New Workspace Modal */}
      {showNewWorkspaceModal && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white">
            <h3 className="text-2xl font-extrabold mb-6 text-brand-text">Buat Ruang Kerja Baru</h3>
            <input 
              type="text" 
              placeholder="Nama Ruang Kerja" 
              className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-3 shadow-inner mb-4 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createWorkspace()}
              autoFocus
            />
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Template</label>
              <select
                className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all bg-white"
                value={newWorkspaceTemplate}
                onChange={(e) => setNewWorkspaceTemplate(e.target.value)}
              >
                {templates.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowNewWorkspaceModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={createWorkspace}
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-text hover:bg-black rounded-full shadow-sm transition-colors"
              >
                Buat Ruang Kerja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active = false, collapsed = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, collapsed?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-3 rounded-2xl text-sm font-bold transition-all ${collapsed ? 'justify-center px-0' : 'px-4'} ${active ? 'bg-brand-orange/10 text-brand-orange' : 'text-gray-600 hover:bg-gray-200/60 hover:text-brand-text'}`}
    >
      {icon}
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}

function StatCard({ title, value, danger = false }: { title: string, value: string, danger?: boolean }) {
  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 border-b-4 shadow-sm">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className={`text-3xl font-bold mt-2 ${danger ? 'text-red-600' : 'text-brand-text'}`}>{value}</div>
    </div>
  );
}
