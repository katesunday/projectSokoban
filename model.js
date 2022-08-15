class Model {
    constructor(_view) {
        this.view = _view;
        this.direction = null;
        this.map = null;
        this.level = null;
        this.countMove = 0;
        this.countT = 0;
        this.scorePoint = 0;
        this.isAudio = true;
        this.username = null;
        this.targetLevel = null;
        this.restartLevel = null;
    }

    updateState(hashPageName, level, targetLevel) { // SPA
        let myView = this.view; //  чтобы не потерять this
        if (hashPageName === 'play') {
            this.targetLevel = targetLevel;
            this.restartLevel = level;
            this.view.renderContent(hashPageName, this.countMove);
            this.view.showMoves(this.countMove);
            this.view.showLevel(this.targetLevel);
            this.map = this.deepCopy(level);//создать глубокую копию уровня, чтобы работать только с копией
            this.level = targetLevel.innerText;

        } else if (hashPageName === 'menu') {
            this.view.renderContent(hashPageName);
            this.countMove = 0;
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    var ref = firebase.database().ref();
                    ref.child("users").orderByChild("email").equalTo(`${user.email}`).once("value", snapshot => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            var userDataName = Object.keys(userData);
                            var username = userData[userDataName].username;
                            myView.sayHi(username.toUpperCase());
                        }
                    });
                } else {
                    // console.log('No user is signed in');
                    myView.renderContent('registration');
                }
            });

        } else if (hashPageName === 'levels') {
            this.view.renderContent(hashPageName);
            this.countMove = 0;
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    var ref = firebase.database().ref();
                    ref.child("users").orderByChild("email").equalTo(`${user.email}`).once("value", snapshot => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            var userDataName = Object.keys(userData);
                            var username = userData[userDataName].username;
                            var passedLevels = Number(userData[userDataName].level); // пройденный уровни
                            myView.letPlay(passedLevels);
                        }
                    });
                } else {
                    myView.renderContent('registration');
                }
            });

        } else {
            this.view.renderContent(hashPageName);
            this.countMove = 0;
        }
    }

    goBack() { // возврат в меню
        this.view.renderContent('menu');
    }

    //ф-я глубокого копирования для работы с картой уровня
    deepCopy = (arr) => {
        var out = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            var obj = [];
            for (var k in item) {
                obj[k] = item[k];
            }
            out.push(obj);
        }
        this.view.drawField(this.direction, out);
        return out;
    };

    // ЛОГИКА ИГРОКА
    movePlayer(direction, level) {
        const playerCoords = this.findPlayerCoords(this.map);// взять координаты из копии
        const newPlayerY = this.getY(playerCoords.y, direction, 1)
        const newPlayerX = this.getX(playerCoords.x, direction, 1)

        //оставлять за собой фон и цели исходя из карты уровня (не копии)
        this.map[playerCoords.y][playerCoords.x] =
            this.isTarget(level[playerCoords.y][playerCoords.x]) ? 4 : 2;
        if (this.isAudio) {
            audioWalking.play()
        }
        ;

        //если есть стена, то шаг = 0
        if (this.isWall(this.map[newPlayerY][newPlayerX])) {
            this.map[this.getY(playerCoords.y, direction, 0)][this.getX(playerCoords.x, direction, 0)] = 1;
            this.view.drawField(direction, this.map);
            if (this.isAudio) {
                audioWalking.pause();
                audioWall.play()
            }
            ;
        }
        // если за игроком куб, то
        else if (this.isBrick(this.map[newPlayerY][newPlayerX])) {
            //если через 2 шага там НЕ стена и НЕ куб, то сдвигаем игрока на 1 шаг а кубик на 2 от игрока соотвественно
            if (this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] !== 0
                && this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] != 3
                && this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] != 5) {
                // если через два шага НЕ цель, то двигает игрока и кубик
                if (this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] != 4) {
                    this.map[this.getY(playerCoords.y, direction, 1)][this.getX(playerCoords.x, direction, 1)] = 1;
                    this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] = 3;
                }
                // если там ЦЕЛЬ, то кубик делаем зеленым( т.е успешным)
                else {
                    this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] = 5;
                    if (this.isAudio) {
                        audioSuccess.play()
                    }
                    ;
                    this.map[this.getY(playerCoords.y, direction, 1)][this.getX(playerCoords.x, direction, 1)] = 1;
                }
            }
            //а если там стена, то игрока не двигать больше
            else {
                this.map[this.getY(playerCoords.y, direction, 0)][this.getX(playerCoords.x, direction, 0)] = 1;
                this.map[this.getY(playerCoords.y, direction, 1)][this.getX(playerCoords.x, direction, 1)] = 3;
            }
            this.view.drawField(direction, this.map);
        }
        //если за игроком ЗЕЛЕНЫЙ КУБ, то при движении куб сделать обычным
        else if (this.isSuccess(this.map[newPlayerY][newPlayerX])) {
            //если через 2 шага там НЕ стена, то сдвигаем игрока на 1 шаг а кубик на 2 от игрока соотвественно
            if (this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] == 2) {
                this.map[this.getY(playerCoords.y, direction, 1)][this.getX(playerCoords.x, direction, 1)] = 1;
                this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] = 3;
            }
            //а если две цели подряд
            else if (this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] == 4) {
                this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] = 5;
                if (this.isAudio) {
                    audioSuccess.play()
                }
                ;
                this.map[this.getY(playerCoords.y, direction, 1)][this.getX(playerCoords.x, direction, 1)] = 1;
            } else {
                this.map[this.getY(playerCoords.y, direction, 0)][this.getX(playerCoords.x, direction, 0)] = 1;
            }

            this.view.drawField(direction, this.map);
        } else {
            this.map[this.getY(playerCoords.y, direction, 1)][this.getX(playerCoords.x, direction, 1)] = 1;
            this.view.drawField(direction, this.map);
        }
        this.countTargets(this.map);// считать цели

    };

    findPlayerCoords = (map) => { //найти координаты игрока
        const y = map.findIndex(row => row.includes(1));// если в строке есть игрок дать его индекс
        const x = map[y].indexOf(1); //дать его индекс в строке
        return {
            x,
            y,
            above: map[y - 1][x],
            below: map[y + 1][x],
            sideLeft: map[y][x - 1],
            sideRight: map[y][x + 1],
        }
    };
    // функции поиска соседних блоков
    isBrick = (cell) => [3].includes(cell);// есть ли кубик в клетке
    isPlayer = (cell) => [1].includes(cell);
    isTraversible = (cell) => [2].includes(cell);
    isWall = (cell) => [0].includes(cell);
    isTarget = (cell) => [4].includes(cell);
    isSuccess = (cell) => [5].includes(cell);

    // функции поиска координат игока
    getX = (x, direction, spaces = 1) => {
        if (direction === 'up' || direction === 'down') {
            return x
        }
        if (direction === 'right') {

            return x + spaces
        }
        if (direction === 'left') {
            return x - spaces
        }
    };

    getY = (y, direction, spaces = 1) => {
        if (direction === 'left' || direction === 'right') {
            return y
        }
        if (direction === 'down') {
            return y + spaces
        }
        if (direction === 'up') {
            return y - spaces
        }
    };
    // кнопка аудио
    setAudio = (arg) => {
        this.isAudio = arg;
        this.view.changeMusicBtn();
    }
    //ф-я подсчета целей
    countTargets = (map) => {
        let countT = [];
        map.forEach((row, y) => { // взять каждую строку по У вниз
            row.forEach((cell, x) => { // каждую клетку
                if (cell == 3) {
                    countT.push(cell);
                }
            })
        })
        if (countT.length == 0) {
            this.view.showModal();
            this.scorePoint = (100 - this.countMove);
            this.saveScore();
            if (this.isAudio) {
                audioSuccess.play()
            }
            ;

        }
    };
    // ф-я подсчета ходов
    countMoves = () => {
        this.countMove++;
        this.view.showMoves(this.countMove);
    }
    // добавление нового пользователя
    addUser = (signName, signEmail, signPass) => {
        let userName = signName;
        let userEmail = signEmail;
        let password = signPass;
        let myModel = this;
        let myView = this.view;
        firebase.auth().createUserWithEmailAndPassword(userEmail, password)
            .then(function (user) {
                myDB.ref('users/' + `user_${userName.replace(/\s/g, "").toLowerCase()}`).set({
                    username: `${userName}`,
                    email: `${userEmail}`,
                    password: `${password}`,
                    level: 0,
                })
                console.log(`Пользователь ${userName} добавлен в коллецию users`);
            })
            .then(function (userName) {
                console.log(`Пользователь ${userName} добавлен в коллецию users`);
                myModel.loginUser(userEmail, password);
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("Eroor Msg" + errorMessage);
                myView.showError(error.message);
            });

    }
    // логин уже существующего пользователя
    loginUser = (logEmail, logPass) => {
        let userEmail = logEmail;
        let password = logPass;
        let myView = this.view;
        if (userEmail && password) {
            firebase.auth().signInWithEmailAndPassword(userEmail, password)
                .then(function (user) {
                    var user = firebase.auth().currentUser;
                    var ref = firebase.database().ref();
                    ref.child("users").orderByChild("email").equalTo(`${user.email}`).once("value", snapshot => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            var userDataName = Object.keys(userData);
                            var username = userData[userDataName].username;
                            myView.renderContent('menu');
                        }
                    });
                })
                .catch(function (error) {
                    console.log("Error: " + error.message);
                    myView.showError2(error.message);
                });
        }
    }
    saveScore = () => {
        var user = firebase.auth().currentUser;
        var ref = firebase.database().ref();
        ref.child("users").orderByChild("email").equalTo(`${user.email}`).once("value", snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                var userDataName = Object.keys(userData);
                var userName = userData[userDataName].username.toLowerCase();
                var previousScore = userData[userDataName].score ? userData[userDataName].score : 0;
                var level = userData[userDataName].level; //уровень в базе
                if (level < this.level) { // если уровень в базе меньш того, что проходит игрок
                    myDB.ref('users/' + `user_${userName}`).update({
                        score: Number(previousScore) + Number(this.scorePoint),
                        level: `${this.level}`,
                    })
                } else if (level > this.level) {
                    myDB.ref('users/' + `user_${userName}`).update({//sfs
                        score: Number(previousScore) + Number(this.countMove),
                        level: `${level}`,
                    })
                } else {
                    myDB.ref('users/' + `user_${userName}`).update({
                        score: Number(previousScore) + Number(this.scorePoint),
                        level: `${this.level}`,
                    })
                }

                console.log("exists!", userName);
            }
        });
    }
    logOut = function () {
        firebase.auth().signOut();
        this.view.askToLogin();
    }

    getScore() {
        let arrScore = [];
        let list = {};
        let myView = this.view;

        myDB.ref("users/").on("value", function (snapshot) {
            arrScore = snapshot.val();
            Object.keys(arrScore).forEach(function (key) {
                var val = arrScore[key];
                let username = val.username.toUpperCase().replace(/\s/g, '');
                let score = val.score;
                if (score) {
                    list[username] = score;
                }

            })
            let sortAssocObject = (list) => { // сортировка по возрастанию
                var sortable = [];
                for (var key in list) {
                    sortable.push([key, list[key]]);
                }
                sortable.sort(function (a, b) {
                    return (a[1] > b[1] ? -1 : (a[1] > b[1] ? 1 : 0));
                });
                var orderedList = {};
                for (var idx in sortable) {
                    orderedList[sortable[idx][0]] = sortable[idx][1];
                }
                myView.getRecords(orderedList);
                return orderedList;
            }
            sortAssocObject(list);

        }, function (error) {
            console.log("Error: " + error.code);
        });
    }

    showDelData() {
        this.view.showDelData();
    }

    closeDelData() {
        this.view.closeDelData();
    }

    // удалить данные об очках игрока
    delData(emailToDel) {
        let myView = this.view;
        var user = firebase.auth().currentUser;
        var ref = firebase.database().ref();
        ref.child("users").orderByChild("email").equalTo(`${emailToDel}`).once("value", snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                var userDataName = Object.keys(userData);
                var username = userData[userDataName].username;
                myDB.ref('users/' + `user_${username}/` + 'score').remove();
                myView.closeDelData();
            }
        });
        this.updateState('score');
        this.getScore();
    }

    showModalRestat() {
        this.view.showModalRestat();
    }

    closeShowModalRestart() {
        this.view.closeShowModalRestart();
    }

    // кнопка перезапуска игры
    toRestartGame() {
        let restartLevel = this.restartLevel;
        let targetlevel = this.targetLevel;
        this.updateState('play', restartLevel, targetlevel);
        this.view.showMoves(this.countMove = 0);
        this.view.closeShowModalRestart();
    }

    // обновление страницы
    reload() {
        this.updateState('levels');
    }
}