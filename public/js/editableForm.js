const editableForm = {
    template: `

        <div class="input-group mb-2 mt-2">
            <div class="input-group-prepend">
                <div class="input-group-text"><i v-bind:class="'fas fa-'+icon"></i></div>
            </div>
            <input v-model="value" v-bind:type="type" class="form-control" v-bind:placeholder="placeholder" v-bind:disabled="disabled">
            <div class="input-group-append">
                <div class="input-group-text"><a href="" title="edit" @click.prevent="toggle"><i v-bind:class="disabled ? 'fas fa fa-edit' : 'fas fa fa-check'"></i></a></div>
            </div>
        </div>


`,
    data() {
        return {
            oldValue: '',
            disabled: true
        }
    },
    props: ['icon', 'type', 'placeholder', 'value'],
    computed: {
    },
    methods: {
        toggle: function() {
            if(!this.disabled) {
                this.disabled = !this.disabled;
            } else {
                this.oldValue = this.value;
                this.disabled = !this.disabled;
            }
        }
    },
    filters: {
    },
    mounted: function () {
        console.log(this.value);
    }
};