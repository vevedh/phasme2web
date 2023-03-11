<template>
    <div>

        <transition name="fade">

            <div class="loading-bar" v-show="show">

                <div class="inner" :style="styles"></div>

            </div>

        </transition>

    </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  data () {
        return {
            show: false,
            status: 'success',
            percent: 0,
            color: '#2d8cf0',
            failedColor: '#ed3f14'
        }
    },
    computed: {
        styles () {
            let style = {
                width: `${this.percent}%`
            }
            if (this.status === 'success') {
                style.backgroundColor = this.color
            }
            if (this.status === 'error') {
                style.backgroundColor = this.failedColor
            }
            return style
        }
    },
    methods: {
        showProgress (show) {
            this.show = show
        },
        start () {
            this.showProgress(true)
            this.percent = 0
        },
        stop () {
             this.percent = 100
            setTimeout(() => {
                this.showProgress(false)
            }, 1500)
        }
}
})
</script>

