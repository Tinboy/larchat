<?php

namespace App\Services;

use App\Events\SendMessage;
use App\User;

class ChatService
{

    public function message(User $user, $input_message)
    {
        $message = $user->messages()->create(['body'=>strip_tags($input_message)]);
        //strip_tags пришлось заюзать

        event(new SendMessage($message, $user));
    }

}