"use client"

import { useState } from "react"
import { Button } from "@nss/ui/components/button"
import { updateOrderStatusAction, updateTrackingAction } from "../_actions"
import type { OrderStatus } from "@nss/db/types"
import { CheckCircle2, Truck, XCircle, PackageCheck, ReceiptText } from "lucide-react"

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
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 size={16} />
          Confirm Order
        </Button>
      )}

      {currentStatus === "confirmed" && (
        <Button 
          disabled={loading} 
          onClick={() => handleStatusUpdate("processing", "Order is being packed")}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <PackageCheck size={16} />
          Start Processing
        </Button>
      )}

      {currentStatus === "processing" && (
        <Button 
          disabled={loading} 
          onClick={() => handleStatusUpdate("shipped", "Order dispatched with courier")}
          className="gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <Truck size={16} />
          Mark as Shipped
        </Button>
      )}

      {currentStatus === "shipped" && (
        <Button 
          disabled={loading} 
          onClick={() => handleStatusUpdate("delivered", "Order delivered to customer")}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <CheckCircle2 size={16} />
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
          className="gap-2 text-nss-danger hover:bg-nss-danger/10"
        >
          <XCircle size={16} />
          Cancel Order
        </Button>
      )}
      
      <Button variant="outline" className="gap-2">
        <ReceiptText size={16} />
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
