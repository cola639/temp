// utils/colors.js
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成单个随机 hsl
function generateHSL(type = "light") {
  const h = randomInRange(0, 360);   // 色相
  const s = randomInRange(40, 100);  // 饱和度
  let l;

  if (type === "dark") {
    l = randomInRange(22, 36); // 深色
  } else {
    l = randomInRange(42, 75); // 浅色
  }

  return `hsl(${h}, ${s}%, ${l}%)`;
}

// 生成数组
export function generateColors(count = 10) {
  const softColors = Array.from({ length: count }, () => generateHSL("light"));
  const deepColors = Array.from({ length: count }, () => generateHSL("dark"));
  return { softColors, deepColors };
}

  const [softColors, setSoftColors] = useState([]);
  const [deepColors, setDeepColors] = useState([]);

  useEffect(() => {
    const { softColors, deepColors } = generateColors(5);
    setSoftColors(softColors);
    setDeepColors(deepColors);
  }, []);
