import { useState } from 'react';
import { submitContact } from '../../api';
import { useSettings } from '../../context/SettingsContext';

export default function ContactSection({ data }: { data: Record<string, any> }) {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const title = data.title || 'Get in Touch';
  const address = data.address || settings?.address;
  const phone = data.phone || settings?.phone;
  const email = data.email || settings?.email;
  const hours = data.hours || settings?.hours;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="container-brand grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-3xl font-bold text-blue-900">{title}</h2>
          <div className="space-y-4 text-gray-700">
            {address && <p><strong>Address:</strong> {address}</p>}
            {phone && <p><strong>Phone:</strong> {phone}</p>}
            {email && <p><strong>Email:</strong> {email}</p>}
            {hours && <p><strong>Hours:</strong> {hours}</p>}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 bg-white p-6 shadow-sm">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border border-gray-300 bg-white px-4 py-2" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="w-full border border-gray-300 bg-white px-4 py-2" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border border-gray-300 bg-white px-4 py-2" />
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="w-full border border-gray-300 bg-white px-4 py-2" />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={4} className="w-full border border-gray-300 bg-white px-4 py-2" required />
          <button type="submit" className="btn-primary w-full" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'success' && <p className="text-center text-blue-600">Thank you! We will contact you soon.</p>}
          {status === 'error' && <p className="text-center text-red-600">Something went wrong. Please try again.</p>}
        </form>
      </div>
    </section>
  );
}
