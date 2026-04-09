import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, ClipboardList, Phone, Mail, Calendar, MapPin, FileText, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { translations as allTranslations } from '../utils/translations';

const MembershipDetail = () => {
  const { language } = useLanguage();
  const t = allTranslations[language];
  const { id } = useParams();
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">Member Details</h2>
          <p className="text-gray-400 font-medium">Review the complete membership record for {membership.name || 'this member'}.</p>
        </div>
        <Link to="/memberships" className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-all">
          <ArrowLeft size={18} /> Back to list
        </Link>
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
                <p className="text-lg font-semibold text-gray-800 mt-2">{membership.name || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Phone</p>
                <p className="text-lg font-semibold text-gray-800 mt-2">{membership.phone || membership.whatsapp || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Email</p>
                <p className="text-lg font-semibold text-gray-800 mt-2">{membership.email || '-'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Plan Amount</p>
                <p className="text-lg font-semibold text-gray-800 mt-2">₹{membership.planAmount?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Start Date</p>
                <p className="text-lg font-semibold text-gray-800 mt-2">{new Date(membership.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">End Date</p>
                <p className="text-lg font-semibold text-gray-800 mt-2">{membership.endDate ? new Date(membership.endDate).toLocaleDateString() : 'Infinite'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-[#FFFAF0] border border-[#FCE7A1] p-6">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#B45309]">Membership Notes</p>
              <p className="mt-4 text-gray-700 text-sm">{membership.referral ? `Referral: ${membership.referral}` : 'No referral details provided.'}</p>
              <p className="mt-2 text-gray-700 text-sm">{membership.profession ? `Profession: ${membership.profession}` : 'No profession details provided.'}</p>
            </div>
            <div className="rounded-3xl bg-[#F0F9FF] border border-[#BFDBFE] p-6">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#1D4ED8]">Additional Details</p>
              <p className="mt-4 text-gray-700 text-sm">{membership.address ? `Address: ${membership.address}` : 'No address provided.'}</p>
              <p className="mt-2 text-gray-700 text-sm">{membership.pan ? `PAN: ${membership.pan}` : 'No PAN provided.'}</p>
              <p className="mt-2 text-gray-700 text-sm">{membership.require80G ? '80G Certificate requested' : '80G not requested'}</p>
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
                <span className="font-semibold">{new Date(membership.createdAt).toLocaleDateString()}</span>
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
