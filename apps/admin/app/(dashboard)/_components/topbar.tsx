"use client";

import { usePathname } from "next/navigation";
import { 
  IconSearch, 
  IconBell 
} from "@tabler/icons-react";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage,
  Button,
  Separator,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@nss/ui";

export function Topbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-40 flex items-center px-6 gap-4">
      {/* Breadcrumbs */}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.length > 0 && <BreadcrumbSeparator />}
          {segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            const isLast = index === segments.length - 1;
            const label = segment.charAt(0).toUpperCase() + segment.slice(1);

            return (
              <BreadcrumbList key={href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </BreadcrumbList>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <IconSearch size={18} stroke={1.5} />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
          <IconBell size={18} stroke={1.5} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <div className="flex items-center gap-3 pl-1">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs font-semibold text-foreground">Admin User</span>
            <span className="text-[10px] text-muted-foreground">Super Admin</span>
          </div>
          <Avatar className="h-8 w-8 border border-border/50">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
