import { REST_BASE } from "@/config/api.config";

export async function fetchFlowersREST() {
    const url = `${REST_BASE}/bouquet/premade/latest`;

    const response = await fetch(url, {
        headers: { Accept: "application/json" }
    })
    
    if (!response.ok) {
        throw new Error(`REST failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}