import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);
  return size;
};

export default useWindowSize;
