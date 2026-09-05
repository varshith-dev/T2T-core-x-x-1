"""T2T Monitor — a crisp, non-blocking Windows GUI to watch the pipeline.

All DB/network work runs on a background thread; only the main thread touches
widgets (via self.after). That keeps the window responsive even when a service
is slow or down. Tabs: Overview · Live Pipeline · API Calls · DB Tables.
"""
import ctypes
import os
import threading
import tkinter as tk
from tkinter import ttk

import psycopg
import requests

try:
    import sv_ttk
except ImportError:
    sv_ttk = None

# DPI-aware BEFORE any Tk call so text is sharp.
try:
    ctypes.windll.shcore.SetProcessDpiAwareness(1)
except Exception:
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass

DB_URL = os.environ.get("T2T_DB_URL", "postgres://postgres:postgres@localhost:5433/t2t")
BACKEND = os.environ.get("T2T_BACKEND", "http://localhost:3000")
ML = os.environ.get("T2T_ML", "http://localhost:8000")
REFRESH_MS = 2000
TABLES = ["submissions", "users", "point_ledger", "coupons", "redemptions", "point_rules"]

GREEN = "#16a34a"
RED = "#dc2626"
AMBER = "#d97706"
MUTED = "#64748b"
STATUS_FG = {"approved": GREEN, "needs_review": AMBER, "rejected": RED, "pending": MUTED}


class Monitor(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("T2T Monitor")
        self.geometry("1120x700")
        self.minsize(940, 580)
        self._conn = None
        self._busy = False
        self.dark = False

        try:
            self.tk.call("tk", "scaling", self.winfo_fpixels("1i") / 72.0)
        except Exception:
            pass
        if sv_ttk:
            sv_ttk.set_theme("light")
        else:
            ttk.Style(self).theme_use("clam")

        self.f_title = ("Segoe UI Variable Display", 15, "bold") if sv_ttk else ("Segoe UI", 14, "bold")
        self.f_num = ("Segoe UI Variable Display", 26, "bold") if sv_ttk else ("Segoe UI", 24, "bold")
        self.f_ui = ("Segoe UI", 10)

        self._build()
        self.protocol("WM_DELETE_WINDOW", self._on_close)
        self._closing = False
        self._start()

    # ---------- layout ----------
    def _build(self):
        head = ttk.Frame(self, padding=(18, 14, 18, 6))
        head.pack(fill="x")
        ttk.Label(head, text="◉", foreground=GREEN, font=("Segoe UI", 14)).pack(side="left")
        ttk.Label(head, text=" T2T Monitor", font=self.f_title).pack(side="left")
        ttk.Button(head, text="◐ Theme", command=self._toggle_theme).pack(side="right")
        self.h_db = ttk.Label(head, text="db", font=self.f_ui)
        self.h_ml = ttk.Label(head, text="ml", font=self.f_ui)
        self.h_be = ttk.Label(head, text="backend", font=self.f_ui)
        for w in (self.h_db, self.h_ml, self.h_be):
            w.pack(side="right", padx=(0, 14))

        nb = ttk.Notebook(self)
        nb.pack(fill="both", expand=True, padx=14, pady=(4, 4))
        self._overview_tab(nb)
        self.pipe = self._tree_tab(nb, "Live Pipeline",
                                   [("time", 90), ("user", 150), ("status", 120), ("ml guess", 110),
                                    ("conf", 70), ("points", 70), ("model", 200)])
        self.api = self._tree_tab(nb, "API Calls",
                                  [("time", 90), ("method", 80), ("path", 320), ("status", 80), ("ms", 70)])
        self._tables_tab(nb)
        self.status = ttk.Label(self, text="starting…", foreground=MUTED, font=("Segoe UI", 9),
                                padding=(18, 2, 18, 8))
        self.status.pack(fill="x")

    def _overview_tab(self, nb):
        f = ttk.Frame(nb, padding=18)
        nb.add(f, text="  Overview  ")
        self.cards = {}
        specs = ["Users", "Submissions", "Pending", "In review", "Approved",
                 "Points issued", "Points spent", "Coupons", "Redemptions pending"]
        for i, label in enumerate(specs):
            card = ttk.Frame(f, style="Card.TFrame" if sv_ttk else "TFrame", padding=16)
            card.grid(row=i // 4, column=i % 4, padx=8, pady=8, sticky="nsew", ipadx=6)
            num = ttk.Label(card, text="–", foreground=GREEN, font=self.f_num)
            num.pack(anchor="w")
            ttk.Label(card, text=label, foreground=MUTED, font=self.f_ui).pack(anchor="w")
            self.cards[label] = num
        for c in range(4):
            f.columnconfigure(c, weight=1)

    def _tree_tab(self, nb, title, cols):
        f = ttk.Frame(nb, padding=(12, 10))
        nb.add(f, text=f"  {title}  ")
        tree = ttk.Treeview(f, columns=[c for c, _ in cols], show="headings", selectmode="none")
        for c, w in cols:
            tree.heading(c, text=c.upper())
            tree.column(c, width=w, anchor="w", stretch=(c in ("path", "model", "user")))
        vs = ttk.Scrollbar(f, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=vs.set)
        tree.pack(side="left", fill="both", expand=True)
        vs.pack(side="right", fill="y")
        return tree

    def _tables_tab(self, nb):
        f = ttk.Frame(nb, padding=(12, 10))
        nb.add(f, text="  DB Tables  ")
        top = ttk.Frame(f)
        top.pack(fill="x", pady=(0, 8))
        ttk.Label(top, text="Table", font=self.f_ui).pack(side="left", padx=(0, 8))
        self.table_var = tk.StringVar(value=TABLES[0])
        cb = ttk.Combobox(top, textvariable=self.table_var, values=TABLES, state="readonly", width=22)
        cb.pack(side="left")
        self.table_tree = ttk.Treeview(f, show="headings", selectmode="none")
        self.table_tree.pack(fill="both", expand=True)

    def _toggle_theme(self):
        if sv_ttk:
            sv_ttk.toggle_theme()
            self.dark = sv_ttk.get_theme() == "dark"

    def _stripe(self, tree):
        tree.tag_configure("odd", background="#20262e" if self.dark else "#f3f4f6")
        for s, fg in STATUS_FG.items():
            tree.tag_configure(s, foreground=fg)

    # ---------- fetch (background thread) ----------
    def _start(self):
        if self._closing:
            return
        if self._busy:
            self.after(REFRESH_MS, self._start)
            return
        self._busy = True
        threading.Thread(target=self._collect, daemon=True).start()

    def _conn_ok(self):
        if self._conn is None or self._conn.closed:
            self._conn = psycopg.connect(DB_URL, autocommit=True, connect_timeout=3)
        return self._conn

    def _q(self, sql, params=None):
        with self._conn_ok().cursor() as cur:
            cur.execute(sql, params or ())
            cols = [d.name for d in cur.description] if cur.description else []
            return cols, cur.fetchall()

    def _svc(self, url):
        try:
            return requests.get(url + "/health", timeout=2).ok
        except Exception:
            return False

    def _collect(self):
        """Runs off the UI thread. Gathers a snapshot, posts it back via after()."""
        data = {"db_ok": True}
        try:
            _, [(users,)] = self._q("select count(*) from users")
            _, srows = self._q("select status, count(*) from submissions group by status")
            sc = {s: n for s, n in srows}
            _, [(subs,)] = self._q("select count(*) from submissions")
            _, [(issued, spent)] = self._q(
                "select coalesce(sum(delta) filter (where delta>0),0), "
                "coalesce(-sum(delta) filter (where delta<0),0) from point_ledger")
            _, [(coupons,)] = self._q("select count(*) from coupons")
            _, [(rp,)] = self._q("select count(*) from redemptions where status='pending'")
            data["overview"] = {"Users": users, "Submissions": subs, "Pending": sc.get("pending", 0),
                                "In review": sc.get("needs_review", 0), "Approved": sc.get("approved", 0),
                                "Points issued": issued, "Points spent": spent, "Coupons": coupons,
                                "Redemptions pending": rp}
            _, data["pipeline"] = self._q(
                "select s.created_at, u.display_name, s.status, s.ml_category, s.ml_confidence, "
                "s.awarded_points, s.ml_model_version from submissions s "
                "join users u on u.id = s.user_id order by s.created_at desc limit 100")
            table = self.table_var.get()
            if table in TABLES:
                data["table"] = self._q(f"select * from {table} order by 1 desc limit 200")
        except Exception:
            data["db_ok"] = False
            self._conn = None
        data["be"] = self._svc(BACKEND)
        data["ml"] = self._svc(ML)
        data["api"] = None
        if data["be"]:
            try:
                data["api"] = requests.get(BACKEND + "/debug/events", timeout=2).json()["events"]
            except Exception:
                pass
        if not self._closing:
            self.after(0, self._render, data)

    # ---------- render (main thread) ----------
    def _render(self, data):
        try:
            if "overview" in data:
                for k, v in data["overview"].items():
                    self.cards[k].config(text=str(v))
            if data.get("pipeline") is not None:
                self._render_pipeline(data["pipeline"])
            if data.get("api") is not None:
                self._render_api(data["api"])
            if data.get("table") is not None:
                self._render_table(*data["table"])
            self._pill(self.h_be, "backend", data.get("be"))
            self._pill(self.h_ml, "ml", data.get("ml"))
            self._pill(self.h_db, "db", data.get("db_ok"))
            self.status.config(text=f"auto-refresh {REFRESH_MS // 1000}s   ·   {DB_URL}")
        finally:
            self._busy = False
            if not self._closing:
                self.after(REFRESH_MS, self._start)

    def _pill(self, label, name, ok):
        label.config(text=f"{'●' if ok else '○'} {name}", foreground=GREEN if ok else RED)

    def _render_pipeline(self, rows):
        self._stripe(self.pipe)
        self.pipe.delete(*self.pipe.get_children())
        for i, (created, name, status, cat, conf, pts, model) in enumerate(rows):
            tags = [status] if status in STATUS_FG else []
            if i % 2:
                tags.append("odd")
            self.pipe.insert("", "end", tags=tags, values=(
                created.strftime("%H:%M:%S"), name, str(status).replace("_", " "), cat or "–",
                f"{conf * 100:.0f}%" if conf is not None else "–",
                f"+{pts}" if pts else ("–" if pts is None else "0"),
                (model or "–").split("/")[-1]))

    def _render_api(self, events):
        self._stripe(self.api)
        self.api.delete(*self.api.get_children())
        for i, e in enumerate(events[:150]):
            code = e["status"]
            tag = "approved" if code < 400 else ("needs_review" if code < 500 else "rejected")
            tags = [tag] + (["odd"] if i % 2 else [])
            self.api.insert("", "end", tags=tags,
                            values=(e["time"][11:19], e["method"], e["path"], code, f'{e["ms"]}ms'))

    def _render_table(self, cols, rows):
        self.table_tree.config(columns=cols)
        for c in cols:
            self.table_tree.heading(c, text=c.upper())
            self.table_tree.column(c, width=max(90, min(240, len(c) * 13)), anchor="w")
        self._stripe(self.table_tree)
        self.table_tree.delete(*self.table_tree.get_children())
        for i, row in enumerate(rows):
            self.table_tree.insert("", "end", tags=(["odd"] if i % 2 else []),
                                   values=[str(x)[:64] for x in row])

    def _on_close(self):
        self._closing = True
        try:
            if self._conn and not self._conn.closed:
                self._conn.close()
        except Exception:
            pass
        self.destroy()


if __name__ == "__main__":
    Monitor().mainloop()
