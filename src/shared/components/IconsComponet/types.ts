import * as svg from '@/public/icons';

export type IconName = keyof typeof svg | 'NONE';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}
