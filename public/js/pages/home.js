const Home = {
    template: `<div class="container" style="overflow: hidden;" v-on:click="stopAnimation">
                            <div class="row home-page">
                                <div class="offset-md-3 col-md-6 col-12">
                                    <h1 class="unselectable" v-show="welcome_animation != ''" v-bind:class="welcome_animation">Welcome</h1>
                                    <h1 v-show="to_animation != ''" v-bind:class="to_animation"><p>
                                        <span @click.prevent="randomize_dice" v-bind:class="'dice dice-' + left_dice" v-bind:style="'transform: rotate('+left_dice_r+'deg); transition-duration: '+transition_duration+'s'" style="margin-bottom:-15px;cursor: pointer">
                                        </span><span class="unselectable " style="margin-left:20px; margin-right:20px"> to
                                        </span><span @click.prevent="randomize_dice" v-bind:class="'dice dice-' + right_dice" v-bind:style="'transform: rotate('+right_dice_r+'deg); transition-duration: '+transition_duration+'s'" style="margin-bottom:-15px;cursor: pointer"></span>
                                    </p></h1>
                                    <div class="unselectable" v-show="perudo_animation != ''" v-bind:class="perudo_animation">
                                        <h1 class="perudo-title">Perudo.io</h1>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="offset-md-3 col-md-6 col-12 d-flex justify-content-center">
                                    <router-link to="/games" v-show="button_animation != ''" v-bind:class="button_animation" class="btn btn-home btn-outline-primary btn-lg mr-4"><i class="fas fa-dice"></i> Play</router-link>
                                    <router-link to="/gamerules" v-show="button_animation != ''" v-bind:class="button_animation" class="btn btn-home btn-outline-primary btn-lg ml-4"><i class="fas fa-book"></i> Rules</router-link>
                                </div>
                            </div>
                            <template v-if="online_users_animation != ''">
                            <div class="row home-page mt-5" v-bind:class="online_users_animation">
                                <div class="offset-md-3 col-md-6 col-12 d-flex justify-content-center">
                                <hr class="hr-text mb-4 mt-5" style="width:270px;" data-content="Online users">
                                </div>
                            </div>
                            
                            <div class="row home-page mb-5" v-bind:class="online_users_animation">
                                <div class="offset-md-3 col-md-6 col-12 d-flex justify-content-center">
                                    <template v-for="user in $store.state.online_users">
                                        <div class="ml-2 mr-2">
                                            <h6 class="text-center">
                                                <router-link :to="{ name: 'profile', params: { id: user.id }}">
                                                    <useravatar :userid="user.id" style="width: 32px; height: 32px; border-width: 1px;"/></br>
                                                    <i><username :userid="user.id"/></i>
                                                 </router-link>
                                            </h6>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            </template>
                            </div>
                        </div>`,
    data() {
        return {
            welcome_animation: '',
            to_animation: '',
            perudo_animation: '',
            button_animation: '',
            online_users_animation: '',
            left_dice: 1,
            right_dice: 6,
            left_dice_r: 0,
            right_dice_r: 0,
            animation: [],
            transition_duration: 0.0
        }
    },
    components: {
        'username': Username,
        'useravatar': Useravatar
    },
    methods: {
        reload: function () {
            this.welcome_animation = '';
            this.to_animation = '';
            this.perudo_animation = '';
            this.button_animation = '';
            this.online_users_animation = '';
            this.randomize_dice();

            this.welcome_animation = 'animated bounceInLeft';
            this.animation.push(setTimeout(() => this.to_animation = 'animated bounceInRight', 1000));
            this.animation.push(setTimeout(() => this.perudo_animation = 'animated bounceInUp', 2000));
            this.animation.push(setTimeout(() => this.button_animation = 'animated tada', 3000));
            this.animation.push(setTimeout(() => this.online_users_animation = 'animated fadeIn', 4000));
        },
        stopAnimation: function () {
            this.animation.forEach(timeout => {
                clearTimeout(timeout);
            });
            this.welcome_animation = ' ';
            this.to_animation = ' ';
            this.perudo_animation = ' ';
            this.button_animation = ' ';
            this.online_users_animation = ' ';
        },
        randomize_dice: function () {
            this.transition_duration = 0.0;
            this.left_dice = Math.floor(6 * Math.random()) + 1;
            this.right_dice = Math.floor(6 * Math.random()) + 1;

            setTimeout(() => {
                this.transition_duration = 0.5;
                this.left_dice_r = Math.floor(360 * Math.random()) + 1;
                this.right_dice_r = Math.floor(360 * Math.random()) + 1;
            }, 10);
        }
    },
    mounted: function () {
        this.reload();
    },
    watch: {
        $route: function (to, from) {
            if (to.name === 'home') {
                this.reload();
            }
        }
    },
}