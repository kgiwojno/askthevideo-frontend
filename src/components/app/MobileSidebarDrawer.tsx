import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { useState } from "react";
import AppSidebar from "./AppSidebar";
import { Video, Limits } from "@/types/app";

interface MobileSidebarDrawerProps {
  videos: Video[];
  onLoadVideo: (url: string) => void;
  onRemoveVideo: (id: string) => void;
  onToggleVideo: (id: string) => void;
  questionsRemaining: number;
  isUnlimited: boolean;
  isLoadingVideo: boolean;
  onSubmitAccessKey: (key: string) => void;
  limits: Limits;
}

const MobileSidebarDrawer = (props: MobileSidebarDrawerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden fixed top-3 left-3 z-50 bg-card border border-border rounded-lg p-2 text-foreground hover:bg-secondary transition-colors shadow-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px] sm:w-[300px] bg-card border-r border-border" aria-describedby={undefined}>
        <VisuallyHidden>
          <SheetTitle>Navigation</SheetTitle>
        </VisuallyHidden>
        <AppSidebar {...props} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebarDrawer;
