import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileDrawer, MobileBottomBar } from './MobileNavigation';
import { ArchitectureModal } from './ArchitectureModal';
import { Brain, Search, Mic, GitBranch, ShieldCheck, Database, Sparkles } from 'lucide-react';

export interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F7F9FC] text-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden pb-16 lg:pb-0">
        <Topbar
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAiArchitecture={() => setIsAiModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}

          {/* "Where AI is Used" Interactive Reference Strip (matching reference image footer) */}
          <div className="mt-12 pt-6 border-t border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Where AI is Used (System Architecture)
                </h4>
              </div>
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 self-start sm:self-auto"
              >
                View Details &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { name: 'Azure OpenAI', sub: 'Foundry Models', icon: Brain, color: 'text-blue-600 bg-blue-50' },
                { name: 'Azure AI Search', sub: 'RAG Knowledge', icon: Search, color: 'text-cyan-600 bg-cyan-50' },
                { name: 'Azure Speech', sub: 'STT & Neural TTS', icon: Mic, color: 'text-purple-600 bg-purple-50' },
                { name: 'Foundry Agent', sub: 'Adaptive Flow', icon: GitBranch, color: 'text-pink-600 bg-pink-50' },
                { name: 'Evaluation', sub: 'Accuracy Rubric', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
                { name: 'Supabase', sub: 'Auth & Data Store', icon: Database, color: 'text-teal-600 bg-teal-50' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setIsAiModalOpen(true)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200/70 hover:border-indigo-200 hover:shadow-sm transition-all text-left flex items-center gap-2.5 group"
                  >
                    <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">{item.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomBar />

      {/* Architecture Modal */}
      <ArchitectureModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
