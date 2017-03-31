<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Message;
use App\User;

class SendMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message, $user;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Message $message, User $user)
    {

        $this->message = (object)NULL;
        $this->message->body = $message->body;
        $this->message->created_at = $message->created_at->setTimezone('Europe/Moscow')->toTimeString();

        $this->user = $user;
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return ['mes-channel'];
    }
    public function broadcastAs()
    {
        return 'newMessage';
    }
}
