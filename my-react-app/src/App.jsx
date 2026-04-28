import { useState } from "react";
import { Newspaper, Loader2, RotateCcw } from "lucide-react";
import ModelSelector from "./components/ModelSelector";
import ResultCard from "./components/ResultCard";
import { predictSingle, predictAll } from "./utils/api";

export default function App() {
  const [text, setText]               = useState("");
  const [mode, setMode]               = useState("single");
  const [model, setModel]             = useState("logistic_regression");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [singleResult, setSingleResult] = useState(null);
  const [allResult, setAllResult]     = useState(null);

  const canSubmit = text.trim().length >= 10 && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setSingleResult(null);
    setAllResult(null);

    try {
      if (mode === "single") {
        const res = await predictSingle(text.trim(), model);
        setSingleResult(res);
      } else {
        const res = await predictAll(text.trim());
        setAllResult(res);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setText("");
    setSingleResult(null);
    setAllResult(null);
    setError(null);
  }

  const hasResult = singleResult || allResult;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
            <Newspaper size={18} className="text-zinc-950" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight leading-none">
              Fake News Detector
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Powered by ML · 4 Models
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Intro */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Is this news{" "}
              <span className="text-amber-400">real or fake?</span>
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Paste an article or headline below and let the model decide.
            </p>
          </div>

          {/* Text Area */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
              Article / Headline
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the news article or headline here…"
              rows={6}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all duration-150"
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>{text.length} chars</span>
              {text.length > 0 && text.length < 10 && (
                <span className="text-amber-500">Min 10 characters</span>
              )}
            </div>
          </div>

          {/* Model Selector */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
              Model
            </label>
            <ModelSelector
              mode={mode}
              selectedModel={model}
              onModeChange={setMode}
              onModelChange={setModel}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3 rounded-xl font-bold tracking-wide text-sm transition-all duration-200 flex items-center justify-center gap-2
              bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-lg shadow-amber-400/20
              disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing…
              </>
            ) : (
              "Analyze Article"
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Result */}
          {hasResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                  Result
                </p>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>
              <ResultCard single={singleResult ?? undefined} all={allResult ?? undefined} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 px-6 py-4 text-center text-xs text-zinc-600">
        Data Analysis Final Project 
      </footer>
    </div>
  );
}