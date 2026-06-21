import { AlertTriangle, FileText, Calendar, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';

export function SuspendedAccountScreen() {
  const navigate = useNavigate();

  const suspensionDetails = {
    reason: 'Non-Respect des Politiques de Paiement',
    date: '15 avril 2026',
    rehabilitationDate: '15 mai 2026',
    daysRemaining: 30,
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Overlay Terracotta translucide */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#B05B3B]/20 to-[#B05B3B]/40 backdrop-blur-sm"></div>

      {/* Motif de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 50px),
                             repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 50px)`,
          }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* Icône d'alerte animée */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#B05B3B]/20 border-4 border-[#B05B3B] flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-12 h-12 text-[#B05B3B]" />
            </div>
            <div className="inline-block px-6 py-3 bg-[#B05B3B]/10 border-2 border-[#B05B3B] rounded-full">
              <p className="text-[#B05B3B] uppercase tracking-wide text-sm">
                Compte Suspendu
              </p>
            </div>
          </div>

          {/* Carte principale */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
            <h1 className="text-[#0F172A] text-2xl text-center mb-4">
              Accès Temporairement Restreint
            </h1>

            <div className="bg-[#B05B3B]/10 border-l-4 border-[#B05B3B] rounded-lg p-4 mb-6">
              <p className="text-[#4A4A4A] mb-2">
                <strong>Raison de la suspension :</strong>
              </p>
              <p className="text-[#4A4A4A] text-sm">{suspensionDetails.reason}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-xl">
                <Calendar className="w-5 h-5 text-[#64748B]" />
                <div>
                  <p className="text-xs text-[#64748B]">Date de suspension</p>
                  <p className="text-[#0F172A]">{suspensionDetails.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#D4AF37]/10 to-[#FEF3C7] rounded-xl border border-[#D4AF37]/30">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <p className="text-xs text-[#92400E]">Délai de Réhabilitation</p>
                  <p className="text-[#0F172A]">
                    {suspensionDetails.rehabilitationDate} ({suspensionDetails.daysRemaining}{' '}
                    jours restants)
                  </p>
                </div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-[#64748B] mb-2">
                <span>Temps écoulé</span>
                <span>0 / {suspensionDetails.daysRemaining} jours</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#B05B3B] to-[#D4AF37] w-0 transition-all duration-1000"></div>
              </div>
            </div>

            <div className="bg-[#E0F2FE] rounded-xl p-4 border border-[#006D77]/30 mb-6">
              <p className="text-[#0369A1] text-sm">
                <strong>Que faire maintenant ?</strong>
              </p>
              <ul className="text-[#0369A1] text-xs space-y-1 mt-2">
                <li>• Respectez le délai de réhabilitation</li>
                <li>• Régularisez votre situation si applicable</li>
                <li>• Contactez le support pour plus d'informations</li>
              </ul>
            </div>

            <button className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl mb-3 shadow-lg flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Faire Appel de la Décision</span>
            </button>

            <button className="w-full bg-white border-2 border-[#E2E8F0] text-[#64748B] py-4 rounded-xl flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              <span>Contacter le Support</span>
            </button>
          </div>

          {/* Info supplémentaire */}
          <div className="text-center">
            <p className="text-white/80 text-sm">
              En cas de désaccord, vous disposez d'un délai de 15 jours pour faire appel.
            </p>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                localStorage.removeItem('kauri_account_type');
                navigate('/kauri');
              }}
              className="text-white/60 text-sm underline"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
