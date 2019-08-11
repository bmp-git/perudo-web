const Navbar = {
    template : `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary ">
	<router-link class="navbar-brand mb-0 h1" to="/">Perudo</router-link>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	  <span class="navbar-toggler-icon"></span>
	</button>
  
	<div class="collapse navbar-collapse" id="navbarSupportedContent">
	  <ul class="navbar-nav mr-auto">
		<li class="nav-item">
			<router-link class="nav-link" to="/games">Games</router-link>
		</li>
		<li class="nav-item">
				<router-link class="nav-link" to="/leaderboard">Leaderboard</router-link>
		</li>
	  </ul>
	  <ul class="navbar-nav ml-auto">
			<template v-if="this.$store.state.authenticated">
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						{{this.$store.state.user.username}}
					</a>
					<div class="dropdown-menu" aria-labelledby="navbarDropdown">
						<router-link class="dropdown-item" :to="{ name: 'profile', params: { id: this.$store.state.user._id }}">My profile</router-link>
						<router-link class="dropdown-item" to="/settings">Setting</router-link>
						<div class="dropdown-divider"></div>
						<router-link class="dropdown-item" to="/signout">Sign Out</router-link>
					</div>
				</li>
				<li class="nav-item">
					<router-link class="nav-link" to="/gamerules"><i class="fas fa-book"></i> Game Rules</router-link>
				</li>
			</template>
			<template v-else>
				<li class="nav-item">
					<router-link class="nav-link" to="/signup"><i class="fas fa-user-plus"></i> Sign Up</router-link>
				</li>
				<li class="nav-item">
					<router-link class="nav-link" to="/signin"><i class="fas fa-sign-in-alt"></i> Sign in</router-link>
				</li>
				<li class="nav-item">
					<router-link class="nav-link" to="/gamerules"><i class="fas fa-book"></i> Game Rules</router-link>
				</li>
			</template>
	</ul>
	</div>
  </nav>
    `
}