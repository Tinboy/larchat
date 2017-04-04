<?php

namespace App\Http\Controllers;

use App\Message;

class  ChatController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $messages = Message::latest()->take(5)->get()->reverse();
        return view('chat')->withMessages($messages);
    }


}
