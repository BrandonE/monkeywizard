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
        waves: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }[][];
        attacking: boolean;
        attackTimer: number;
        bananaCount: number;
        io: SocketIOClientStatic;
        socket: SocketIOClient.Socket;
        theme: Phaser.Sound;
        gameIdText: Phaser.Text;
        activeConnectionsText: Phaser.Text;
        gameStatusText : Phaser.Text;
        yourHealthText: Phaser.Text;
        opponentHealthText: Phaser.Text;
        waitingForOpponentText: Phaser.Text;
        bananaCounter: Phaser.Text;
        background: Phaser.Image;
        palm1: Phaser.Image;
        palm2: Phaser.Image;
        palm3: Phaser.Image;
        palm4: Phaser.Image;
        minions: Phaser.Sprite[];
        bananas: Phaser.Sprite[];
        attackLabels: Phaser.Text[];
        attackGraphics: PIXI.Graphics[];
        timeout;

        create() {
            var self = this;

            if (!this.theme) {
                this.theme = this.sound.play('theme-full', 0.5);

                this.theme.onStop.addOnce(function() {
                    this.theme = this.sound.play('theme-loop', 0.5, true);
                }, this);
            }

            this.background = this.add.image(0, 0, 'sprites', 'Aztec Temple/Aztec-Temple');
            this.background.height = this.game.height;
            this.background.width = this.game.width;

            this.palm1 = this.add.image(110, 100, 'sprites', 'Tree/palmTopView2');
            this.palm1.anchor.setTo(0.5);

            this.palm2 = this.add.image(this.game.width - 100, this.game.height - 100, 'sprites', 'Tree/palmTopView2');
            this.palm2.anchor.setTo(0.5);

            this.palm3 = this.add.image(this.game.width - 100, 100, 'sprites', 'Tree/palmTopView2');
            this.palm3.anchor.setTo(0.5);

            this.palm4 = this.add.image(110, this.game.height - 100, 'sprites', 'Tree/palmTopView2');
            this.palm4.anchor.setTo(0.5);


            this.config = this.cache.getJSON('config');

            this.player = this.add.existing(new Player(this));
            this.pointer = this.game.input.activePointer;

            this.game.input.onDown.add(function() {
                if (this.attacking) {
                    this.attack();
                }
            }, this);

            this.waves = [[]];
            this.attackGraphics = [];
            this.attackLabels = [];
            this.minions = [];
            this.bananas = [];

            this.socket = io.connect();

            this.socket.on('user connected', function(playerNum, gameSent) {
                var player,
                    playerIndex,
                    minion,
                    banana,
                    m,
                    b;

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

                    if (self.gameIdText) {
                        self.gameIdText.kill();
                    }

                    self.gameIdText = self.add.text(10, 0, 'Game ID: ' + self.id, Generic.Fonts.fontStyle);
                }

                if (self.players[0] && self.players[1]) {
                    if (self.timeout) {
                        clearTimeout(self.timeout);
                    }

                    if (self.waitingForOpponentText) {
                        self.waitingForOpponentText.kill();
                    }

                    for (m = 0; m < self.minions.length; m++) {
                        minion = self.minions[m];

                        if (minion) {
                            minion.kill();
                            minion.killed = true;
                        }
                    }

                    for (b = 0; b < self.bananas.length; b++) {
                        banana = self.bananas[b];

                        if (banana) {
                            banana.kill();
                            banana.killed = true;
                        }
                    }

                    self.showHealth();
                    self.attackStart();
                } else {
                    if (self.waitingForOpponentText) {
                        self.waitingForOpponentText.kill();
                    }

                    self.waitingForOpponentText = self.add.text(
                        (self.game.width / 2) - 130,
                        self.game.height / 2,
                        'Waiting for Opponent...',
                        Generic.Fonts.fontStyle
                    );

                    self.dodgeRandom();
                }
            });

            this.socket.on('user disconnected', function(playerNum) {
                var winningPlayerNum,
                    playerIndex;

                if (playerNum) {
                    if (self.players[0] && self.players[1]) {
                        winningPlayerNum = (playerNum === 1) ? 2 : 1;

                        self.game.state.states.End.clientPlayerNum = self.clientPlayerNum;
                        self.game.state.states.End.winningPlayerNum = winningPlayerNum;
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
                    10, 25, 'Active Connections: ' + activeConnections.toString(), Generic.Fonts.fontStyle
                );
            });

            this.socket.on('turn', function(turn) {
                var waves;

                if (self.clientPlayerNum) {
                    waves = turn[self.clientPlayerNum - 1];

                    if (self.gameStatusText) {
                        self.gameStatusText.kill();
                    }

                    self.gameStatusText = self.add.text(
                        self.game.width - 690,
                        self.game.height - 40,
                        'Dodge!',
                        Generic.Fonts.fontStyle
                    );

                    self.dodge(waves);

                    self.timeout = setTimeout(function() {
                        self.attackStart();
                    }, 5000);
                }
            });

            this.socket.on('player health changed', function(playerNum, health) {
                var player;

                if (playerNum) {
                    player = self.players[playerNum - 1];
                    player.health = health;

                    self.showHealth();
                }
            });

            this.socket.on('end', function(losingPlayerNum, turns) {
                var winningPlayerNum = (losingPlayerNum === 1) ? 2 : 1;

                self.game.state.states.End.clientPlayerNum = self.clientPlayerNum;
                self.game.state.states.End.winningPlayerNum = winningPlayerNum;
                self.game.state.states.End.turns = turns;

                self.end();
            });
        }

        attack() {
            var angle: { degrees: number, degreesCounterClockwise: number, radians: number },
                destinationX: number,
                destinationY: number,
                graphics: Phaser.Graphics;

            if (this.bananaCount < this.config.maxBananas) {
                angle = this.getAngle(this.player.x, this.player.y, this.pointer.x, this.pointer.y);

                this.waves[0].push({
                    player_x: this.player.x,
                    player_y: this.player.y,
                    pointer_x: this.pointer.x,
                    pointer_y: this.pointer.y
                });

                this.bananaCount++;
                this.showBananaCounter();

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

                this.attackLabels.push(
                    this.add.text(this.player.x - 10, this.player.y, this.bananaCount.toString(), {})
                );
            }
        }

        attackStart() {
            this.attacking = true;
            this.bananaCount = 0;
            this.showBananaCounter();

            this.attackTimer = 11;
            this.attackTimeout();
        }

        dodge(waves: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }[][]) {
            var wave: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }[],
                banana: { player_x: number, player_y: number, pointer_x: number, pointer_y: number },
                attackLabel,
                attackGraphic,
                w: number,
                b: number,
                al,
                ag;

            for (al = 0; al < this.attackLabels.length; al++) {
                attackLabel = this.attackLabels[al];
                attackLabel.kill();
            }

            for (ag = 0; ag < this.attackGraphics.length; ag++) {
                attackGraphic = this.attackGraphics[ag];
                attackGraphic.kill();
            }

            this.attackLabels = [];
            this.attackGraphics = [];

            for (w = 0; w < waves.length; w++) {
                wave = waves[w];

                for (b = 0; b < wave.length; b++) {
                    banana = wave[b];
                    this.addMinion(banana, w, b);
                }
            }
        }

        dodgeRandom() {
            var self = this,
                waves: { player_x: number, player_y: number, pointer_x: number, pointer_y: number }[][] = [[]],
                xMaxima: number = this.game.width - 280,
                yMaxima: number = this.game.height - 185,
                banana: { player_x: number, player_y: number, pointer_x: number, pointer_y: number },
                b: number;

            for (b = 0; b < this.config.maxBananas; b++) {
                banana = {
                    player_x  : (Math.random() * xMaxima) + 280,
                    player_y  : (Math.random() * yMaxima) + 125,
                    pointer_x : (Math.random() * xMaxima) + 280,
                    pointer_y : (Math.random() * yMaxima) + 125
                };

                waves[0].push(banana);
            }

            this.dodge(waves);

            this.timeout = setTimeout(function() {
                self.dodgeRandom();
            }, 5000);
        }

        end() {
            var minion,
                banana,
                m,
                b;

            this.id = null;
            this.players = [null, null];
            this.clientPlayerNum = null;
            this.attacking = false;

            this.background.kill();
            this.palm1.kill();
            this.palm2.kill();
            this.palm3.kill();
            this.palm4.kill();
            this.gameIdText.kill();
            this.waitingForOpponentText.kill();

            for (m = 0; m < this.minions.length; m++) {
                minion = this.minions[m];

                if (minion) {
                    minion.kill();
                    minion.killed = true;
                }
            }

            for (b = 0; b < this.bananas.length; b++) {
                banana = this.bananas[b];

                if (banana) {
                    banana.kill();
                    banana.killed = true;
                }
            }

            this.socket.close();

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.game.state.start('End');
        }

        attackTimeout() {
            var self = this;

            this.attackTimer--;

            if (this.attackTimer >= 0) {
                if (this.gameStatusText) {
                    this.gameStatusText.kill();
                }

                this.gameStatusText = this.add.text(
                    self.game.width - 690, self.game.height - 40, 'Attack! ' + self.attackTimer, Generic.Fonts.fontStyle
                );

                this.timeout = setTimeout(function() {
                    self.attackTimeout();
                }, 1000);
            } else {
                this.attacking = false;
                this.socket.emit('player attack', this.waves);
                this.waves = [[]];
            }
        }

        showBananaCounter() {
            if (this.bananaCounter) {
                this.bananaCounter.kill();
            }

            this.bananaCounter = this.add.text(
                this.game.width - 290,
                0,
                'Banana Count: ' + (this.config.maxBananas - this.bananaCount) + ' / ' + this.config.maxBananas,
                Generic.Fonts.fontStyle
            );
        }

        showHealth() {
            var health;

            if (this.yourHealthText) {
                this.yourHealthText.kill();
            }

            this.yourHealthText = this.add.text(
                10,
                this.game.height - 40,
                'Your Health: ' + this.players[this.clientPlayerNum - 1].health + ' / ' + this.config.maxHealth,
                Generic.Fonts.fontStyle
            );

            if (this.opponentHealthText) {
                this.opponentHealthText.kill();
            }

            health = (this.clientPlayerNum === 1) ? this.players[1].health : this.players[0].health;

            this.opponentHealthText = this.add.text(
                this.game.width - 310,
                this.game.height - 40,
                'Opponent\'s Health: ' + health + ' / ' + this.config.maxHealth,
                Generic.Fonts.fontStyle
            );
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
                x = 60;
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

            this.minions.push(
                this.add.existing(
                    new Generic.Minion(this, waveIndex, bananaIndex, x, y, banana.player_x, banana.player_y)
                )
            );
        }
    }

    export class Player extends Generic.Wizard {
        constructor(state: State) {
            super(state);
        }
    }
}
