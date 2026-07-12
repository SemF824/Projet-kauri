import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ShieldAlert, ShieldCheck, UserCheck, UserX, KeyRound, 
  FileText, Loader2, RefreshCw, Search, User, ChevronRight, X, ZoomIn, Upload
} from 'lucide-react';
import { getSupabase } from '../../../../utils/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';

interface KYCRequest {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  accountType: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  street?: string;
  city?: string;
  zip?: string;
  createdAt: string;
}

interface LightboxState {
  url: string;
  type: 'image' | 'pdf';
}

function privatePemToArrayBuffer(pem: string): ArrayBuffer {
  const b64Lines = pem
    .replace(/-----\s*BEGIN[^-]*-----\s*/g, "")
    .replace(/-----\s*END[^-]*-----\s*/g, "")
    .replace(/\s/g, "");
  const binaryString = window.atob(b64Lines);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function detectMimeType(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer).slice(0, 4);
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return "application/pdf";
  }
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return "image/png";
  }
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return "image/gif";
  }
  return "image/jpeg";
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  
  const [privateKeyPEM, setPrivateKeyText] = useState('');
  const [isKeyLoaded, setIsKeyActive] = useState(false);
  const [importedCryptoKey, setImportedCryptoKey] = useState<CryptoKey | null>(null);
  
  const [decryptedIdentityUrl, setDecryptedIdentityUrl] = useState<string | null>(null);
  const [decryptedSelfieUrl, setDecryptedSelfieUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const [isIdentityEncrypted, setIsIdentityEncrypted] = useState(false);
  const [isSelfieEncrypted, setIsSelfieEncrypted] = useState(false);

  const [identityFileType, setIdentityFileType] = useState<'image' | 'pdf'>('image');
  const [selfieFileType, setSelfieFileType] = useState<'image' | 'pdf'>('image');

  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  // Auto-chargement de la clé privée de session enregistrée localement
  useEffect(() => {
    const initializeSavedKey = async () => {
      const savedPem = localStorage.getItem('kauri_admin_secure_key');
      if (!savedPem) return;
      try {
        const rawBinaryKey = privatePemToArrayBuffer(savedPem);
        const cryptoKey = await window.crypto.subtle.importKey(
          "pkcs8",
          rawBinaryKey,
          { name: "RSA-OAEP", hash: "SHA-256" },
          false,
          ["decrypt"]
        );
        setImportedCryptoKey(cryptoKey);
        setIsKeyActive(true);
      } catch (e) {
        console.error("Failure importing saved enclave key:", e);
        localStorage.removeItem('kauri_admin_secure_key');
      }
    };
    initializeSavedKey();
  }, []);

  useEffect(() => {
    if (!authContextLoading && (!user || profile?.accountType !== 'admin')) {
      // Restriction désactivée temporairement pour tests
      // navigate('/kauri/login');
    }
  }, [user, profile, authContextLoading]);

  const fetchAllProfiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formatted: KYCRequest[] = (data || []).map((p: any) => ({
        id: p.id,
        fullName: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Non renseigné',
        email: p.email || 'Inconnu',
        phone: p.phone_number || 'Non communiqué',
        accountType: p.account_type || 'particulier',
        kycStatus: p.kyc_status || 'pending',
        street: p.street || 'Non renseigné',
        city: p.city || 'Non renseigné',
        zip: p.zip || 'Non renseigné',
        createdAt: p.created_at || p.updated_at || new Date().toISOString()
      }));

      setRequests(formatted);
    } catch (err: any) {
      console.error('[KYC Fetch Error]:', err);
      toast.error("Erreur de synchronisation du registre des comptes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const handleKeyFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const pemText = await file.text();
      if (!pemText.includes('-----BEGIN PRIVATE KEY-----')) {
        toast.error("Le fichier sélectionné ne possède pas les en-têtes PKCS#8 d'une clé RSA valide.");
        return;
      }

      const rawBinaryKey = privatePemToArrayBuffer(pemText);
      const cryptoKey = await window.crypto.subtle.importKey(
        "pkcs8",
        rawBinaryKey,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["decrypt"]
      );

      setImportedCryptoKey(cryptoKey);
      setIsKeyActive(true);
      localStorage.setItem('kauri_admin_secure_key', pemText);
      toast.success("Enclave administrative armée. Session décryptage activée.");
      
      if (selectedRequest) {
        handleViewAndDecryptDocs(selectedRequest);
      }
    } catch (err) {
      console.error(err);
      toast.error("Échec d'intégration binaire de la clé privée.");
    }
  };

  const handleRevokeKey = () => {
    localStorage.removeItem('kauri_admin_secure_key');
    setImportedCryptoKey(null);
    setIsKeyActive(false);
    setDecryptedIdentityUrl(null);
    setDecryptedSelfieUrl(null);
    toast.info("Enclave administrative révoquée de la mémoire locale.");
  };

  // 🎯 PARSING DE L'ENVELOPPE MULTI-DESTINATAIRES
  const decryptPayload = async (packedArrayBuffer: ArrayBuffer, key: CryptoKey): Promise<{ url: string; type: 'image' | 'pdf' }> => {
    const packedBytes = new Uint8Array(packedArrayBuffer);
    const view = new DataView(packedBytes.buffer);
    
    const encryptedKeyLengthAdmin = view.getUint32(0, false);
    const encryptedKeyLengthUser = view.getUint32(4, false);
    
    const encryptedAesKeyAdmin = packedBytes.slice(8, 8 + encryptedKeyLengthAdmin);
    
    const ivOffset = 8 + encryptedKeyLengthAdmin + encryptedKeyLengthUser;
    const iv = packedBytes.slice(ivOffset, ivOffset + 12);
    const ciphertext = packedBytes.slice(ivOffset + 12);

    const decryptedAesKeyRaw = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      key,
      encryptedAesKeyAdmin
    );

    const aesKey = await window.crypto.subtle.importKey(
      "raw",
      decryptedAesKeyRaw,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decryptedFileBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      ciphertext
    );

    const exactMime = detectMimeType(decryptedFileBuffer);
    const finalBlob = new Blob([decryptedFileBuffer], { type: exactMime });
    
    return {
      url: URL.createObjectURL(finalBlob),
      type: exactMime === "application/pdf" ? 'pdf' : 'image'
    };
  };

  const handleViewAndDecryptDocs = async (req: KYCRequest) => {
    setSelectedRequest(req);
    setDecryptedIdentityUrl(null);
    setDecryptedSelfieUrl(null);
    setIsIdentityEncrypted(false);
    setIsSelfieEncrypted(false);

    setIsDecrypting(true);
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('secure-kyc')
        .list(req.id);

      if (listError) throw listError;

      const identityFile = files?.find(f => f.name.startsWith('identity'));
      const selfieFile = files?.find(f => f.name.startsWith('selfie'));

      if (identityFile) {
        const isEnc = identityFile.name.endsWith('.enc');
        setIsIdentityEncrypted(isEnc);

        const { data: blob } = await supabase.storage
          .from('secure-kyc')
          .download(`${req.id}/${identityFile.name}`);

        if (blob) {
          if (isEnc) {
            if (!importedCryptoKey) {
              setDecryptedIdentityUrl(null);
            } else {
              const arrayBuf = await blob.arrayBuffer();
              const result = await decryptPayload(arrayBuf, importedCryptoKey);
              setIdentityFileType(result.type);
              setDecryptedIdentityUrl(result.url);
            }
          } else {
            setIdentityFileType(blob.type === 'application/pdf' ? 'pdf' : 'image');
            setDecryptedIdentityUrl(URL.createObjectURL(blob));
          }
        }
      } else {
        setDecryptedIdentityUrl("https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=400&q=80");
      }

      if (selfieFile) {
        const isEnc = selfieFile.name.endsWith('.enc');
        setIsSelfieEncrypted(isEnc);

        const { data: blob } = await supabase.storage
          .from('secure-kyc')
          .download(`${req.id}/${selfieFile.name}`);

        if (blob) {
          if (isEnc) {
            if (!importedCryptoKey) {
              setDecryptedSelfieUrl(null);
            } else {
              const arrayBuf = await blob.arrayBuffer();
              const result = await decryptPayload(arrayBuf, importedCryptoKey);
              setSelfieFileType(result.type);
              setDecryptedSelfieUrl(result.url);
            }
          } else {
            setSelfieFileType(blob.type === 'application/pdf' ? 'pdf' : 'image');
            setDecryptedSelfieUrl(URL.createObjectURL(blob));
          }
        }
      } else {
        setDecryptedSelfieUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
      }

    } catch (err: any) {
      console.error('[Decryption Master Stack Crash]:', err);
      toast.error("Erreur de décodage du package cryptographique.");
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleUpdateStatus = async (status: 'verified' | 'rejected') => {
    if (!selectedRequest) return;

    // 🎯 REJET INTERNE INFRANCHISSABLE : Si l'opérateur tente d'approuver sans la clé
    if (!isKeyLoaded || !importedCryptoKey) {
      toast.error("Action administrative révoquée. Vous devez détenir la clé privée décryptant le dossier pour statuer.");
      return;
    }

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

      toast.success(`Décision de conformité enregistrée : ${status.toUpperCase()}`);
      setSelectedRequest(null);
      fetchAllProfiles();
    } catch (err: any) {
      console.error('[Status DB Write Error]:', err);
      toast.error("Impossible d'appliquer la décision sur le profil.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || r.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.kycStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans select-none">
      
      {/* BANDEAU SUPERIEUR */}
      <div className="border-b border-slate-800 bg-[#1E293B]/60 backdrop-blur-xl px-8 py-5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white">KAURI REGULATORY MATRIX</h1>
            <p className="text-xs text-slate-400">Registre général de conformité et de vérification d'identité</p>
          </div>
        </div>
        <button onClick={fetchAllProfiles} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer border-none text-white">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* COLONNE GAUCHE */}
        <div className="w-3/5 border-r border-slate-800 p-6 flex flex-col space-y-4 overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un titulaire (Nom, Email)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E293B] border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-xs outline-none focus:border-amber-500/50 text-white transition-all"
            />
          </div>

          <div className="flex border-b border-slate-800 text-xs font-bold gap-2">
            {(['all', 'pending', 'verified', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`pb-3 px-3 capitalize bg-transparent border-none transition-all cursor-pointer ${
                  statusFilter === status ? 'border-b-2 border-amber-500 text-amber-500 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {status === 'all' ? 'Tous les profils' : status === 'pending' ? 'Non vérifiés' : status === 'verified' ? 'Vérifiés' : 'Rejetés'}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400">Aucun dossier ne correspond aux critères.</p>
            </div>
          ) : (
            <div className="bg-[#1E293B]/20 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#1E293B]/40 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    <th className="py-3 px-4">Titulaire / Identifiants</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">État de conformité</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredRequests.map((req) => (
                    <tr 
                      key={req.id} 
                      className={`hover:bg-[#1E293B]/30 transition-colors ${selectedRequest?.id === req.id ? 'bg-amber-500/5' : ''}`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white uppercase tracking-tight">{req.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{req.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-300 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">{req.accountType}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          req.kycStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          req.kycStatus === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {req.kycStatus === 'pending' ? 'Non vérifié' : req.kycStatus === 'verified' ? 'Vérifié' : 'Rejeté'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleViewAndDecryptDocs(req)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-[11px] transition-all inline-flex items-center gap-1 cursor-pointer border-none shadow-md"
                        >
                          Inspecter <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* COLONNE DROITE */}
        <div className="w-2/5 p-6 overflow-y-auto bg-[#090D1A]">
          
          {/* CHARGEMENT AUTOMATIQUE DE L'ENCLAVE */}
          {!isKeyLoaded ? (
            <div className="bg-[#1E293B]/60 border border-slate-800 p-6 rounded-3xl text-center space-y-4 mb-6">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
                <KeyRound className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Clef Administrative Requise</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Glissez votre fichier de clé privée administrative (.pem) pour activer l'extraction instantanée.</p>
              </div>
              <label className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 border-none">
                <Upload className="w-4 h-4" />
                Charger kauri_private.pem
                <input type="file" accept=".pem,.key,.txt" onChange={handleKeyFileChange} className="hidden" />
              </label>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-emerald-400 font-bold">Enclave Active · Extraction Enveloppe A</p>
              </div>
              <button onClick={handleRevokeKey} className="text-[10px] text-slate-400 hover:text-white underline bg-transparent border-none cursor-pointer">Désactiver</button>
            </div>
          )}

          {selectedRequest ? (
            <div className="space-y-6">
              <div className="bg-[#1E293B]/30 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 uppercase tracking-wider">Attestation Personnelle</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="col-span-2">
                    <span className="text-slate-500 block mb-0.5">Titulaire du compte :</span>
                    <strong className="text-white text-sm uppercase">{selectedRequest.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Téléphone :</span>
                    <strong className="text-slate-200">{selectedRequest.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Identifiant interne :</span>
                    <strong className="text-slate-400 font-mono text-[10px] block truncate">{selectedRequest.id}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block mb-0.5">Adresse physique déclarée :</span>
                    <strong className="text-slate-200 block bg-[#0F172A] p-3 rounded-xl border border-slate-800 mt-1 leading-normal">
                      {selectedRequest.street}, {selectedRequest.zip} {selectedRequest.city}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Pièces justificatives décryptées</h3>
                {isDecrypting ? (
                  <div className="py-12 text-center border border-slate-800 rounded-2xl bg-[#1E293B]/10">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Déchiffrement asymétrique...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* APERÇU PIECE D'IDENTITÉ */}
                    <div className="border border-slate-800 rounded-2xl p-2 bg-[#1E293B]/20 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden group transition-all">
                      {decryptedIdentityUrl ? (
                        <div className="w-full h-full relative flex flex-col items-center justify-center">
                          {identityFileType === 'pdf' ? (
                            <div 
                              onClick={() => setLightbox({ url: decryptedIdentityUrl, type: 'pdf' })}
                              className="w-full h-44 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 flex flex-col items-center justify-center cursor-zoom-in transition-all text-center p-3"
                            >
                              <FileText className="w-10 h-10 text-red-500 mb-2" />
                              <span className="text-[11px] font-bold text-white block truncate max-w-full">JUSTIFICATIF PDF</span>
                              <span className="text-[9px] text-slate-400 mt-1">Cliquer pour zoomer</span>
                            </div>
                          ) : (
                            <div className="w-full h-full relative cursor-zoom-in" onClick={() => setLightbox({ url: decryptedIdentityUrl, type: 'image' })}>
                              <img src={decryptedIdentityUrl} alt="Identity" className="w-full h-44 object-cover rounded-xl" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                <ZoomIn className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          )}
                          <span className={`text-[9px] font-bold block absolute bottom-2 right-2 px-2 py-0.5 rounded ${isIdentityEncrypted ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'}`}>
                            {isIdentityEncrypted ? 'ENVELOPPE A' : 'BRUT'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="text-xs font-bold text-slate-400">identity.enc</p>
                          <span className="text-[10px] text-amber-500 font-bold block">VERROU SÉCURISÉ</span>
                        </div>
                      )}
                    </div>

                    {/* APERÇU SELFIE */}
                    <div className="border border-slate-800 rounded-2xl p-2 bg-[#1E293B]/20 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden group transition-all">
                      {decryptedSelfieUrl ? (
                        <div className="w-full h-full relative flex flex-col items-center justify-center">
                          {selfieFileType === 'pdf' ? (
                            <div 
                              onClick={() => setLightbox({ url: decryptedSelfieUrl, type: 'pdf' })}
                              className="w-full h-44 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 flex flex-col items-center justify-center cursor-zoom-in transition-all text-center p-3"
                            >
                              <FileText className="w-10 h-10 text-red-500 mb-2" />
                              <span className="text-[11px] font-bold text-white block truncate max-w-full">SELFIE PDF</span>
                            </div>
                          ) : (
                            <div className="w-full h-full relative cursor-zoom-in" onClick={() => setLightbox({ url: decryptedSelfieUrl, type: 'image' })}>
                              <img src={decryptedSelfieUrl} alt="Selfie" className="w-full h-44 object-cover rounded-xl" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                <ZoomIn className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          )}
                          <span className={`text-[9px] font-bold block absolute bottom-2 right-2 px-2 py-0.5 rounded ${isSelfieEncrypted ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'}`}>
                            {isSelfieEncrypted ? 'ENVELOPPE A' : 'BRUT'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <User className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="text-xs font-bold text-slate-400">selfie.enc</p>
                          <span className="text-[10px] text-amber-500 font-bold block">VERROU SÉCURISÉ</span>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

              {/* 🎯 SÉCURISATION RADICALE DES BOUTONS DE CONFORMITÉ */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={isActionLoading || isDecrypting || !isKeyLoaded}
                  className="flex-1 py-4 border border-red-500/30 hover:border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  <UserX className="w-4 h-4" /> Rejeter le dossier
                </button>
                <button
                  onClick={() => handleUpdateStatus('verified')}
                  disabled={isActionLoading || isDecrypting || !isKeyLoaded}
                  className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" /> Confirmer et valider
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-slate-800 rounded-3xl">
              <FileText className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-sm font-bold text-slate-400">Station d'inspection vide</h3>
              <p className="text-xs text-slate-500 max-w-[240px] mt-1">Sélectionnez une ligne du tableau de gauche pour initier le déchiffrement local du dossier.</p>
            </div>
          )}
        </div>
      </div>

      {/* LIGHTBOX UNIVERSELLE HD (IFRAME ET IMAGES) */}
      {lightbox && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <button 
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 p-3 bg-slate-900 border border-slate-800 text-white rounded-full transition-all cursor-pointer shadow-xl z-50 hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[88vh] w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2">
            {lightbox.type === 'pdf' ? (
              <iframe 
                src={lightbox.url} 
                className="w-full h-[84vh] rounded-xl border-none bg-white"
                title="Kauri Fullscreen Audit Frame"
              />
            ) : (
              <img 
                src={lightbox.url} 
                alt="Audit Zoomed View" 
                className="max-w-full max-h-[84vh] object-contain rounded-xl"
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
