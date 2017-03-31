<?php

namespace App\Http\Controllers;


use App\Message;
use App\User;


class  ChatController extends Controller
{
    protected $auth, $service, $message, $user;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(User $user,Message $message)
    {
        $this->user = $user;
        $this->message = $message;
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $messages = $this->message->orderBy('id', 'desc')->get();

        if(count($messages) < 5 ){
            return view('chat');
        }

        $messages = $messages->take(5)->reverse();
        foreach ($messages as $message)
        {
            $message->create_time = $message->created_at->setTimezone('Europe/Moscow')->toTimeString();
        }
        return view('chat')->withMessages($messages);
    }


}
