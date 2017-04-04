<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ChatService;
use Illuminate\Contracts\Auth\Guard as AuthCont;

class  MessagesController extends Controller
{

    protected $auth, $chat;

    public function __construct( AuthCont $auth, ChatService $chat)
    {

        $this->auth = $auth;
        $this->chat = $chat;
        $this->middleware('auth');
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'message' => 'required|min:3|max:255'
        ]);//пробовал добавить regex


        $this->chat->message($this->auth->user(), $request->input('message'));

    }

}