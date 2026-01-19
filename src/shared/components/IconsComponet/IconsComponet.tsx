import * as svg from '@/public/icons';
import { IconProps } from './types';

export default function IconsComponet({ name, size = 24, className, color = 'currentColor', ...props }: IconProps) {
  if (name === 'NONE') return null;

  const IconComponent = svg[name];

  if (!IconComponent) {
    console.error(`Icon "${name}" not found`);
    return null;
  }

  return (
    <span
      className={`inline-flex ${props.onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <IconComponent
        className="inline-flex items-center justify-center text-center"
        width="100%"
        height="100%"
        color={color}
        {...props}
      />
    </span>
  );
}
