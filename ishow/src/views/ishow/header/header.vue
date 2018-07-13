<template>
    <div class="ishow-headerWrapper">
        <header class="header">
            iShow
            <navbar :show-id='showId' :render-json="renderJson" :show-json="showJson"></navbar>
            <statusButton :show-json="showJson" :page-json="pageJson" :page="page" :h5-json="h5Json"></statusButton>
        </header>
    </div>
</template>
<script>
import navbar from './navbar.vue';
import statusButton from './button.vue';
export default {
  data() {
    return {
      active: ''
    };
  },
  props: ['showId', 'showJson', 'pageJson', 'renderJson', 'page', 'h5Json'],
  components: {
    navbar,
    statusButton
  }

};
</script>
