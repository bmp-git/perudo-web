const Crud = { 
	template: `<div class="container-fluid"> <div class="row">
                    <div class="col">
                        <button @click.prevent="showAddMovie" type="button" class="btn btn-success"><i class="fas fa-plus"></i> Add Movie</button>
                    </div>
                </div>
                <div class="row" v-if="adding">
                    <div class="col">
                        <form>
                            <div class="form-group">
                                <label for="title">Title</label>
                                <input v-model="new_movie.title" type="text" class="form-control" id="title" placeholder="Enter title">
                            </div>
                            <div class="form-group">
                                <label for="overview">Overview</label>
                                <textarea v-model="new_movie.overview"  class="form-control" id="overview">
                                </textarea>
                            </div>
                            <div class="form-group">
                                <label for="homepage">Homepage</label>
                                <input v-model="new_movie.homepage" type="text" class="form-control" id="homepage" placeholder="Enter homepage link">
                            </div>
                            <div class="form-group">
                                <label for="poster">Poster link</label>
                                <input v-model="new_movie.poster_path" type="text" class="form-control" id="poster" placeholder="Enter poster link">
                                <img v-bind:src=new_movie.poster_path alt="" />
                            </div>
                            <div class="form-group">
                                <label for="release">Release date</label>
                                <input v-model="new_movie.release_date" type="date" class="form-control" id="release" >
                            </div>
                            <button @click.prevent="addMovie" type="submit" class="btn btn-primary">Submit</button>
                            <button @click.prevent="cancelAddMovie" type="submit" class="btn btn-danger">Cancel</button>
                            
                        </form>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                    <table class="table responsive">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Overview</th>
                                <th scope="col">Homepage</th>
                                <th scope="col">Poster</th>
                                <th scope="col">Release date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="movie in movies" :key="movies._id">
                                <td>{{ movie.title|uppercase }}</td>
                                <td>{{ movie.overview }}</td>
                                <td>{{ movie.homepage }}</td>
                                <td><img v-bind:src=movie.poster_path alt="" /></td>
                                <td>{{ movie.release_date | limit(10) }}</td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-primary">
                                        <i class="fas fa-pen"></i>
                                    </button>
                                    <button @click.prevent="deleteMovie(movie._id)" type="button" class="btn btn-sm btn-danger">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div> </div>`,
data() {
    return {
      movies: [],
      new_movie: {
                  "title" : "", 
                  "overview" : "", 
                  "homepage" : "", 
                  "poster_path" : "", 
                  "release_date" : new Date().toISOString().slice(0,10), 
      },
      adding: false
    }
  },
  methods: {
      listMovies: function () {
        axios.get("http://localhost:3000/api/movies")
          //.then(response => (console.log(response.data)))
          .then(response => (this.movies = response.data))
          .catch(error => (console.log(error)));
          
      },
      addMovie: function(){
          console.log(this.new_movie);
          axios.post('http://localhost:3000/api/movies', this.new_movie)
              //.then(response => (console.log(response.data)))
              .then(response => {
                  this.movies.push(response.data);
                  this.cancelAddMovie();
              })
              .catch(error => (console.log(error)));
      },
      showAddMovie: function(){
          this.adding = true;
          console.log(typeof(this.movies[0].release_date));
      },
      cancelAddMovie: function(){
          this.adding = false;
          this.resetNewMovie();
      },
      deleteMovie: function(_id){
          console.log(_id);
          axios.delete('http://localhost:3000/api/movies/'+_id)
              //.then(response => (console.log(response.data)))
              .then(response => {
                  console.log("cancellato!");
                  this.movies.splice(this.movies.findIndex(item => item._id === _id), 1)
              })
              .catch(error => (console.log(error)));
      },
      resetNewMovie: function(){
          this.new_movie = {
                  "title" : "", 
                  "overview" : "", 
                  "homepage" : "", 
                  "poster_path" : "", 
                  "release_date" : new Date(), 
                  }
      },
      init: function(){
          this.listMovies();
      }
  },
  mounted(){
      this.init()
  },
  filters: {
      limit: function(text, length) {
          return text.substring(0, length); }
  }
}