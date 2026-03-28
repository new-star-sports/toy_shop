"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { updateOrderStatusAction, updateTrackingAction } from "../_actions"
import type { OrderStatus } from "@nss/db/types"
import { 
  IconCircleCheck, 
  IconTruck, 
  IconCircleX, 
  IconPackage, 
  IconFileDescription 
} from "@tabler/icons-react"

interface FulfillmentActionsProps {
  orderId: string
  currentStatus: OrderStatus
}

export function FulfillmentActions({ orderId, currentStatus }: FulfillmentActionsProps) {
  const [loading, setLoading] = useState(false)

  const handleStatusUpdate = async (status: OrderStatus, note?: string) => {
    setLoading(true)
    try {
      const result = await updateOrderStatusAction(orderId, status, note)
      if (!result.success) alert("Error: " + result.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {currentStatus === "pending" && (
        <Button 
          disabled={loading} 
          onClick={() => handleStatusUpdate("confirmed", "Order confirmed by admin")}
          className="gap-2 bg-success hover:bg-success/90 rounded-full"
        >
          <IconCircleCheck size={16} stroke={2} />
          Confirm Order
        </Button>
      )}

      {currentStatus === "confirmed" && (
        <Button 
          disabled={loading} 
          onClick={() => handleStatusUpdate("processing", "Order is being packed")}
          className="gap-2 bg-primary hover:bg-primary/90 rounded-full"
        >
          <IconPackage size={16} stroke={2} />
          Start Processing
        </Button>
      )}

      {currentStatus === "processing" && (
        <Button 
          disabled={loading} 
          onClick={() => handleStatusUpdate("shipped", "Order dispatched with courier")}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-full"
        >
          <IconTruck size={16} stroke={2} />
          Mark as Shipped
        </Button>
      )}

      {currentStatus === "shipped" && (
        <Button 
          disabled={loading} 
          onClick={() => handleStatusUpdate("delivered", "Order delivered to customer")}
          className="gap-2 bg-success hover:bg-success/90 rounded-full"
        >
          <IconCircleCheck size={16} stroke={2} />
          Mark as Delivered
        </Button>
      )}

      {currentStatus !== "cancelled" && currentStatus !== "delivered" && (
        <Button 
          variant="outline"
          disabled={loading} 
          onClick={() => {
            const reason = prompt("Enter cancellation reason:")
            if (reason) handleStatusUpdate("cancelled", reason)
          }}
          className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 rounded-full"
        >
          <IconCircleX size={16} stroke={2} />
          Cancel Order
        </Button>
      )}
      
      <Button variant="outline" className="gap-2 rounded-full border-border/50">
        <IconFileDescription size={16} stroke={1.5} />
        Invoice
      </Button>
    </div>
  )
}

export function TrackingUpdate({ orderId, currentTracking }: { orderId: string, currentTracking?: string }) {
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    const tracking = prompt("Enter tracking number:", currentTracking || "")
    if (tracking !== null) {
      setLoading(true)
      const result = await updateTrackingAction(orderId, { tracking_number: tracking })
      if (!result.success) alert("Error: " + result.error)
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" className="w-full text-[10px]" disabled={loading} onClick={handleUpdate}>
      {currentTracking ? "Update Tracking" : "Add Tracking Info"}
    </Button>
  )
}
