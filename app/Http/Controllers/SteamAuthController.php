<?php

namespace App\Http\Controllers;

use Invisnik\LaravelSteamAuth\SteamAuth;
use App\User;
use Illuminate\Contracts\Auth\Factory as AuthCont;

class SteamAuthController extends Controller
{
    /**
     * @var SteamAuth
     */
    private $steam;
    protected $auth;

    public function __construct(SteamAuth $steam, AuthCont $auth)
    {
        $this->auth = $auth;
        $this->steam = $steam;
    }

    public function logout()
    {
        $this->auth->logout();
        return redirect('/');
    }

    public function login()
    {
        if (!$this->steam->validate()) {
            return $this->steam->redirect(); // redirect to Steam login page
        }
            $info = $this->steam->getUserInfo();
            if (!is_null($info)) {
                $user = User::where('steamid', $info->steamID64)->first();
                    $user = User::updateOrCreate(
                        ['steamid'  => $info->steamID64],
                        [
                        'username' => $info->personaname,
                        'avatar'   => $info->avatarfull
                        ]);

                $this->auth->login($user, true);

                return redirect('/'); // redirect to site
            }
        }

    }
