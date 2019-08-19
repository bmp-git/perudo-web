const Gamerules = {
    template: `
    <div class="container text-center mt-3">
    <p class="h1">Game rules</p>
    <p>Perudo is a dice game. The object of perudo is to be the last player with a die or more.</p>

    <p class="h5 text-primary mt-5">Introduction</p>

    <p>Perudo is played in rounds. Each player receives five dice. Each round begins by rolling all dice (automatically shaked by the game). After shaking the dice, 
    a new round is started and each player can peek his own dice. </br>

    Players bid, guessing at the number of rolls. When a player believes that another player has over-estimated, they can doubt. </br>
    
    The player who lost a die in the last round is the first player in the new round. If the player lost his last die, then the player to his right plays first instead.</p>
    
    <p class="h5 text-primary mt-5">Bid</p>
    
    <p>The first player announces a number, and then the next player has the choice of doubting it, by saying Doubt or raising the bid, either by the number of dice or by the 
    value of the dice. (or by doing both) For example, if player 1 bid three twos, then player two could bid three threes, four twos, four fours, or even ten sixes.</br>

    Players may bid Aces (<span class="dice dice-1"></span>) in a round, and halve the previous number announced. If the number does not halve, they 
    should round up. The next player will need to bid more aces or to bid one more than double the number bid in order to bid a different number.</p>
    
    
    <p class="h5 text-primary mt-5">Doubt</p>
    
    <p>If a player call Doubt all the players show their dice to verify whether the number was indeed too high. If there are enough dice of that number, then the player who 
    Doubted lose a die. If there are not, then the player who made the last bid is the one who lose a die. In either case, a new round begins.</p>
    
    
    <p class="h5 text-primary mt-5">Palifico</p>
    
    <p>If a player remains with one die, once per game he can call Palifico. He will be the one who do the first bid and the die that he select cannot be changed.</p>
     
    
    <p class="h5 text-primary mt-5">Spoton</p>
    
    <p>If a player has less than five dice, he can 'Spoton'. This is valid only when it's not your turn and you don't made the current bid. After call spoton all players 
    reveal their dice and if the bid is exact the one who spoton win a die, otherwise loses one. In either case, a new round begins.</p>
    
    
    <p class="h5 text-primary mt-5">Counting dice</p>
    
    <p>When someone Doubt or Spoton on a bid the dice are counted following this rules: all die within the bid are counted, and the aces are added to the sum only for the 
    player who made the bid. If the bid is one the aces, all aces are counted.</p>

    <p class="h4 text-primary mt-5">Example</p>
    <p>There are three players with this dice: </p>
    <h5>Bill <span class="dice dice-2 mr-1"></span><span class="dice dice-4 mr-1"></span><span class="dice dice-4 mr-1"></span><span class="dice dice-5 mr-1"></span><span class="dice dice-6"></span></h5>
    <h5>Turner <span class="dice dice-1 mr-1"></span><span class="dice dice-2 mr-1"></span><span class="dice dice-3 mr-1"></span><span class="dice dice-6 mr-1"></span><span class="dice dice-6"></span></h5>
    <h5>Jones <span class="dice dice-1 mr-1"></span><span class="dice dice-1 mr-1"></span><span class="dice dice-3 mr-1"></span><span class="dice dice-3 mr-1"></span><span class="dice dice-5"></span></h5>
    <p>Every player see only his dice.</br>The round starts and it's Bill's turn. Bill try to bluff and <b>bids 3 dice of <span class="dice dice-3"></span></b>.</br>
    Now it's Turner's turn, he's not sure about Bill's bid and changes dice, he <b>bids 4 dice of <span class="dice dice-6"></span></b> hoping the other two have at least one <span class="dice dice-6"></span> in cases Jones doubt</br>
    Jones think that the bid is corrent and doesn't want to doubt, according to Bill's bid he think there are many <span class="dice dice-3"></span> and <b>bids 6 dice of <span class="dice dice-3"></span></b></br>
    Bill knows that Jones's bid is based on his initial bluff, therefore he <b>Doubts</b>.</br>
    The count of dice is: </p>
    <h5>Bill <span class="dice dice-2 mr-1"></span><span class="dice dice-4 mr-1"></span><span class="dice dice-4 mr-1"></span><span class="dice dice-5 mr-1"></span><span class="dice dice-6"></span></h5>
    <h5>Turner <span class="dice dice-1 mr-1"></span><span class="dice dice-2 mr-1"></span><span style="background-color: red;" class="dice dice-3 mr-1"></span><span class="dice dice-6 mr-1"></span><span class="dice dice-6"></span></h5>
    <h5>Jones <span style="background-color: red;" class="dice dice-1 mr-1"></span><span style="background-color: red;" class="dice dice-1 mr-1"></span><span style="background-color: red;" class="dice dice-3 mr-1"></span><span style="background-color: red;" class="dice dice-3 mr-1"></span><span class="dice dice-5"></span></h5>
    <p>There are only 5 dice of <span class="dice dice-3 mr-1"></span>! Jones loses a die.</br>A new round starts and it's Jones's turn...</p>

    <p class="h4 text-primary mt-5">Interface tutorial</p>
    <diceSelector bid="bid" game="game"/>
    </div>`,
    components: {
        'diceSelector': diceSelector,
    },
    data() {
        return {
            game: {
                current_bid: null,
                is_palifico_round: false,
                round: 1,
            },
            bid: {
                quantity: 1,
                dice: 1
            }
        }
    },
    methods: {

    },
    mounted: function () {

    },

};