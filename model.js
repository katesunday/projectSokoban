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
        let myView = this.view;
        if (hashPageName === 'play') {
            this.targetLevel = targetLevel;
            this.restartLevel = level;
            this.view.renderContent(hashPageName, this.countMove);
            this.view.showMoves(this.countMove);
            this.view.showLevel(this.targetLevel);
            this.map = this.deepCopy(level);// working with a deepCopy of the map
            this.level = targetLevel.innerText;

        } else if (hashPageName === 'menu') {
            this.view.renderContent(hashPageName);
            this.countMove = 0;
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    const ref = firebase.database().ref();
                    ref.child("users").orderByChild("email").equalTo(`${user.email}`).once("value", snapshot => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            const userDataName = Object.keys(userData);
                            const username = userData[userDataName].username;
                            myView.sayHi(username.toUpperCase());
                        }
                    });
                } else {
                    myView.renderContent('registration');
                }
            });

        } else if (hashPageName === 'levels') {
            this.view.renderContent(hashPageName);
            this.countMove = 0;
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    const ref = firebase.database().ref();
                    ref.child("users").orderByChild("email").equalTo(`${user.email}`).once("value", snapshot => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            const userDataName = Object.keys(userData);
                            const username = userData[userDataName].username;
                            const passedLevels = Number(userData[userDataName].level);
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

    goBack() { // back to menu
        this.view.renderContent('menu');
    }

    //deepCopy func
    deepCopy = (arr) => {
        const out = [];
        for (let i = 0, len = arr.length; i < len; i++) {
            const item = arr[i];
            const obj = [];
            for (let k in item) {
                obj[k] = item[k];
            }
            out.push(obj);
        }
        this.view.drawField(this.direction, out);
        return out;
    };

    // PLAYER LOGIC
    movePlayer(direction, level) {
        const playerCoords = this.findPlayerCoords(this.map);// taking coordinates
        const newPlayerY = this.getY(playerCoords.y, direction, 1)
        const newPlayerX = this.getX(playerCoords.x, direction, 1)

        // leave background based on initial map(not copy)
        this.map[playerCoords.y][playerCoords.x] =
            this.isTarget(level[playerCoords.y][playerCoords.x]) ? 4 : 2;
        if (this.isAudio) {
            audioWalking.play()
        }
        ;

        //if there is a wall then step = 0
        if (this.isWall(this.map[newPlayerY][newPlayerX])) {
            this.map[this.getY(playerCoords.y, direction, 0)][this.getX(playerCoords.x, direction, 0)] = 1;
            this.view.drawField(direction, this.map);
            if (this.isAudio) {
                audioWalking.pause();
                audioWall.play()}
        }
        //  if there is a cube in front of the player
        else if (this.isBrick(this.map[newPlayerY][newPlayerX])) {
            // if in 2 steps there is not a wall and not a cube, then moving the player for 1 step and cube for 2 steps
            if (this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] !== 0
                && this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] !== 3
                && this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] !== 5) {
                // if in 2 step there is no target, then moving player and cube
                if (this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] !== 4)
                {
                    this.map[this.getY(playerCoords.y, direction, 1)][this.getX(playerCoords.x, direction, 1)] === 1;
                    this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] === 3;
                }
                    // if there is target then making the cube green
                else {
                    this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] = 5;
                    if (this.isAudio) {
                        audioSuccess.play()}
                    this.map[this.getY(playerCoords.y, direction, 1)][this.getX(playerCoords.x, direction, 1)] = 1;
                }
            }
                // if there is a wall do not move the player
            else {
                this.map[this.getY(playerCoords.y, direction, 0)][this.getX(playerCoords.x, direction, 0)] = 1;
                this.map[this.getY(playerCoords.y, direction, 1)][this.getX(playerCoords.x, direction, 1)] = 3;
            }
            this.view.drawField(direction, this.map);
        }
            // if moving success cube from the target
        else if (this.isSuccess(this.map[newPlayerY][newPlayerX])) {
            // if in 2 steps there is no wall, moving player and cube for 1 and 2 steps
            if (this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] === 2) {
                this.map[this.getY(playerCoords.y, direction, 1)][this.getX(playerCoords.x, direction, 1)] = 1;
                this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] = 3;
            }
            //if two targets in a row
            else if (this.map[this.getY(playerCoords.y, direction, 2)][this.getX(playerCoords.x, direction, 2)] === 4) {
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
        this.countTargets(this.map);// counting targets

    };

    findPlayerCoords = (map) => { //finding coordinates of the player
        const y = map.findIndex(row => row.includes(1));
        const x = map[y].indexOf(1);
        return {
            x,
            y,
            above: map[y - 1][x],
            below: map[y + 1][x],
            sideLeft: map[y][x - 1],
            sideRight: map[y][x + 1],
        }
    };

    //func to search other blocks
    isBrick = (cell) => [3].includes(cell);// есть ли кубик в клетке
    isPlayer = (cell) => [1].includes(cell);
    isTraversible = (cell) => [2].includes(cell);
    isWall = (cell) => [0].includes(cell);
    isTarget = (cell) => [4].includes(cell);
    isSuccess = (cell) => [5].includes(cell);

    // func to find current coordinates of the player
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
    // audio button
    setAudio = (arg) => {
        this.isAudio = arg;
        this.view.changeMusicBtn();
    }
    //counting targets
    countTargets = (map) => {
        let countT = [];
        map.forEach((row) => {
            row.forEach((cell) => {
                if (cell === 3) {
                    countT.push(cell);
                }
            })
        })
        if (countT.length === 0) {
            this.view.showModal();
            this.scorePoint = (100 - this.countMove);
            this.saveScore();
            if (this.isAudio) {
                audioSuccess.play()
            }
            ;

        }
    };
    // func to count moves
    countMoves = () => {
        this.countMove++;
        this.view.showMoves(this.countMove);
    }
    // adding new user
    addUser = (signName, signEmail, signPass) => {
        let userName = signName;
        let userEmail = signEmail;
        let password = signPass;
        let myModel = this;
        let myView = this.view;
        firebase.auth().createUserWithEmailAndPassword(userEmail, password)
            .then(function () {
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
                const errorMessage = error.message;
                console.log("Error Msg" + errorMessage);
                myView.showError(error.message);
            });

    }
    // login of registered user
    loginUser = (logEmail, logPass) => {
        let userEmail = logEmail;
        let password = logPass;
        let myView = this.view;
        if (userEmail && password) {
            firebase.auth().signInWithEmailAndPassword(userEmail, password)
                .then(function () {
                    const user = firebase.auth().currentUser;
                    const ref = firebase.database().ref();
                    ref.child("users").orderByChild("email").equalTo(`${user.email}`).once("value", snapshot => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            const userDataName = Object.keys(userData);
                            const username = userData[userDataName].username;
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
        const user = firebase.auth().currentUser;
        const ref = firebase.database().ref();
        ref.child("users").orderByChild("email").equalTo(`${user.email}`).once("value", snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userDataName = Object.keys(userData);
                const userName = userData[userDataName].username.toLowerCase();
                const previousScore = userData[userDataName].score ? userData[userDataName].score : 0;
                const level = userData[userDataName].level; // level in firebase
                if (level < this.level) {
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
                const val = arrScore[key];
                const username = val.username.toUpperCase().replace(/\s/g, '');
                const score = val.score;
                if (score) {
                    list[username] = score;
                }

            })
            let sortAssocObject = (list) => { // сортировка по возрастанию
                const sortable = [];
                for (let key in list) {
                    sortable.push([key, list[key]]);
                }
                sortable.sort(function (a, b) {
                    return (a[1] > b[1] ? -1 : (a[1] > b[1] ? 1 : 0));
                });
                const orderedList = {};
                for (let idx in sortable) {
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

    // delete score of the user
    delData(emailToDel) {
        let myView = this.view;
        const ref = firebase.database().ref();
        ref.child("users").orderByChild("email").equalTo(`${emailToDel}`).once("value", snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userDataName = Object.keys(userData);
                const username = userData[userDataName].username;
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

    // restart the game
    toRestartGame() {
        let restartLevel = this.restartLevel;
        let targetLevel = this.targetLevel;
        this.updateState('play', restartLevel, targetLevel);
        this.view.showMoves(this.countMove = 0);
        this.view.closeShowModalRestart();
    }

    // reload the game
    reload() {
        this.updateState('levels');
    }
}