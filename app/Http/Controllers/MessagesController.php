<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ChatService;
use Illuminate\Contracts\Auth\Factory as AuthCont;

class  MessagesController extends Controller
{
    public function __construct( AuthCont $auth, ChatService $service)
    {
        $this->auth = $auth;
        $this->service = $service;
        $this->middleware('auth');
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'message' => 'required|min:3|max:255'
        ]);//пробовал добавить regex

        $user = $this->auth->user();

        $this->service->message($user, $request->input('message'));

    }

}