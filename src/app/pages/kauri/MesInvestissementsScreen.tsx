import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { getSupabase } from "../../../utils/supabase";

interface Investment {
  id: string;
  project_name: string;
  amount: number;
  current_value: number;
  roi: number;
  status: "growing" | "stable" | "declining";
  investment_date: string;
  category: string;
}

export function MesInvestissementsScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [investments, setInvestments] = useState<Investment[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const supabase = getSupabase();

        // Vérification de la session utilisateur
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError(
            "Vous devez être connecté pour voir vos investissements.",
          );
          setLoading(false);
          return;
        }

        // Récupération des données protégées par les RLS
        const { data, error: fetchError } = await supabase
          .from("investments")
          .select("*")
          .order("investment_date", { ascending: false });

        if (fetchError) throw fetchError;

        setInvestments(data || []);
      } catch (err: any) {
        console.error(
          "Erreur lors de la récupération des investissements:",
          err,
        );
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const totalInvested = investments.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0,
  );
  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + Number(inv.current_value),
    0,
  );
  const totalRoi =
    totalInvested > 0
      ? ((totalCurrentValue - totalInvested) / totalInvested) *
        100
      : 0;

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-[#0F172A] text-white" : "bg-white text-[#0F172A]"}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77]"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pb-24 transition-colors ${isDarkMode ? "bg-[#0F172A]" : "bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]"}`}
    >
      <div
        className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? "bg-gradient-to-br from-[#1E293B] to-[#334155]" : "bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]"}`}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-white flex items-center gap-2 transition-transform hover:-translate-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <h1 className="text-white text-2xl font-semibold mb-2">
          Mes Investissements
        </h1>
        <p className="text-white/90 text-sm">
          Portfolio & rendements
        </p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div
          className={`rounded-2xl p-6 shadow-xl border ${isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
        >
          <h3
            className={`text-sm mb-4 font-medium ${isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
          >
            Vue d'ensemble
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p
                className={`text-xs mb-1 font-medium ${isDarkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
              >
                Investi total
              </p>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
              >
                {totalInvested.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div>
              <p
                className={`text-xs mb-1 font-medium ${isDarkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
              >
                Valeur actuelle
              </p>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
              >
                {totalCurrentValue.toLocaleString("fr-FR")} €
              </p>
            </div>
          </div>

          <div
            className={`rounded-xl p-4 transition-colors ${
              totalRoi >= 0
                ? "bg-[#D1FAE5] border border-[#006D77]/30"
                : "bg-[#FECACA] border border-[#B05B3B]/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <p
                className={`text-sm font-semibold ${totalRoi >= 0 ? "text-[#006D77]" : "text-[#B05B3B]"}`}
              >
                ROI Global
              </p>
              <div className="flex items-center gap-2">
                {totalRoi >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-[#006D77]" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-[#B05B3B]" />
                )}
                <p
                  className={`text-xl font-bold ${totalRoi >= 0 ? "text-[#006D77]" : "text-[#B05B3B]"}`}
                >
                  {totalRoi > 0 ? "+" : ""}
                  {totalRoi.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`font-semibold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
            >
              Projets investis ({investments.length})
            </h3>
          </div>

          <div className="space-y-3">
            {investments.length === 0 && !error && !loading ? (
              <p
                className={`text-center py-8 text-sm ${isDarkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
              >
                Aucun investissement trouvé. Il est temps de
                commencer.
              </p>
            ) : (
              investments.map((investment) => (
                <div
                  key={investment.id}
                  onClick={() =>
                    navigate(
                      `/kauri/investment/${investment.id}`,
                    )
                  }
                  className={`rounded-2xl p-5 shadow-md border cursor-pointer transform transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4
                        className={`font-bold mb-1 ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
                      >
                        {investment.project_name}
                      </h4>
                      <p
                        className={`text-xs font-medium ${isDarkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
                      >
                        {investment.category}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        investment.roi >= 0
                          ? "bg-[#D1FAE5] text-[#006D77]"
                          : "bg-[#FECACA] text-[#B05B3B]"
                      }`}
                    >
                      {investment.roi > 0 ? "+" : ""}
                      {investment.roi}%
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p
                        className={`text-[10px] uppercase tracking-wider mb-1 ${isDarkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
                      >
                        Investi
                      </p>
                      <p
                        className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
                      >
                        {Number(
                          investment.amount,
                        ).toLocaleString("fr-FR")}{" "}
                        €
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-[10px] uppercase tracking-wider mb-1 ${isDarkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
                      >
                        Valeur
                      </p>
                      <p
                        className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
                      >
                        {Number(
                          investment.current_value,
                        ).toLocaleString("fr-FR")}{" "}
                        €
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-[10px] uppercase tracking-wider mb-1 ${isDarkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
                      >
                        Gain
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          investment.roi >= 0
                            ? "text-[#006D77]"
                            : "text-[#B05B3B]"
                        }`}
                      >
                        {investment.roi >= 0 ? "+" : ""}
                        {(
                          Number(investment.current_value) -
                          Number(investment.amount)
                        ).toLocaleString("fr-FR")}{" "}
                        €
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-between pt-3 border-t ${isDarkMode ? "border-[#334155]" : "border-[#E2E8F0]"}`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar
                        className={`w-4 h-4 ${isDarkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
                      />
                      <p
                        className={`text-xs font-medium ${isDarkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
                      >
                        {new Date(
                          investment.investment_date,
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 ${isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] hover:from-[#00565F] hover:to-[#0B7A70] text-white py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-95 font-semibold">
          <DollarSign className="w-5 h-5" />
          <span>Découvrir de nouveaux projets</span>
        </button>
      </div>
    </div>
  );
}
