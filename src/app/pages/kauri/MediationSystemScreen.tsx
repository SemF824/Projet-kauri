import { ArrowLeft, Scale, Users, MessageCircle, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function MediationSystemScreen() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const dispute = {
    projectName: 'Restaurant Lolo Moderne',
    amount: 50000,
    initiator: 'Investisseur Collectif',
    respondent: 'Jean-Pierre Louis (Chef de Projet)',
    date: '18 avril 2026',
    status: 'En médiation',
  };

  const guardians = [
    { name: 'Marie Laurent', role: 'Gardienne Senior', avatar: 'ML', vote: 'pending' },
    { name: 'Sophie Bernard', role: 'Gardienne', avatar: 'SB', vote: 'pending' },
    { name: 'André Charles', role: 'Gardien Expert Finance', avatar: 'AC', vote: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      <div className="bg-gradient-to-br from-[#475569] to-[#64748B] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Scale className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-white text-2xl mb-2">Système de Médiation</h1>
          <p className="text-white/90 text-sm">Résolution de litiges par les Gardiens</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/90 text-sm">Statut du Litige</span>
            <span className="px-3 py-1 bg-[#FEF3C7] text-[#92400E] text-xs rounded-full">
              {dispute.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-white/60 text-xs mb-1">Montant en Jeu</p>
              <p className="text-white text-lg">{dispute.amount.toLocaleString()} €</p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Date d'ouverture</p>
              <p className="text-white text-sm">{dispute.date}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Détails du litige */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
            Détails du Litige
          </h3>

          <div className="space-y-3 mb-4">
            <div className="p-4 bg-[#F8FAFC] rounded-xl">
              <p className="text-[#64748B] text-xs mb-1">Projet Concerné</p>
              <p className="text-[#0F172A]">{dispute.projectName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#F8FAFC] rounded-xl">
                <p className="text-[#64748B] text-xs mb-1">Demandeur</p>
                <p className="text-[#0F172A] text-sm">{dispute.initiator}</p>
              </div>
              <div className="p-4 bg-[#F8FAFC] rounded-xl">
                <p className="text-[#64748B] text-xs mb-1">Défendeur</p>
                <p className="text-[#0F172A] text-sm">{dispute.respondent}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FEF3C7] rounded-xl p-4 border border-[#D4AF37]/30">
            <p className="text-[#92400E] text-sm mb-2">
              <strong>Objet du Litige :</strong>
            </p>
            <p className="text-[#92400E] text-sm">
              Retard dans la livraison des jalons du projet et manque de transparence sur
              l'utilisation des fonds levés. Les investisseurs demandent un audit complet et une
              extension du délai ou un remboursement partiel.
            </p>
          </div>
        </div>

        {/* Panel des Gardiens */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#006D77]" />
            Panel de Gardiens (3)
          </h3>

          <div className="space-y-3 mb-4">
            {guardians.map((guardian, index) => (
              <div key={index} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center text-white shadow-lg">
                      {guardian.avatar}
                    </div>
                    <div>
                      <p className="text-[#0F172A]">{guardian.name}</p>
                      <p className="text-[#64748B] text-xs">{guardian.role}</p>
                    </div>
                  </div>

                  {guardian.vote === 'pending' ? (
                    <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] text-xs rounded-full">
                      En délibération
                    </span>
                  ) : guardian.vote === 'approved' ? (
                    <CheckCircle2 className="w-6 h-6 text-[#006D77]" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#E0F2FE] rounded-xl p-4 border border-[#006D77]/30">
            <p className="text-[#0369A1] text-sm">
              <strong>ℹ️ Processus :</strong> Les 3 Gardiens examinent le dossier de manière
              indépendante. Une décision à la majorité simple (2/3) est nécessaire. Délai maximum : 15 jours.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-4">Chronologie</h3>

          <div className="space-y-0">
            {[
              { title: 'Litige ouvert', date: '18 avril 2026', status: 'completed' },
              { title: 'Gardiens notifiés', date: '18 avril 2026', status: 'completed' },
              { title: 'Examen du dossier', date: 'En cours', status: 'in-progress' },
              { title: 'Décision finale', date: 'D+15', status: 'upcoming' },
            ].map((item, index) => (
              <div key={index} className="relative pb-4">
                {index !== 3 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-[#E2E8F0]"></div>
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      item.status === 'completed'
                        ? 'bg-[#D1FAE5] text-[#006D77]'
                        : item.status === 'in-progress'
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#F1F5F9] text-[#94A3B8]'
                    }`}
                  >
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="text-[#0F172A] text-sm mb-1">{item.title}</p>
                    <p className="text-[#64748B] text-xs">{item.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white border-2 border-[#E2E8F0] text-[#64748B] py-4 rounded-xl flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Discussion</span>
          </button>
          <button className="bg-white border-2 border-[#E2E8F0] text-[#64748B] py-4 rounded-xl flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </button>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-gradient-to-r from-[#475569] to-[#64748B] text-white py-4 rounded-xl shadow-lg"
        >
          Ouvrir un Nouveau Litige
        </button>
      </div>
    </div>
  );
}
