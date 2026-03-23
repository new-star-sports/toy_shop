import { getSettings } from "@nss/db/queries"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nss/ui/components/tabs"
import { GeneralForm } from "./_components/general-form"
import { MarketingForm } from "./_components/marketing-form"
import { CommerceForm } from "./_components/commerce-form"
import { Settings as SettingsIcon, Megaphone, Store, Truck } from "lucide-react"

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-nss-text-primary flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-nss-primary" /> Store Settings
        </h1>
        <p className="text-nss-text-secondary">Configure your store's global identity, marketing bars, and commerce rules.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-nss-surface p-1 border border-nss-border">
          <TabsTrigger value="general" className="gap-2">
            <Store className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="marketing" className="gap-2">
            <Megaphone className="h-4 w-4" /> Marketing
          </TabsTrigger>
          <TabsTrigger value="commerce" className="gap-2">
            <Truck className="h-4 w-4" /> Commerce
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
