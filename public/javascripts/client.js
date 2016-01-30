var socket = io(),
    config,
    game;

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

                if (game) {
                    if (playerNum) {
                        playerIndex = playerNum - 1;
                        player = gameSent.players[playerIndex];

                        game.players[playerIndex] = player;
                    }
                } else {
                    game = {
                        players         : gameSent.players,
                        clientPlayerNum : playerNum
                    };

                    if (playerNum) {
                        $('#playerNum').text(playerNum);
                    }
                }

                for (playerIndex = 0; playerIndex < game.players.length; playerIndex++) {
                    player = game.players[playerIndex];
                    playerNum = (playerIndex + 1);

                    if (player) {
                        healthList += '<li>Player #' + playerNum + ': ' +
                            '<span id="health' + playerNum + '">'+ player.health + '</span></li>';
                    }
                }

                $('#health').html(healthList);
            });

            socket.on('user disconnected', function(playerNum) {
                var playerIndex;

                if (playerNum) {
                    playerIndex = playerNum - 1;
                    delete game.players[playerIndex];
                }
            });

            socket.on('active connections', function(activeConnections) {
                $('#activeConnections').text(activeConnections);
            });

            socket.on('player health changed', function(playerNum, health) {
                var player;

                if (playerNum) {
                    player = game.players[playerNum - 1];
                    player.health = health;

                    $('#health' + playerNum).text(health);
                }
            });

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
                        socket.emit('player take damage', 1);
                        break;

                    default:
                        return;
                }

                e.preventDefault();
            });
        });
    }
);
