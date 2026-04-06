import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: "primary" | "secondary" | "accent";
  link: string;
  buttonText: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  color,
  link,
  buttonText,
}: FeatureCardProps) {
  const gradientClasses = {
    primary: "bg-gradient-to-br from-primary-500 to-primary-600",
    secondary: "bg-gradient-to-br from-secondary-500 to-secondary-600",
    accent: "bg-gradient-to-br from-accent-500 to-accent-600",
  };

  const buttonTextColor = {
    primary: "text-primary-600",
    secondary: "text-secondary-600",
    accent: "text-accent-600",
  };

  return (
    <div
      className={`${gradientClasses[color]} rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start">
        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
          <span className="material-icons text-black">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          <p className="text-sm text-black text-opacity-80 mt-1">
            {description}
          </p>
        </div>
      </div>
      <Button
        asChild
        className={`mt-4 px-3 py-1.5 bg-black ${buttonTextColor[color]} rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors`}
      >
        <Link href={link}>{buttonText}</Link>
      </Button>
    </div>
  );
}
