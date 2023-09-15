// Seleciona o elemento canvas e obtém seu contexto 2D
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

// Seleciona elementos HTML relacionados ao jogo, como pontuação e menu
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final--score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play") 

// Cria um elemento de áudio para efeitos sonoros
const audio = new Audio('../assets/audio.mp3')

// Tamanho de uma unidade (célula) no jogo
const size = 30;

// Velocidade inicial do jogo
let speed = 300;

// Função para aumentar a velocidade do jogo
const incrementSpeed = () =>{
    speed = speed - 5;
}

// Posição inicial da cobra
const initialPosition = {x:270, y:240}

// Inicializa a cobra com uma única célula
let snake = [{x:270, y:240}]

// Função para aumentar a pontuação
const incrementScore = () =>{
    score.innerText = +score.innerText+ 10

}
// Função para gerar um número aleatório dentro de um intervalo
const randomNumber = (min , max) => {
    return Math.round(Math.random() *(max - min) + min)
}

// Função para gerar uma posição aleatória para a comida
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30)  * 30
}

// Função para gerar uma cor aleatória para a comida
const randomColor = () =>{
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

// Objeto que representa a comida
const food = {
      x: randomPosition(),
      y: randomPosition(),
      color:  randomColor()
}

// Direção inicial da cobra
let direction, loopid

// Função para desenhar a comida na tela
const drawFood = () =>{

   const{x, y, color} = food
    
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.fillStyle = food.color
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur = 0
}

// Função para desenhar a cobra na tela
const drawSnake = () => {
    ctx.fillStyle = "#ddd"
    
    snake.forEach((position, index)=> {

        if (index == snake.length - 1){
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x, position.y, size,size)
    })
}

// Função para mover a cobra
const moveSnake = () =>{
    if(!direction) return

    const head = snake[snake.length -1]

   

    if(direction == "right"){
        snake.push({ x: head.x + size, y: head.y})
    }

    if(direction == "left"){
        snake.push({ x: head.x - size, y: head.y})
    }

    if(direction == "down"){
        snake.push({ x: head.x, y: head.y + size})
    }

    if(direction == "up"){
        snake.push({ x: head.x, y: head.y - size})
    }

    snake.shift()
}

// Função para desenhar a grade na tela
const drawGrid = () =>{
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30)
    {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

// Função para verificar se a cobra comeu a comida
const checkEat = () => {
    const head = snake[snake.length -1]
    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        incrementSpeed()
        snake.push(head)
        audio.play()
        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}
// Função para verificar colisões da cobra com paredes ou consigo mesma
const checkCollision = () => {
    const head = snake[snake.length -1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = 
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y ==head.y
    })

    if (wallCollision || selfCollision){
        gameOver()
    }
} 

// Função chamada quando o jogo termina
const gameOver = () =>{
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
    speed = 300
}

// Função principal do loop do jogo
const gameLoop = () => {
    clearInterval(loopid)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

  loopid = setTimeout(() => {
    gameLoop()
  }, speed)
}

// Inicia o loop do jogo
gameLoop()

// Ouve eventos de teclado para controlar a direção da cobra
document.addEventListener("keydown",({key}) =>{
    
    if (key == "ArrowRight" && direction !== "left"){
        direction ="right"
    }
    if (key == "ArrowLeft" && direction !== "right"){
        direction ="left"
    }
    if (key == "ArrowUp" && direction !== "down"){
        direction ="up"
    }
    if (key == "ArrowDown" && direction !== "up"){
        direction ="down"
    }
})

// Ouve o evento de clique no botão "Play" para reiniciar o jogo
buttonPlay.addEventListener("click" , () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition];
})