import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

interface KYCGuardOverlayProps {
  children?: React.ReactNode;
}

export function KYCGuardOverlay({ children }: KYCGuardOverlayProps) {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  if (loading) return null;

  // 🎯 VERROU ABSOLU : Si le compte est validé, on affiche normalement les fonctionnalités financières
  if (profile?.kyc_status === 'verified' || profile?.kyc_completed === true) {
    return <>{children}</>;
  }

  const isRejected = profile?.kyc_status === 'rejected';

  return (
    <div className="relative w-full h-full min-h-[70vh]">
      
      {/* 1. FLOUTAGE ET INACTIVATION DES COMPOSANTS FINANCIERS SOUS-JACENTS */}
      <div className="w-full h-full pointer-events-none select-none filter blur-[5px] opacity-40">
        {children || (
          <div className="p-8 space-y-6">
            <div className="h-32 bg-slate-200 rounded-3xl" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-slate-200 rounded-2xl" />
              <div className="h-24 bg-slate-200 rounded-2xl" />
            </div>
            <div className="h-48 bg-slate-200 rounded-3xl" />
          </div>
        )}
      </div>

      {/* 2. ENCLAVE VISUELLE DE NOTIFICATION ET VERROUILLAGE SÉCURISÉ */}
      <div className="absolute inset-0 flex items-center justify-center p-6 bg-transparent z-40">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg ${
            isRejected ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
          }`}>
            {isRejected ? <ShieldAlert className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
          </div>

          <div className="space-y-2">
            <h2 className="text-[#0F172A] text-xl font-extrabold tracking-tight">
              {isRejected ? 'Dossier de conformité rejeté' : 'Compte en cours de validation'}
            </h2>
            <p className="text-[#475569] text-xs leading-relaxed px-2">
              {isRejected 
                ? "Vos pièces justificatives n'ont pas pu être validées par notre équipe de conformité. Veuillez soumettre à nouveau vos documents réglementaires."
                : "Bonjour ! Vos pièces justificatives ont été transmises avec succès au registre central de KAURI. Votre dossier est en cours d'analyse."}
            </p>
          </div>

          {/* LA NOTIFICATION EXPLICITE DES 24H */}
          {!isRejected && (
            <div className="bg-[#E6F4F5] border border-[#006D77]/10 rounded-2xl p-4 text-left">
              <p className="text-[#006D77] text-xs font-semibold leading-relaxed text-center">
                ⏳ Activation de vos accès financiers sous 24 heures maximum.
              </p>
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-4 text-left text-[11px] text-slate-500 leading-normal space-y-1.5 border border-slate-100">
            <p className="font-bold text-slate-700">Fonctionnalités gelées temporairement :</p>
            <p>• Création, adhésion et paiement de Tontines</p>
            <p>• Dépôts, retraits et transferts de capitaux</p>
            <p>• Souscription aux levées de fonds</p>
          </div>

          <button
            onClick={() => navigate('/kauri/kyc-verification')}
            className={`w-full py-4 rounded-xl text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-none ${
              isRejected ? 'bg-red-500 hover:bg-red-600' : 'bg-[#006D77] hover:bg-[#00525a]'
            }`}
          >
            <span>{isRejected ? 'Soumettre à nouveau les pièces' : 'Vérifier mes documents'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
