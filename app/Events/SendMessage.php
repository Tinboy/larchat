<?php

namespace App\Events;


use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Message;
use App\User;

class SendMessage implements ShouldBroadcast
{
    use SerializesModels;

    public $message, $user;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Message $message, User $user)
    {

        $this->message = (object)[];
        $this->message->body = $message->body;
        $this->message->created_at = $message->created_at->toTimeString();
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
