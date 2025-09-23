<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('my-domains'))->assertRedirect(route('login'));
});

test('authenticated users can visit the my-domains', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('my-domains'))->assertOk();
});
