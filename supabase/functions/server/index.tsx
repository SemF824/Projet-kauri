import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

async function getAuthUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

function uid() {
  return crypto.randomUUID();
}

// ── Health ───────────────────────────────────────────────────────────────────

app.get("/make-server-3612691c/health", (c) => c.json({ status: "ok" }));

// ── Auth: Signup ─────────────────────────────────────────────────────────────

app.post("/make-server-3612691c/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { phone, pin, firstName, lastName, accountType, businessName } = body;

    if (!phone || !pin || !firstName || !lastName || !accountType) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const clean = phone.replace(/[\s\-\(\)]/g, "");
    const normalized = clean.startsWith("+") ? clean : `+33${clean.replace(/^0/, "")}`;
    const email = `${normalized}@kauri.app`;

    const supabase = serviceClient();
    // Supabase requires 6+ char passwords; pad short PINs with a fixed salt
    const password = `${pin}_kauri`;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { firstName, lastName, accountType, phone: normalized },
      email_confirm: true,
    });

    if (error) {
      console.log("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    const userId = data.user.id;
    const now = new Date().toISOString();

    const profile = {
      id: userId,
      phone: normalized,
      firstName,
      lastName,
      accountType,
      businessName: businessName || null,
      trustScore: 3.5,
      balance: 0,
      currency: "EUR",
      kycCompleted: false,
      createdAt: now,
    };

    await kv.set(`user:${userId}:profile`, profile);
    await kv.set(`user:${userId}:wallet`, {
      balance: 0,
      currency: "EUR",
      transactions: [],
    });

    // Seed with some demo tontines/projects if first user
    const existingProjects = await kv.get("projects:index");
    if (!existingProjects) {
      await seedDemoData();
    }

    return c.json({ success: true, userId });
  } catch (e) {
    console.log("Signup exception:", e);
    return c.json({ error: `Signup failed: ${e}` }, 500);
  }
});

// ── User Profile ─────────────────────────────────────────────────────────────

app.get("/make-server-3612691c/user/profile", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const profile = await kv.get(`user:${user.id}:profile`);
    if (!profile) {
      // Auto-create profile for existing auth users (migration)
      const meta = user.user_metadata || {};
      const newProfile = {
        id: user.id,
        phone: meta.phone || "",
        firstName: meta.firstName || "Utilisateur",
        lastName: meta.lastName || "",
        accountType: meta.accountType || "particulier",
        businessName: meta.businessName || null,
        trustScore: 3.5,
        balance: 0,
        currency: "EUR",
        kycCompleted: false,
        createdAt: new Date().toISOString(),
      };
      await kv.set(`user:${user.id}:profile`, newProfile);
      await kv.set(`user:${user.id}:wallet`, { balance: 0, currency: "EUR", transactions: [] });
      return c.json(newProfile);
    }
    return c.json(profile);
  } catch (e) {
    console.log("Profile fetch error:", e);
    return c.json({ error: `Failed to fetch profile: ${e}` }, 500);
  }
});

app.put("/make-server-3612691c/user/profile", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const body = await c.req.json();
    const existing = await kv.get(`user:${user.id}:profile`) || {};
    const updated = { ...existing, ...body, id: user.id };
    await kv.set(`user:${user.id}:profile`, updated);
    return c.json(updated);
  } catch (e) {
    return c.json({ error: `Failed to update profile: ${e}` }, 500);
  }
});

// ── Wallet ───────────────────────────────────────────────────────────────────

app.get("/make-server-3612691c/wallet", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const wallet = await kv.get(`user:${user.id}:wallet`) || { balance: 0, currency: "EUR", transactions: [] };
    return c.json(wallet);
  } catch (e) {
    return c.json({ error: `Wallet fetch failed: ${e}` }, 500);
  }
});

app.post("/make-server-3612691c/wallet/topup", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const { amount, method = "Carte bancaire" } = await c.req.json();
    if (!amount || amount <= 0) return c.json({ error: "Invalid amount" }, 400);

    const wallet = await kv.get(`user:${user.id}:wallet`) || { balance: 0, currency: "EUR", transactions: [] };
    wallet.balance = (wallet.balance || 0) + amount;
    wallet.transactions = [
      {
        id: uid(),
        type: "credit",
        amount,
        description: `Recharge via ${method}`,
        date: new Date().toISOString(),
      },
      ...(wallet.transactions || []).slice(0, 49),
    ];

    await kv.set(`user:${user.id}:wallet`, wallet);

    // Update profile balance too
    const profile = await kv.get(`user:${user.id}:profile`) || {};
    profile.balance = wallet.balance;
    await kv.set(`user:${user.id}:profile`, profile);

    return c.json(wallet);
  } catch (e) {
    return c.json({ error: `Topup failed: ${e}` }, 500);
  }
});

app.post("/make-server-3612691c/wallet/send", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const { amount, recipient, description = "Virement" } = await c.req.json();
    if (!amount || amount <= 0) return c.json({ error: "Invalid amount" }, 400);

    const wallet = await kv.get(`user:${user.id}:wallet`) || { balance: 0, currency: "EUR", transactions: [] };
    if ((wallet.balance || 0) < amount) return c.json({ error: "Solde insuffisant" }, 400);

    wallet.balance -= amount;
    wallet.transactions = [
      {
        id: uid(),
        type: "debit",
        amount,
        description: `${description}${recipient ? ` → ${recipient}` : ""}`,
        date: new Date().toISOString(),
      },
      ...(wallet.transactions || []).slice(0, 49),
    ];

    await kv.set(`user:${user.id}:wallet`, wallet);
    const profile = await kv.get(`user:${user.id}:profile`) || {};
    profile.balance = wallet.balance;
    await kv.set(`user:${user.id}:profile`, profile);

    return c.json(wallet);
  } catch (e) {
    return c.json({ error: `Send failed: ${e}` }, 500);
  }
});

// ── Tontines ─────────────────────────────────────────────────────────────────

app.get("/make-server-3612691c/tontines", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const userTontineIds: string[] = (await kv.get(`user:${user.id}:tontines`)) || [];
    const tontines = await Promise.all(
      userTontineIds.map((id) => kv.get(`tontine:${id}`))
    );
    return c.json(tontines.filter(Boolean));
  } catch (e) {
    return c.json({ error: `Tontines fetch failed: ${e}` }, 500);
  }
});

app.get("/make-server-3612691c/tontines/available", async (c) => {
  try {
    const allIds: string[] = (await kv.get("tontines:index")) || [];
    const tontines = await Promise.all(allIds.map((id) => kv.get(`tontine:${id}`)));
    const publicTontines = tontines.filter((t) => t && t.type === "public" && t.status === "active");
    return c.json(publicTontines);
  } catch (e) {
    return c.json({ error: `Available tontines fetch failed: ${e}` }, 500);
  }
});

app.post("/make-server-3612691c/tontines", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const body = await c.req.json();
    const { name, description, contribution, frequency, maxMembers, type = "private" } = body;

    if (!name || !contribution || !frequency) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const profile = await kv.get(`user:${user.id}:profile`);
    const tontineId = uid();
    const now = new Date().toISOString();

    const tontine = {
      id: tontineId,
      name,
      description: description || "",
      contribution: Number(contribution),
      frequency,
      maxMembers: maxMembers || 10,
      type,
      status: "active",
      creatorId: user.id,
      creatorName: profile ? `${profile.firstName} ${profile.lastName}` : "Utilisateur",
      members: [{ userId: user.id, name: profile ? `${profile.firstName} ${profile.lastName}` : "Créateur", joinedAt: now }],
      currentRound: 1,
      totalRounds: maxMembers || 10,
      createdAt: now,
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    await kv.set(`tontine:${tontineId}`, tontine);

    const allIds: string[] = (await kv.get("tontines:index")) || [];
    await kv.set("tontines:index", [...allIds, tontineId]);

    const userTontineIds: string[] = (await kv.get(`user:${user.id}:tontines`)) || [];
    await kv.set(`user:${user.id}:tontines`, [...userTontineIds, tontineId]);

    return c.json(tontine, 201);
  } catch (e) {
    return c.json({ error: `Create tontine failed: ${e}` }, 500);
  }
});

app.post("/make-server-3612691c/tontines/:id/join", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const tontineId = c.req.param("id");
    const tontine = await kv.get(`tontine:${tontineId}`);
    if (!tontine) return c.json({ error: "Tontine not found" }, 404);

    const alreadyMember = tontine.members?.some((m: any) => m.userId === user.id);
    if (alreadyMember) return c.json({ error: "Already a member" }, 400);
    if (tontine.members?.length >= tontine.maxMembers) return c.json({ error: "Tontine is full" }, 400);

    const profile = await kv.get(`user:${user.id}:profile`);
    tontine.members.push({
      userId: user.id,
      name: profile ? `${profile.firstName} ${profile.lastName}` : "Membre",
      joinedAt: new Date().toISOString(),
    });

    await kv.set(`tontine:${tontineId}`, tontine);

    const userTontineIds: string[] = (await kv.get(`user:${user.id}:tontines`)) || [];
    if (!userTontineIds.includes(tontineId)) {
      await kv.set(`user:${user.id}:tontines`, [...userTontineIds, tontineId]);
    }

    return c.json(tontine);
  } catch (e) {
    return c.json({ error: `Join tontine failed: ${e}` }, 500);
  }
});

// ── Projects / Investments ────────────────────────────────────────────────────

app.get("/make-server-3612691c/projects", async (c) => {
  try {
    const allIds: string[] = (await kv.get("projects:index")) || [];
    const projects = await Promise.all(allIds.map((id) => kv.get(`project:${id}`)));
    return c.json(projects.filter(Boolean));
  } catch (e) {
    return c.json({ error: `Projects fetch failed: ${e}` }, 500);
  }
});

app.get("/make-server-3612691c/user/investments", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const investmentIds: string[] = (await kv.get(`user:${user.id}:investments`)) || [];
    const investments = await Promise.all(
      investmentIds.map((id) => kv.get(`investment:${id}`))
    );
    return c.json(investments.filter(Boolean));
  } catch (e) {
    return c.json({ error: `Investments fetch failed: ${e}` }, 500);
  }
});

app.post("/make-server-3612691c/projects", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const profile = await kv.get(`user:${user.id}:profile`);
    if (profile?.accountType !== "professionnel") {
      return c.json({ error: "Only professional accounts can create projects" }, 403);
    }

    const body = await c.req.json();
    const { name, description, targetAmount, category, imageUrl } = body;
    if (!name || !targetAmount || !category) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const projectId = uid();
    const project = {
      id: projectId,
      name,
      description: description || "",
      targetAmount: Number(targetAmount),
      raisedAmount: 0,
      category,
      imageUrl: imageUrl || null,
      creatorId: user.id,
      creatorName: profile.businessName || `${profile.firstName} ${profile.lastName}`,
      investors: [],
      status: "active",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`project:${projectId}`, project);
    const allIds: string[] = (await kv.get("projects:index")) || [];
    await kv.set("projects:index", [...allIds, projectId]);

    return c.json(project, 201);
  } catch (e) {
    return c.json({ error: `Create project failed: ${e}` }, 500);
  }
});

app.post("/make-server-3612691c/projects/:id/invest", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const projectId = c.req.param("id");
    const { amount } = await c.req.json();
    if (!amount || amount <= 0) return c.json({ error: "Invalid amount" }, 400);

    const wallet = await kv.get(`user:${user.id}:wallet`) || { balance: 0 };
    if ((wallet.balance || 0) < amount) return c.json({ error: "Solde insuffisant" }, 400);

    const project = await kv.get(`project:${projectId}`);
    if (!project) return c.json({ error: "Project not found" }, 404);

    wallet.balance -= amount;
    wallet.transactions = [
      {
        id: uid(),
        type: "debit",
        amount,
        description: `Investissement: ${project.name}`,
        date: new Date().toISOString(),
      },
      ...(wallet.transactions || []).slice(0, 49),
    ];
    await kv.set(`user:${user.id}:wallet`, wallet);

    const profile = await kv.get(`user:${user.id}:profile`) || {};
    profile.balance = wallet.balance;
    await kv.set(`user:${user.id}:profile`, profile);

    project.raisedAmount = (project.raisedAmount || 0) + amount;
    const existingInvestor = project.investors?.find((i: any) => i.userId === user.id);
    if (existingInvestor) {
      existingInvestor.amount += amount;
    } else {
      project.investors = [
        ...(project.investors || []),
        { userId: user.id, name: profile ? `${profile.firstName} ${profile.lastName}` : "Investisseur", amount },
      ];
    }
    await kv.set(`project:${projectId}`, project);

    const investmentId = uid();
    const investment = { id: investmentId, projectId, projectName: project.name, amount, date: new Date().toISOString() };
    await kv.set(`investment:${investmentId}`, investment);
    const userInvestments: string[] = (await kv.get(`user:${user.id}:investments`)) || [];
    await kv.set(`user:${user.id}:investments`, [...userInvestments, investmentId]);

    return c.json({ success: true, investment, project });
  } catch (e) {
    return c.json({ error: `Investment failed: ${e}` }, 500);
  }
});

// ── Wallet init ──────────────────────────────────────────────────────────────

app.post("/make-server-3612691c/wallet/init", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  try {
    const existing = await kv.get(`user:${user.id}:wallet`);
    if (!existing) {
      await kv.set(`user:${user.id}:wallet`, { balance: 0, currency: "EUR", transactions: [] });
    }
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ error: `Wallet init failed: ${e}` }, 500);
  }
});

// ── Seed endpoint ─────────────────────────────────────────────────────────────

app.post("/make-server-3612691c/seed", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  try {
    const existing = await kv.get("projects:index");
    if (!existing || (existing as string[]).length === 0) {
      await seedDemoData();
    }
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ error: `Seed failed: ${e}` }, 500);
  }
});

// ── Seed demo data ────────────────────────────────────────────────────────────

async function seedDemoData() {
  const now = new Date().toISOString();

  const projects = [
    {
      id: uid(),
      name: "Marché Bio de Dakar",
      description: "Création d'un marché bio local à Dakar pour promouvoir l'agriculture durable et soutenir les petits producteurs.",
      targetAmount: 15000,
      raisedAmount: 9200,
      category: "Agriculture",
      imageUrl: null,
      creatorId: "demo",
      creatorName: "Fatou Diallo Entreprises",
      investors: [],
      status: "active",
      createdAt: now,
    },
    {
      id: uid(),
      name: "École Numérique Abidjan",
      description: "Équipement d'une école en Côte d'Ivoire avec des tablettes et une connexion internet pour 300 élèves.",
      targetAmount: 25000,
      raisedAmount: 18500,
      category: "Éducation",
      imageUrl: null,
      creatorId: "demo",
      creatorName: "DigiAfrica SARL",
      investors: [],
      status: "active",
      createdAt: now,
    },
    {
      id: uid(),
      name: "Restaurant Afro-Caraïbe Paris",
      description: "Ouverture d'un restaurant mettant en valeur la cuisine afro-caribéenne dans le 10e arrondissement de Paris.",
      targetAmount: 40000,
      raisedAmount: 12000,
      category: "Restauration",
      imageUrl: null,
      creatorId: "demo",
      creatorName: "Laura Monlouis-Bonnaire",
      investors: [],
      status: "active",
      createdAt: now,
    },
  ];

  const projectIds: string[] = [];
  for (const p of projects) {
    await kv.set(`project:${p.id}`, p);
    projectIds.push(p.id);
  }
  await kv.set("projects:index", projectIds);

  // Seed a demo public tontine
  const tontineId = uid();
  const tontine = {
    id: tontineId,
    name: "Tontine Solidarité Diaspora",
    description: "Tontine mensuelle ouverte à toute la communauté. Cotisation de 100€/mois.",
    contribution: 100,
    frequency: "mensuel",
    maxMembers: 12,
    type: "public",
    status: "active",
    creatorId: "demo",
    creatorName: "Admin KAURI",
    members: [
      { userId: "demo1", name: "Aminata Bah", joinedAt: now },
      { userId: "demo2", name: "Moussa Koné", joinedAt: now },
      { userId: "demo3", name: "Chantal Nkosi", joinedAt: now },
    ],
    currentRound: 1,
    totalRounds: 12,
    createdAt: now,
    nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
  await kv.set(`tontine:${tontineId}`, tontine);
  await kv.set("tontines:index", [tontineId]);
}

Deno.serve(app.fetch);
