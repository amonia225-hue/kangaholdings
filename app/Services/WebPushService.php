<?php

namespace App\Services;

use App\Models\User;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class WebPushService
{
    public function configured(): bool
    {
        return (bool) config('webpush.vapid.public_key') && (bool) config('webpush.vapid.private_key');
    }

    /**
     * Send a push notification to every device registered by the user.
     * Silently prunes subscriptions the push service reports as gone.
     */
    public function sendToUser(User $user, string $title, string $body, string $url = '/compte'): void
    {
        if (! $this->configured()) {
            return;
        }

        $subscriptions = $user->pushSubscriptions()->get();
        if ($subscriptions->isEmpty()) {
            return;
        }

        $webPush = new WebPush([
            'VAPID' => [
                'subject' => config('webpush.vapid.subject'),
                'publicKey' => config('webpush.vapid.public_key'),
                'privateKey' => config('webpush.vapid.private_key'),
            ],
        ]);

        $payload = json_encode([
            'title' => $title,
            'body' => $body,
            'url' => $url,
        ]);

        foreach ($subscriptions as $sub) {
            $webPush->queueNotification(
                Subscription::create([
                    'endpoint' => $sub->endpoint,
                    'publicKey' => $sub->public_key,
                    'authToken' => $sub->auth_token,
                    'contentEncoding' => $sub->content_encoding ?: 'aesgcm',
                ]),
                $payload,
            );
        }

        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();
            if (! $report->isSuccess() && $report->isSubscriptionExpired()) {
                $user->pushSubscriptions()->where('endpoint', $endpoint)->delete();
            }
        }
    }
}
