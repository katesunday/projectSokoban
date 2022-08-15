
function gameInit(container) {
    let socobanView = new View(container);
    let socobanModel = new Model(socobanView);
    let socobanController = new Controller(socobanModel, container);
}

document.addEventListener("DOMContentLoaded", gameInit(document.querySelector("#app")));
