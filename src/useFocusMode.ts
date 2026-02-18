import { useState, useEffect, useCallback } from "react";

/**
 * Focus mode hook for distraction-free writing.
 * Hides sidebar, expands editor, dims UI elements.
 * Toggle with Ctrl+Shift+F or the button.
 */
export function useFocusMode() {
  const [active, setActive] = useState(false);

  const toggle = useCallback(() => {
    setActive(prev => {
      const next = !prev;
      document.body.classList.toggle("focus-mode", next);
      return next;
    });
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        toggle();
      }
      // ESC exits focus mode
      if (e.key === "Escape" && active) {
        setActive(false);
        document.body.classList.remove("focus-mode");
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [active, toggle]);

  return { active, toggle };
}
