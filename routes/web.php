<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/


Route::get('/', function () {
    return view('welcome');
});

Route::group(['prefix' => 'ws'], function(){
    Route::get('check-auth', function(){
        return response()->json([
            'auth' => \Auth::check()
        ]);
    });
});


Route::get('/chat', 'ChatController@index');
Route::post('chat/sendMessage', 'MessagesController@create');
Route::get('/login', 'SteamAuthController@login')->name('login');
Route::get('/logout', 'SteamAuthController@logout');