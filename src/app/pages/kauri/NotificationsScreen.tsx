import { ArrowLeft, CheckCircle2, TrendingUp, Users, AlertCircle, Gift, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

import { SwipeableNotification } from '../../components/SwipeableNotification';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'celebration';
  title: string;
  message: string;
  detail: string;
  time: string;
  icon: any;
  read: boolean;
  status?: 'active' | 'archived';
  action: { label: string; path: string };
}

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Paiement reçu',
      message: '500,00 € déposés sur votre solde',
      detail: "Votre tour de tontine dans « Cercle Familial » est arrivé. Les 500,00 € ont été transférés automatiquement depuis les contributions des membres.",
      time: 'Il y a 2h',
      icon: CheckCircle2,
      read: false,
      action: { label: 'Voir ma tontine', path: '/kauri/tontines-actives' },
    },
    {
      id: '2',
      type: 'info',
      title: 'Nouveau membre',
      message: 'Marie C. a rejoint « Cercle Familial »',
      detail: "Marie C. a été acceptée par les membres du groupe. Le cercle compte maintenant 8 participants. La prochaine cotisation est prévue le 1er juillet.",
      time: 'Il y a 5h',
      icon: Users,
      read: false,
      action: { label: 'Voir le cercle', path: '/kauri/tontines-actives' },
    },
    {
      id: '3',
      type: 'celebration',
      title: 'Projet financé à 100%',
      message: 'Votre investissement dans « Lolo Moderne » est complet',
      detail: "Le projet a atteint son objectif de financement. Votre mise de 1 200 € génère un rendement estimé à 14 % sur 18 mois. Les premiers versements débutent en août.",
      time: 'Hier',
      icon: Sparkles,
      read: true,
      action: { label: 'Mes investissements', path: '/kauri/mes-investissements' },
    },
    {
      id: '4',
      type: 'warning',
      title: 'Vote en attente',
      message: 'Demande de swap dans « Cercle Entrepreneurial »',
      detail: "Kwame D. souhaite échanger son tour avec Amina S. pour le mois de juillet. Votre vote est requis avant le 20 juin pour que la demande soit validée.",
      time: 'Il y a 1 jour',
      icon: AlertCircle,
      read: true,
      action: { label: 'Voter maintenant', path: '/kauri/tontines-actives' },
    },
    {
      id: '5',
      type: 'info',
      title: 'ROI disponible',
      message: '+12 % de rendement sur « Coopérative Agricole »',
      detail: "Les bénéfices du trimestre viennent d'être distribués. Vous avez reçu 144 € correspondant à votre quote-part. Retrouvez le détail dans votre historique.",
      time: 'Il y a 2 jours',
      icon: TrendingUp,
      read: true,
      action: { label: 'Voir le rendement', path: '/kauri/mes-investissements' },
    },
    {
      id: '6',
      type: 'celebration',
      title: 'Récompense débloquée',
      message: 'Badge « Membre Émérite » obtenu',
      detail: "Votre régularité sur 6 mois consécutifs vous a valu le badge Membre Émérite. Ce statut vous ouvre l'accès aux tontines Premium et aux offres exclusives.",
      time: 'Il y a 3 jours',
      icon: Gift,
      read: true,
      action: { label: 'Voir mon profil', path: '/kauri/profil-particulier' },
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

  const unreadCount = notifications.filter(n => !n.read && (n.status === 'active' || !n.status)).length;

  const accentColor = (type: string) => {
    if (type === 'success') return '#006D77';
    if (type === 'celebration') return '#D4AF37';
    if (type === 'warning') return '#B05B3B';
    return '#64748B';
  };

  const iconColor = (type: string) => {
    if (type === 'success') return 'text-[#006D77]';
    if (type === 'celebration') return 'text-[#D4AF37]';
    if (type === 'warning') return 'text-[#B05B3B]';
    return 'text-[#64748B]';
  };

  const iconBg = (type: string) => {
    if (type === 'success') return isDarkMode ? 'bg-[#006D77]/20' : 'bg-[#006D77]/10';
    if (type === 'celebration') return isDarkMode ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/10';
    if (type === 'warning') return isDarkMode ? 'bg-[#B05B3B]/20' : 'bg-[#B05B3B]/10';
    return isDarkMode ? 'bg-white/10' : 'bg-[#64748B]/10';
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F2F4F7]'}`}>
      {/* Header */}
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'}`}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Retour</span>
          </button>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-white text-2xl font-semibold mb-1">Notifications</h1>
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

      {/* Tabs */}
      <div className="flex gap-4 px-6 pt-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'active' 
              ? isDarkMode ? 'border-white text-white' : 'border-[#006D77] text-[#006D77]'
              : 'border-transparent text-[#64748B]'
          }`}
        >
          Actives
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'archived'
              ? isDarkMode ? 'border-white text-white' : 'border-[#006D77] text-[#006D77]'
              : 'border-transparent text-[#64748B]'
          }`}
        >
          Archivées
        </button>
      </div>

      {/* List */}
      <div className="px-4 pt-4 space-y-2">
        {notifications
          .filter(n => (activeTab === 'archived' ? n.status === 'archived' : (n.status === 'active' || !n.status)))
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