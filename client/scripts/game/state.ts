/// <reference path="../../../typings/tsd.d.ts" />
'use strict';

namespace Game {
    export class State extends Phaser.State {
        config: { port: number, maxHealth: number, maxBananas: number};
        id: number;
        players;
        clientPlayerNum: number;
        player: Player;
        pointer: Phaser.Pointer;
        waves: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }[][] = [[]];
        attacking: boolean;
        banana: number;
        io: SocketIOClientStatic;
        socket: SocketIOClient.Socket;
        music: Phaser.Sound;
        gameIdText: Phaser.Text;
        playerNumText: Phaser.Text;
        activeConnectionsText: Phaser.Text;
        gameStatusText : Phaser.Text;
        player1HealthText: Phaser.Text;
        player2HealthText: Phaser.Text;
        attackGraphics = [];
        timeout;

        create() {
            var self = this;
            self.fontStyle = { font: "25px Arial", fill: "#ffff00", align: "center" };

            this.sound = this.sound.play('background-music', 100, true);

            var background = this.add.image(0, 0, 'sprites', 'Aztec Temple/Aztec-Temple');
            background.height = this.game.height;
            background.width = this.game.width;

            var palm1 = this.add.image(100 ,100, 'sprites', 'Tree/palmTopView2');
            palm1.anchor.setTo(0.5);
            var palm2 = this.add.image(this.game.width -100 , this.game.height - 100, 'sprites', 'Tree/palmTopView2');
            palm2.anchor.setTo(0.5);
            var palm3 = this.add.image(this.game.width -100 , 100, 'sprites', 'Tree/palmTopView2');
            palm3.anchor.setTo(0.5);
            var palm4 = this.add.image(100 ,this.game.height - 100, 'sprites', 'Tree/palmTopView2');
            palm4.anchor.setTo(0.5);


            this.config = this.cache.getJSON('config');

            this.player = this.add.existing(new Player(this));
            this.pointer = this.game.input.activePointer;

            this.game.input.onDown.add(function() {
                if (this.attacking) {
                    this.attack();
                }
            }, this);

            this.socket = io.connect();

            this.socket.on('user connected', function(playerNum, gameSent) {
                var player,
                    playerIndex,
                    text;

                if (self.id) {
                    if (playerNum) {
                        playerIndex = playerNum - 1;
                        player = gameSent.players[playerIndex];

                        self.players[playerIndex] = player;
                    }
                } else {
                    self.id = gameSent.id;
                    self.players = gameSent.players;
                    self.clientPlayerNum = playerNum;
                }

                if (self.gameIdText) {
                    self.gameIdText.kill();
                }

                self.gameIdText = self.add.text(0, 0, 'Game ID: ' + self.id, self.fontStyle);

                if (playerNum) {
                    if (self.playerNumText) {
                        self.playerNumText.kill();
                    }
                    
                    self.playerNumText = self.add.text(0, 25, 'Player #' + playerNum, self.fontStyle);
                }

                if (self.players[0]) {
                    text = 'Player 1 Health: ' + self.players[0].health + ' / ' + self.config.maxHealth;
                } else {
                    text = 'Waiting for Player 1...';
                }

                if (self.player1HealthText) {
                    self.player1HealthText.kill();
                }

                self.player1HealthText = self.add.text(
                    0,
                    self.game.height - 40,
                    text,
                    self.fontStyle
                );

                if (self.players[1]) {
                    text = 'Player 2 Health: ' + self.players[1].health + ' / ' + self.config.maxHealth;
                } else {
                    text = 'Waiting for Player 2...';
                }

                if (self.player2HealthText) {
                    self.player2HealthText.kill();
                }

                self.player2HealthText = self.add.text(
                    self.game.width - 310,
                    self.game.height - 40,
                    text,
                    self.fontStyle
                );

                if (self.players[0] && self.players[1]) {
                    self.attackStart();
                }
            });

            this.socket.on('user disconnected', function(playerNum) {
                var playerIndex;

                if (playerNum) {
                    if (self.players[0] && self.players[1]) {
                        self.game.state.states.End.message = 'Player #' + playerNum + ' has forfeited!';
                        self.game.state.states.End.turns = null;

                        self.end();
                    }

                    playerIndex = playerNum - 1;
                    delete self.players[playerIndex];
                }
            });

            this.socket.on('active connections', function(activeConnections) {
                if (self.activeConnectionsText) {
                    self.activeConnectionsText.kill();
                }

                self.activeConnectionsText = self.add.text(
                    0, 50, 'Active Connections: ' + activeConnections.toString(), self.fontStyle
                );
            });

            this.socket.on('turn', function(turn) {
                var waves;

                if (self.clientPlayerNum) {
                    waves = turn[self.clientPlayerNum - 1];
                    self.defend(waves);
                }
            });

            this.socket.on('player health changed', function(playerNum, health) {
                var player,
                    x;

                if (playerNum) {
                    player = self.players[playerNum - 1];
                    player.health = health;

                    if (playerNum === 1) {
                        if (self.player1HealthText) {
                            self.player1HealthText.kill();
                        }

                        self.player1HealthText = self.add.text(
                            0,
                            self.game.height - 40,
                            'Player ' + playerNum + ' Health: ' + player.health + ' / ' + self.config.maxHealth,
                            self.fontStyle
                        );
                    } else {
                        if (self.player2HealthText) {
                            self.player2HealthText.kill();
                        }

                        self.player2HealthText = self.add.text(
                            self.game.width - 310,
                            self.game.height - 40,
                            'Player ' + playerNum + ' Health: ' + player.health + ' / ' + self.config.maxHealth,
                            self.fontStyle
                        );
                    }
                }
            });

            this.socket.on('end', function(losingPlayerNum, turns) {
                self.game.state.states.End.message = 'Player #' + losingPlayerNum + ' has been defeated!';
                self.game.state.states.End.turns = turns;

                self.end();
            });
        }

        attack() {
            var angle: { degrees: number, degreesCounterClockwise: number, radians: number },
                destinationX: number,
                destinationY: number,
                graphics: Phaser.Graphics;

            if (this.banana < this.config.maxBananas) {
                angle = this.getAngle(this.player.x, this.player.y, this.pointer.x, this.pointer.y);

                this.waves[0].push({
                    player_x: this.player.x,
                    player_y: this.player.y,
                    pointer_x: this.pointer.x,
                    pointer_y: this.pointer.y
                });

                this.banana++;

                graphics = this.add.graphics(100, 100);
                graphics.beginFill(0xFF3300);
                graphics.lineStyle(5, 0xffd900, 1);

                destinationX = this.player.x + (50 * Math.cos(angle.radians)) - 100;
                destinationY = this.player.y + (50 * Math.sin(angle.radians)) - 100;

                graphics.moveTo(this.player.x - 100, this.player.y - 100);

                this.attackGraphics.push(
                    graphics.lineTo(destinationX, destinationY)
                );

                graphics.moveTo(destinationX, destinationY);

                this.attackGraphics.push(
                    graphics.lineTo(
                        this.player.x + (10 * Math.cos(angle.radians + 45)) - 100,
                        this.player.y + (10 * Math.sin(angle.radians + 45)) - 100
                    )
                );

                graphics.moveTo(destinationX, destinationY);

                this.attackGraphics.push(
                    graphics.lineTo(
                        this.player.x + (10 * Math.cos(angle.radians - 45)) - 100,
                        this.player.y + (10 * Math.sin(angle.radians - 45)) - 100
                    )
                );

                graphics.moveTo(this.player.x - 100, this.player.y - 100);

                this.attackGraphics.push(
                    graphics.lineTo(
                        this.player.x + (50 * Math.cos(angle.radians + Math.PI)) - 100,
                        this.player.y + (50 * Math.sin(angle.radians + Math.PI)) - 100
                    )
                );

                this.attackGraphics.push(
                    this.add.text(this.player.x - 10, this.player.y, this.banana.toString(), {})
                );
            }
        }

        attackStart() {
            var self = this;
            self.fontStyle = { font: "25px Arial", fill: "#ffff00", align: "center" };


            if (this.gameStatusText) {
                this.gameStatusText.kill();
            }

            this.gameStatusText = this.add.text(this.game.width - 690, this.game.height - 40, 'Attack!', self.fontStyle);
            this.attacking = true;
            this.banana = 0;

            this.timeout = setTimeout(function() {
                self.attacking = false;
                self.socket.emit('player attack', self.waves);
                self.waves = [[]];
            }, 10000);
        }

        defend(waves: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }[][]) {
            if (this.gameStatusText) {
                this.gameStatusText.kill();
            }

            this.gameStatusText = this.add.text(this.game.width - 690, this.game.height - 40, 'Defend!', { font: "25px Arial", fill: "#ffff00", align: "center" });

            var self = this,
                wave: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }[],
                banana: { player_x: number, player_y: number, pointer_x: number, pointer_y: number },
                attackGraphic,
                w: number,
                b: number,
                ag;

            for (ag = 0; ag < self.attackGraphics.length; ag++) {
                attackGraphic = self.attackGraphics[ag];
                attackGraphic.kill();
            }

            self.attackGraphics = [];

            for (w = 0; w < waves.length; w++) {
                wave = waves[w];

                for (b = 0; b < wave.length; b++) {
                    banana = wave[b];
                    this.addMinion(banana, w, b);
                }
            }

            this.timeout = setTimeout(function() {
                self.attackStart();
            }, 5000);
        }

        end() {
            this.gameIdText.kill();
            this.playerNumText.kill();

            this.socket.close();

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.sound.pause();

            this.game.state.start('End');
        }

        getAngle(x1: number, y1: number, x2: number, y2: number) {
            var playerPoint: Phaser.Point = new Phaser.Point(x1, y1),
                mousePoint: Phaser.Point = new Phaser.Point(x2, y2),
                angleDegrees: number = playerPoint.angle(mousePoint, true),
                angleRadians: number = playerPoint.angle(mousePoint),
                angleDegreesCounterClockwise: number;

            if (angleDegrees >= 0) {
                angleDegreesCounterClockwise = 360 - angleDegrees;
            } else {
                angleDegreesCounterClockwise = -angleDegrees;
            }

            return {
                degrees: angleDegrees,
                degreesCounterClockwise: angleDegreesCounterClockwise,
                radians: angleRadians
            };
        }

        addMinion(
            banana: { player_x: number, player_y: number, pointer_x: number, pointer_y: number },
            waveIndex: number,
            bananaIndex: number
        ) {
            var angle: { degrees: number, degreesCounterClockwise: number, radians: number },
                x: number,
                y: number;

            angle = this.getAngle(banana.player_x, banana.player_y, banana.pointer_x, banana.pointer_y);

            if (angle.degreesCounterClockwise >= 45 && angle.degreesCounterClockwise < 135) {
                x = this.player.x +
                    (((this.player.x * 2) * Math.cos(angle.radians)) / (2 * Math.sin(angle.radians)));
                y = this.game.height - 40;
            }

            if (angle.degreesCounterClockwise >= 135 && angle.degreesCounterClockwise < 225) {
                x = this.game.width - 40;
                y = this.player.y +
                    (((this.player.y * 2) * Math.sin(angle.radians)) / (2 * Math.cos(angle.radians)));
            }

            if (angle.degreesCounterClockwise >= 225 && angle.degreesCounterClockwise < 315) {
                x = (this.game.width - this.player.x) +
                    (((this.player.x * 2) * Math.cos(angle.radians)) / (2 * Math.sin(angle.radians)));
                y = 0;
                x = this.game.width - x;
            }

            if (angle.degreesCounterClockwise >= 315 || angle.degreesCounterClockwise < 45) {
                x = 0;
                y = (this.game.height - this.player.y) +
                    (((this.player.y * 2) * Math.sin(angle.radians)) / (2 * Math.cos(angle.radians)));
                y = this.game.height - y;
            }

            if (x > this.game.width - 40) {
                x = this.game.width - 40;
            }

            if (y > this.game.height - 40) {
                y = this.game.height - 40;
            }

            this.add.existing(
                new Generic.Minion(this, waveIndex, bananaIndex, x, y, banana.player_x, banana.player_y)
            );
        }
    }

    export class Player extends Generic.Cursor {
        constructor(state: State) {
            super(state);
        }
    }
}
