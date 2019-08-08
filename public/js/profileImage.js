const profileImage = {
    template: `
            <div>
                <div class="profileImage">
                    <img v-bind:src="imageURL"/>
                </div>
                
                <input type="file" ref="inputFile" @change="loadImage" single hidden>
                
                <template v-if="canedit">
                    <button class="mt-1 btn btn-primary btn-block" @click.prevent="onEditClick">
                        <i class="fas fa fa-edit"></i>Change Avatar
                    </button>
                
                    <errorSuccessNotifier ref="notifier"></errorSuccessNotifier>
                
                </template>

            </div>     
`,
    data() {
        return {
            imageURL: '/api/users/' + this.userid + '/avatar',
        }
    },
    props: ['userid', 'canedit', 'onnewimage'],
    components: {
        'errorSuccessNotifier': errorSuccessNotifier
    },
    computed: {
    },
    methods: {
        reload: function() {
            this.imageURL = this.imageURL + ' '; //workaround to reload image
        },
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
            this.reload();
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