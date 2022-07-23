const suits = ["coeur", "trèfle", "pique", "carreau"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "V", "D", "R"];

let deck;
let playerHand = [];
let dealerHand = [];
let wins = 0;
let losses = 0;
let draws = 0;
let bank = 500;
let bet = 0;
let btnNewGame = document.getElementById("new-game");
let gameInfo = document.getElementById("game-info");
let btnCard = document.getElementById("btn-card");
let btnPass = document.getElementById("btn-pass");
let playerValue = document.getElementById("player-value");
let dealerValue = document.getElementById("dealer-value");
let playerBet = document.getElementById("player-bet");
let btnConfirmBet = document.getElementById("confirm-bet-button");
let bankInfo = document.getElementById("player-bank");

//Action sur le bouton nouvelle partie
btnNewGame.addEventListener("click", setABet)
btnCard.addEventListener("click", triggerCarteButton)
btnPass.addEventListener("click", triggerServiButton)

//création du jeu de cartes
function createDeck() {
    deck = [];

    for (suit in suits) {
        for (value in values) {
            deck.push(`${values[value]} ${suits[suit]}`)
        }
    }

    return deck;
}

//mélange des cartes
function shuffleDeck() {
    deck = createDeck();
    let m = deck.length;
    let i;

    while (m) {
        i = Math.floor(Math.random() * m--);
        [deck[m], deck[i]] = [deck[i], deck[m]];
    }
    return deck;
}

//Action pour lancer un pari
function setABet() {
    playerBet.classList.remove("hidden");
    btnNewGame.classList.add("hidden");
    styleInfo("Faites vos paris avant de commencer !", "white")
    btnConfirmBet.addEventListener("click", newGame)
}

//Vérif que le joueur parie min 50 et qu'il a ce qu'il faut en banque
function checkBet(bet) {
    if (bet < 50) {
        styleInfo(`Vous devez payer minimum 50 !`, "red");
        return false;
    } else if (bet > bank) {
        styleInfo(`Vous n'avez pas autant en banque !`, "red");
        return false;
    } else {
        playerBet.classList.add("hidden");
        styleInfo(`Partie en cours...`, "white")
        return true
    }
}

//Maj du pari du joueur
function setBank(bet, statut) {
    if (statut == "blackjack") {
        bank += (bet * 2.5)
    }

    if (statut == "wins") {
        bank += (bet * 2)
    }

    if (statut == "draws") {
        bank += parseInt(bet);
    }

    if (statut == "losses") {
        bank;
    }

    bankInfo.innerHTML = `Banque du joueur : ${bank}`;
}

//lancement d'une nouvelle partie
function newGame() {
    deck = shuffleDeck();

    bet = document.getElementById("bet").value == "" ? bet : document.getElementById("bet").value;

    if (checkBet(bet)) {
        document.getElementById("start").classList.remove("hidden")
        //reset des mains
        playerHand = [];
        dealerHand = [];

        bankInfo.innerHTML = `Banque du joueur : ${bank} | Montant du pari : ${bet}`

        bank -= bet;

        btnNewGame.classList.add("hidden");
        btnCard.classList.remove("hidden");
        btnPass.classList.remove("hidden");

        //triage des mains 
        playerHand.push(deck.pop());
        playerHand.push(deck.pop());
        dealerHand.push(deck.pop());
        dealerHand.push(deck.pop());

        //calcul et affichage le total de chaque main
        let playerHandValue = calculateHandValue(playerHand);
        let dealerHandValue = calculateHandValue(dealerHand);
        playerValue.innerHTML = `Valeur : ${playerHandValue}`;
        dealerValue.innerHTML = `Valeur : ${dealerHandValue}`;


        //Affichage des cartes 
        drawCards(playerHand, "player-hand");
        drawCards(dealerHand, "dealer-hand");

        //En cas d'égalité
        if (playerHandValue == 21 && dealerHandValue == 21) {
            draws += 1;
            setBank(bet, "draws");
            styleInfo("Egalité !", "grey")
            updateScore();
            return;
        }

        //En cas de victoire
        if (playerHandValue == 21) {
            wins += 1;
            setBank(bet, "blackjack");
            styleInfo("Blackjack pour le joueur, gagné !", "green");
            updateScore();
            return;
        }

        //En cas de défaite
        if (dealerHandValue == 21) {
            losses += 1;
            setBank(bet, "losses");
            styleInfo("Blackjack pour le dealer, le joueur a perdu !", "red");
            updateScore();
            return;
        }

    }
}


//récupération de la valeur des cartes
function getCardsValue(cards) {
    let game = [];

    for (card in cards) {
        let cardValue = cards[card].split(" ")[0];
        if (cardValue == "A") {
            game.push(1)
        }

        if (cardValue == "2") {
            game.push(2)
        }

        if (cardValue == "3") {
            game.push(3)
        }

        if (cardValue == "4") {
            game.push(4)
        }

        if (cardValue == "5") {
            game.push(5)
        }

        if (cardValue == "6") {
            game.push(6)
        }

        if (cardValue == "7") {
            game.push(7)
        }

        if (cardValue == "8") {
            game.push(8)
        }

        if (cardValue == "9") {
            game.push(9)
        }

        if (cardValue == "10" || cardValue == "V" || cardValue == "D" || cardValue == "R") {
            game.push(10)
        }
    }

    return game;
}

//Calcul d'une main 
function calculateHandValue(hand) {
    let value = 0;
    let cards = getCardsValue(hand);

    for (card in cards) {
        if (cards[card] == 1) {
            value += 11;
            continue;
        }
        value += cards[card];
    }

    return value;
}

//Affichage des cartes
function drawCards(hand, select) {
    let drawCard = "";
    drawCard += '<div class="wrapper">';
    let cardValue;
    let cardSuit;
    let symbol = "";
    let color = "";

    for (card in hand) {
        cardValue = hand[card].split(" ")[0];
        cardSuit = hand[card].slice(2)

        if (cardSuit == "coeur") {
            symbol = "&#9829;";
            color = "red";
        }

        if (cardSuit == "carreau") {
            symbol = "&#9830;";
            color = "red";
        }

        if (cardSuit == "trèfle") {
            symbol = "&#9827;";
            color = "black";
        }

        if (cardSuit == "pique") {
            symbol = "&#9824;";
            color = "black";
        }

        drawCard += `<div class="card ${color}">`;
        drawCard += `<span class="card-value">${symbol}</span>`
        drawCard += `<span class="card-suit">${cardValue}</span>`
        drawCard += '</div>';
    }
    drawCard += '</div>';
    document.querySelector(`.${select} p`).innerHTML = drawCard;
}

//Maj du score 
function updateScore() {
    btnNewGame.classList.remove("hidden");
    document.getElementById("score").innerHTML = `Gagné : ${wins} | Nul : ${draws} | Perdu : ${losses}`;
    btnPass.classList.add("hidden");
    btnCard.classList.add("hidden");
}

//Appel à tirer une nouvelle carte au clic sur le bouton 
function triggerCarteButton() {
    playerHand.push(deck.pop());
    drawCards(playerHand, 'player-hand');
    let playerHandValue = calculateHandValue(playerHand);
    playerValue.innerHTML = `Total : ${playerHandValue}`;
    if (playerHandValue > 21) {
        takeNewCard();
    }
}

//Condition de jeu lors du tirage d'une nouvelle carte
function takeNewCard() {
    let playerHandValue = calculateHandValue(playerHand);
    let dealerHandValue = calculateHandValue(dealerHand);

    while (dealerHandValue < 17) {
        dealerHand.push(deck.pop());
        drawCards(dealerHand, 'dealer-hand');
        dealerHandValue = calculateHandValue(dealerHand);
        dealerValue.innerHTML = `Total : ${dealerHandValue}`;
    }

    if (dealerHandValue > 21 && playerHandValue > 21 || dealerHandValue == playerHandValue) {
        draws += 1;
        setBank(bet, "draws");
        styleInfo("Egalité !", "grey");
        updateScore();
    } else if (playerHandValue > 21 || (dealerHandValue > playerHandValue && dealerHandValue < 22)) {
        losses += 1;
        setBank(bet, "losses");
        styleInfo("Blackjack pour le dealer, le joueur a perdu !", "red");
        updateScore();
    } else {
        wins += 1;
        setBank(bet, "wins");
        styleInfo("Blackjack pour le joueur, gagné !", "green");
        updateScore();
    }
}

//Appel sur le bouton passer son tour
function triggerServiButton() {
    takeNewCard();
}

//Mise en style du texte info 
function styleInfo(txt, color) {
    gameInfo.innerHTML = txt;
    gameInfo.style.color = color;
}
