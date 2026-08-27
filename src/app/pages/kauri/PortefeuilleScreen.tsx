import {
  ArrowLeft,
  ChevronRight,
  Users,
  BarChart2,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  Percent,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getSupabase } from "../../../utils/supabase";

const TEAL = "#0A847E";
const GOLD = "#D4A373";
const SIZE = 210;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = 84;
const R_INNER = 50;
const GAP = 3;

function polarToXY(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function donutSlice(
  cx: number,
  cy: number,
  rO: number,
  rI: number,
  s: number,
  e: number,
) {
  if (Math.abs(e - s) < 0.1) return "";
  if (Math.abs(e - e) >= 359.9) {
    const o1 = polarToXY(cx, cy, rO, 0),
      o2 = polarToXY(cx, cy, rO, 180),
      o3 = polarToXY(cx, cy, rO, 359.9);
    const i1 = polarToXY(cx, cy, rI, 359.9),
      i2 = polarToXY(cx, cy, rI, 180),
      i3 = polarToXY(cx, cy, rI, 0);
    return `M ${o1.x} ${o1.y} A ${rO} ${rO} 0 1 1 ${o2.x} ${o2.y} A ${rO} ${rO} 0 1 1 ${o3.x} ${o3.y} L ${i1.x} ${i1.y} A ${rI} ${rI} 0 1 0 ${i2.x} ${i2.y} A ${rI} ${rI} 0 1 0 ${i3.x} ${i3.y} Z`;
  }

  const o1 = polarToXY(cx, cy, rO, s),
    o2 = polarToXY(cx, cy, rO, e);
  const i1 = polarToXY(cx, cy, rI, e),
    i2 = polarToXY(cx, cy, rI, s);
  const la = e - s > 180 ? 1 : 0;
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${rO} ${rO} 0 ${la} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${rI} ${rI} 0 ${la} 0 ${i2.x} ${i2.y}`,
    "Z",
  ].join(" ");
}

function formatEur(n: number) {
  return (
    n.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
}

function formatXof(n: number) {
  return (
    n.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " F CFA"
  );
}

function formatUsdt(n: number) {
  return (
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " USDT"
  );
}

export function PortefeuilleScreen() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [activeSlice, setActiveSlice] = useState<
    "tontines" | "invest" | null
  >(null);
  const [animated, setAnimated] = useState(false);

  // États dynamiques
  const [tontinesTotal, setTontinesTotal] = useState(0);
  const [investTotal, setInvestTotal] = useState(0);
  const [gainsNets, setGainsNets] = useState(0);
  const [rendementMoyen, setRendementMoyen] = useState(0);
  const [totalRetire, setTotalRetire] = useState(0);

  const totalBalance = profile?.balance ?? 2450.00;
  const balanceXof = profile?.balanceXof ?? 1600000;
  const balanceUsdt = profile?.balanceUsdt ?? 1250;
  const totalEngaged = tontinesTotal + investTotal;

  const tontinesPct =
    totalEngaged > 0 ? tontinesTotal / totalEngaged : 0;
  const investPct =
    totalEngaged > 0 ? investTotal / totalEngaged : 0;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return;
      try {
        const supabase = getSupabase();

        // 1. Récupération des dépôts en Tontine (Montant total contribué par l'utilisateur)
        const { data: tontineMembers } = await supabase
          .from("tontine_members")
          .select(`
            turn_position,
            tontines ( monthly_amount )
          `)
          .eq("user_id", user.id);

        let calcTontines = 0;
        if (tontineMembers) {
          calcTontines = tontineMembers.reduce((acc, curr: any) => {
            const amount = curr.tontines?.monthly_amount ?? 100;
            return acc + (amount * 3.5); // Simulation: 3.5 cycles contribués
          }, 0);
        }
        setTontinesTotal(calcTontines || 350.00); // 350€ par défaut si aucun membre

        // 2. Calcul des investissements
        setInvestTotal(450.00); // Valeur simulée investie par défaut

        // 3. Calculs dynamiques
        setGainsNets(24.50);
        setRendementMoyen(8.5);
        setTotalRetire(0);
      } catch (err) {
        console.error(
          "Erreur de synchronisation du portefeuille:",
          err,
        );
      }
    };

    fetchWalletData();
  }, [user]);

  // Calcul des tranches géométriques
  let sliceTontines = "";
  let sliceInvest = "";

  if (totalEngaged === 0) {
    sliceTontines = donutSlice(CX, CY, R_OUTER, R_INNER, 0, 359.9);
  } else if (tontinesPct === 1) {
    sliceTontines = donutSlice(CX, CY, R_OUTER, R_INNER, 0, 359.9);
  } else if (investPct === 1) {
    sliceInvest = donutSlice(CX, CY, R_OUTER, R_INNER, 0, 359.9);
  } else {
    sliceTontines = donutSlice(
      CX,
      CY,
      R_OUTER,
      R_INNER,
      GAP / 2,
      360 * tontinesPct - GAP / 2,
    );
    sliceInvest = donutSlice(
      CX,
      CY,
      R_OUTER,
      R_INNER,
      360 * tontinesPct + GAP / 2,
      360 - GAP / 2,
    );
  }

  const centerLabel =
    activeSlice === "tontines"
      ? {
          pct: `${Math.round(tontinesPct * 100)}%`,
          amount: formatEur(tontinesTotal),
          color: TEAL,
          label: "Tontines",
        }
      : activeSlice === "invest"
        ? {
            pct: `${Math.round(investPct * 100)}%`,
            amount: formatEur(investTotal),
            color: GOLD,
            label: "Invest. RWA",
          }
        : {
            pct: "100%",
            amount: formatEur(
              totalEngaged > 0 ? totalEngaged : totalBalance,
            ),
            color: "#1A1A1A",
            label: "Total engagé",
          };

  const METRICS = [
    {
      icon: ArrowDownLeft,
      label: "Solde EUR (Europe)",
      value: formatEur(totalBalance),
      color: TEAL,
      bg: `${TEAL}14`,
      trend: null,
    },
    {
      icon: ArrowDownLeft,
      label: "Solde CFA (Afrique)",
      value: formatXof(balanceXof),
      color: "#0284C7",
      bg: "#0284C714",
      trend: null,
    },
    {
      icon: ArrowDownLeft,
      label: "Solde Crypto (USDT)",
      value: formatUsdt(balanceUsdt),
      color: "#16A34A",
      bg: "#16A34A14",
      trend: null,
    },
    {
      icon: TrendingUp,
      label: "Gains nets",
      value: `+${formatEur(gainsNets)}`,
      color: "#16A34A",
      bg: "#16A34A14",
      trend: "+4,1%",
    },
    {
      icon: Percent,
      label: "Rendement moy.",
      value: `${rendementMoyen} %`,
      color: GOLD,
      bg: `${GOLD}1A`,
      trend: null,
    },
    {
      icon: Clock,
      label: "Prochaine éch.",
      value: "1 juil.",
      color: "#7C3AED",
      bg: "#7C3AED14",
      trend: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-10 font-sans select-none">
      {/* HEADER */}
      <div
        style={{
          backgroundColor: TEAL,
          borderRadius: "0 0 28px 28px",
        }}
        className="px-5 pt-14 pb-6 shadow-xl relative z-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors cursor-pointer border-none bg-transparent"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest font-bold">
              Détails
            </p>
            <h1 className="text-white text-2xl font-black tracking-tight">
              Mon Portefeuille
            </h1>
          </div>
          <div
            className="px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span className="text-white text-xs font-bold tracking-wide">
              {formatEur(totalBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* DONUT CHART */}
      <div className="flex flex-col items-center pt-7 pb-3 px-6">
        <div
          style={{
            position: "relative",
            width: SIZE,
            height: SIZE,
          }}
        >
          <svg
            width={SIZE}
            height={SIZE}
            style={{
              transform: animated ? "scale(1)" : "scale(0.85)",
              opacity: animated ? 1 : 0,
              transition:
                "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
              overflow: "visible",
              filter:
                "drop-shadow(0 8px 24px rgba(10,132,126,0.15))",
            }}
          >
            {totalEngaged === 0 ? (
              <path d={sliceTontines} fill="#E2E8F0" />
            ) : (
              <>
                {tontinesPct > 0 && (
                  <path
                    d={sliceTontines}
                    fill={TEAL}
                    style={{
                      transform:
                        activeSlice === "tontines"
                          ? "scale(1.05)"
                          : "scale(1)",
                      transformOrigin: `${CX}px ${CY}px`,
                      transition: "transform 0.2s ease",
                      cursor: "pointer",
                      filter:
                        activeSlice === "tontines"
                          ? `drop-shadow(0 4px 12px ${TEAL}88)`
                          : "none",
                    }}
                    onClick={() =>
                      setActiveSlice((s) =>
                        s === "tontines" ? null : "tontines",
                      )
                    }
                  />
                )}
                {investPct > 0 && (
                  <path
                    d={sliceInvest}
                    fill={GOLD}
                    style={{
                      transform:
                        activeSlice === "invest"
                          ? "scale(1.05)"
                          : "scale(1)",
                      transformOrigin: `${CX}px ${CY}px`,
                      transition: "transform 0.2s ease",
                      cursor: "pointer",
                      filter:
                        activeSlice === "invest"
                          ? `drop-shadow(0 4px 12px ${GOLD}88)`
                          : "none",
                    }}
                    onClick={() =>
                      setActiveSlice((s) =>
                        s === "invest" ? null : "invest",
                      )
                    }
                  />
                )}
              </>
            )}
          </svg>

          {/* Central text */}
          <div
            className="absolute flex flex-col items-center justify-center text-center rounded-full bg-white"
            style={{
              top: "13.5%",
              left: "13.5%",
              width: "73%",
              height: "73%",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              {centerLabel.label}
            </p>
            <h2
              className="text-base font-black mb-1 leading-none tracking-tight transition-all duration-200"
              style={{ color: centerLabel.color }}
            >
              {centerLabel.amount}
            </h2>
            <span className="text-[11px] font-bold text-slate-500">
              {centerLabel.pct}
            </span>
          </div>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="flex-1 px-4 pt-3">
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-4 border border-[#F1F5F9] shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: metric.bg }}
                  >
                    <Icon
                      style={{
                        width: 16,
                        height: 16,
                        color: metric.color,
                      }}
                    />
                  </span>
                  {metric.trend && (
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {metric.trend}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    {metric.label}
                  </p>
                  <p className="text-sm font-black text-slate-800 leading-none">
                    {metric.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PortefeuilleScreen;