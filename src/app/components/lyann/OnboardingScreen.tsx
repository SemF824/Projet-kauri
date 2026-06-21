import { Shield, Fingerprint, Wallet, ArrowRight } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D9488] to-[#14B8A6] px-6 py-8 flex flex-col">
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
          <span className="text-white text-2xl">K</span>
        </div>
        <h1 className="text-white text-3xl mb-2">Bienvenue sur KAURI</h1>
        <p className="text-[#F1F5F9] text-sm">L'Unité dans la Finance, la Force dans la Communauté</p>
      </div>

      <div className="flex-1 bg-[#F8FAFC] rounded-3xl p-6 shadow-2xl">
        <h2 className="text-[#0F172A] mb-2 text-center">Secure Your Account</h2>
        <p className="text-[#64748B] text-sm text-center mb-8">
          Complete these steps to access your digital wallet
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border-2 border-[#0D9488] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#0D9488]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#0F172A] mb-1">Identity Verification</h3>
                <p className="text-[#64748B] text-sm mb-3">
                  KYC verification to ensure community trust
                </p>
                <div className="flex items-center gap-2 text-xs text-[#0D9488]">
                  <div className="w-2 h-2 rounded-full bg-[#0D9488]"></div>
                  <span>Government ID • Selfie Verification</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                <Fingerprint className="w-6 h-6 text-[#D97706]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#0F172A] mb-1">Biometric Setup</h3>
                <p className="text-[#64748B] text-sm mb-3">
                  Secure login with Face ID or Fingerprint
                </p>
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <div className="w-2 h-2 rounded-full bg-[#CBD5E1]"></div>
                  <span>Quick & Secure Access</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                <Wallet className="w-6 h-6 text-[#D97706]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#0F172A] mb-1">Digital Wallet Creation</h3>
                <p className="text-[#64748B] text-sm mb-3">
                  Your secure vault for all transactions
                </p>
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <div className="w-2 h-2 rounded-full bg-[#CBD5E1]"></div>
                  <span>Bank-Level Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Start Verification</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-center text-[#64748B]">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <div className="w-2 h-2 rounded-full bg-white"></div>
        <div className="w-2 h-2 rounded-full bg-white/40"></div>
        <div className="w-2 h-2 rounded-full bg-white/40"></div>
      </div>
    </div>
  );
}
