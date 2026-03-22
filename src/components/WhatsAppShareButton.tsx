import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppShareButtonProps {
  text: string;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "sm";
  className?: string;
}

export default function WhatsAppShareButton({ text, label = "Share via WhatsApp", variant = "outline", className }: WhatsAppShareButtonProps) {
  const handleShare = () => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      variant={variant === "sm" ? "ghost" : variant}
      size={variant === "sm" ? "sm" : "default"}
      onClick={handleShare}
      className={cn("gap-2 text-[#25D366] hover:text-[#25D366]", className)}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </Button>
  );
}
