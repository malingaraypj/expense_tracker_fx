import React from "react";
import * as Icons from "lucide-react";
import { type LucideProps, type LucideIcon } from "lucide-react";

interface IconRendererProps extends LucideProps {
  name: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  name,
  className = "w-5 h-5",
  ...props
}) => {
  // Safely cast the namespace without using 'any' to satisfy strict TypeScript rules
  const IconComponent =
    (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Tag;

  return <IconComponent className={className} {...props} />;
};
