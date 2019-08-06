const errorSuccessNotifier = {
    template: `
        <div>
            <small class="text-danger" v-if="show_error">
                {{error_message}}
            </small>
            <small class="text-success" v-if="show_success">
                {{success_message}}
            </small>        
        </div>
`,
    data() {
        return {
            show_error: false,
            show_success: false,
            error_message: "",
            success_message: "",
            showTimeSpan: 5000
        }
    },
    computed: {
    },
    methods: {
        showError: function(message, timeout = this.showTimeSpan) {
            this.error_message = message;
            this.show_error = true;
            if(timeout !== null) {
                setTimeout(() => {
                    this.show_error = false;
                    this.error_message = "";
                }, this.showTimeSpan);
            }
        },
        showPersistentError: function(message) {
            this.showError(message, null);
        },
        showSuccess: function(message, timeout = this.showTimeSpan) {
            this.success_message = message;
            this.show_success = true;
            if(timeout !== null) {
                setTimeout(() => {
                    this.show_success = false;
                    this.success_message = "";
                }, this.showTimeSpan);
            }
        },
        showPersistentSuccess: function(message) {
            this.showSuccess(message, null);
        },
    },
    filters: {
    },
    mounted: function () {

    }
};