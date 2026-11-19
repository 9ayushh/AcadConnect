import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Mail, Lock, Hash, Building2, Calendar, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('invite');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      rollNumber: '',
      department: 'Computer Science & Engineering',
      academicYear: '2026-2027',
      course: 'B.Tech CSE',
      yearSemester: '4th Year / Sem 7',
      collegeName: 'National Institute of Technology',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setServerError(null);
    try {
      await registerUser(data);
      toast.success('Registration successful! Welcome to AcadConnect.');

      if (inviteCode) {
        navigate(`/join/${inviteCode}`, { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Registration failed.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 text-white items-center justify-center font-bold text-2xl shadow-lg mb-3">
          AC
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Create Student Account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Join your academic capstone groups and collaborate with your teammates
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-sm">
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. Aarav Sharma"
                leftIcon={<User className="w-4 h-4" />}
                required
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="student@example.edu"
                leftIcon={<Mail className="w-4 h-4" />}
                required
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Roll / Enrollment Number"
                placeholder="e.g. 21CSE045"
                leftIcon={<Hash className="w-4 h-4" />}
                required
                error={errors.rollNumber?.message}
                {...register('rollNumber')}
              />

              <Input
                label="Department"
                placeholder="Computer Science"
                leftIcon={<Building2 className="w-4 h-4" />}
                required
                error={errors.department?.message}
                {...register('department')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Course / Branch"
                placeholder="B.Tech CSE"
                leftIcon={<BookOpen className="w-4 h-4" />}
                required
                error={errors.course?.message}
                {...register('course')}
              />

              <Input
                label="Academic Year"
                placeholder="2026-2027"
                leftIcon={<Calendar className="w-4 h-4" />}
                required
                error={errors.academicYear?.message}
                {...register('academicYear')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Year & Semester"
                placeholder="4th Year / Sem 7"
                required
                error={errors.yearSemester?.message}
                {...register('yearSemester')}
              />

              <Input
                label="College / University Name"
                placeholder="National Institute of Technology"
                error={errors.collegeName?.message}
                {...register('collegeName')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <Input
                label="Password"
                type="password"
                placeholder="Min 8 chars, 1 uppercase, 1 digit"
                leftIcon={<Lock className="w-4 h-4" />}
                required
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                leftIcon={<Lock className="w-4 h-4" />}
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-4">
              Create Student Account
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
