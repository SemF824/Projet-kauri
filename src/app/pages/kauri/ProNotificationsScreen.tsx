import { ArrowLeft, TrendingUp, Users, AlertCircle, DollarSign, FileText, Briefcase, ChevronRight, ArrowRight, ShieldCheck, Moon, Sun, Heart, Trophy, Play, Gift, Bell } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

import { SwipeableNotification } from '../../components/SwipeableNotification';

type NotifCategory = 'tout' | 'investisseurs' | 'paliers' | 'social' | 'documents';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'business';
  category: NotifCategory;
  title: string;
  message: string;
  detail: string;
  time: string;
  icon: any;
  read: boolean;
  status?: 'active' | 'archived';
  action: { label: string; path: string };
  meta?: { palier?: string; montant?: string; contributionType?: 'don' | 'investissement' };
}

export function ProNotificationsScreen() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [activeCategory, setActiveCategory] = useState<NotifCategory>('tout');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      category: 'investisseurs',
      title: 'Nouvel investisseur · Palier 2',
      message: 'Sophie B. a investi 5 000 € — Palier Partenaire',
      detail: "Sophie Bernard a confirmé un investissement de 5 000 € sur le Palier 2 (Partenaire) du projet « Lolo Moderne ». Rendement annuel proposé : 8%. Le total collecté atteint désormais 45 000 € (45% de l'objectif).",
      time: 'Il y a 1h',
      icon: TrendingUp,
      read: false,
      meta: { palier: 'Palier 2 · Partenaire', montant: '5 000 €', contributionType: 'investissement' },
      action: { label: 'Voir les investisseurs', path: '/kauri/pro-investisseurs' },
    },
    {
      id: '2',
      type: 'success',
      category: 'investisseurs',
      title: 'Nouveau donateur · Palier 1',
      message: 'Jean-Luc M. a fait un don de 500 € — Palier Soutien',
      detail: "Jean-Luc Martin a choisi de soutenir votre projet « Lolo Moderne » avec un don de 500 € au Palier 1 (Soutien). Il recevra les contreparties associées : remerciement public + goodies. Total dons : 3 200 €.",
      time: 'Il y a 2h',
      icon: Gift,
      read: false,
      meta: { palier: 'Palier 1 · Soutien', montant: '500 €', contributionType: 'don' },
      action: { label: 'Voir les contributions', path: '/kauri/pro-investisseurs' },
    },
    {
      id: '3',
      type: 'business',
      category: 'paliers',
      title: '🥈 Palier 2 atteint !',
      message: '« Lolo Moderne » a franchi les 30 000 € collectés',
      detail: "Félicitations ! Votre projet vient de franchir le Palier 1 (Bronze) à 30 000 €. Les 87 contributeurs à ce stade financent désormais : équipement de base + local. Prochain objectif : Palier 2 à 60 000 €.",
      time: 'Il y a 3h',
      icon: Trophy,
      read: false,
      meta: { palier: 'Palier 1 · Bronze', montant: '30 000 €' },
      action: { label: 'Voir le pot commun', path: '/kauri/pot-commun' },
    },
    {
      id: '4',
      type: 'business',
      category: 'paliers',
      title: 'Palier 3 en approche',
      message: '85% de l\'objectif maximal atteint · 15 000 € restants',
      detail: "Votre campagne « Lolo Moderne » approche du Palier 3 (Visionnaire) fixé à 100 000 €. Il reste 15 000 € à collecter. Publiez une nouvelle vidéo dans Découverte pour accélérer la mobilisation des particuliers.",
      time: 'Il y a 5h',
      icon: TrendingUp,
      read: false,
      meta: { palier: 'Palier 3 · Visionnaire', montant: '100 000 €' },
      action: { label: 'Publier une vidéo', path: '/kauri/pro-publish' },
    },
    {
      id: '5',
      type: 'success',
      category: 'social',
      title: 'Publication performante',
      message: 'Votre vidéo "Ouverture Lolo" · 891 vues · 12 clics CTA',
      detail: "Votre publication vidéo « Ouverture de notre Lolo Moderne » publiée il y a 2 jours totalise 891 vues, 342 likes et 12 clics sur le bouton Investir. 3 conversions ont été générées (2 investissements + 1 don).",
      time: 'Il y a 6h',
      icon: Play,
      read: true,
      action: { label: 'Voir les stats', path: '/kauri/pro-publication-stats' },
    },
    {
      id: '6',
      type: 'success',
      category: 'social',
      title: '50 nouveaux abonnés',
      message: 'Votre page pro a gagné 50 abonnés ce mois',
      detail: "Suite à votre dernière publication, votre compte professionnel a enregistré 50 nouveaux abonnés particuliers. Ces abonnés verront en priorité vos prochaines publications dans leur fil Découverte.",
      time: 'Hier',
      icon: Users,
      read: true,
      action: { label: 'Voir le fil', path: '/kauri/social-feed' },
    },
    {
      id: '7',
      type: 'warning',
      category: 'documents',
      title: 'Signature requise',
      message: 'Transaction de 12 000 € en attente de 2 signatures',
      detail: "Une transaction de 12 000 € initiée par votre co-signataire nécessite votre validation ainsi qu'une autre signature autorisée. La transaction expirera dans 48h si aucune action n'est prise.",
      time: 'Hier',
      icon: AlertCircle,
      read: true,
      action: { label: 'Valider', path: '/kauri/multi-signature' },
    },
    {
      id: '8',
      type: 'info',
      category: 'documents',
      title: 'Document requis',
      message: 'Rapport financier T2 à soumettre avant le 15 juin',
      detail: "La plateforme KAURI requiert votre rapport financier du 2ème trimestre pour maintenir la conformité de votre compte Pro. Date limite : 15 juin.",
      time: 'Il y a 2 jours',
      icon: FileText,
      read: true,
      action: { label: 'Gérer les documents', path: '/kauri/pro-manage-account' },
    },
    {
      id: '9',
      type: 'success',
      category: 'investisseurs',
      title: 'Dividendes versés',
      message: '2 750 € crédités sur votre compte business',
      detail: "La distribution de rendements du trimestre vient d'être effectuée pour les investisseurs du Palier 2. Montant net crédité sur votre compte business : 2 750 €.",
      time: 'Il y a 3 jours',
      icon: DollarSign,
      read: true,
      action: { label: 'Voir le portefeuille', path: '/kauri/pro-portefeuille' },
    },
    {
      id: '10',
      type: 'info',
      category: 'documents',
      title: 'Vérification KYB renouvelée',
      message: 'Votre entreprise est certifiée pour 12 mois',
      detail: "La vérification annuelle de votre entreprise SARL Innovation Caraïbes a été renouvelée avec succès. Votre badge de confiance Pro est actif pour les 12 prochains mois.",
      time: 'Il y a 5 jours',
      icon: ShieldCheck,
      read: true,
      action: { label: 'Mon profil Pro', path: '/kauri/profil-pro' },
    },
  ]);

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleArchive = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: n.status === 'archived' ? 'active' : 'archived' } : n));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const toggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const CATEGORIES: { id: NotifCategory; label: string; icon: any }[] = [
    { id: 'tout',          label: 'Tout',          icon: Bell },
    { id: 'investisseurs', label: 'Investisseurs', icon: TrendingUp },
    { id: 'paliers',       label: 'Paliers',       icon: Trophy },
    { id: 'social',        label: 'Social',        icon: Play },
    { id: 'documents',     label: 'Documents',     icon: FileText },
  ];

  const unreadCount = notifications.filter(n => !n.read && (n.status === 'active' || !n.status)).length;

  const accentColor = (type: string) => {
    if (type === 'success') return '#006D77';
    if (type === 'business') return '#D4AF37';
    if (type === 'warning') return '#B05B3B';
    return '#64748B';
  };

  const iconColor = (type: string) => {
    if (type === 'success') return 'text-[#006D77]';
    if (type === 'business') return 'text-[#D4AF37]';
    if (type === 'warning') return 'text-[#B05B3B]';
    return 'text-[#64748B]';
  };

  const iconBg = (type: string) => {
    if (type === 'success') return isDarkMode ? 'bg-[#006D77]/20' : 'bg-[#006D77]/10';
    if (type === 'business') return isDarkMode ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/10';
    if (type === 'warning') return isDarkMode ? 'bg-[#B05B3B]/20' : 'bg-[#B05B3B]/10';
    return isDarkMode ? 'bg-white/10' : 'bg-[#64748B]/10';
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F2F4F7]'}`}>
      {/* Header */}
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]'}`}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Retour</span>
          </button>
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            title={isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
          </button>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-white text-2xl font-semibold mb-1">Notifications Pro</h1>
            <p className="text-white/75 text-sm">
              {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est à jour'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-white/80 text-xs underline underline-offset-2">
              Tout marquer lu
            </button>
          )}
        </div>
      </div>

      {/* Bannière synthèse levées */}
      <div className="px-6 pt-4">
        <div className={`rounded-2xl p-4 border grid grid-cols-3 gap-3 ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'} shadow-sm`}>
          {[
            { label: 'Total levé', value: '45 000 €', color: '#006D77' },
            { label: 'Ce mois', value: '+8 200 €', color: '#D4AF37' },
            { label: 'Palier actuel', value: 'Palier 2', color: '#B05B3B' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="font-bold text-sm" style={{ color: s.color }}>{s.value}</p>
              <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs actives / archivées */}
      <div className="flex gap-4 px-6 pt-4 border-b border-transparent">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'active'
              ? isDarkMode ? 'border-white text-white' : 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-[#64748B]'
          }`}
        >
          Actives
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'archived'
              ? isDarkMode ? 'border-white text-white' : 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-[#64748B]'
          }`}
        >
          Archivées
        </button>
      </div>

      {/* Filtres catégories */}
      <div className="flex gap-2 overflow-x-auto px-4 pt-3 pb-1 scrollbar-none">
        {CATEGORIES.map(cat => {
          const CatIcon = cat.icon;
          const count = notifications.filter(n =>
            (cat.id === 'tout' || n.category === cat.id) &&
            !n.read &&
            (n.status === 'active' || !n.status)
          ).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition-all flex-shrink-0 ${
                activeCategory === cat.id
                  ? isDarkMode ? 'bg-[#D4AF37] text-white' : 'bg-[#D4AF37] text-white'
                  : isDarkMode ? 'bg-white/10 text-white/60' : 'bg-white text-[#64748B] border border-[#E2E8F0]'
              }`}
            >
              <CatIcon className="w-3 h-3" />
              {cat.label}
              {count > 0 && (
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${activeCategory === cat.id ? 'bg-white/30 text-white' : 'bg-[#B05B3B] text-white'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="px-4 pt-3 space-y-2">
        {notifications
          .filter(n =>
            (activeTab === 'archived' ? n.status === 'archived' : (n.status === 'active' || !n.status)) &&
            (activeCategory === 'tout' || n.category === activeCategory)
          )
          .map(n => {
          const Icon = n.icon;
          const expanded = expandedId === n.id;
          const accent = accentColor(n.type);

          return (
            <SwipeableNotification
              key={n.id}
              id={n.id}
              isRead={n.read}
              isArchived={n.status === 'archived'}
              onDelete={handleDelete}
              onArchive={handleArchive}
              onToggleRead={handleToggleRead}
            >
              <div
                onClick={() => toggle(n.id)}
                className={`overflow-hidden cursor-pointer transition-all duration-300`}
                style={{ borderLeft: `3.5px solid ${accent}` }}
              >
                {/* Compact row — always visible */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg(n.type)}`}>
                    <Icon className={`w-4 h-4 ${iconColor(n.type)}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                      )}
                      <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                        {n.title}
                      </p>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
                      {n.message}
                    </p>
                    {n.meta && (
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {n.meta.palier && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${accent}18`, color: accent }}>
                            {n.meta.palier}
                          </span>
                        )}
                        {n.meta.contributionType === 'investissement' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#006D77]/10 text-[#006D77] font-medium flex items-center gap-0.5">
                            <TrendingUp className="w-2.5 h-2.5" /> Investissement
                          </span>
                        )}
                        {n.meta.contributionType === 'don' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#B05B3B]/10 text-[#B05B3B] font-medium flex items-center gap-0.5">
                            <Heart className="w-2.5 h-2.5" /> Don
                          </span>
                        )}
                        {n.meta.montant && (
                          <span className={`text-[10px] font-bold ${isDarkMode ? 'text-white/50' : 'text-[#94A3B8]'}`}>
                            {n.meta.montant}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs ${isDarkMode ? 'text-[#475569]' : 'text-[#CBD5E1]'}`}>{n.time}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-300 ${isDarkMode ? 'text-[#475569]' : 'text-[#CBD5E1]'} ${expanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                </div>

                {/* Expanded detail */}
                <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className={`mx-4 mb-4 pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-[#F1F5F9]'}`}>
                      <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>
                        {n.detail}
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(n.action.path); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
                        style={{ background: accent }}
                      >
                        {n.action.label}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwipeableNotification>
          );
        })}
      </div>
    </div>
  );
}
