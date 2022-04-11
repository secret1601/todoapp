<template>
    <h1>{{apptitle}}</h1>
</template>

<script>
export default ({
    // props: ['apptitle']
    props: {
        apptitle: {
            type: String,
            requierd: true
        }
    }
})
</script>

<style>
</style>