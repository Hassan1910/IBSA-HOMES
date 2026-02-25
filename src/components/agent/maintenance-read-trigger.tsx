"use client";

import { useEffect, useRef } from "react";
import { markAgentMaintenanceAsRead } from "@/actions/maintenance";

export function AgentMaintenanceReadTrigger({ propertyIds }: { propertyIds: string[] }) {
    const hasTriggered = useRef(false);

    useEffect(() => {
        if (!hasTriggered.current && propertyIds.length > 0) {
            hasTriggered.current = true;
            markAgentMaintenanceAsRead(propertyIds).catch(console.error);
        }
    }, [propertyIds]);

    return null;
}
