"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
    id: number
    Title: string
    Description: string
    read: boolean
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, Title: "Titulo 1", Description: "New message from John", read: false },
        { id: 2, Title: "Titulo 2", Description: "Your order has been shipped", read: false },
        { id: 3, Title: "Titulo 3", Description: "Payment received,Payment received,Payment received", read: true },
        { id: 4, Title: "Titulo 4", Description: "New message from John", read: false },
        { id: 5, Title: "Titulo 5", Description: "Your order has been shipped", read: false },
        { id: 6, Title: "Titulo 6", Description: "Payment received,Payment received,Payment received", read: true },
    ])

    const unreadCount = notifications.filter((n) => !n.read).length

    const markAsRead = (id: number) => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-8 w-8" color="blue" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 mt-1 mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <h3 className="mb-2 text-lg font-semibold">Notificaciones</h3>
                <ScrollArea className="h-[300px]">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`mb-2 p-2 rounded cursor-pointer ${notification.read ? "bg-gray-100  hover:bg-gray-200" : "bg-blue-100 hover:bg-blue-200"}`}
                                onClick={() => markAsRead(notification.id)}
                                title={notification.Description}
                            >
                                <p className="text-sm font-semibold">{notification.Title}</p>
                                <div className="text-xs w-full truncate">{notification.Description}</div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 truncate">Sin Notificaciones</p>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}

