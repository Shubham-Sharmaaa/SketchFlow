import { RefObject, useEffect, useState } from "react";

const useWindowSize = (containerRef: RefObject<HTMLDivElement | null>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const height = containerRef.current?.clientHeight;
  const width = containerRef.current?.clientWidth;
  useEffect(() => {
    setSize({
      width: width ?? 0,
      height: height ?? 0,
    });
  }, [height, width]);
  return size;
};

export default useWindowSize;
