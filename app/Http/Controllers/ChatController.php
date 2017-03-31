<?php

namespace App\Http\Controllers;


use App\Events\SendMessage;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Factory as AuthCont;
use App\Services\ChatService;
use App\Message;
use App\User;
use Carbon;
class  ChatController extends Controller
{
    protected $auth, $service, $message, $user;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(User $user,Message $message, AuthCont $auth, ChatService $service)
    {
        $this->user = $user;
        $this->message = $message;
        $this->service = $service;
        $this->auth = $auth;
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
            var_dump($message->created_at);
            $message->create_time = $message->created_at->setTimezone('Europe/Moscow')->toTimeString();
        }
        return view('chat')->withMessages($messages);
    }

    public function send(Request $request)
    {
        $this->validate($request, [
            'message' => 'required|min:3|max:255'
        ]);//пробовал добавить regex

        $user = $this->auth->user();

        $this->service->message($user, $request->input('message'));

    }
}
