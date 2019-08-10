const Leaderboard = { template: `<div class="container">
<hr class="hr-text" data-content="Global leaderboard">

<div class="row">
    <div class="col-md-12">
                <label> Show players
                <select class="custom-select custom-select-sm">
                    <option selected value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </label>
    </div>
</div>
<div class="container table-responsive">
<div class="row ">
<table class="table table-hover">
  <thead>
    <tr>
      <th scope="col">#</th>
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
                        <img v-bind:src="avatar_url(user.id)" class="ig-avatar" width="32px" height="32px" style="object-fit: cover; border-radius: 50%; border: 2px solid #007BFF;">
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
    <p>Showing 1 to 10 of 1000 players</p>
</div>
<div class="col-sm-7 col-md-7">
        <ul class="pagination float-right">
        <li class="page-item disabled">
        <a class="page-link" href="#" tabindex="-1" aria-disabled="true"><i class="fas fa-chevron-left"></i></a>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
        <a class="page-link" href="#"><i class="fas fa-chevron-right"></i></a>
        </li>
        </ul>
    </div>
</div>
</div>`,
data() {
    return {
        page : 1,
        page_lenght : 10,
        total : 0,
        users: []
    }
 },
 methods: {
     reload: function() {
        axios.get("/api/leaderboard", { params: { page : this.page, pageLenght : this.page_lenght } })
            .then(response => {
                this.users = response.data.result;
                this.total = response.data.total;
            })
            .catch(error => {
                console.log(error.data);
            });
    },
    avatar_url: function(user_id) {
        return "/api/users/" + user_id + "/avatar";
    }
 },
 mounted: function () {
    this.reload();
 }
}