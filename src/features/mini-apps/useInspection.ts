"use client";

import { useCallback, useState } from "react";
import { readActiveTabUrl } from "@/lib/browser";
import {
  type Inspection,
  inspect,
  MAX_HISTORY,
  type MiniApp,
} from "@/lib/models/inspection";
import type { QrEvidence } from "@/lib/models/qr";

export type Session = Inspection & {
  id: number;
  content?: string;
  evidence?: QrEvidence;
};

export function useInspection() {
  const [app, setApp] = useState<MiniApp>("url");
  const [captureGeneration, setCaptureGeneration] = useState(0);
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [result, setResult] = useState<Session | null>(null);
  const [error, setError] = useState<"invalidInput" | "tabError" | null>(null);
  function check() {
    try {
      const next = { ...inspect(app, input), id: Date.now() };
      setResult(next);
      setSessions((previous) => [next, ...previous].slice(0, MAX_HISTORY));
      setError(null);
    } catch {
      setError("invalidInput");
      setResult(null);
    }
  }
  function capture(content: string, evidence: QrEvidence) {
    const next = {
      ...inspect("qr", content),
      id: Date.now(),
      content,
      evidence,
    };
    setInput(content);
    setApp("qr");
    setResult(next);
    setSessions((previous) => [next, ...previous].slice(0, MAX_HISTORY));
    setError(null);
  }
  const selectApp = useCallback((next: MiniApp) => {
    setCaptureGeneration((generation) => generation + 1);
    setApp(next);
    setInput("");
    setResult(null);
    setError(null);
  }, []);
  function clear() {
    setCaptureGeneration((generation) => generation + 1);
    setInput("");
    setSessions([]);
    setResult(null);
    setError(null);
  }
  async function currentTab() {
    try {
      setInput(await readActiveTabUrl());
      setApp("url");
      setResult(null);
      setError(null);
    } catch {
      setError("tabError");
    }
  }
  return {
    app,
    captureGeneration,
    input,
    sessions,
    result,
    error,
    setInput,
    selectApp,
    check,
    capture,
    clear,
    currentTab,
    setResult,
  };
}
