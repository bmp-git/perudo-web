const Home = { template: `<div class="container">
                            <div class="row home-page">
                                <div class="col">
                                    <h1 v-show="welcome_animation != ''" v-bind:class="welcome_animation">Welcome</h1>
                                    <h1 v-show="to_animation != ''" v-bind:class="to_animation">
                                        <span v-bind:class="'dice home-dice dice-' + left_dice" v-bind:style="'transform: rotate('+left_dice_r+'deg)'" style="margin-bottom:-15px; margin-right:20px;"></span>
                                            to 
                                        <span v-bind:class="'dice home-dice dice-' + right_dice" v-bind:style="'transform: rotate('+right_dice_r+'deg)'" style="margin-bottom:-15px; margin-left:20px;"></span>
                                    </h1>
                                    <div v-show="perudo_animation != ''" v-bind:class="perudo_animation">
                                        <h1 class="perudo-title">Perudo.io</h1>
                                    </div>
                                </div>
                            </div>
                            <div class="row home-page">
                                <div v-show="button_animation != ''" class="col">
                                    <router-link to="/games" v-bind:class="button_animation" class="btn btn-home btn-outline-primary btn-lg"><i class="fas fa-dice"></i> Play</router-link>
                                </div>
                                <div v-show="button_animation != ''" class="col">
                                    <router-link to="/gamesrules" v-bind:class="button_animation" class="btn btn-home btn-outline-primary btn-lg"><i class="fas fa-book"></i> Rules</router-link>
                                </div>
                            </div>
                          </div>`,
 data() {
    return {
        welcome_animation: '',
        to_animation: '',
        perudo_animation: '',
        button_animation: '',
        left_dice : 1,
        right_dice : 6,
        left_dice_r : 0,
        right_dice_r : 0,
    }
 },
 methods: {
     reload: function () {
        this.welcome_animation = '';
        this.to_animation = '';
        this.perudo_animation =  '';
        this.button_animation = '';
        
        this.left_dice_r = Math.floor(360*Math.random())+1;
        this.right_dice_r = Math.floor(360*Math.random())+1;
        this.left_dice = Math.floor(6*Math.random())+1; 
        this.right_dice = Math.floor(6*Math.random())+1; 
    
        this.welcome_animation = 'animated bounceInLeft';
        setTimeout(() => this.to_animation = 'animated bounceInRight', 1000);
        setTimeout(() => this.perudo_animation = 'animated bounceInUp', 2000);
        setTimeout(() => this.button_animation = 'animated tada', 3000);
     }
 },
 mounted: function () {
     this.reload();
 },
 watch: {
    $route: function(to, from) {
        if(to.name === 'home') {
            this.reload();
        }
    }
 },
}