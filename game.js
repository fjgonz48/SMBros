/* https://docs.phaser.io/api-documentation/api-documentation 
   https://phaser.io/tutorials/making-your-first-phaser-3-game-spanish
*/

const config = {
    type: Phaser.AUTO,
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300}
        }
    },
    scene: {
        preload, // Precargar recursos
        create, // Iniciar juego
        update // Carga los frame constantemente
    }
}

new Phaser.Game(config)

function preload() { // Se ejecuta primero [PRE-CARGAR]
    this.load.image('cloud1','assets/scenery/overworld/cloud1.png')
    this.load.image('floor','assets/scenery/overworld/floorbricks.png')
    this.load.image('custom','assets/blocks/overworld/customBlock.png')
    this.load.spritesheet('mario','assets/entities/mario.png',{frameWidth:18,frameHeight:16})
    this.load.audio('gameover','assets/sound/music/gameover.mp3')
    
}

function create() { // Se ejecuta segundo [CREAR ELEMENTO PRE-CARGADO]
    /* Agrega imagen de nube */
    this.add.image(100,50,'cloud1').setScale(0.15)

    /* Agrega el suelo con fisicas estaticas */
    //this.add.image(0,212,'floor').setOrigin(0)
    this.floor = this.physics.add.staticGroup()
    this.floor.create(0,212,'floor').setOrigin(0).refreshBody()

    /* Agrega bloques (flotantes) con fisicas estaticas */
    //this.add.image(100,150,'custom').setOrigin(0)
    this.custom = this.physics.add.staticGroup()
    this.custom.create(100,150,'custom').setOrigin(0).refreshBody()

    this.add.image(50,180,'floor').setOrigin(-1)

    /* Agrega al mario con fisicas (coliciones y animaciones) */
    //this.add.sprite(100,199,'mario')
    //this.mario = this.add.sprite(100,199,'mario')
    this.mario = this.physics.add.sprite(50, 20,'mario').setOrigin(0,1).setCollideWorldBounds(true).setGravityY(300)

    this.physics.add.collider(this.mario, this.floor)
    this.physics.add.collider(this.mario, this.custom)

    this.keys = this.input.keyboard.createCursorKeys()
    this.anims.create({
        key:'mario-walk',
        frames: this.anims.generateFrameNumbers(
            'mario',
            {start:1,end:3}
        ),
        repeat:-1 // infinito
    })
    this.anims.create({
        key:'mario-idle',
        frames: [{key: 'mario', frame: 0}]
    })
    this.anims.create({
        key:'mario-split',
        frames: [{key: 'mario', frame: 5}]
    })
    this.anims.create({
        key:'mario-dead',
        frames: [{key: 'mario', frame: 4}]
    })

    /* Camara */
    this.physics.world.setBounds(0,0,2000,config.height)
    this.cameras.main.setBounds(0,0,2000,config.height)
    this.cameras.main.startFollow(this.mario)

}

function update() {

    if (this.mario.isDead) return // 🚨 CLAVE

    this.mario.setVelocityX(0)

    if (this.keys.left.isDown) {
        this.mario.setVelocityX(-150)
        this.mario.flipX = true
        this.mario.anims.play('mario-walk', true)

    } else if (this.keys.right.isDown) {
        this.mario.setVelocityX(150)
        this.mario.flipX = false
        this.mario.anims.play('mario-walk', true)

    } else {
        this.mario.anims.play('mario-idle', true)
    }

    if (this.keys.up.isDown && this.mario.body.touching.down) {
        this.mario.setVelocityY(-300)
        this.mario.anims.play('mario-split', true)
    }

    // 👇 MUERTE
    if (this.mario.y >= config.height && !this.mario.isDead) {
        this.mario.isDead = true
        this.mario.anims.play('mario-dead', true)
        this.mario.setCollideWorldBounds(false)
        this.sound.play('gameover')
        this.sound.add('gameover',{volume:0.2}).play()

        setTimeout(() => {
            this.mario.setVelocityY(-350)
            }, 100)

        setTimeout(() => {
            this.scene.restart()
            }, 2000)
    }
}