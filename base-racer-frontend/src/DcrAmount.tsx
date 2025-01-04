import { useMemo } from 'react'

export const formatNumber = (value: string | number, digits = 2) => {
    if (!value) return value
    try {
        const number = Number(value)
        if (isNaN(number)) return '-'
        return Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: digits,
        }).format(number)
    } catch {
        return '-'
    }
}

export default ({ dcr, style = {}, precise = undefined as undefined | number }) => {
    const formatted = useMemo(() => formatNumber(dcr, precise), [dcr, precise])

    return <span style={style}>{formatted} DCR</span>
}
