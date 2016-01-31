var socket = io(),
    config,
    game = {};

$(document).ready
(
    function ()
    {
        $.getJSON('config.json', function(data) {
            config = data;

            socket.on('user connected', function(playerNum, gameSent) {
                var player,
                    playerIndex,
                    healthList = '';

                if (!game.ended) {
                    if (game.id) {
                        if (playerNum) {
                            playerIndex = playerNum - 1;
                            player = gameSent.players[playerIndex];

                            game.players[playerIndex] = player;
                        }
                    } else {
                        game = {
                            id              : gameSent.id,
                            players         : gameSent.players,
                            clientPlayerNum : playerNum,
                            ended           : false
                        };

                        $('#gameId').text(game.id);

                        if (playerNum) {
                            $('#playerNum').text(playerNum);
                        }
                    }

                    for (playerIndex = 0; playerIndex < game.players.length; playerIndex++) {
                        player = game.players[playerIndex];
                        playerNum = (playerIndex + 1);

                        if (player) {
                            healthList += '<li>Player #' + playerNum + ': ' +
                                '<span id="health' + playerNum + '">'+ player.health + '</span>' +
                                ' / ' + config.maxHealth + '</li>';
                        }
                    }

                    $('#health').html(healthList);
                }
            });

            socket.on('user disconnected', function(playerNum) {
                var playerIndex;

                if (!game.ended && playerNum) {
                    if (game.players[0] && game.players[1]) {
                        game.ended = true;
                        $('#ended').text('Player #' + playerNum + ' has forfeited!');
                    }

                    playerIndex = playerNum - 1;
                    delete game.players[playerIndex];
                }
            });

            socket.on('active connections', function(activeConnections) {
                $('#activeConnections').text(activeConnections);
            });

            socket.on('turn', function(turn) {
                if (!game.ended && game.clientPlayerNum) {
                    console.log('Received attack: ' + JSON.stringify(turn[game.clientPlayerNum - 1]));
                }
            });

            socket.on('player health changed', function(playerNum, health) {
                var player;

                if (playerNum) {
                    player = game.players[playerNum - 1];
                    player.health = health;

                    $('#health' + playerNum).text(health);
                }
            });

            socket.on('end', function(losingPlayerNum, turns) {
                game.ended = true;
                $('#ended').text('Player #' + losingPlayerNum + ' has been defeated!');
                console.log('Turns: ' + JSON.stringify(turns));
            });

            if (!game.ended) {
                $(document).keydown(function(e) {
                    switch(e.which) {
                        case 81:
                            // Set Bullet Up-Left (Q)
                            break;

                        case 87:
                            // Set Bullet Up (W)
                            break;

                        case 69:
                            // Set Bullet Up-Right (E)
                            break;

                        case 65:
                            // Set Bullet Left (A)
                            break;

                        case 68:
                            // Set Bullet Right (D)
                            break;

                        case 90:
                            // Set Bullet Down-Left (Z)
                            break;

                        case 88:
                            // Set Bullet Down (X)
                            break;

                        case 67:
                            // Set Bullet Down-Right (C)
                            break;

                        case 13:
                            // Take One Damage (Enter: Debug Purposes)
                            socket.emit('player hit', 0, 0, 100, 100);
                            break;

                        case 32:
                            // Send Attack (Space: Debug Purposes)
                            socket.emit(
                                'player attack',
                                [
                                    // Wave One
                                    [
                                        // Bullet 1-1
                                        {
                                            angle : 0,
                                            x     : game.clientPlayerNum,
                                            y     : game.clientPlayerNum
                                        },

                                        // Bullet 1-2
                                        {
                                            angle : 90,
                                            x     : game.clientPlayerNum,
                                            y     : game.clientPlayerNum
                                        }
                                    ],

                                    // Wave Two
                                    [
                                        // Bullet 2-1
                                        {
                                            angle : 180,
                                            x     : game.clientPlayerNum,
                                            y     : game.clientPlayerNum
                                        },

                                        // Bullet 2-2
                                        {
                                            angle : 270,
                                            x     : game.clientPlayerNum,
                                            y     : game.clientPlayerNum
                                        }
                                    ]
                                ]
                            );
                            break;

                        default:
                            return;
                    }

                    e.preventDefault();
                });
            }
        });
    }
);
