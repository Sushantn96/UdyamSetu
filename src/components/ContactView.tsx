import React, { useState } from 'react';
import { Phone, Mail, MapPin, Building, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

export const ContactView: React.FC<{ language: Language }> = ({ language }) => {
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrievanceSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="contact-helpline-section">
      {/* Title */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {language === 'hi' ? 'संपर्क, हेल्पलाइन एवं शिकायत निवारण' : 'Helpline & Grievance Redressal Directory'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ministry of Social Justice and Empowerment • Concessional Credit Citizen Support Services
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contact Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2">
              National Helplines & Offices
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-lg border border-slate-200">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold">National Concessional Loan Toll-Free Helpline</strong>
                  <span className="text-slate-900 font-bold text-sm">1800-11-2001 / 1800-180-7777</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Toll-free across all telecom networks (9:30 AM to 6:00 PM, Monday to Saturday)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-lg border border-slate-200">
                <Building className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold">Ministry Central Secretariat</strong>
                  <p className="text-[11px] text-slate-600">
                    Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-lg border border-slate-200">
                <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold">Official Electronic Mail</strong>
                  <span className="text-slate-800 font-medium">support-udyamsetu@gov.in</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 text-xs text-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span>District Level Inquiries</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              For field appraisals, physically inspectable asset verification, and prompt loan sanctioning, please contact your respective <strong>District Industries Centre (DIC)</strong> or <strong>State Channelising Agency (SCA)</strong> office located at your district headquarters.
            </p>
          </div>
        </div>

        {/* Grievance Redressal Form */}
        <div className="lg:col-span-6 bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2">
            Citizen Grievance & Query Redressal Form
          </h3>

          {grievanceSubmitted ? (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-semibold text-emerald-950">Grievance Ticket Registered Successfully</h4>
              <p className="text-xs text-slate-600">
                Your complaint token <strong>#MOSJE-GRV-{Math.floor(100000 + Math.random() * 900000)}</strong> has been lodged. A designated nodal officer will review your query within 48 business hours.
              </p>
              <button
                onClick={() => setGrievanceSubmitted(false)}
                className="mt-3 text-xs text-slate-900 underline font-semibold hover:text-slate-700"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Full Name of Entrepreneur / Applicant *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rameshwar Prasad"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-hidden text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-hidden text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Query or Grievance Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please state details regarding loan eligibility, bank branch refusal, or portal technical assistance..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-hidden text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-md transition shadow-2xs"
              >
                Submit Citizen Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
