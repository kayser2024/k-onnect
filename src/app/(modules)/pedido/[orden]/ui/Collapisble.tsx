'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronsUpDown } from 'lucide-react'
import React, { useState } from 'react'
import { TimeLine } from '../TimeLine'



interface CollapsibleProps {
    orden: string
    created_at: string
}
export const Collapisble = ({ orden, created_at }: CollapsibleProps) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Card>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}
            >
                <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                        <span>Historial</span>
                        <CollapsibleTrigger asChild className='bg-slate-100 hover:bg-slate-300' title='Desplegar'>
                            <Button variant="ghost" size="sm" className="w-9 p-0 rounded-full">
                                <ChevronsUpDown className="h-4 w-4" />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </CardTitle>
                </CardHeader>

                <CollapsibleContent>
                    <CardContent className="flex-1">
                        <TimeLine order={orden} created_at={created_at} />
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}
