<template>
  <div class="home p-grid">
    <div
      v-for="article in articles"
      :key="article.title"
      class="p-col-3 article"
    >
      <img v-if="article.imageUrl" alt="user header" :src="article.imageUrl" />
      <p class="article-title">{{ article.title }}</p>
      <p>Scrappé : {{ moment(article.scrappedDate).calendar() }}</p>
      <a :href="article.url" target="_blank">Lien vers l'article</a>
    </div>

    <Paginator
      :rows="pageSize"
      :totalRecords="articlePage ? articlePage.totalDocs : 0"
      @page="($event) => loadPage($event.page)"
      class="p-col-12"
    ></Paginator>
  </div>
</template>

<script>
import Paginator from "primevue/paginator";

export default {
  name: "Home",
  components: { Paginator },
  inject: ["articleService", "moment"],
  data() {
    return {
      pageSize: 10,
      articlePage: null,
    };
  },
  created() {
    this.loadPage(0);
  },
  methods: {
    loadPage(page) {
      this.articleService
        .findAll(page, this.pageSize)
        .then((result) => (this.articlePage = result.data));
    },
  },

  computed: {
    articles() {
      return this.articlePage ? this.articlePage.docs : [];
    },
  },
};
</script>

<style scoped>
.article {
  border: 1px lightgray solid;
  border-radius: 10px;
}
.article-title {
  font-weight: bold;
  font-size: 1.25em;
}
</style>
