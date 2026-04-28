import { ShieldCheck, ShieldAlert, BarChart2 } from "lucide-react";

const MODEL_LABELS = {
  logistic_regression: "Logistic Regression",
  decision_tree:       "Decision Tree",
  gradient_boosting:   "Gradient Boosting",
  random_forest:       "Random Forest",
};

function Badge({ label }) {
  const isReal = label === "REAL";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold tracking-wider ${
        isReal
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : "bg-red-500/15 text-red-400 border border-red-500/30"
      }`}
    >
      {isReal ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
      {label}
    </span>
  );
}

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>Confidence</span>
        <span className="font-mono font-semibold text-zinc-300">{pct}%</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}


export default function ResultCard({ single, all }) {
  if (single) {
    const isReal = single.label === "REAL";
    return (
      <div
        className={`rounded-2xl border p-6 space-y-4 transition-all duration-300 ${
          isReal
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-red-500/30 bg-red-500/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Verdict
            </p>
            <Badge label={single.label} />
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Model
            </p>
            <p className="text-sm text-zinc-300 font-medium">
              {MODEL_LABELS[single.model_used]}
            </p>
          </div>
        </div>
        <ConfidenceBar value={single.confidence} />
      </div>
    );
  }

  if (all) {
    const entries = Object.entries(all.predictions) 
    const realCount = entries.filter(([, v]) => v === "REAL").length;
    const majority = realCount >= 3 ? "REAL" : realCount <= 1 ? "FAKE" : null;

    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        {/* Majority */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400">
            <BarChart2 size={16} />
            <span className="text-sm font-medium">Majority Verdict</span>
          </div>
          {majority ? (
            <Badge label={majority} />
          ) : (
            <span className="text-sm text-amber-400 font-semibold">
              2 — 2 Split
            </span>
          )}
        </div>

        {/* Per-model results */}
        <div className="space-y-2.5">
          {entries.map(([model, label]) => (
            <div
              key={model}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-800/50"
            >
              <span className="text-sm text-zinc-300">
                {MODEL_LABELS[model] ?? model}
              </span>
              <Badge label={label} />
            </div>
          ))}
        </div>

        {/* Score bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Real votes</span>
            <span className="font-mono text-zinc-300">
              {realCount} / {entries.length}
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${(realCount / entries.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }


}