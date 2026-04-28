const MODELS = [
  { key: "logistic_regression", label: "Logistic Regression", short: "LR" },
  { key: "decision_tree",       label: "Decision Tree",       short: "DT" },
  { key: "gradient_boosting",   label: "Gradient Boosting",   short: "GB" },
  { key: "random_forest",       label: "Random Forest",       short: "RF" },
];

export default function ModelSelector({ mode, selectedModel, onModeChange, onModelChange }) {
  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
        {["single", "all"].map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
              mode === m
                ? "bg-amber-400 text-zinc-950 shadow-lg shadow-amber-400/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {m === "single" ? "Single Model" : "All Models"}
          </button>
        ))}
      </div>

      {/* Model Pills */}
      {mode === "single" && (
        <div className="grid grid-cols-2 gap-2">
          {MODELS.map(({ key, label, short }) => (
            <button
              key={key}
              onClick={() => onModelChange(key)}
              className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-150 text-left ${
                selectedModel === key
                  ? "border-amber-400 bg-amber-400/10 text-amber-300"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              <span className="font-mono text-xs font-bold mr-2 opacity-60">{short}</span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}