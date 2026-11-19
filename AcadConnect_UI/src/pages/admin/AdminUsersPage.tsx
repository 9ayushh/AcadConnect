import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { User, Role } from '../../types';
import { UserPlus, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('TEACHER');
  const [department, setDepartment] = useState('Computer Science & Engineering');

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => userService.getUsers(),
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: Partial<User>) => userService.createUser(userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success(`User account for ${data.name} (${data.role}) created successfully!`);
      setIsModalOpen(false);
      setName('');
      setEmail('');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    createUserMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      role,
      department,
    });
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (u) => (
        <div>
          <p className="font-bold text-slate-900">{u.name}</p>
          <p className="text-xs text-slate-500">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      sortable: true,
      render: (u) => {
        const roleStyles = {
          ADMIN: 'bg-purple-50 text-purple-700 border-purple-200',
          TEACHER: 'bg-blue-50 text-blue-700 border-blue-200',
          STUDENT: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        }[u.role];
        return (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${roleStyles}`}>
            {u.role}
          </span>
        );
      },
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: (u) => <span className="text-xs text-slate-700">{u.department || 'General'}</span>,
    },
    {
      key: 'rollNumber',
      header: 'Identifier / Roll',
      render: (u) => (
        <span className="font-mono text-xs text-slate-500">{u.rollNumber || 'Faculty ID'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Identity Provisioning"
        description="Manage user directory and grant privileged Teacher or Administrator accounts (§0, §17)"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Provision Privileged User
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={users || []}
        loading={isLoading}
        searchKey="name"
        searchPlaceholder="Search by name, email, or role..."
      />

      {/* Provision User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision Privileged Account"
        description="Create faculty guides or system administrators. Public registration is student-only."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreate}
              loading={createUserMutation.isPending}
            >
              Provision Account
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Dr. Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Institutional Email"
            type="email"
            placeholder="priya.sharma@nit.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Select
            label="Assigned System Role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            options={[
              { value: 'TEACHER', label: 'TEACHER — Faculty Project Guide' },
              { value: 'ADMIN', label: 'ADMIN — System Administrator' },
              { value: 'STUDENT', label: 'STUDENT — Enrolled Student' },
            ]}
          />

          <Input
            label="Department"
            placeholder="e.g. Computer Science & Engineering"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};
