@extends('layouts.app')

@section('view-styles')
    <link rel="stylesheet" href="css\chat.css">
    @endsection

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8">
            <div class="panel panel-default">
                <div class="panel-heading">Chat</div>

                <div class="panel-body">
                    <form>
                        {{ csrf_field() }}
                    <div class="form-group">
                    <div class="well chat-place" id="chat-div">
                        @if($messages)
                            @foreach($messages as $message)
                                <img src="{{ $message->user->avatar }}" class="user-img-chat">
                                <div class="msg-head-wrapper">
                                    <div class="nick-wrapper">
                                        <a target="_blank" href="http://steamcommunity.com/profiles/{{ $message->user->steamid }}">{{ $message->user->username }}</a>
                                        </div>
                                    <div class="time-wrapper">({{$message->create_time}})</div>
                                    </div>
                                <div class="msg-body-wrapper">{{ $message->body }}</div>
                            @endforeach
                        @endif
                    </div>
                    </div>
                        <div class="form-group">
                           <div class="col-md-10">
                               <label for="message" class="control-label">Message:</label>
                                <input id="message" type="text" class="form-control message-input" name="message" autocomplete="off">

                           </div>
                            <input type="submit" class="message-submit btn btn-primary col-md-2" value="Submit">
                        </div>
                    </form>
                    @if (count($errors) > 0)
                        <div class="alert alert-danger">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="panel panel-default">
            <div class="panel-heading">Users</div>

            <div class="panel-body">
                Visitors online: <span class="online-counter"></span>
            </div>

    </div>
</div>
@endsection

@section('view-scripts')
            <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js"></script>

            <script src="js/chat.js"></script>

    @endsection
