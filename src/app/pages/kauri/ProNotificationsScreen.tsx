import { ArrowLeft, TrendingUp, Users, AlertCircle, DollarSign, FileText, Briefcase, ChevronRight, ArrowRight, ShieldCheck, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

import { SwipeableNotification } from '../../components/SwipeableNotification';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'business';
  title: string;
  message: string;
  detail: string;
  time: string;
  icon: any;
  read: boolean;
  status?: 'active' | 'archived';
  action: { label: string; path: string };
}

export function ProNotificationsScreen() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Nouvel investisseur',
      message: 'SARL Delta a investi 5 000 € dans « Lolo Moderne »',
      detail: "La société SARL Delta a confirmé une participation de 5 000 € dans votre projet « Lolo Moderne ». Cet investissement porte le total collecté à 45 000 €, soit 45 % de l'objectif.",
      time: 'Il y a 1h',
      icon: Users,
      read: false,
      action: { label: 'Voir le projet', path: '/kauri/investment-hub' },
    },
    {
      id: '2',
      type: 'business',
      title: 'Objectif intermédiaire atteint',
      message: '« Lolo Moderne » à 45 % de son objectif',
      detail: "Félicitations ! Votre projet vient de franchir le seuil des 45 000 €. À ce rythme, l'objectif de 100 000 € sera atteint avant la fin du mois. Partagez la campagne pour accélérer.",
      time: 'Il y a 3h',
      icon: TrendingUp,
      read: false,
      action: { label: 'Tableau de bord', path: '/kauri/investment-hub' },
    },
    {
      id: '3',
      type: 'info',
      title: 'Document requis',
      message: 'Rapport financier T2 à soumettre avant le 15 juin',
      detail: "La plateforme KAURI requiert votre rapport financier du 2ème trimestre pour maintenir la conformité de votre compte Pro. Date limite : 15 juin. Accédez à vos paramètres pour déposer le fichier.",
      time: 'Il y a 6h',
      icon: FileText,
      read: false,
      action: { label: 'Gérer les documents', path: '/kauri/pro-manage-account' },
    },
    {
      id: '4',
      type: 'warning',
      title: 'Signature requise',
      message: 'Transaction de 12 000 € en attente de 2 signatures',
      detail: "Une transaction de 12 000 € initiée par votre co-signataire nécessite votre validation ainsi qu'une autre signature autorisée. La transaction expirera dans 48h si aucune action n'est prise.",
      time: 'Hier',
      icon: AlertCircle,
      read: true,
      action: { label: 'Valider la transaction', path: '/kauri/multi-signature' },
    },
    {
      id: '5',
      type: 'success',
      title: 'Dividendes versés',
      message: '2 750 € crédités sur votre compte',
      detail: "La distribution de dividendes du trimestre vient d'être effectuée. Montant net après prélèvements : 2 750 €. Retrouvez le détail complet dans votre espace investissements.",
      time: 'Il y a 2 jours',
      icon: DollarSign,
      read: true,
      action: { label: 'Voir les investissements', path: '/kauri/mes-investissements' },
    },
    {
      id: '6',
      type: 'business',
      title: 'Opportunité institutionnelle',
      message: 'Un investisseur institutionnel souhaite vous contacter',
      detail: "Un fonds d'investissement spécialisé dans les projets diaspora est intéressé par votre profil. Il a demandé à être mis en relation. Consultez votre hub pour voir les détails de cette opportunité.",
      time: 'Il y a 3 jours',
      icon: Briefcase,
      read: true,
      action: { label: 'Voir l\'opportunité', path: '/kauri/investment-hub' },
    },
    {
      id: '7',
      type: 'info',
      title: 'Vérification KYB renouvelée',
      message: 'Votre entreprise est de nouveau certifiée',
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

      {/* Tabs */}
      <div className="flex gap-4 px-6 pt-4">
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
