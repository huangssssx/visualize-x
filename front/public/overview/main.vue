<template>
    <div class="main">hello1 {{ world }}
    <child/>
    </div>
</template>

<script>
import child from './child.vue'
import { sayHello } from "./utils.js";

export default {
    components:{
        child
    },
    mounted(){
        debugger
        sayHello();

    }
}
</script>

<style scoped>
.main {
    border: 1px solid black;
    background: red;
}
</style>
