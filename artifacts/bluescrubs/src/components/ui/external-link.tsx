import { useToast } from "@/hooks/use-toast";

interface ExternalLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, className, children }: ExternalLinkProps) {
  const { toast } = useToast();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const win = window.open(href, "_blank", "noopener,noreferrer");
    if (!win) {
      navigator.clipboard.writeText(href).catch(() => {});
      toast({
        title: "Link copied",
        description: "Paste the URL into a new browser tab to open it.",
        duration: 4000,
      });
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
