// Web Push (VAPID) client helpers for the Kanga PWA.

export function pushSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export function permission(): NotificationPermission | 'unsupported' {
    if (!pushSupported()) return 'unsupported';
    return Notification.permission;
}

function urlBase64ToUint8Array(base64: string): BufferSource {
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(b64);
    const buffer = new ArrayBuffer(raw.length);
    const out = new Uint8Array(buffer);
    for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
}

function xsrfToken(): string {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
}

async function post(url: string, body: unknown): Promise<Response> {
    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': xsrfToken(),
        },
        body: JSON.stringify(body),
    });
}

export async function isSubscribed(): Promise<boolean> {
    if (!pushSupported()) return false;
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return false;
    return !!(await reg.pushManager.getSubscription());
}

/** Ask permission, subscribe, and register the subscription server-side. */
export async function subscribe(vapidPublicKey: string): Promise<'ok' | 'denied' | 'unsupported' | 'error'> {
    if (!pushSupported() || !vapidPublicKey) return 'unsupported';

    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return 'denied';

    try {
        const reg = await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
            sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });
        }
        const json = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
        const res = await post('/push/subscribe', {
            endpoint: json.endpoint,
            keys: json.keys,
            contentEncoding: (PushManager as unknown as { supportedContentEncodings?: string[] }).supportedContentEncodings?.[0] ?? 'aesgcm',
        });
        return res.ok ? 'ok' : 'error';
    } catch (e) {
        return 'error';
    }
}

export async function unsubscribe(): Promise<void> {
    if (!pushSupported()) return;
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg && (await reg.pushManager.getSubscription());
    if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe().catch(() => {});
        await post('/push/unsubscribe', { endpoint }).catch(() => {});
    }
}
