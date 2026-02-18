import { useState, useEffect, useRef, useCallback } from "react";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

/**
 * Auto-save hook with debounce and status indicator.
 * Shows "Saving..." while debouncing, "Saved" after persist.
 */
export function useAutoSave<T>(
  data: T,
  key: string,
  debounceMs: number = 500
): { status: SaveStatus; lastSaved: Date | null; forceSave: () => void } {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const prevData = useRef<string>("");

  const save = useCallback(() => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      setStatus("saved");
      setLastSaved(new Date());
    } catch {
      setStatus("error");
    }
  }, [data, key]);

  useEffect(() => {
    const serialized = JSON.stringify(data);
    if (serialized === prevData.current) return;
    prevData.current = serialized;

    setStatus("saving");
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(save, debounceMs);

    return () => clearTimeout(timeoutRef.current);
  }, [data, debounceMs, save]);

  return { status, lastSaved, forceSave: save };
}
