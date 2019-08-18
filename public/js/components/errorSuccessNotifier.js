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
            showTimeSpan: 5000,
            old_timeout: null
        }
    },
    computed: {
    },
    methods: {
        showError: function(message, timeout = this.showTimeSpan) {
            if(this.old_timeout) {
                clearTimeout(this.old_timeout);
            }
            this.show_success = false;
            this.error_message = message;
            this.show_error = true;
            if(timeout !== null) {
                this.old_timeout = setTimeout(() => {
                    this.disappear();
                }, timeout);
            }
        },
        showPersistentError: function(message) {
            if(this.old_timeout) {
                clearTimeout(this.old_timeout);
            }
            this.showError(message, null);
        },
        disappear: function() {
            this.show_success = false;
            this.error_success = "";
            this.show_error = false;
            this.error_message = "";
        },
        showSuccess: function(message, timeout = this.showTimeSpan) {
            if(this.old_timeout) {
                clearTimeout(this.old_timeout);
            }
            this.show_error = false;
            this.success_message = message;
            this.show_success = true;
            if(timeout !== null) {
                this.old_timeout = setTimeout(() => {
                    this.disappear();
                }, timeout);
            }
        },
        showPersistentSuccess: function(message) {
            if(this.old_timeout) {
                clearTimeout(this.old_timeout);
            }
            this.showSuccess(message, null);
        },
    },
    filters: {
    },
    mounted: function () {

    }
};