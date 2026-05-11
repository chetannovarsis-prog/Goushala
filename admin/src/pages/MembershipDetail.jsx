import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, ClipboardList, Phone, Mail, Calendar, MapPin, FileText, ShieldCheck, Pencil, Save, Trash2, X } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations as allTranslations } from '../utils/translations';

const toDigits = (value) => String(value || '').replace(/[^\d]/g, '');

const toWhatsappUrl = (value) => {
  const digits = toDigits(value);
  if (!digits) return null;
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountry}`;
};

const MembershipDetail = () => {
  const { language } = useLanguage();
  const t = allTranslations[language];
  const { id } = useParams();
  const [membership, setMembership] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const whatsappUrl = useMemo(
    () => toWhatsappUrl(membership?.whatsapp || membership?.phone),
    [membership?.whatsapp, membership?.phone]
  );

  useEffect(() => {
    const fetchMembership = async () => {
      setError('');
      try {
        const res = await api.get(`/admin/memberships/${id}`);
        setMembership(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load membership details');
      }
      setLoading(false);
    };

    fetchMembership();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FF9933]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-3xl p-6 font-semibold">{error}</div>
        <Link to="/memberships" className="inline-flex items-center gap-2 text-[#4D2D0E] font-bold"> <ArrowLeft size={18} /> Back to Memberships</Link>
      </div>
    );
  }

  if (!membership) {
    return <div className="text-center text-gray-500">Membership not found.</div>;
  }

  const startEdit = () => {
    setEditing(true);
    setForm({
      id: membership.id,
      memberId: membership.memberId,
      userId: membership.userId ?? 0,
      name: membership.name || '',
      email: membership.email || '',
      phone: membership.phone || '',
      whatsapp: membership.whatsapp || '',
      type: membership.type || 'yearly',
      planAmount: membership.planAmount ?? 0,
      status: membership.status || 'active',
      payment_status: membership.payment_status || 'pending',
      require80G: !!membership.require80G,
      address: membership.address || '',
      pan: membership.pan || '',
      referral: membership.referral || '',
      profession: membership.profession || '',
      startDate: membership.startDate ? new Date(membership.startDate).toISOString().split('T')[0] : '',
      endDate: membership.endDate ? new Date(membership.endDate).toISOString().split('T')[0] : '',
      certificateUrl: membership.certificateUrl || '',
    });
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm(null);
  };

  const saveEdit = async () => {
    if (!form?.id) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };
      const res = await api.put(`/admin/memberships/${form.id}`, payload);
      setMembership(res.data);
      setEditing(false);
      setForm(null);
    } catch (err) {
      alert('Failed to update membership');
    }
    setSaving(false);
  };

  const deleteMembership = async () => {
    const ok = confirm(`Delete membership #${membership.id}? This cannot be undone.`);
    if (!ok) return;
    try {
      await api.delete(`/admin/memberships/${membership.id}`);
      window.location.href = '/memberships';
    } catch (err) {
      alert('Failed to delete membership');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">Member Details</h2>
          <p className="text-gray-400 font-medium">Review the complete membership record for {membership.name || 'this member'}.</p>
        </div>
        <div className="flex items-center gap-3">
          {!editing ? (
            <button onClick={startEdit} className="inline-flex items-center gap-2 rounded-2xl bg-orange-50 px-5 py-3 text-[#FF9933] font-black hover:bg-[#FF9933] hover:text-white transition-all">
              <Pencil size={18} /> Edit
            </button>
          ) : (
            <>
              <button onClick={cancelEdit} className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-all">
                <X size={18} /> Cancel
              </button>
              <button disabled={saving} onClick={saveEdit} className="inline-flex items-center gap-2 rounded-2xl bg-[#4D2D0E] px-5 py-3 text-white font-black hover:bg-black transition-all disabled:opacity-60">
                <Save size={18} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
          <button onClick={deleteMembership} className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-red-700 font-black hover:bg-red-600 hover:text-white transition-all">
            <Trash2 size={18} /> Delete
          </button>
          <Link to="/memberships" className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-all">
            <ArrowLeft size={18} /> Back to list
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400 font-bold">Member ID</p>
              <h3 className="text-3xl font-black text-gray-800 mt-2">#{membership.memberId}</h3>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${membership.type === 'lifetime' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                <ShieldCheck size={16} /> {membership.type}
              </span>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500">{membership.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Name</p>
                {!editing ? (
                  <p className="text-lg font-semibold text-gray-800 mt-2">{membership.name || '-'}</p>
                ) : (
                  <input className="input-field py-4 font-bold mt-2" value={form?.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Phone</p>
                {!editing ? (
                  <p className="text-lg font-semibold text-gray-800 mt-2">{membership.phone || membership.whatsapp || '-'}</p>
                ) : (
                  <input className="input-field py-4 font-bold mt-2" value={form?.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Email</p>
                {!editing ? (
                  <p className="text-lg font-semibold text-gray-800 mt-2">{membership.email || '-'}</p>
                ) : (
                  <input className="input-field py-4 font-bold mt-2" value={form?.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Plan Amount</p>
                {!editing ? (
                  <p className="text-lg font-semibold text-gray-800 mt-2">₹{membership.planAmount?.toLocaleString() || '0'}</p>
                ) : (
                  <input type="number" className="input-field py-4 font-bold mt-2" value={form?.planAmount ?? 0} onChange={(e) => setForm({ ...form, planAmount: e.target.value })} />
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Start Date</p>
                {!editing ? (
                  <p className="text-lg font-semibold text-gray-800 mt-2">{new Date(membership.startDate).toLocaleDateString()}</p>
                ) : (
                  <input type="date" className="input-field py-4 font-bold mt-2" value={form?.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">End Date</p>
                {!editing ? (
                  <p className="text-lg font-semibold text-gray-800 mt-2">{membership.endDate ? new Date(membership.endDate).toLocaleDateString() : 'Infinite'}</p>
                ) : (
                  <input type="date" className="input-field py-4 font-bold mt-2" value={form?.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-[#FFFAF0] border border-[#FCE7A1] p-6">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#B45309]">Membership Notes</p>
              {!editing ? (
                <>
                  <p className="mt-4 text-gray-700 text-sm">{membership.referral ? `Referral: ${membership.referral}` : 'No referral details provided.'}</p>
                  <p className="mt-2 text-gray-700 text-sm">{membership.profession ? `Profession: ${membership.profession}` : 'No profession details provided.'}</p>
                </>
              ) : (
                <div className="mt-4 space-y-3">
                  <input className="input-field py-4 font-bold" placeholder="Referral" value={form?.referral || ''} onChange={(e) => setForm({ ...form, referral: e.target.value })} />
                  <input className="input-field py-4 font-bold" placeholder="Profession" value={form?.profession || ''} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
                </div>
              )}
            </div>
            <div className="rounded-3xl bg-[#F0F9FF] border border-[#BFDBFE] p-6">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#1D4ED8]">Additional Details</p>
              {!editing ? (
                <>
                  <p className="mt-4 text-gray-700 text-sm">{membership.address ? `Address: ${membership.address}` : 'No address provided.'}</p>
                  <p className="mt-2 text-gray-700 text-sm">{membership.pan ? `PAN: ${membership.pan}` : 'No PAN provided.'}</p>
                  <p className="mt-2 text-gray-700 text-sm">{membership.require80G ? '80G Certificate requested' : '80G not requested'}</p>
                </>
              ) : (
                <div className="mt-4 space-y-3">
                  <textarea className="input-field py-4 font-bold min-h-[90px]" placeholder="Address" value={form?.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  <input className="input-field py-4 font-bold" placeholder="PAN" value={form?.pan || ''} onChange={(e) => setForm({ ...form, pan: e.target.value })} />
                  <label className="flex items-center gap-3 font-bold text-gray-700">
                    <input type="checkbox" checked={!!form?.require80G} onChange={(e) => setForm({ ...form, require80G: e.target.checked })} />
                    80G requested
                  </label>
                </div>
              )}
            </div>
          </div>

          {membership.certificateUrl && (
            <a
              href={membership.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FF9933] px-6 py-3 text-white font-bold hover:bg-[#f59e0b] transition-all"
            >
              <FileText size={18} /> View Certificate
            </a>
          )}

          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black ml-4">Type</label>
                <select className="input-field py-4 font-bold" value={form?.type || 'yearly'} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="yearly">yearly</option>
                  <option value="lifetime">lifetime</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black ml-4">Status</label>
                <select className="input-field py-4 font-bold" value={form?.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">active</option>
                  <option value="expired">expired</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black ml-4">Payment</label>
                <select className="input-field py-4 font-bold" value={form?.payment_status || 'pending'} onChange={(e) => setForm({ ...form, payment_status: e.target.value })}>
                  <option value="pending">pending</option>
                  <option value="success">success</option>
                  <option value="failed">failed</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black ml-4">Certificate URL</label>
                <input className="input-field py-4 font-bold" value={form?.certificateUrl || ''} onChange={(e) => setForm({ ...form, certificateUrl: e.target.value })} />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400 font-black">Contact Details</p>
            <div className="mt-4 grid gap-4">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#4D2D0E]" />
                <span className="font-semibold text-gray-800">{membership.phone || '-'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#4D2D0E]" />
                <span className="font-semibold text-gray-800">{membership.email || '-'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[#4D2D0E]" />
                <span className="font-semibold text-gray-800">{membership.address || 'No address'}</span>
              </div>
              {whatsappUrl && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-green-600" />
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#FF9933] hover:underline">
                    WhatsApp: {membership.whatsapp || membership.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-gray-50 p-5 border border-gray-100">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 font-black">Account Details</p>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-semibold">{membership.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Plan Amount</span>
                <span className="font-semibold">₹{membership.planAmount?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Created On</span>
                <span className="font-semibold">
                  {new Date(membership.createdAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {membership.razorpay_payment_id && (
                <div className="flex justify-between">
                  <span>Transaction ID</span>
                  <span className="font-semibold">{membership.razorpay_payment_id}</span>
                </div>
              )}
              {membership.razorpay_order_id && (
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-semibold">{membership.razorpay_order_id}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipDetail;
