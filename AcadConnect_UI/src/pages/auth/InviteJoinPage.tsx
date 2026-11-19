import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { groupService } from '../../services/groupService';
import { MainGroup } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Users, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const InviteJoinPage: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState<MainGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreview() {
      if (!inviteCode) return;
      try {
        setLoading(true);
        const data = await groupService.getInvitePreview(inviteCode);
        setGroup(data);
      } catch (err: unknown) {
        setError((err as { message?: string })?.message || 'Invalid or expired invitation link');
      } finally {
        setLoading(false);
      }
    }

    fetchPreview();
  }, [inviteCode]);

  const handleJoin = async () => {
    if (!inviteCode) return;
    setJoining(true);
    try {
      await groupService.joinByInvite(inviteCode);
      toast.success('Successfully joined group!');
      if (role === 'TEACHER') {
        navigate('/teacher/groups');
      } else {
        navigate('/student/group');
      }
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message || 'Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader size="lg" label="Checking invitation link..." />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Invalid Invitation</h2>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            {error || 'This invitation code does not exist or has expired.'}
          </p>
          <div className="mt-6">
            <Link to="/login">
              <Button variant="outline" size="sm" className="w-full">
                Go to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 text-white items-center justify-center font-bold text-2xl shadow-md mb-4">
          AC
        </div>
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 mb-2">
          Academic Group Invitation
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          {group.name}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          {group.description}
        </p>

        {/* Group details */}
        <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-[11px] text-slate-400">Course Instructor</p>
              <p className="text-xs font-bold text-slate-800">{group.teacherName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-[11px] text-slate-400">Enrolled Students</p>
              <p className="text-xs font-bold text-slate-800">{group.memberCount} members</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="lg"
              loading={joining}
              onClick={handleJoin}
              className="w-full shadow-md"
              icon={<CheckCircle2 className="w-5 h-5" />}
            >
              Join Academic Group
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Please sign in or register to accept this invitation:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Link to="/login" state={{ from: { pathname: `/join/${inviteCode}` } }}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to={`/register?invite=${inviteCode}`}>
                  <Button variant="primary" size="sm" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
