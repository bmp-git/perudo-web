const NotFound = { 
    template: `<div class="row">
        <div class="col-md-12">
            <div class="error-template">
                <h1>
                    Oops!</h1>
                <h2>
                    404 Not Found</h2>
                <div class="error-details">
                    Sorry, an error has occured, requested page not found!
                </div>
                <div class="error-actions">
                    <router-link class="btn btn-primary btn-lg" to="/"><span class="glyphicon glyphicon-home"></span> Take Me Home </router-link>
                </div>
            </div>
        </div>`
    
}