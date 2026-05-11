import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, FileText, Trash2, Pencil, Save, X } from 'lucide-react';
import api from '../utils/api';

const toDigits = (value) => String(value || '').replace(/[^\d]/g, '');

const toWhatsappUrl = (value) => {
  const digits = toDigits(value);
  if (!digits) return null;
  const withCountry = digits.length === 10 ? `91${digits}` : digits; // default India for 10-digit numbers
  return `https://wa.me/${withCountry}`;
};

const DonationDetail = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonation = async () => {
      setError('');
      try {
        const res = await api.get(`/admin/donations/${id}`);
        setDonation(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load donation details');
      }
      setLoading(false);
    };

    fetchDonation();
  }, [id]);

  const whatsappUrl = useMemo(() => toWhatsappUrl(donation?.whatsapp || donation?.phone), [donation?.whatsapp, donation?.phone]);

  const openReceipt = () => {
    if (!donation?.id) return;
    const apiBase = String(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    window.open(`${apiBase}/api/certificates/generate/donation/${donation.id}`, '_blank');
  };

  const startEdit = () => {
    setEditing(true);
    setForm({
      id: donation.id,
      name: donation.name || '',
      email: donation.email || '',
      phone: donation.phone || '',
      whatsapp: donation.whatsapp || '',
      type: donation.type || 'cow',
      quantity: donation.quantity ?? 1,
      amount: donation.amount ?? 0,
      status: donation.status || 'pending',
      require80G: !!donation.require80G,
      address: donation.address || '',
      pan: donation.pan || '',
      referral: donation.referral || '',
      profession: donation.profession || '',
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
      const res = await api.put(`/admin/donations/${form.id}`, form);
      setDonation(res.data);
      setEditing(false);
      setForm(null);
    } catch (err) {
      alert('Failed to update donation');
    }
    setSaving(false);
  };

  const deleteDonation = async () => {
    if (!donation?.id) return;
    const ok = confirm(`Delete donation #${donation.id}? This cannot be undone.`);
    if (!ok) return;
    try {
      await api.delete(`/admin/donations/${donation.id}`);
      window.location.href = '/donations';
    } catch (err) {
      alert('Failed to delete donation');
    }
  };

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
        <Link to="/donations" className="inline-flex items-center gap-2 text-[#4D2D0E] font-bold"><ArrowLeft size={18} /> Back to Donations</Link>
      </div>
    );
  }

  if (!donation) return <div className="text-center text-gray-500">Donation not found.</div>;

  const detailRow = (label, value) => (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">{label}</p>
      <p className="text-lg font-semibold text-gray-800 mt-2 break-words">{value || '-'}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">Donation Details</h2>
          <p className="text-gray-400 font-medium">Shows the exact details saved at payment time.</p>
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
          <button onClick={openReceipt} className="inline-flex items-center gap-2 rounded-2xl bg-orange-50 px-5 py-3 text-[#FF9933] font-black hover:bg-[#FF9933] hover:text-white transition-all">
            <FileText size={18} /> Receipt (PDF)
          </button>
          <button onClick={deleteDonation} className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-red-700 font-black hover:bg-red-600 hover:text-white transition-all">
            <Trash2 size={18} /> Delete
          </button>
          <Link to="/donations" className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-all">
            <ArrowLeft size={18} /> Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {detailRow('Donation ID', `#${donation.id}`)}
          {!editing ? detailRow('Status', donation.status) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Status</p>
              <select className="input-field py-4 font-bold mt-2" value={form?.status || 'pending'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">pending</option>
                <option value="success">success</option>
                <option value="failed">failed</option>
              </select>
            </div>
          )}
          {detailRow(
            'Created',
            donation.createdAt
              ? new Date(donation.createdAt).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : '-'
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!editing ? detailRow('Name', donation.name) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Name</p>
              <input className="input-field py-4 font-bold mt-2" value={form?.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          )}
          {!editing ? detailRow('Email', donation.email) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Email</p>
              <input className="input-field py-4 font-bold mt-2" value={form?.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          )}
          {!editing ? detailRow('Phone', donation.phone) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Phone</p>
              <input className="input-field py-4 font-bold mt-2" value={form?.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          )}
          {!editing ? (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">WhatsApp</p>
              <div className="text-lg font-semibold text-gray-800 mt-2 break-words">
                {whatsappUrl ? (
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-[#FF9933] hover:underline">
                    {donation.whatsapp || donation.phone}
                  </a>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">WhatsApp</p>
              <input className="input-field py-4 font-bold mt-2" value={form?.whatsapp || ''} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!editing ? detailRow('Type', donation.type) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Type</p>
              <select className="input-field py-4 font-bold mt-2" value={form?.type || 'cow'} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="cow">cow</option>
                <option value="bhandara">bhandara</option>
              </select>
            </div>
          )}
          {!editing ? detailRow('Quantity', String(donation.quantity ?? '')) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Quantity</p>
              <input type="number" className="input-field py-4 font-bold mt-2" value={form?.quantity ?? 1} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
          )}
          {!editing ? detailRow('Amount', donation.amount !== undefined ? `₹${Number(donation.amount).toLocaleString()}` : '-') : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Amount (₹)</p>
              <input type="number" className="input-field py-4 font-bold mt-2" value={form?.amount ?? 0} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!editing ? detailRow('80G Requested', donation.require80G ? 'Yes' : 'No') : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">80G Requested</p>
              <label className="mt-3 inline-flex items-center gap-3 font-bold text-gray-700">
                <input type="checkbox" checked={!!form?.require80G} onChange={(e) => setForm({ ...form, require80G: e.target.checked })} />
                Mark as 80G requested
              </label>
            </div>
          )}
          {!editing ? detailRow('PAN', donation.pan) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">PAN</p>
              <input className="input-field py-4 font-bold mt-2" value={form?.pan || ''} onChange={(e) => setForm({ ...form, pan: e.target.value })} />
            </div>
          )}
          {!editing ? detailRow('Referral', donation.referral) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Referral</p>
              <input className="input-field py-4 font-bold mt-2" value={form?.referral || ''} onChange={(e) => setForm({ ...form, referral: e.target.value })} />
            </div>
          )}
          {!editing ? detailRow('Profession', donation.profession) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Profession</p>
              <input className="input-field py-4 font-bold mt-2" value={form?.profession || ''} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {!editing ? detailRow('Address', donation.address) : (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Address</p>
              <textarea className="input-field py-4 font-bold mt-2 min-h-[110px]" value={form?.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detailRow('Razorpay Order ID', donation.razorpay_order_id)}
          {detailRow('Razorpay Payment ID', donation.razorpay_payment_id)}
        </div>
      </div>
    </div>
  );
};

export default DonationDetail;
