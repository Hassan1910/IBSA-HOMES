"use client";

import { useEffect, useRef } from "react";
import { markAgentSupportAsRead } from "@/app/actions/support";

export function AgentSupportReadTrigger() {
    const hasTriggered = useRef(false);

    useEffect(() => {
        if (!hasTriggered.current) {
            hasTriggered.current = true;
            markAgentSupportAsRead().catch(console.error);
        }
    }, []);

    return null;
}
