const profileImage = {
    template: `
            <div>
                <div class="profileImage">
                    <template v-if="this.userid">
                        <router-link :to="getImageLink">
                            <useravatar ref="avatar" :userid="userid" style="border: 0px"/>
                        </router-link>
                    </template>
                </div>
                
                <input type="file" ref="inputFile" accept="image/*" @change="loadImage" hidden>
                
                <template v-if="canedit">
                    <button class="mt-3 btn btn-primary btn-block" @click.prevent="onEditClick">
                        <i class="fas fa fa-edit"></i> Change Avatar
                    </button>
                    
                    <button class="mt-1 btn btn-danger btn-block" @click.prevent="deleteAvatar">
                        <i class="fas fa fa-trash"></i> Delete Avatar
                    </button>
                
                    <errorSuccessNotifier ref="notifier"></errorSuccessNotifier>
                
                </template>

            </div>     
`,
    data() {
        return {
        }
    },
    props: ['userid', 'canedit', 'onnewimage'],
    components: {
        'errorSuccessNotifier': errorSuccessNotifier,
        'useravatar': Useravatar
    },
    computed: {
        getImageLink: function () {
            if (
                this.$store &&
                this.$store.state &&
                this.$store.state.user &&
                this.$store.state.user._id === this.userid &&
                this.$route.name === "profile" &&
                this.$route.params.id ===  this.userid
            ) {
                return {
                    name: 'settings'
                };
            } else {
                return {
                    name: 'profile',
                    params: { id: this.userid }
                };
            }
        }
    },
    methods: {
        reload: function() {
            if(this.$refs.avatar) {
                this.$refs.avatar.reload();
            }
        },
        onEditClick: function() {
            this.$refs.inputFile.click();
        },
        deleteAvatar: function() {
            if(!confirm("Are you sure? Your profile image will be reset to default picture.")) {
                return;
            }
            this.onnewimage('', this.onSuccess, this.onError);
        },
        loadImage: function() {
            const img = this.$refs.inputFile.files[0];
            if(img) {
                if(img.size > 65536) {
                    alert("Image is too large. Maximum size is 64KB.");
                    return;
                }
                const reader = new FileReader();

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
            }

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