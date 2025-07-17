import { useMutation } from '@tanstack/react-query'
import { apiClient } from './apiClient'

export interface Factor {
    "10D": string,
    "1D": string,
    "20D": string,
    "5D": string,
}

export interface FactorData extends Factor {
    asset: string,
    factor: string,
    factor_abs: string,
    factor_quantile: string,
    signal: string,
    strategy_return: string
}
export interface ICByAsset {
    [asset: string]: Factor
}

export interface PerformanceMetrics {
    [key: string]: string
}

export interface FitnessDetail {
    "Component Scores": {
        "Consistency Score": string,
        "Efficiency Score": string,
        "Risk Management Score": string,
        "Risk-Return Score": string,
        "Stability Score": string
    },
    "Fitness Grade": string,
    "Overall Fitness Score": string,
    "Weights": {
        "Consistency Score": string,
        "Efficiency Score": string,
        "Risk Management Score": string,
        "Risk-Return Score": string,
        "Stability Score": string
    }
}
// Types
export interface SimulateAlphaResponse {
    // factor_data: FactorData[],
    factor_name: string,
    ic_by_asset: ICByAsset,
    ic_by_factor: Factor,
    long_short_returns: Factor
    performance_metrics: PerformanceMetrics
    quantile_returns: Factor[]
    chart_info: {
        s3_url: string
    }
    fitness_detail: FitnessDetail
    turnover_detail: Record<string, string>
    margin_detail: Record<string, string>
}


export const api = {
    // simulate alpha
    simulateAlpha: async (alpha: string): Promise<SimulateAlphaResponse> => {
        const response = await apiClient.post<SimulateAlphaResponse>(`/simulate-alpha`, { alpha })
        console.log(response.data)
        return response.data || null
    },
}

// Custom hooks
export function useSimulateAlpha() {
    return useMutation({
        mutationFn: (alpha: string) => api.simulateAlpha(alpha),
    })
}