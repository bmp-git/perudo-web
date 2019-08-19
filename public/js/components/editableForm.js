const editableForm = {
    template: `

        <div>
            <template v-if="label">
                    <label class="control-label" :for="this._uid">{{label}}</label>
            </template>
            <div class="input-group mb-2">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i v-bind:class="'fas fa-'+icon"></i></div>
                </div>
                <input :id="this._uid" v-model="value" v-bind:type="type" class="form-control" v-bind:placeholder="placeholder" v-bind:disabled="disabled">
                <div class="input-group-append">
                    <div class="input-group-text"><a href="" title="edit" @click.prevent="toggle"><i v-bind:class="disabled ? 'fas fa fa-edit' : 'fas fa fa-check'"></i></a></div>
                </div>
            </div>
            
            <errorSuccessNotifier ref="notifier"></errorSuccessNotifier>
        </div>

`,
    components: {
        'errorSuccessNotifier': errorSuccessNotifier
    },
    data() {
        return {
            oldValue: '',
            disabled: true
        }
    },
    props: ['icon', 'type', 'placeholder', 'value', 'onchangeconfirm', 'label'],
    computed: {
    },
    methods: {
        toggle: function() {
            if(!this.disabled) {
                if(this.oldValue === this.value) {
                    this.disabled = true;
                    return;
                }
                if (this.value === '') {
                    this.$refs.notifier.showError("The form is empty!");
                    return;
                }

                this.$emit('update:value', this.value);
                this.onchangeconfirm(this.value, this.onSuccess, this.onError);

            } else {
                this.oldValue = this.value;
                this.disabled = false;
            }
        },
        onSuccess: function(message) {
            this.disabled = true;
            this.$refs.notifier.showSuccess(message);
        },
        onError: function (message) {
            this.$refs.notifier.showError(message);
        }
    },
    filters: {
    },
    mounted: function () {
        console.log(this.value);
    }
};