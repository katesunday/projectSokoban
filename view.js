class View {
    Registration = {
        render: () =>{
            return `
            <div class="form-structor">
	        <div class="signup">
		        <h2 class="form-title" id="signup"><span>or</span>Sign up</h2>
                <p id ="errMsg"></p>
		    <div class="form-holder">
			    <input type="text" class="input" id="signName" placeholder="Name" />
			    <input type="email" class="input" id="signEmail" placeholder="Email" />
			    <input type="password" class="input" id="signPass" placeholder="Password">
                </input>
                <input type="checkbox" id = "showPW"></input>
                <p id = "showPWtext">Show password</p>
		    </div>
		    <button class="submit-btn" id="signSubmit">Sign up</button>
	        </div>
	        <div class="login slide-up">
		    <div class="center">
			    <h2 class="form-title" id="login"><span>or</span>Log in</h2>
                <p id ="errMsg2"></p>
			<div class="form-holder">
				<input type="email" class="input" id="logEmail" placeholder="Email" />
				<input type="password" class="input" id="logPass" placeholder="Password" />
                <input type="checkbox" id = "showPW2"></input>
                <p id = "showPWtext">Show password</p>
			</div>
			    <button class="submit-btn" id="logSubmit">Log in</button>
		    </div>
	        </div>
            </div>
            `
        }
    };
    GameMenu = { // стартовая страница игры
        render: () =>{
            return `
            <div class="menu" id="menu">
            <button class="playBtn" id="playBtn"><a href="#levels">PLAY</a></button>
            <button class="rulesBtn" id="rulesBtn"><a href="#rules">GAME RULES</a></button>
            <button class="scoreBtn" id="scoreBtn"><a href="#score">SCORE TABLE</a></button>
            <button class = "logout" id = "logout">LOG OUT</button>
            <div class = "auth"></div>
            </div>
            `
        }
    };
    Play = { // сама игра
        render: (moves) =>{
            return  `
            <div class = "infoLevel"></div>
            <div class = 'restartModal'>
            <p>Are you sure that you want to restart the game?<br>
            You will loose your current record.</p>
            <button id = "toRestart">I'm sure</button>
            <button id = "noRestart">No</button>
            </div>
            <button class = "music" id = 'music'></button>
            <div class = "countMoves">Your moves: ${moves}</div>
            <div class = "canvas">
            <canvas id="sokoban" width="600px" height="500px"></canvas>
            </div>
            <div class = "levelcomplete">
            </div>
            `
        }
        
    };
    Levels = {
        render: () =>{
            return `
            <div class="levels" id = "levels">
            <h3>SELECT LEVEL</h3>
            <div class="level not-active " ><a class="play" id="level1" href="#play">1</a></div>
            <div class="level not-active" ><a class="play" id="level2" href="#play">2</a></div>
            <div class="level not-active" ><a class="play" id="level3" href="#play">3</a></div>
            <div class="level not-active" ><a class="play" id="level4" href="#play">4</a></div>
            <div class="level not-active" ><a class="play" id="level5" href="#play">5</a></div>
            <div class="level not-active" ><a class="play" id="level6" href="#play">6</a></div>
            <div class="level not-active" ><a class="play" id="level7" href="#play">7</a></div>
            <div class="level not-active" ><a class="play" id="level8" href="#play">8</a></div>
            <div class="level not-active" ><a class="play" id="level9" href="#play">9</a></div>
            <div class="level not-active" ><a class="play" id="level10" href="#play">10</a></div>
            <div class="goBack" >
            <img src="img/back.png" alt="go back" id="goBack">
            </div>    
            </div>  
            </div>
            `
        }
    };
    Rules = { //  правила игры
        render: () =>{
            return`
            <div class="rules" id="rules">
            <div class = 'howto'>How to play:</div>
            <div>The player is confined to the board and may move horizontally
                 or vertically onto empty squares (never through walls or boxes).
                  The player can move a box by walking up to it and push it to the 
                  square beyond. Boxes cannot be pulled, and they cannot be pushed 
                  to squares with walls or other boxes.
            </div>
            <div>Use keyboard for moving the player.<br>&#8593; - to move up
            <br> &#8595; - to move down
            <br> &#8594; - to move right 
            <br> &#8592; - to move left
            </div>
            <div>Try to place boxes on green targets in a minimum ammount of moves. Your points depends on the 
            ammount of moves you have taken. If you play level second or more times, you will receive less 
            points.</div>
            <div><h5>So don't rush, think twice and enjoy the game!</h5></div>
            <img src="img/soko.png" alt="soko" id="soko">
            <div class="goBack" >
            <img src="img/back.png" alt="go back" id="goBack">
            </div>    
            </div>   
            `
        }
    }
    Score = {
        render:() =>{
            return `
            <div class="records" id="records">
               <div class="topTen" id="topTen">
                   <p>Top players!</p>
                   <svg id="loading"></svg>
                   <ol id = "score"></ol>
               </div>
               <div class="goBack" >
               <img src="img/back.png" alt="go back" id="goBack">
               <button id="delData">I want to delete my score record</button>
               <div id = "modalDelData">
               <button class = "closeForm">&#10008;</button>
               <p>Confirm your email:</p>
               <input type="email" class="input" id="delDataEmail" placeholder="Email" ></input>
               <button class = "confirmDel">Yes, I really want to delete my record.</button>
               </div>
               </div>  
            </div>
            `
        }
    };
    router = { 
        registration: this.Registration,
        menu: this.GameMenu,
        play: this.Play,
        rules: this.Rules,
        score: this.Score,
        levels: this.Levels,
        moves: this.moves,
    };
    constructor(field) {
        this.container = field;
		this.direction = null;
        this.moves = 0;
        this.username = null;

		
	   this.wall = new Image();
			 this.wall.src = 'img/wall.png';
	   this.bg = new Image();
			this.bg.src = 'img/bg.png';
	   this.player = new Image();
			this.player.src = 'img/player.png';
	   this.brick = new Image();
			this.brick.src = 'img/brick.png'
	   this.target = new Image();
			this.target.src = 'img/greentarget.png';
	   this.success = new Image();
			this.success.src = 'img/brickSuccess.png';
       
    }
    renderContent(hashPageName,moves) {
        let routeName = "registration";
        if (hashPageName.length > 0) {
            routeName = hashPageName in this.router ? hashPageName : "error";
        }
        this.container.innerHTML = this.router[routeName].render(moves);
        location.hash = routeName;
    }
    showMoves(moves){
       this.moves = moves;
       let divCountMoves = document.querySelector('.countMoves');
       divCountMoves.innerHTML = `Your moves: ${moves} 
        
        <button class = "backTolev" id = 'backTolev'></button>
        <button class = "restart" id = 'restart'></button>`;
        
    }
    showLevel(targetlevel){
      let divLevel = document.querySelector('.infoLevel');
       let levelNumber = targetlevel.innerText;
       divLevel.innerHTML = `Level: ${levelNumber} `;
    }
    //ф-я отрисовки карты
    drawField (direction,map){
        const cellSize = 70;// размер клетки
        const wall = this.wall;
		const bg = this.bg;
		const player = this.player;
		const brick = this.brick;
		const success = this.success;
		const target = this.target;

        const game = document.getElementById('sokoban');
        if(game && game.getContext('2d')){
        var ctx = game.getContext('2d');
        }
        map.forEach((row, y) => { // взять каждую строку по У вниз
        row.forEach((cell, x) => { // каждую клетку 
          paintCell(ctx, cell, x, y)
        })
        })
        function paintCell(ctx, cell, x, y) {
            
        if(cell== 1){
            ctx.drawImage(bg,x*cellSize,y*cellSize,cellSize,cellSize);
            if(direction == 'right'){
                
                ctx.drawImage(player, 130, 128, cellSize, cellSize,x*cellSize,y*cellSize,cellSize,cellSize);
            }
            else if(direction == 'left'){
                ctx.drawImage(player, 130, 65, cellSize, cellSize,x*cellSize,y*cellSize,cellSize,cellSize);
            }
            else if(direction == 'down'){
                ctx.drawImage(player, 70, 0, cellSize, cellSize,x*cellSize,y*cellSize,cellSize,cellSize);
            }
            else if(direction == 'up'){
                ctx.drawImage(player, 130, 190, cellSize, cellSize,x*cellSize,y*cellSize,cellSize,cellSize);
            }
            else{
            //вырезка спрайта - пример
            // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            ctx.drawImage(player, 0, 0, cellSize, cellSize,x*cellSize,y*cellSize,cellSize,cellSize);
            } 
        }
        else if(cell ==2){
            ctx.drawImage(bg,x*cellSize,y*cellSize,cellSize,cellSize);
        }
        else if(cell == 3){
            ctx.drawImage(brick,x*cellSize,y*cellSize,cellSize,cellSize);
        }
        else if(cell == 4){
            ctx.drawImage(bg,x*cellSize,y*cellSize,cellSize,cellSize);
            ctx.drawImage(target, 0, 0, cellSize, cellSize,(x*cellSize)+cellSize/2-(target.width/2),(y*cellSize)+cellSize/2-(target.width/2),cellSize,cellSize);
        }
        else if(cell == 5){
            ctx.drawImage(bg,x*cellSize,y*cellSize,cellSize,cellSize);
            ctx.drawImage(target, 0, 0, cellSize, cellSize,(x*cellSize)+cellSize/2-(target.width/2),(y*cellSize)+cellSize/2-(target.width/2),cellSize,cellSize);
            ctx.drawImage(success,x*cellSize,y*cellSize,cellSize,cellSize);
        }
        else {
            ctx.drawImage(wall,x*cellSize,y*cellSize,cellSize,cellSize); 
        }
      
        }
     }
    
    showModal(){
        let divLevelComplete = document.querySelector('.levelcomplete');
       divLevelComplete.style.display = 'block';
      divLevelComplete.innerHTML = `<p>You have gained ${100-this.moves} points!</p>
            <button class = "backToLevels">Back to levels</button>`
    }
    changeMusicBtn(){
        document.querySelector('#music').classList.toggle('disabled');
    }
    sayHi(username){ 
        if(username){
            this.username = username;
            document.querySelector('.auth').innerHTML = `<p>HI, ${this.username}!!</p>`;
        }
    }
    askToLogin(){
     this.renderContent('registration');
    }
    getRecords(list){
        for (let [key, value] of Object.entries(list)) {
            var userName = `${key}`;
            var userScore = `${value}`;
            const olList = document.querySelector("#score");
            const li = document.createElement('li');
            const text = document.createTextNode(`${key}: ${userScore} points`);
            olList.appendChild(li);
            li.appendChild(text);
        }
        document.getElementById('loading').style.display = 'none';
    }
    letPlay(passedLevels){
        let allLevels = document.querySelectorAll('.level');
        if(allLevels){
            for (let i = 0; i < allLevels.length-(allLevels.length-passedLevels-1); i++) { 
                allLevels[i].classList.remove('not-active');
            }
        }
    }
    showDelData(){
        document.querySelector('#modalDelData').style.display = 'block';
    }
    closeDelData(){
        document.querySelector('#modalDelData').style.display = 'none'; 
    }
    showModalRestat(){
        document.querySelector('.restartModal').style.display = 'block'; 
    }
    closeShowModalRestart(){
        document.querySelector('.restartModal').style.display = 'none'; 
    }
    showError(error){
        document.querySelector('#errMsg').innerText = error;
    }
    showError2(error){
        document.querySelector('#errMsg2').innerText = error;
    }

}
