import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  getUsers,
  updateUserRole,
  type UserRecord,
  type UserRole,
} from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import ToastFeedback from '../components/ToastFeedback';
import { useAuth } from '../context/AuthContext';

function formatDate(value?: string) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function roleLabel(role: UserRole) {
  if (role === 'superadmin') return 'Super admin';
  if (role === 'admin') return 'Admin';
  return 'User';
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => {
        setMessageType('error');
        setMessage('User records could not be loaded.');
      })
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (record: UserRecord, role: UserRole) => {
    const previousRole = record.role;
    setSavingId(record.id);
    setMessage('');
    setUsers((current) =>
      current.map((item) => (item.id === record.id ? { ...item, role } : item))
    );

    try {
      const updated = await updateUserRole(record.id, role);
      setUsers((current) =>
        current.map((item) => (item.id === record.id ? updated : item))
      );
      setMessageType('success');
      setMessage(`${record.name}'s role was updated.`);
    } catch (requestError) {
      setUsers((current) =>
        current.map((item) =>
          item.id === record.id ? { ...item, role: previousRole } : item
        )
      );
      setMessageType('error');
      setMessage(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.error || 'The role could not be changed.'
          : 'The role could not be changed.'
      );
    } finally {
      setSavingId('');
    }
  };

  return (
    <AdminLayout
      title="User records"
      description="Review registered accounts and control administrative access."
    >
      <ToastFeedback message={message} type={messageType} />

      <section className="border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-bold text-gray-900">Registered users</h2>
          <p className="mt-1 text-sm text-gray-500">
            New signups start as Users. Admin roles can access website management.
          </p>
        </div>

        {loading ? (
          <p className="p-8 text-center text-sm text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">
            No user records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Registered</th>
                  <th className="px-5 py-3">Last login</th>
                  <th className="px-5 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((record) => {
                  const ownAccount = record.id === currentUser?.id;
                  const protectedSuperadmin =
                    record.role === 'superadmin' &&
                    currentUser?.role !== 'superadmin';
                  return (
                    <tr key={record.id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {record.name}
                          {ownAccount && (
                            <span className="ml-2 text-xs font-medium text-blue-700">
                              You
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-gray-500">{record.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(record.lastLoginAt)}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={record.role}
                          disabled={
                            ownAccount ||
                            protectedSuperadmin ||
                            savingId === record.id
                          }
                          onChange={(event) =>
                            changeRole(record, event.target.value as UserRole)
                          }
                          className="w-40 border border-gray-300 bg-white px-3 py-2 font-semibold text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                          aria-label={`Role for ${record.name}`}
                        >
                          <option value="user">{roleLabel('user')}</option>
                          <option value="admin">{roleLabel('admin')}</option>
                          {currentUser?.role === 'superadmin' && (
                            <option value="superadmin">
                              {roleLabel('superadmin')}
                            </option>
                          )}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
