import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ShoppingBag, Calendar, Sparkles, Receipt, FileText } from 'lucide-react';
import { Artwork } from '../types';

interface ArtworkPurchaseModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtworkPurchaseModal({ artwork, isOpen, onClose }: ArtworkPurchaseModalProps) {
  const [activeTab, setActiveTab] = useState<'purchase' | 'rent'>('purchase');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Form States - Purchase
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [whiteGloveSetup, setWhiteGloveSetup] = useState<boolean>(true);

  // Form States - Rent
  const [renterName, setRenterName] = useState('');
  const [renterEmail, setRenterEmail] = useState('');
  const [rentalPeriod, setRentalPeriod] = useState<string>('3-months');
  const [rentalOccasion, setRentalOccasion] = useState<string>('corporate');
  const [customOccasion, setCustomOccasion] = useState('');
  const [startDate, setStartDate] = useState<string>('2026-07-01');

  // Computed Prices
  const isGiant = artwork?.id === 'art-back-giant';
  const basePurchasePrice = isGiant ? 28400 : 14200;
  const baseMonthlyRent = isGiant ? 850 : 420;

  const framePrice = 0;
  const whiteGlovePrice = whiteGloveSetup ? 450 : 0;
  
  let rentalDurationMonths = 3;
  if (rentalPeriod === '1-month') rentalDurationMonths = 1;
  if (rentalPeriod === '6-months') rentalDurationMonths = 6;
  if (rentalPeriod === '1-year') rentalDurationMonths = 12;

  const totalPrice = activeTab === 'purchase' ? basePurchasePrice + framePrice + whiteGlovePrice : baseMonthlyRent * rentalDurationMonths;

  // Invoice / Contract details generated upon submission
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate luxury blockchain authentication / courier contract routing
    setTimeout(() => {
      const orderId = `ATC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setReceiptData({
        orderId,
        type: activeTab,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
        title: artwork?.title || 'Bespoke Masterpiece',
        artist: artwork?.artist || 'Atelier Resident',
        buyer: activeTab === 'purchase' ? buyerName : renterName,
        email: activeTab === 'purchase' ? buyerEmail : renterEmail,
        details: activeTab === 'purchase' ? {
          whiteGlove: whiteGloveSetup ? 'INCLUDED' : 'STANDARD PORTAGE',
          destination: shippingAddress
        } : {
          period: rentalPeriod.replace('-', ' ').toUpperCase(),
          occasion: rentalOccasion.toUpperCase(),
          start: startDate,
          customDetails: customOccasion || 'None Specified'
        },
        financials: {
          base: activeTab === 'purchase' ? basePurchasePrice : baseMonthlyRent,
          addons: activeTab === 'purchase' ? framePrice + whiteGlovePrice : 0,
          total: totalPrice
        }
      });
      setLoading(false);
      setSuccess(true);
    }, 1800);
  };

  const handleResetModal = () => {
    setSuccess(false);
    setReceiptData(null);
    onClose();
  };

  if (!isOpen || !artwork) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop blur */}
        <motion.div
          id="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Sheet */}
        <motion.div
          id="modal-container"
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative bg-[#0b0b0d] border border-white/10 rounded-xl w-full max-w-4xl max-h-[92dvh] overflow-hidden flex flex-col shadow-2xl text-white font-sans"
        >
          {/* Top header navigation rail */}
          <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-white/10 bg-[#070709] shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-mono tracking-[3px] text-gray-400 uppercase truncate">
                Artwork Inquiry
              </span>
            </div>
            <button
              id="btn-close-modal"
              onClick={onClose}
              aria-label="Close"
              className="text-gray-400 hover:text-white border border-white/10 hover:border-white/35 rounded-lg p-1.5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin]">
            <AnimatePresence mode="wait">
              {!success ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 lg:gap-12">
                  
                  {/* LEFT COLUMN: ARTWORK INFO */}
                  <div className="space-y-4 sm:space-y-5">
                    <div className="border border-white/10 p-2.5 sm:p-3 bg-black/40 rounded-lg overflow-hidden flex items-center justify-center min-h-[140px] md:min-h-[300px]">
                      {artwork.customImageUrl ? (
                        <img
                          src={artwork.customImageUrl}
                          alt={artwork.title}
                          className="max-w-full max-h-[160px] md:max-h-[350px] object-contain rounded"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="relative w-full aspect-square bg-neutral-950 flex items-center justify-center rounded border border-white/5">
                          <span className="text-white/45 font-mono text-xs uppercase">PREVIEW</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex justify-between items-baseline gap-3">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight uppercase text-white font-sans">
                          {artwork.title}
                        </h2>
                        <span className="text-xs font-mono text-gray-400 shrink-0">{artwork.year}</span>
                      </div>
                      
                      <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400 flex items-center gap-1.5">
                        Artist: <span className="text-white font-sans text-xs">{artwork.artist}</span>
                      </div>

                      <div className="p-3 bg-white/5 border border-white/5 rounded text-xs text-gray-300 leading-relaxed font-sans">
                        {artwork.description}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-gray-400 pt-2 border-t border-white/5">
                        <div>
                          <span className="block text-gray-500 uppercase">DIMENSIONS</span>
                          <span className="text-white">{artwork.width}m × {artwork.height}m</span>
                        </div>
                        <div>
                          <span className="block text-gray-500 uppercase">AVAILABILITY</span>
                          <span className="text-emerald-400">● AVAILABLE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: INTERACTIVE CONTRACT GATEWAY */}
                  <div className="flex flex-col bg-white/[0.02] border border-white/5 p-4 sm:p-6 rounded-lg space-y-4">
                    
                    {/* TABS SELECTOR */}
                    <div className="flex border-b border-white/10">
                      <button
                        id="tab-btn-purchase"
                        type="button"
                        onClick={() => setActiveTab('purchase')}
                        className={`flex-1 pb-3 text-center text-xs font-mono tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
                          activeTab === 'purchase'
                            ? 'border-white text-white font-bold'
                            : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                        Purchase
                      </button>
                      <button
                        id="tab-btn-rent"
                        type="button"
                        onClick={() => setActiveTab('rent')}
                        className={`flex-1 pb-3 text-center text-xs font-mono tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
                          activeTab === 'rent'
                            ? 'border-white text-white font-bold'
                            : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                        Rent / Lease
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                      {/* DYNAMIC FORM SEGMENTS */}
                      {activeTab === 'purchase' ? (
                        <div className="space-y-3">
                          <p className="text-[11px] text-gray-400 leading-relaxed">
                            Acquire this original artwork with insured delivery and framing.
                          </p>

                          <div>
                            <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              required
                              value={buyerName}
                              onChange={(e) => setBuyerName(e.target.value)}
                              placeholder="Your full name"
                              className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm focus:border-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              value={buyerEmail}
                              onChange={(e) => setBuyerEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm focus:border-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">
                              Delivery Address
                            </label>
                            <textarea
                              required
                              value={shippingAddress}
                              onChange={(e) => setShippingAddress(e.target.value)}
                              placeholder="Street address, city, country, postal code"
                              className="w-full h-16 bg-black/60 border border-white/10 rounded px-3 py-2 text-sm focus:border-white focus:outline-none resize-none"
                            />
                          </div>

                          <div className="flex items-center gap-3 pt-1">
                            <input
                              id="white-glove-setup"
                              type="checkbox"
                              checked={whiteGloveSetup}
                              onChange={(e) => setWhiteGloveSetup(e.target.checked)}
                              className="w-4 h-4 rounded text-black accent-white cursor-pointer bg-neutral-900 border-neutral-700"
                            />
                            <label htmlFor="white-glove-setup" className="text-xs text-gray-300 font-sans cursor-pointer select-none">
                              Delivery & Wall Installation (+ R 450)
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-[11px] text-gray-400 leading-relaxed">
                            Lease this artwork for private events, home staging, film shoots, or corporate spaces.
                          </p>

                          <div>
                            <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              required
                              value={renterName}
                              onChange={(e) => setRenterName(e.target.value)}
                              placeholder="Your full name"
                              className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm focus:border-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              value={renterEmail}
                              onChange={(e) => setRenterEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm focus:border-white focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">
                                Duration
                              </label>
                              <select
                                value={rentalPeriod}
                                onChange={(e) => setRentalPeriod(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded px-2 py-2 text-xs focus:border-white focus:outline-none"
                              >
                                <option value="1-month">1 Month Lease</option>
                                <option value="3-months">3 Month Lease (-5%)</option>
                                <option value="6-months">6 Month Lease (-12%)</option>
                                <option value="1-year">1 Year Lease (-20%)</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">
                                Occasion
                              </label>
                              <select
                                value={rentalOccasion}
                                onChange={(e) => setRentalOccasion(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded px-2 py-2 text-xs focus:border-white focus:outline-none"
                              >
                                <option value="corporate">Corporate Office</option>
                                <option value="staged-estate">Home Staging</option>
                                <option value="private-galas">Private Gala</option>
                                <option value="film-production">Film / Photo Shoot</option>
                                <option value="social-soiree">Private Reception</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">
                              Venue / Event Details
                            </label>
                            <input
                              type="text"
                              required={rentalOccasion === 'other'}
                              value={customOccasion}
                              onChange={(e) => setCustomOccasion(e.target.value)}
                              placeholder="Venue address or event details"
                              className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm focus:border-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">
                              Exhibition Start Date
                            </label>
                            <input
                              type="date"
                              required
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm focus:border-white focus:outline-none text-white scheme-dark"
                            />
                          </div>
                        </div>
                      )}

                      {/* COMPUTED SUMMARY & ORDER BUTTON */}
                      <div className="pt-4 mt-4 border-t border-white/10 space-y-3 shrink-0">
                        <div className="flex justify-between items-baseline font-mono">
                          <span className="text-[10px] text-gray-400 uppercase">
                            {activeTab === 'purchase' ? 'TOTAL ACQUISITION FEE' : 'TOTAL LEASE FEE'}
                          </span>
                          <span className="text-lg font-bold text-white tracking-wide">
                            R {totalPrice.toLocaleString('en-US')}
                          </span>
                        </div>

                        <button
                          id="submit-transaction-btn"
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-white hover:bg-gray-200 text-black font-semibold text-xs tracking-widest uppercase transition-all rounded shadow-md flex items-center justify-center gap-2 cursor-pointer border border-white"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Verifying Ledger Status...
                            </span>
                          ) : (
                            <>
                              {activeTab === 'purchase' ? <ShoppingBag className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                              {activeTab === 'purchase' ? 'Authorize Custom purchase' : 'Register Lease Contract'}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                </div>
              ) : (
                /* SUCCESS RECEIPT / CONTRACT INVOICE SCREEN */
                <motion.div
                  id="success-receipt-screen"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-xl mx-auto border border-white/10 bg-black/40 p-6 md:p-8 rounded-lg space-y-6 flex flex-col items-center shadow-lg font-mono"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-400 flex items-center justify-center animate-pulse">
                    <Check className="w-6 h-6" />
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="text-sm tracking-[5px] uppercase font-bold text-white font-sans">
                      {receiptData?.type === 'purchase' ? 'Acquisition request Processed' : 'Lease Contract Certified'}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase">
                      Exposition Ledger Registry Complete
                    </p>
                  </div>

                  {/* Curated receipt template */}
                  <div className="w-full border border-dashed border-white/20 p-5 rounded space-y-4 bg-[#050505]">
                    <div className="flex justify-between items-center text-[10px] text-gray-500 border-b border-white/5 pb-2">
                      <span>DOC ID: {receiptData?.orderId}</span>
                      <span>DATE: {receiptData?.date}</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-300">
                      <div className="text-white text-sm font-sans font-bold uppercase tracking-wider">{receiptData?.title}</div>
                      <div className="text-[10px] text-gray-400 uppercase">By {receiptData?.artist}</div>
                      <div className="text-[10px] text-gray-400 uppercase pt-2">
                        {receiptData?.type === 'purchase' ? 'Collector' : 'Lessee'}: <span className="text-white font-sans font-medium">{receiptData?.buyer}</span> ({receiptData?.email})
                      </div>
                    </div>

                    <div className="border-t border-b border-white/5 py-3 space-y-1.5 text-[10px] text-gray-400 uppercase">
                      {receiptData?.type === 'purchase' ? (
                        <>
                          <div className="flex justify-between">
                            <span>Logistics Portage:</span>
                            <span className="text-white">{receiptData?.details.whiteGlove}</span>
                          </div>
                          <div className="flex justify-between pt-1">
                            <span>Destination:</span>
                            <span className="text-white font-sans text-right truncate max-w-[250px]" title={receiptData?.details.destination}>
                              {receiptData?.details.destination}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span>Leasing Duration:</span>
                            <span className="text-white">{receiptData?.details.period}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lease Occasion:</span>
                            <span className="text-white">{receiptData?.details.occasion}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Event Venue:</span>
                            <span className="text-white font-sans text-right truncate max-w-[250px]">
                              {receiptData?.details.customDetails}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Exhibition Start:</span>
                            <span className="text-white">{receiptData?.details.start}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-xs text-gray-300">TOTAL SECURED FEES:</span>
                      <span className="text-lg font-bold text-white tracking-wider">
                        R {receiptData?.financials.total.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>

                  <div className="w-full text-center space-y-4">
                    <p className="text-[10px] text-gray-500 leading-relaxed max-w-sm mx-auto uppercase">
                      An archival specialist will contact you in the next 12 hours with certified export documentations, custom frame mocks, and premium logistical tracking.
                    </p>
                    <button
                      id="btn-confirm-receipt-close"
                      onClick={handleResetModal}
                      className="px-6 py-2 ml-auto bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-[10px] tracking-widest uppercase transition-all rounded shadow cursor-pointer border border-white/20 hover:border-white"
                    >
                      Return to Exhibition
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
