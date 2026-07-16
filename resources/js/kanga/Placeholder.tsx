import type { CSSProperties } from 'react';

type Props = {
    src?: string | null;
    alt?: string;
    label?: string;
    style?: CSSProperties;
    className?: string;
};

/**
 * Image slot: renders the real image when available, otherwise an elegant
 * branded placeholder (mirrors the mockup's <image-slot> behaviour).
 */
export default function Placeholder({ src, alt = '', label = 'Photo', style, className }: Props) {
    if (src) {
        return (
            <img
                src={src.startsWith('http') || src.startsWith('/') ? src : `/storage/${src}`}
                alt={alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }}
                className={className}
            />
        );
    }

    return (
        <div className={`kh-slot ${className ?? ''}`} style={style}>
            <span>{label}</span>
        </div>
    );
}
