import { useState, useEffect, useCallback } from "react";

export function useElementDimensions(ref: React.RefObject<HTMLElement>) {
  const getDimensions = useCallback(() => {
    return {
      width: ref.current?.offsetWidth ?? 0,
      height: ref.current?.offsetHeight ?? 0,
    };
  }, [ref]);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions());
    };
    const dimensionsTimeout = setTimeout(() => {
      if (ref.current) {
        setDimensions(getDimensions());
      }
    }, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(dimensionsTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [ref, getDimensions]);

  return dimensions;
}
