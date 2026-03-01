"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook01Icon,
  NewTwitterIcon,
  PinterestIcon,
  Linkedin01Icon,
  Mail01Icon,
  Copy01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  function copyLink() {
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied to clipboard"),
      () => toast.error("Failed to copy link")
    );
  }

  const platforms = [
    {
      label: "Share on Facebook",
      icon: Facebook01Icon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Share on X",
      icon: NewTwitterIcon,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "Share on Pinterest",
      icon: PinterestIcon,
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    },
    {
      label: "Share on LinkedIn",
      icon: Linkedin01Icon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Share via Email",
      icon: Mail01Icon,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">
        Share:
      </span>
      {platforms.map((platform) => (
        <Button
          key={platform.label}
          variant="outline"
          size="icon"
          asChild
          title={platform.label}
        >
          <a
            href={platform.href}
            target={platform.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={platform.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          >
            <HugeiconsIcon icon={platform.icon} size={18} />
          </a>
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={copyLink}
        title="Copy link"
      >
        <HugeiconsIcon icon={Copy01Icon} size={18} />
      </Button>
    </div>
  );
}
