const profileImageSelector = {
    template: `
            <div>
                <div class="profile-pic">
                    <img v-bind:src="imageURL" height="160" width="160" style="object-fit: cover;"/>
                    <div class="edit"><a href="#" @click.prevent="onEditClick"><i class="fas fa fa-edit"></i></a></div>
                </div>
                <input type="file" ref="inputFile" @change="loadImage" single hidden>
                <errorSuccessNotifier ref="notifier"></errorSuccessNotifier>
            </div>     
`,
    data() {
        return {
            imageURL: '/api/users/' + this.$store.state.user._id + '/avatar'
        }
    },
    props: ['onnewimage'],
    components: {
        'errorSuccessNotifier': errorSuccessNotifier
    },
    computed: {
    },
    methods: {
        onEditClick: function() {
            this.$refs.inputFile.click();
        },
        loadImage: function() {
            const img = this.$refs.inputFile.files[0];
            const reader  = new FileReader();

            reader.onloadend = () => {
                this.onnewimage(reader.result, this.onSuccess, this.onError);
            };

            reader.onabort = () => {
                this.$refs.notifier.showError("Error during file reading! (Aborted).");
            };

            reader.onerror = () => {
                this.$refs.notifier.showError("Error during file reading!");
            };

            reader.readAsDataURL(img);

        },
        onSuccess: function(message) {
            this.$refs.notifier.showSuccess(message);
            this.imageURL = this.imageURL + ' '; //workaround to reload image
        },
        onError: function (message) {
            this.$refs.notifier.showError(message);
        }

    },
    filters: {
    },
    mounted: function () {

    }
};