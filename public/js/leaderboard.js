const Leaderboard = { template: `<div class="container table-responsive">
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

<div class="row">
<table class="table table-hover">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Country</th>
      <th scope="col">Username</th>
      <th scope="col">Points</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
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
</div>` }