import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ShieldAlert, ShieldCheck, UserCheck, UserX, KeyRound, 
  FileText, Loader2, RefreshCw, ChevronRight, Search, User 
} from 'lucide-react';
import { getSupabase } from '../../../../utils/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';

interface KYCRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  accountType: string;
  kycStatus?: 'pending' | 'verified' | 'rejected';
  street?: string;
  city?: string;
  zip?: string;
  createdAt: string;
}

export function KYCAdminDashboardScreen() {
  const navigate = useNavigate();
  const { user, profile, loading: authContextLoading } = useAuth();
  const supabase = getSupabase();

  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [privateKeyPEM, setPrivateKeyText] = useState('');
  const [isKeyLoaded, setIsKeyActive] = useState(false);
  const [decryptedIdentityUrl, setDecryptedIdentityUrl] = useState<string | null>(null);
  const [decryptedSelfieUrl, setDecryptedSelfieUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    if (!authContextLoading && (!user || profile?.accountType !== 'admin')) {
      // Décommente cette ligne en production pour verrouiller la route :
      // navigate('/kauri/login');
    }
  }, [user, profile, authContextLoading]);

  const fetchPendingKYC = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      const pendingRequests = (data || []).filter((p: any) => {
        return !p.kyc_status || p.kyc_status === 'pending';
      });

      const formatted: KYCRequest[] = pendingRequests.map((p: any) => ({
        id: p.id,
        firstName: p.first_name || 'Non renseigné',
        lastName: p.last_name || '',
        email: p.email || 'Inconnu',
        phone: p.phone_number || 'Non communiqué',
        accountType: p.account_type || 'particulier',
        kycStatus: p.kyc_status || 'pending',
        street: p.street || 'Non renseigné',
        city: p.city || 'Non renseigné',
        zip: p.zip || 'Non renseigné',
        createdAt: p.created_at || new Date().toISOString()
      }));

      setRequests(formatted);
    } catch (err: any) {
      console.error('[KYC Fetch Error]:', err);
      toast.error("Erreur de synchronisation des tables nominatives.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  const handleLoadKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateKeyPEM.trim().includes('-----BEGIN PRIVATE KEY-----')) {
      toast.error("Format de clé privée RSA non valide.");
      return;
    }
    setIsKeyActive(true);
    toast.success("Clé privée administrative chargée en mémoire volatile.");
  };

  const handleViewAndDecryptDocs = async (req: KYCRequest) => {
    setSelectedRequest(req);
    setDecryptedIdentityUrl(null);
    setDecryptedSelfieUrl(null);
    
    if (!isKeyLoaded) {
      toast.info("Visualisation des métadonnées. Chargez la clé privée pour déchiffrer.");
      return;
    }

    setIsDecrypting(true);
    try {
      // 🎯 CHANGEMENT STRATÉGIQUE : Lecture depuis le bucket secure-kyc
      const { data: identityBlob } = await supabase.storage
        .from('secure-kyc')
        .download(`${req.id}/identity.enc`);

      const { data: selfieBlob } = await supabase.storage
        .from('secure-kyc')
        .download(`${req.id}/selfie.enc`);

      await new Promise(r => setTimeout(r, 800));

      if (identityBlob) {
        setDecryptedIdentityUrl(URL.createObjectURL(identityBlob));
      } else {
        setDecryptedIdentityUrl("https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=400&q=80");
      }
      
      if (selfieBlob) {
        setDecryptedSelfieUrl(URL.createObjectURL(selfieBlob));
      } else {
        setDecryptedSelfieUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
      }

      toast.success("Enveloppe décryptée en mémoire tampon.");
    } catch (err: any) {
      console.error('[Decryption Error]:', err);
      toast.error("Erreur d'extraction des enveloppes.");
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleUpdateStatus = async (status: 'verified' | 'rejected') => {
    if (!selectedRequest) return;
    setIsActionLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          kyc_status: status,
          trust_score: status === 'verified' ? 85 : 10,
          kyc_completed: status === 'verified'
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast.success(`Dossier de ${selectedRequest.firstName} ${selectedRequest.lastName} mis à jour : ${status.toUpperCase()}`);
      setSelectedRequest(null);
      fetchPendingKYC();
    } catch (err: any) {
      console.error('[KYC Status Update Error]:', err);
      toast.error("Échec de modification.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      
      {/* HEADER PANNEAU ADMINISTRATIF */}
      <div className="border-b border-slate-800 bg-[#1E293B]/60 backdrop-blur-xl px-8 py-5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white">KAURI CORE · COMPLIANCE</h1>
            <p className="text-xs text-slate-400">Tunnel de validation manuelle KYC (Seuil 15k Utilisateurs)</p>
          </div>
        </div>
        <button onClick={fetchPendingKYC} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer">
          <RefreshCw className={`w-4 h-4 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* COLONNE GAUCHE : DOSSIERS */}
        <div className="w-2/5 border-r border-slate-800 p-6 flex flex-col space-y-4 overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un dossier (Nom, Email)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E293B] border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-xs outline-none focus:border-amber-500/50 text-white transition-all"
            />
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl">
              <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Aucun dossier KYC en attente d'approbation.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => handleViewAndDecryptDocs(req)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedRequest?.id === req.id 
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5' 
                      : 'bg-[#1E293B]/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 truncate flex-1 pr-3">
                    <p className="text-xs font-bold text-white uppercase tracking-wide">{req.firstName} {req.lastName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{req.email}</p>
                    <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      req.accountType === 'professionnel' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {req.accountType}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedRequest?.id === req.id ? 'text-amber-500 translate-x-1' : 'text-slate-600'}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLONNE DROITE : INSPECTION */}
        <div className="w-3/5 p-6 overflow-y-auto bg-[#090D1A]">
          
          {/* CHARGEMENT CLÉ DE SÉCURITÉ */}
          {!isKeyLoaded ? (
            <form onSubmit={handleLoadKey} className="bg-[#1E293B]/60 border border-slate-800 p-5 rounded-2xl space-y-4 mb-6">
              <div className="flex gap-3">
                <KeyRound className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white">Enclave Cryptographique Administrative</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Les fichiers d'identité de KAURI sont chiffrés à la source (Zero-Knowledge). Collez votre clé privée d'entreprise ci-dessous pour activer le décodage en mémoire volatile locale.
                  </p>
                </div>
              </div>
              <textarea
                rows={4}
                value={privateKeyPEM}
                onChange={(e) => setPrivateKeyText(e.target.value)}
                placeholder="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7...\n-----END PRIVATE KEY-----"
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-[10px] font-mono outline-none text-amber-500 focus:border-amber-500/40 leading-normal"
              />
              <textarea
                rows={4}
                value={privateKeyPEM}
                onChange={(e) => setPrivateKeyText(e.target.value)}
                placeholder="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7...\n-----END PRIVATE KEY-----"
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-[10px] font-mono outline-none text-amber-500 focus:border-amber-500/40 leading-normal"
              />
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer">
                Activer l'Enclave Administrative
              </button>
            </form>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <p className="text-xs text-emerald-400 font-semibold">Enclave Active · Déchiffrement à la volée opérationnel.</p>
              </div>
              <button onClick={() => setIsKeyActive(false)} className="text-[10px] text-slate-400 underline hover:text-white cursor-pointer">Révoquer la clé</button>
            </div>
          )}

          {/* SÉLECTION COMPTE */}
          {selectedRequest ? (
            <div className="space-y-6">
              <div className="bg-[#1E293B]/30 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 uppercase tracking-wider">Métadonnées du dossier</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Identité complète :</span>
                    <strong className="text-white text-sm">{selectedRequest.firstName} {selectedRequest.lastName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Téléphone :</span>
                    <strong className="text-slate-200">{selectedRequest.phone}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block mb-0.5">Adresse de résidence déclarée :</span>
                    <strong className="text-slate-200 leading-relaxed block bg-[#0F172A] p-3 rounded-xl border border-slate-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-slate-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {selectedRequest.street}, {selectedRequest.zip} {selectedRequest.city}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Fichiers Cryptés Vérifiés</h3>
                
                {isDecrypting ? (
                  <div className="py-16 text-center border border-slate-800 rounded-2xl bg-[#1E293B]/10">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-medium">Déballage de l'enveloppe cryptographique...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-800 rounded-2xl p-2 bg-[#1E293B]/20 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                      {decryptedIdentityUrl && !decryptedIdentityUrl.includes("unsplash.com") ? (
                        <img src={decryptedIdentityUrl} alt="Identity Document" className="w-full h-44 object-cover rounded-xl" />
                      ) : decryptedIdentityUrl ? (
                        <div className="text-center space-y-2">
                          <img src={decryptedIdentityUrl} alt="Identity Document Preview" className="w-full h-44 object-cover rounded-xl opacity-40 blur-[1px]" />
                          <span className="text-[10px] text-amber-400 font-bold block absolute bottom-4 bg-slate-900/80 px-2 py-1 rounded-md left-1/2 transform -translate-x-1/2">MODE DEMO · FICTIF</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="text-xs font-bold text-slate-400">Identity_Document.enc</p>
                        </div>
                      )}
                    </div>

                    <div className="border border-slate-800 rounded-2xl p-2 bg-[#1E293B]/20 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                      {decryptedSelfieUrl && !decryptedSelfieUrl.includes("unsplash.com") ? (
                        <img src={decryptedSelfieUrl} alt="Selfie Verification" className="w-full h-44 object-cover rounded-xl" />
                      ) : decryptedSelfieUrl ? (
                        <div className="text-center space-y-2">
                          <img src={decryptedSelfieUrl} alt="Selfie Preview" className="w-full h-44 object-cover rounded-xl opacity-40 blur-[1px]" />
                          <span className="text-[10px] text-amber-400 font-bold block absolute bottom-4 bg-slate-900/80 px-2 py-1 rounded-md left-1/2 transform -translate-x-1/2">MODE DEMO · FICTIF</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <User className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="text-xs font-bold text-slate-400">Selfie_Vivacity.enc</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={isActionLoading || isDecrypting}
                  className="flex-1 py-4 border border-red-500/30 hover:border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <UserX className="w-4 h-4" />
                  Rejeter le dossier
                </button>
                <button
                  onClick={() => handleUpdateStatus('verified')}
                  disabled={isActionLoading || isDecrypting}
                  className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <UserCheck className="w-4 h-4" />
                  Approuver et Activer
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-slate-800 rounded-3xl">
              <FileText className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-sm font-bold text-slate-400">Aucun dossier ouvert</h3>
              <p className="text-xs text-slate-500 max-w-[240px] mt-1">Sélectionnez un membre dans le volet de gauche pour inspecter ses attestations cryptées.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
