interface LayoutItem {
  id: string;
  name: string;
  weight: number;
}

type LayoutResult = LayoutItem & { x: number; y: number };

export function radialLayout({
  center,
  items,
}: {
  center: { x: number; y: number };
  items: LayoutItem[];
}): LayoutResult[] {
  return items.map((item) => {
    const minRadius = 90;
    const maxRadius = 320;

    const radius = maxRadius - (item.weight / 100) * (maxRadius - minRadius);
    const angle = Math.random() * Math.PI * 2;

    return {
      ...item,
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
  });
}
