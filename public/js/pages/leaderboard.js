const Leaderboard = {
    template: `
        <div>
            <header class="sr-only">Global leaderboard</header>
            <main>
                <div class="container">
                    <hr class="hr-text" data-content="Global leaderboard">
                    
                    <div class="row">
                        <div class="col-md-12">
                                    <label> Show players
                                    <select class="custom-select custom-select-sm" v-model="page_lenght" v-on:change="changePageLenght">
                                        <option>3</option>
                                        <option>10</option>
                                        <option>25</option>
                                    </select>
                                </label>
                        </div>
                    </div>
                    <div class="container table-responsive" style="overflow-y: hidden;">
                    <div class="row ">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th scope="col">Rank</th>
                          <th scope="col">Username</th>
                          <th scope="col">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="user in users">
                            <tr>
                                <th scope="row">{{user.rank}}</th>
                                <td>
                                    <router-link :to="{ name: 'profile', params: { id: user.id }}">
                                    <useravatar :userid="user.id" style="width: 32px; height: 32px; border-width: 1px;"/>
                                    </router-link>
                                    <router-link :to="{ name: 'profile', params: { id: user.id }}">
                                    {{user.username}}
                                    </router-link>
                                </td>
                                <td>{{user.points}}</td>
                            </tr>
                        </template>
                      </tbody>
                    </table>
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-sm-5 col-md-5">
                        <p><i>Showing {{firstUser}} to {{lastUser}} of {{total}} players</i></p>
                    </div>
                    <div class="col-sm-7 col-md-7">
                            <ul class="pagination float-right">
                            <li class="page-item" v-bind:class="page == 1 ? 'disabled' : ''">
                                <a class="page-link" @click.prevent="changePage(page-1)" tabindex="-1" aria-disabled="true" style="cursor: pointer">
                                    <i class="fas fa-chevron-left"></i>
                                </a>
                            </li>
                            <template v-if="pages <= 5">
                                <template v-for="n in pages">
                                <li class="page-item" v-bind:class="n == page ? 'active' : ''">
                                    <a class="page-link" @click.prevent="changePage(n)" style="cursor: pointer">{{n}}</a>
                                </li>
                                </template>
                            </template>
                            <template v-else>
                                <template v-for="n in pages">
                                <template v-if="n == 1 || n == page || n == pages">
                                    <li class="page-item" v-bind:class="n == page ? 'active' : ''">
                                        <a class="page-link" @click.prevent="changePage(n)" style="cursor: pointer">{{n}}</a>
                                    </li>
                                </template>
                                <template v-else-if="n == page + 1 || n == page - 1">
                                    <li class="page-item disabled"> <a class="page-link">...</a></li>
                                </template>
                                </template>
                            </template>
                            <li class="page-item" v-bind:class="lastPage ? 'disabled' : ''">
                                <a class="page-link" @click.prevent="changePage(page+1)" style="cursor: pointer">
                                    <i class="fas fa-chevron-right"></i>
                                </a>
                            </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
`,
    data() {
        return {
            page: 1,
            page_lenght: 10,
            total: 0,
            users: []
        }
    },
    components: {
        'useravatar': Useravatar
    },
    watch: {
        $route: function(to, from) {
            if(to.name === 'leaderboard') {
                this.reload();
            }
        }
    },
    methods: {
        reload: function () {
            axios.get("/api/leaderboard", { params: { page: this.page, pageLenght: this.page_lenght } })
                .then(response => {
                    this.users = response.data.result;
                    this.total = response.data.total;
                })
                .catch(error => {
                    console.log(error.data);
                });
        },
        changePageLenght: function () {
            this.page = 1;
            this.reload();
        },
        changePage: function (n) {
            this.page = n;
            this.reload();
        }
    },
    computed: {
        lastUser: function () {
            return this.firstUser + Object.keys(this.users).length - 1;
        },
        firstUser: function () {
            return (this.page - 1) * this.page_lenght + 1;
        },
        lastPage: function () {
            return this.lastUser == this.total;
        },
        pages: function () {
            return Math.ceil(this.total / this.page_lenght);
        }
    },
    mounted: function () {
        this.reload();
    }
}