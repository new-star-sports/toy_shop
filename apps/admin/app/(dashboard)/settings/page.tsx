import { getSettings } from "@nss/db/queries"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralForm } from "./_components/general-form"
import { MarketingForm } from "./_components/marketing-form"
import { CommerceForm } from "./_components/commerce-form"
import { IconSettings, IconTruck, IconBuildingStore } from "@tabler/icons-react"
import { Megaphone } from "lucide-react"


export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const settings = await getSettings([
    "store_info",
    "announcement_bar",
    "trust_bar",
    "shipping",
    "loyalty"
  ])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <IconSettings className="h-6 w-6 text-primary" /> Store Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your store&apos;s global identity, marketing bars, and commerce rules.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-muted/30 p-1 border border-border rounded-xl flex w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="general" className="gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">
            <IconBuildingStore className="h-4 w-4 hidden sm:inline" /> General
          </TabsTrigger>
          <TabsTrigger value="marketing" className="gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">
            <Megaphone className="h-4 w-4 hidden sm:inline" /> Marketing
          </TabsTrigger>
          <TabsTrigger value="commerce" className="gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">
            <IconTruck className="h-4 w-4 hidden sm:inline" /> Commerce
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general">
            <GeneralForm initialData={settings.store_info as any} />
          </TabsContent>
          <TabsContent value="marketing">
            <MarketingForm
              announcementBar={settings.announcement_bar as any}
              trustBar={settings.trust_bar as any}
            />
          </TabsContent>
          <TabsContent value="commerce">
            <CommerceForm
              shipping={settings.shipping as any}
              loyalty={settings.loyalty as any}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
