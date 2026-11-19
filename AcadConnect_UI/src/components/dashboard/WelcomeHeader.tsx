import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

interface WelcomeHeaderProps {
  nextStepMessage?: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  nextStepMessage = 'Track your capstone milestones and submit project deliverables on time.',
}) => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden mb-6">
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Academic Workspace Active</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome back, {firstName}!
        </h2>
        <p className="mt-2 text-indigo-100/90 text-sm sm:text-base leading-relaxed">
          {nextStepMessage}
        </p>
      </div>

      {/* Subtle decorative circles */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
      <div className="absolute right-20 -top-20 w-48 h-48 rounded-full bg-indigo-400/10 blur-xl pointer-events-none" />
    </div>
  );
};
