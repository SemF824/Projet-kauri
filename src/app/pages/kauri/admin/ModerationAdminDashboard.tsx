import { useState, useEffect } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  UserX,
  Trash2,
  Eye,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { getSupabase } from "../../../utils/supabase";
import { toast } from "sonner";

interface ModerationReport {
  id: string;
  reporter_id: string;
  content_type: "message" | "user" | "room" | "media";
  content_id: string;
  reported_user_id?: string;
  reason: string;
  details?: string;
  plain_text_snapshot?: string;
  status: "pending" | "in_review" | "resolved_sanctioned" | "dismissed";
  moderator_notes?: string;
  created_at: string;
}

export default function ModerationAdminDashboard() {
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      let query = supabase
        .from("moderation_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReports(data || []);
    } catch (err: any) {
      console.error("Erreur chargement signalements:", err);
      toast.error("Impossible de charger les signalements de modération.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleUpdateStatus = async (
    reportId: string,
    newStatus: "resolved_sanctioned" | "dismissed",
    actionDesc: string
  ) => {
    setProcessingId(reportId);
    try {
      const supabase = getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("moderation_reports")
        .update({
          status: newStatus,
          moderator_notes: adminNote.trim() || actionDesc,
          resolved_by: user?.id || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reportId);

      if (error) throw error;

      toast.success(`Signalement mis à jour : ${actionDesc}`);
      setSelectedReport(null);
      setAdminNote("");
      fetchReports();
    } catch (err: any) {
      toast.error(err.message || "Erreur de mise à jour");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      r.reason.toLowerCase().includes(s) ||
      (r.details && r.details.toLowerCase().includes(s)) ||
      (r.plain_text_snapshot && r.plain_text_snapshot.toLowerCase().includes(s))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">
                Centre de Modération & Sécurité
              </h1>
              <p className="text-xs text-slate-500">
                Gestion des abus, fraudes financières et signalements de la communauté Kauri
              </p>
            </div>
          </div>
          <button
            onClick={fetchReports}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl transition-all w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {[
              { id: "pending", label: "En attente", icon: Clock },
              { id: "in_review", label: "En cours", icon: AlertTriangle },
              { id: "resolved_sanctioned", label: "Sanctionnés", icon: CheckCircle2 },
              { id: "dismissed", label: "Rejetés", icon: XCircle },
              { id: "all", label: "Tous", icon: Filter },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                    statusFilter === f.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrer par mot-clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* Report List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
            <p className="text-xs text-slate-500 font-medium">Chargement des signalements...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-slate-800">Aucun signalement</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tous les dossiers dans cette catégorie ont été traités.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-700">
                      {report.reason}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(report.created_at).toLocaleDateString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Type : <span className="capitalize">{report.content_type}</span>
                    </p>
                    {report.details && (
                      <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{report.details}"
                      </p>
                    )}
                  </div>

                  {report.plain_text_snapshot && (
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-800 mb-1">
                        Contenu incriminé capturé
                      </p>
                      <p className="text-xs text-amber-900 italic font-mono break-all">
                        {report.plain_text_snapshot}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      report.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : report.status === "resolved_sanctioned"
                        ? "bg-red-100 text-red-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Statut: {report.status}
                  </span>

                  <div className="flex items-center gap-2">
                    {report.status === "pending" && (
                      <>
                        <button
                          disabled={processingId === report.id}
                          onClick={() =>
                            handleUpdateStatus(
                              report.id,
                              "dismissed",
                              "Signalement sans suite (Non justifié)"
                            )
                          }
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          Classer
                        </button>
                        <button
                          disabled={processingId === report.id}
                          onClick={() =>
                            handleUpdateStatus(
                              report.id,
                              "resolved_sanctioned",
                              "Sanction appliquée (Avertissement ou Bannissement)"
                            )
                          }
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                        >
                          Sanctionner
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
