import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { useOverlayClose } from "./useOverlayClose.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function Probe({ open, onClose, back }) {
  useOverlayClose(open, onClose, { back });
  return null;
}
function mount(props) {
  const el = document.createElement("div");
  const root = createRoot(el);
  act(() => root.render(<Probe {...props} />));
  return { rerender: (p) => act(() => root.render(<Probe {...p} />)), unmount: () => act(() => root.unmount()) };
}

describe("useOverlayClose", () => {
  it("Escape closes an open overlay, not a closed one", () => {
    const onClose = vi.fn();
    const m = mount({ open: false, onClose });
    act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
    expect(onClose).not.toHaveBeenCalled();
    m.rerender({ open: true, onClose });
    act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
    expect(onClose).toHaveBeenCalledTimes(1);
    m.unmount();
  });

  it("phone Back (popstate) closes it; X-close removes the extra history entry", () => {
    const onClose = vi.fn();
    const m = mount({ open: true, onClose });
    expect(window.history.state?.jnOverlay).toBe(true);
    act(() => window.dispatchEvent(new PopStateEvent("popstate")));
    expect(onClose).toHaveBeenCalledTimes(1);
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    m.rerender({ open: false, onClose });
    expect(back).not.toHaveBeenCalled(); // already went back
    m.rerender({ open: true, onClose });
    m.rerender({ open: false, onClose });  // closed with X
    expect(back).toHaveBeenCalledTimes(1);
    back.mockRestore();
    m.unmount();
  });

  it("back:false never touches history", () => {
    const push = vi.spyOn(window.history, "pushState");
    const m = mount({ open: true, onClose: () => {}, back: false });
    expect(push).not.toHaveBeenCalled();
    push.mockRestore();
    m.unmount();
  });
});
