const Gamerules = {
    template: `
    <div class="container text-center mt-3 mb-5 col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
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
    player who made the bid. If the bid is on the aces, all aces are counted.</p>

    <p class="h4 text-primary mt-5">Example</p>
    <p>There are three players with this dice: </p>
    <h5>Bill <span class="dice dice-2 mr-1"></span><span class="dice dice-4 mr-1"></span><span class="dice dice-4 mr-1"></span><span class="dice dice-5 mr-1"></span><span class="dice dice-6"></span></h5>
    <h5>Turner <span class="dice dice-1 mr-1"></span><span class="dice dice-2 mr-1"></span><span class="dice dice-3 mr-1"></span><span class="dice dice-6 mr-1"></span><span class="dice dice-6"></span></h5>
    <h5>Jones <span class="dice dice-1 mr-1"></span><span class="dice dice-1 mr-1"></span><span class="dice dice-3 mr-1"></span><span class="dice dice-3 mr-1"></span><span class="dice dice-5"></span></h5>
    <p>Every player see only his dice.</br>The round starts and it's Bill's turn. Bill try to bluff and <b>bids 3 dice of <span class="dice dice-3"></span></b>.</br>
    Now it's Turner's turn, he's not sure about Bill's bid and changes dice, he <b>bids 4 dice of <span class="dice dice-6"></span></b> hoping the other two have at least one <span class="dice dice-6"></span> in cases Jones doubt</br>
    Jones think that the bid is corrent and doesn't want to doubt, thanks to Bill's bid and his own dice he think there are many <span class="dice dice-3"></span> and <b>bids 6 dice of <span class="dice dice-3"></span></b></br>
    Bill knows that Jones's bid is based on his initial bluff, therefore he <b>Doubts</b>.</br>
    The count of dice is: </p>
    <h5>Bill <span class="dice dice-2 mr-1"></span><span class="dice dice-4 mr-1"></span><span class="dice dice-4 mr-1"></span><span class="dice dice-5 mr-1"></span><span class="dice dice-6"></span></h5>
    <h5>Turner <span class="dice dice-1 mr-1"></span><span class="dice dice-2 mr-1"></span><span style="background-color: red;" class="dice dice-3 mr-1"></span><span class="dice dice-6 mr-1"></span><span class="dice dice-6"></span></h5>
    <h5>Jones <span style="background-color: red;" class="dice dice-1 mr-1"></span><span style="background-color: red;" class="dice dice-1 mr-1"></span><span style="background-color: red;" class="dice dice-3 mr-1"></span><span style="background-color: red;" class="dice dice-3 mr-1"></span><span class="dice dice-5"></span></h5>
    <p>There are only 5 dice of <span class="dice dice-3 mr-1"></span>! Jones loses a die.</br>A new round starts and it's Jones's turn...</p>

    <h1 class="mt-5">Interface tutorial</h1>
    In this section are explained some of the principal component to interact with the games. In order to play you must be signed-in, if you haven't yet please take a 
    moment to <router-link to="/signup">sign-up</router-link> or <router-link to="/signin">sign-in</router-link>.

    <p class="h5 text-primary mt-5">Games</p>

    <p>In <router-link to="/games">games</router-link> section you will see all games. You can join a game not started by clicking on <button type="button" class="btn btn-primary btn-sm mt-1">Join</button>
     or specatate a started game with the button <button type="button"class="btn btn-secondary btn-sm mt-1"">Spectate</button>
    </br>In order to create your own game you can press the plus button on bottom right of the page <button type="button" class="btn btn-primary btn-circle" aria-label="Create new game"><i class="fas fa-plus"></i></button>
    and compiling the "new game" form.</br>
    If you are the owner of the lobby (a game not started) you can start it when there are at least two players with the button <button type="button" class="btn btn-primary btn-sm mt-1">Start game!</button></br>
    Inside a lobby you can chat with the players using the chat at the bottom of the page.</p>
    
    
    
    <p class="mt-5">When a game is started you will be redirected to the game page. Now will be described some in-game components in order to help you make the first steps.</p>
    
    <p class="h5 text-primary mt-5">Turn time</p>
    <p>This progress bar indicates how much time is left to play.
    Don't worry to much if the color of the bar is gray, it means that is not your turn...</p>
    <div class="progress" style="margin-bottom:16px">
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-secondary" style="width: 100%;">10</div>
    </div>
    <p>But pay attention.. when the bar is blue it's your time!</p>
    <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%">10</div>
    </div>

    <p class="h5 text-primary mt-5">Player turn</p>

    <p>This component is essential in order to see how many dice each player has and which player is the turn.
     To distinguish yourself from the others your name is "You" and your avatar border is blue.
     To indicate which player is the turn there is a little arrow under the name it pulse infinitely.</p>
     <p> In the example below, it's your turn and currently you have 1 dice more then your opponent. </p>
    <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 pl-0 pr-0"><div class="row justify-content-around">
        <div class="animated pulse infinite slow">
            <div class="row d-flex justify-content-center">5 dice</div> 
            <div class="row d-flex justify-content-center">
                <a href="#"><img alt="User avatar" src="/static/img/avatar.png" title="Online" class="useravatar" style="opacity: 1;"></a>
            </div> 
            <div class="row d-flex justify-content-center">
                <a href="#" class=""> You </a>
            </div> 
            <div class="row d-flex justify-content-center">
                <i class="fas fa-chevron-up"></i>
            </div>
        </div>
        <div>
            <div class="row d-flex justify-content-center">4 dice</div> 
            <div class="row d-flex justify-content-center">
                <a href="#"><img alt="User avatar" src="/static/img/avatar.png" title="Online" class="useravatar" style="opacity: 1;border: 2px solid #AAAAAA"></a>
            </div> 
            <div class="row d-flex justify-content-center">
                <a href="#" class=""> Worthy opponent </a>
            </div> 
        </div>
    </div>
    </div>
    
    <p class="h5 text-primary mt-5">Bid</p>

    <p>When is your turn you can select a bid with the bid selector: press +/- to increse or decrease the quantity and use the scroll to select the wanted dice.<br>
    The selector will help you by setting the minimum quantity that you can bid when selecting a different dice (in this case always to one).</p>

    <diceSelector v-bind:bid.sync="this.bid" v-bind:game="game"/>

    <p><i> Selected bid: {{bid.quantity}} dice of <span v-bind:class="'dice dice-'+bid.dice+' ml-1'"></span> </i></p>

    <p class="h5 text-primary mt-5">Game buttons</p>
    <p>In order to play there is a button for each game action discussed in the section about the game rules.
    These buttons are enabled according to these rules. The bid button make the bid selected in the previous component.</p>
    <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 pl-0 pr-0">
        <div class="row d-flex justify-content-around">
            <button type="button" class="btn btn-primary ml-1 mr-1">Bid</button>
            <button type="button" class="btn btn-primary ml-1 mr-1">Doubt</button>
            <button type="button" class="btn btn-primary ml-1 mr-1" disabled>Spot on</button>
            <button type="button" class="btn btn-primary ml-1 mr-1">Palifico</button>
        </div>  
    </div>
    
    </div>`,
    components: {
        'diceSelector': diceSelector,
        'gameButtons': GameButtons
    },
    data() {
        return {
            game: {
                current_bid: null,
                is_palifico_round: false,
                round: 1,
                turn_time: 30,
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