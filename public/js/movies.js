const Movies = { 
	template: `<div class="row">
		<div class="col">
			<div class="card" v-for="movie in movies" :key="movies._id">
				<div class="row no-gutters">
					<div class="col-md-4">
						<img v-bind:src=movie.poster_path class="card-img" alt="">
					</div>
					<div class="col-md-8">
						<div class="card-body">
							<h5 class="card-title">{{ movie.title }}</h5>
							<p class="card-text">{{ movie.overview }}</p>
							<p class="card-text"><a v-bind:href=movie.homepage>Official Website</a></p>
							<p class="card-text">Release date: {{ movie.release_date | limit(10) }}</p>

						</div>
					</div>
				</div>
			</div>		
		</div>
	</div>`,
	data() {
		return {
		movies: []
		}
	},
	methods: {
		listMovies: function () {
			axios.get("http://localhost:3000/api/movies")
			//.then(response => (console.log(response.data)))
			.then(response => (this.movies = response.data))
			.catch(error => (console.log(error)));
			
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
			return text.substring(0, length); 
		}
	},

}