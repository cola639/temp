// ============ 15 组柔和 HSL 颜色 ============
const softBorders = [
  'hsl(190 50% 80%)', 
  'hsl(200 45% 85%)',
  'hsl(170 40% 80%)', 
  'hsl(150 35% 82%)', 
  'hsl(120 30% 85%)', 
  'hsl( 80 35% 80%)', 
  'hsl( 60 40% 85%)', 
  'hsl( 45 50% 85%)', 
  'hsl( 30 45% 82%)', 
  'hsl( 25 40% 80%)', 
  'hsl(330 35% 82%)', 
  'hsl(340 40% 85%)', 
  'hsl(270 40% 85%)',
  'hsl(230 45% 85%)',
  'hsl(210 40% 80%)'
];


function pickSoftBorder() {
  return softBorders[Math.floor(Math.random() * softBorders.length)];
}

