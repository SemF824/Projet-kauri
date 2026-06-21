import { ArrowLeft, Shield, Users, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function MultiSignatureValidationScreen() {
  const navigate = useNavigate();
  const [guardians] = useState([
    { name: 'Marie Laurent', status: 'approved', avatar: 'ML', time: 'Il y a 2h' },
    { name: 'Jean-Pierre Louis', status: 'pending', avatar: 'JP', time: 'En attente' },
    { name: 'Sophie Bernard', status: 'approved', avatar: 'SB', time: 'Il y a 5h' },
  ]);

  const transaction = {
    amount: 50000,
    recipient: 'Lolo Moderne Restaurant',
    purpose: 'Levée de fonds - Expansion',
    date: '20 avril 2026',
  };

  const approvedCount = guardians.filter((g) => g.status === 'approved').length;
  const requiredApprovals = 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Shield className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-white text-2xl mb-2">Validation Multi-Signatures</h1>
          <p className="text-[#E0F2FE] text-sm">Sécurité renforcée pour transactions importantes</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
          <div className="text-center mb-4">
            <p className="text-white/90 text-sm mb-2">Progression des Validations</p>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-white text-3xl">{approvedCount}</span>
              <span className="text-white/80 text-xl">/</span>
              <span className="text-white/80 text-2xl">{requiredApprovals}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all duration-500"
                style={{ width: `${(approvedCount / requiredApprovals) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Détails de la transaction */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#006D77]/10 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#006D77]" />
            </div>
            Détails de la Transaction
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl">
              <span className="text-[#64748B] text-sm">Montant</span>
              <span className="text-[#0F172A] text-lg">
                {transaction.amount.toLocaleString()} €
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl">
              <span className="text-[#64748B] text-sm">Bénéficiaire</span>
              <span className="text-[#0F172A]">{transaction.recipient}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl">
              <span className="text-[#64748B] text-sm">Objet</span>
              <span className="text-[#0F172A] text-sm">{transaction.purpose}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl">
              <span className="text-[#64748B] text-sm">Date de demande</span>
              <span className="text-[#0F172A] text-sm">{transaction.date}</span>
            </div>
          </div>
        </div>

        {/* Liste des Gardiens */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-[#D4AF37]" />
            </div>
            Gardiens du Cercle
          </h3>

          <div className="space-y-3">
            {guardians.map((guardian, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all ${
                  guardian.status === 'approved'
                    ? 'bg-[#D1FAE5] border-[#006D77]'
                    : guardian.status === 'pending'
                    ? 'bg-[#FEF3C7] border-[#D4AF37]'
                    : 'bg-[#FEE2E2] border-[#EF4444]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center text-white shadow-lg">
                      {guardian.avatar}
                    </div>
                    <div>
                      <p className="text-[#0F172A]">{guardian.name}</p>
                      <p className="text-xs text-[#64748B]">{guardian.time}</p>
                    </div>
                  </div>

                  <div>
                    {guardian.status === 'approved' && (
                      <div className="flex items-center gap-2 text-[#006D77]">
                        <CheckCircle2 className="w-6 h-6 animate-scaleIn" />
                        <span className="text-sm">Approuvé</span>
                      </div>
                    )}
                    {guardian.status === 'pending' && (
                      <div className="flex items-center gap-2 text-[#D97706]">
                        <Clock className="w-6 h-6 animate-pulse" />
                        <span className="text-sm">En attente</span>
                      </div>
                    )}
                    {guardian.status === 'rejected' && (
                      <div className="flex items-center gap-2 text-[#EF4444]">
                        <XCircle className="w-6 h-6" />
                        <span className="text-sm">Refusé</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-[#E0F2FE] rounded-xl p-4 border border-[#006D77]/30">
            <p className="text-[#0369A1] text-sm">
              <strong>ℹ️ Sécurité Anti-Fraude :</strong>
              <br />
              Cette transaction nécessite l'approbation de {requiredApprovals} gardiens de confiance
              pour être validée et exécutée.
            </p>
          </div>
        </div>

        {/* Statut de la validation */}
        {approvedCount === requiredApprovals ? (
          <div className="bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] rounded-2xl p-6 border-2 border-[#006D77] shadow-xl">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-[#006D77] mx-auto mb-4 animate-bounce" />
              <h3 className="text-[#0F172A] text-xl mb-2">Validation Complète !</h3>
              <p className="text-[#006D77] text-sm mb-4">
                La transaction a été approuvée par tous les gardiens et sera exécutée sous 24h.
              </p>
              <button className="bg-[#006D77] text-white px-6 py-3 rounded-xl">
                Voir les Détails
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-2xl p-6 border-2 border-[#D4AF37] shadow-xl">
            <div className="text-center">
              <Clock className="w-16 h-16 text-[#D97706] mx-auto mb-4 animate-pulse" />
              <h3 className="text-[#0F172A] text-xl mb-2">En Attente de Validation</h3>
              <p className="text-[#92400E] text-sm">
                {requiredApprovals - approvedCount} signature(s) manquante(s) pour valider la
                transaction.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
