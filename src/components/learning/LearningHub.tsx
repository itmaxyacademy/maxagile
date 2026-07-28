import { useState } from 'react';
import { Materi } from './Materi';
import { ReadinessAssessment } from './ReadinessAssessment';
import { MigrationWizard } from './MigrationWizard';
import { MappingTool } from './MappingTool';
import { TransformationGuide } from './TransformationGuide';
import { Checklist } from './Checklist';
import { UsecaseQuiz } from './UsecaseQuiz';
import { BookOpen, ClipboardCheck, Compass, GitMerge, LayoutList, ListTodo, BrainCircuit } from 'lucide-react';

type Tab = 'materi' | 'assessment' | 'wizard' | 'guide' | 'mapping' | 'checklist' | 'quiz';

export function LearningHub() {
  const [activeTab, setActiveTab] = useState<Tab>('materi');

  const tabs = [
    { id: 'materi', label: 'Pusat Materi', icon: <BookOpen size={16} /> },
    { id: 'assessment', label: 'Penilaian Kesiapan', icon: <ClipboardCheck size={16} /> },
    { id: 'wizard', label: 'Wizard Migrasi', icon: <Compass size={16} /> },
    { id: 'guide', label: 'Panduan Transformasi', icon: <LayoutList size={16} /> },
    { id: 'mapping', label: 'Alat Pemetaan', icon: <GitMerge size={16} /> },
    { id: 'checklist', label: 'Daftar Periksa', icon: <ListTodo size={16} /> },
    { id: 'quiz', label: 'Kuis Usecase', icon: <BrainCircuit size={16} /> }
  ];

  return (
    <div className="flex-1 h-full overflow-auto bg-brand-bg custom-scrollbar">
      <div className="bg-white px-6 pt-6 pb-2 shrink-0 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold text-brand-text mb-2 tracking-tight">MaxAgile Learning Center</h2>
          <p className="text-gray-500 mb-6 max-w-2xl">Pusat pembelajaran interaktif untuk memahami dan beralih secara mulus dari metode Tradisional ke pola pikir Agile.</p>
        </div>
      </div>
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-sm flex gap-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-extrabold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-brand-text text-white border-2 border-brand-text border-b-4 translate-y-[-2px] shadow-sm' 
                : 'bg-white border-2 border-gray-200 border-b-4 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 hover:text-brand-text'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {activeTab === 'materi' && <Materi />}
        {activeTab === 'assessment' && <ReadinessAssessment />}
        {activeTab === 'wizard' && <MigrationWizard />}
        {activeTab === 'guide' && <TransformationGuide />}
        {activeTab === 'mapping' && <MappingTool />}
        {activeTab === 'checklist' && <Checklist />}
        {activeTab === 'quiz' && <UsecaseQuiz />}
      </div>
    </div>
  );
}
