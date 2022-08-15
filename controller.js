class Controller {
    constructor(_model, _container) {
        this.model = _model;
        this.container = _container
        this.level = null;
        window.addEventListener("hashchange", this.updateState);
        this.updateState();
        this.listeners();
        this.checkReload();

    }

    updateState = () => {
        const hashPageName = window.location.hash.slice(1).toLowerCase();
        if (hashPageName !== 'play' && hashPageName !== 'score') {
            this.model.updateState(hashPageName, this.level);
            if (!this.container.querySelector('canvas')) {
                document.removeEventListener('keydown', this.keyHandler);
            }
        } else if (hashPageName === 'score') {
            this.model.updateState(hashPageName, this.level);
            this.model.getScore();
        }

    }
    checkReload = () => {
        let locHash = window.location.hash.slice(1).toLowerCase();
        if (locHash === 'play') {
            if (document.getElementById('sokoban')) {
            } else if (document.getElementById('sokoban') == null) {
                this.model.reload();
            }
        }
    }
    listeners = () => {
        document.addEventListener('click', (e) => {
            let target = e.target;
            const loginBtn = document.getElementById('login');
            const signupBtn = document.getElementById('signup');
            const goBackBtn = document.getElementById('goBack');
            const btnBackToLevels = document.querySelector('.backToLevels');
            const signSubmit = document.querySelector('#signSubmit');
            const signName = document.querySelector('#signName');
            const signPass = document.querySelector('#signPass');
            const signEmail = document.querySelector('#signEmail');
            const logSubmit = document.querySelector('#logSubmit');
            const logEmail = document.querySelector('#logEmail');
            const logPass = document.querySelector('#logPass');
            const musicBtn = document.querySelector('.music');
            const logoutBtn = document.querySelector('.logout');
            const showDelData = document.querySelector('#delData');
            const closeDelData = document.querySelector('.closeForm');
            const delData = document.querySelector('.confirmDel');
            const delDataEmail = document.querySelector('#delDataEmail');
            const restart = document.querySelector('.restart');
            const toRestart = document.querySelector('#toRestart');
            const noRestart = document.querySelector('#noRestart');
            const backTolev = document.querySelector('#backTolev');
            const showPW = document.querySelector("#showPW");
            const showPW2 = document.querySelector("#showPW2");
            if (target.hash === '#play') { //отрисовка игры в зависимости от уровня
                let level = target.id;
                level = window[level];
                this.model.updateState('play', level, target);
                this.listenKeyboard(level);// включить слушатели клавиатуры
                this.level = level;
            }
            ;
            switch (target) {
                case loginBtn:
                    let parent = target.parentNode.parentNode;
                    Array.from(target.parentNode.parentNode.classList).find((element) => {
                        if (element !== "slide-up") {
                            parent.classList.add('slide-up')
                        } else {
                            signupBtn.parentNode.classList.add('slide-up')
                            parent.classList.remove('slide-up')
                        }
                    });
                    break;
                case signupBtn:
                    let parent2 = target.parentNode;
                    Array.from(target.parentNode.classList).find((element) => {
                        if (element !== "slide-up") {
                            parent2.classList.add('slide-up')
                        } else {
                            loginBtn.parentNode.parentNode.classList.add('slide-up')
                            parent2.classList.remove('slide-up')
                        }
                    });
                    break;
                case goBackBtn:
                    this.model.goBack();
                    break;
                case btnBackToLevels:
                    this.model.updateState('levels');
                    break;
                case signSubmit:
                    this.model.addUser(signName.value, signEmail.value, signPass.value);
                    break;
                case logSubmit:
                    this.model.loginUser(logEmail.value, logPass.value);
                    break;
                case musicBtn:
                    if (musicBtn.className === 'music') {
                        this.model.setAudio(false);
                    } else if (musicBtn.className === 'music disabled') {
                        this.model.setAudio(true);
                    }
                    break;
                case logoutBtn:
                    this.model.logOut();
                    break;
                case showDelData:
                    this.model.showDelData();
                    break;
                case closeDelData:
                    this.model.closeDelData();
                    break;
                case delData:
                    this.model.delData(delDataEmail.value);
                    break;
                case restart:
                    this.model.showModalRestat();
                    break;
                case noRestart:
                    this.model.closeShowModalRestart();
                    break;
                case toRestart:
                    this.model.toRestartGame();
                    break;
                case backTolev:
                    this.model.updateState('levels');
                    break;
                case showPW:
                    if (signPass.type === "password") {
                        signPass.type = "text";
                    } else {
                        signPass.type = "password";
                    }
                    break;
                case showPW2:
                    if (logPass.type === "password") {
                        logPass.type = "text";
                    } else {
                        logPass.type = "password";
                    }
                    break;

            }

        });
    }
    listenKeyboard = () => {
        if (this.container.querySelector('canvas')) {
            document.addEventListener('keydown', this.keyHandler)
        }
    };
    keyHandler = (e) => {
        let level = this.level;
        let direction = null;
        switch (e.key) {
            case "ArrowRight":
                this.model.countMoves();
                direction = 'right';
                this.model.movePlayer(direction, level);
                break;
            case "ArrowLeft":
                this.model.countMoves();
                direction = 'left';
                this.model.movePlayer(direction, level);
                break;
            case "ArrowUp":
                this.model.countMoves();
                direction = 'up';
                this.model.movePlayer(direction, level);
                break;
            case "ArrowDown":
                this.model.countMoves();
                direction = 'down';
                this.model.movePlayer(direction, level);
                break;

        }
    }
}