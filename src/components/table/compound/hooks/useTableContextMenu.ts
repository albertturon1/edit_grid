import { useState, useCallback } from "react";
import type { ActiveCell } from "../types";

interface MenuState {
  position: { x: number; y: number };
  activeCell: ActiveCell;
}

export function useTableContextMenu() {
  const [menuState, setMenuState] = useState<MenuState | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent, activeCell: ActiveCell) => {
    e.preventDefault();
    setMenuState({
      position: { x: e.clientX, y: e.clientY },
      activeCell,
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuState(null);
  }, []);

  return { menuState, handleContextMenu, closeMenu };
}
