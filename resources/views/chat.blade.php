@extends('layouts.app')

@section('view-styles')
    <link rel="stylesheet" href="css\chat.css">
    @endsection

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-9">
            <a target="_blank" href="https://steamcommunity.com/tradeoffer/new/?partner=389357914">
            <div class="btn btn-lg btn-success">
                 DEPOSIT
            </div>
            </a>
            <hr>
            <div class="dep-container">

            </div>

        </div>
        <div class="col-md-3 chat-wrapper">
            <div class="panel panel-default">
                <div class="panel-heading">Chat
                    <div class="pull-right">
                        <span class="online-counter"></span>
                        <i class="fa fa-user" aria-hidden="true"></i>
                    </div>
                </div>

                <div>
                    <form class="chat-from">
                        {{ csrf_field() }}
                        <div>
                            <div class="chat-place" id="chat-div">

                        @if($messages)
                            @foreach($messages as $message)
                                <div class="chat-msg">
                                <img src="{{ $message->user->avatar }}" class="user-img-chat">
                                <div class="msg-head-wrapper">
                                    <div class="nick-wrapper">
                                        <a target="_blank" href="{{ $message->user->link() }}">{{ $message->user->username }}</a>
                                        </div>
                                    <div class="time-wrapper">({{$message->created_at->toTimeString()}})</div>
                                    </div>
                                <div class="msg-body-wrapper">{{ $message->body }}</div>
                                </div>
                            @endforeach
                        @endif

                    </div>
                    </div>
                        <div>
                           <div>
                                <input id="message" type="text" class="form-control message-input" name="message" placeholder="Писать здесь" autocomplete="off">

                           </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</div>
</div>
@endsection

@section('view-scripts')
            <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js"></script>
            <script src="js/notify.min.js"></script>
            <script src="js/chat.js"></script>

    @endsection
