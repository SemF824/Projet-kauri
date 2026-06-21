import { ArrowLeft, Link2, CheckCircle2, Clock, Shield, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';

export function SmartContractExplorerScreen() {
  const navigate = useNavigate();

  const transactions = [
    {
      id: '0x742d...3f9a',
      type: 'Contribution',
      amount: 500,
      from: 'Marie Laurent',
      to: 'Pot Commun - Lolo Moderne',
      timestamp: 'Il y a 2 heures',
      status: 'validé',
      block: '15,234,567',
      gas: '0.0021 ETH',
    },
    {
      id: '0x8a3c...2b1f',
      type: 'Validation Multi-Sig',
      amount: 50000,
      from: 'Gardiens (3/3)',
      to: 'Expansion Restaurant',
      timestamp: 'Il y a 5 heures',
      status: 'validé',
      block: '15,234,521',
      gas: '0.0045 ETH',
    },
    {
      id: '0x1f9e...7c4d',
      type: 'Distribution',
      amount: 2500,
      from: 'Pot Commun',
      to: 'André Charles',
      timestamp: 'Il y a 1 jour',
      status: 'validé',
      block: '15,233,892',
      gas: '0.0018 ETH',
    },
    {
      id: '0x4b2a...9e6c',
      type: 'Contribution',
      amount: 1000,
      from: 'Jean-Pierre Louis',
      to: 'Pot Commun - Lolo Moderne',
      timestamp: 'Il y a 2 jours',
      status: 'en attente',
      block: 'Pending',
      gas: '0.0019 ETH',
    },
  ];

  const contractInfo = {
    address: '0x742d35Cc6634C0532925a3b844Bc9e3f9a',
    network: 'Ethereum Mainnet',
    deployer: 'KAURI Protocol',
    createdAt: '15 mars 2026',
    totalTransactions: 1247,
    totalValue: '€2,450,000',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Link2 className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-white text-2xl mb-2">Explorateur Smart Contract</h1>
          <p className="text-[#E0F2FE] text-sm">Transparence totale sur la blockchain</p>
        </div>

        {/* Info du contrat */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/90 text-sm">Adresse du Contrat</span>
            <button className="text-[#D4AF37] text-xs flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>Voir sur Etherscan</span>
            </button>
          </div>
          <p className="text-white text-xs font-mono mb-3">{contractInfo.address}</p>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs mb-1">Réseau</p>
              <p className="text-white text-sm">{contractInfo.network}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Transactions</p>
              <p className="text-white text-sm">{contractInfo.totalTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border border-[#E2E8F0]">
            <Shield className="w-8 h-8 text-[#006D77] mb-2" />
            <p className="text-[#0F172A] text-lg mb-1">{contractInfo.totalValue}</p>
            <p className="text-[#64748B] text-xs">Valeur Totale</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-[#E2E8F0]">
            <CheckCircle2 className="w-8 h-8 text-[#D4AF37] mb-2" />
            <p className="text-[#0F172A] text-lg mb-1">100%</p>
            <p className="text-[#64748B] text-xs">Taux de Succès</p>
          </div>
        </div>

        {/* Journal des transactions */}
        <div>
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-[#D4AF37] rounded-full"></div>
            Journal des Transactions
          </h3>

          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-5 shadow-md border-2 transition-all ${
                  tx.status === 'validé'
                    ? 'border-[#D1FAE5]'
                    : 'border-[#FEF3C7]'
                }`}
              >
                {/* En-tête */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 bg-[#006D77]/10 text-[#006D77] text-xs rounded-full">
                        {tx.type}
                      </span>
                      {tx.status === 'validé' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#006D77]" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#F59E0B] animate-pulse" />
                      )}
                    </div>
                    <p className="text-[#64748B] text-xs">{tx.timestamp}</p>
                  </div>
                  <p className="text-[#0F172A] text-lg">{tx.amount.toLocaleString()} €</p>
                </div>

                {/* Détails */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748B]">De</span>
                    <span className="text-[#0F172A]">{tx.from}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748B]">À</span>
                    <span className="text-[#0F172A]">{tx.to}</span>
                  </div>
                </div>

                {/* Info blockchain */}
                <div className="pt-3 border-t border-[#E2E8F0] grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[#64748B] mb-1">TX Hash</p>
                    <p className="text-[#006D77] font-mono">{tx.id}</p>
                  </div>
                  <div>
                    <p className="text-[#64748B] mb-1">Bloc / Gas</p>
                    <p className="text-[#0F172A]">
                      {tx.block}
                      <br />
                      <span className="text-[#64748B]">{tx.gas}</span>
                    </p>
                  </div>
                </div>

                {/* Bouton voir détails */}
                <button className="w-full mt-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#006D77] text-sm hover:bg-[#E0F2FE] transition-colors">
                  Voir sur Blockchain Explorer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info transparence */}
        <div className="mt-6 bg-gradient-to-br from-[#E0F2FE] to-[#DBEAFE] rounded-2xl p-6 border border-[#006D77]/30">
          <h4 className="text-[#0F172A] mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#006D77]" />
            Garantie de Transparence
          </h4>
          <p className="text-[#0369A1] text-sm leading-relaxed">
            Toutes les transactions KAURI sont enregistrées sur la blockchain Ethereum, assurant
            une traçabilité totale et immuable. Chaque mouvement de fonds est vérifiable
            publiquement.
          </p>
        </div>
      </div>
    </div>
  );
}
