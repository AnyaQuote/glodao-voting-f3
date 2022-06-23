<template>
  <v-sheet v-if="noContent" class="row no-gutters">
    <div class="d-none d-sm-none d-md-block col-3 pr-4">
      <v-skeleton-loader boilerplate type="image" />
    </div>
    <div class="col-9">
      <v-skeleton-loader boilerplate type="image, image, image" />
    </div>
  </v-sheet>
  <v-sheet v-else class="markdown-container">
    <main :class="wrapperClass">
      <div id="markdown-aside" class="d-none d-sm-none d-md-block markdown-sticky mt-3"></div>
      <div id="markdown-content"></div>
    </main>
  </v-sheet>
</template>

<script lang="ts">
import { marked } from 'marked'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class MissionLearningDocument extends Vue {
  @Prop({ required: true }) document!: string

  noContent = false

  mounted() {
    if (!this.document) {
      this.noContent = true
    } else {
      this.init()
    }
  }

  /**
   * Generate links for markdown aside from content headings
   * @param headings
   */
  generateMarkupLinks(headings: any[]) {
    const mappedHeadingData = headings.map((heading) => ({
      title: heading.innerText,
      depth: heading.nodeName.replace(/\D/g, ''),
      id: heading.getAttribute('id'),
    }))
    const dataTags = mappedHeadingData.map(
      (heading) =>
        `
        <li class="${heading.depth > 1 ? 'pl-2 custom-link-item' : 'custom-link-item'}">
          	<a headingTag="#${heading.id}">${heading.title}</a>
          </li>
        `
    )
    const htmlMarkup = `<ul class="markdown-ul">${dataTags.join('')}</ul>`
    return htmlMarkup
  }

  /**
   * Hightlight link in markdown aside matched heading in markdown content
   * @param visibleId
   * @param links arrays of links
   */
  updateLinks(visibleId: string, links: any[]) {
    links.map((link) => {
      let headingTag = link.getAttribute('headingTag')
      link.classList.remove('markdown-is-active')
      if (headingTag === `#${visibleId}`) link.classList.add('markdown-is-active')
    })
  }

  /**
   * Hightlight any link in markdown aside that matches heading in markdown content when scrolling
   * Jump to heading in markdown content matches selected link in markdown aside
   * @param headings array of headings
   * @param links array of links
   */
  handleScroll(headings: any[], links: any[]) {
    if (!headings || !headings.length || !links) return
    if (headings[0].getBoundingClientRect().top >= 100) {
      this.updateLinks('#', links)
    }
    headings.forEach((heading) => {
      if (heading.getBoundingClientRect().top <= 100 && heading.getBoundingClientRect().top > 0)
        this.updateLinks(heading.id, links)
    })
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100)
      this.updateLinks(headings[headings.length - 1].id, links)
  }

  /**
   * Append content and add events to tags
   */
  init() {
    const $main = document.querySelector('#markdown-content')
    const $aside = document.querySelector('#markdown-aside')

    const htmlContent = marked(this.document)

    $main!.innerHTML = htmlContent

    const $headings = [...$main!.querySelectorAll('h1, h2')]
    const linkHtml = this.generateMarkupLinks($headings)
    $aside!.innerHTML = linkHtml

    const $links = [...$aside!.querySelectorAll('a')]
    $links.forEach((link) => {
      link.addEventListener('click', () => {
        $headings.forEach((heading) => {
          if (`#${heading.id}` === link.getAttribute('headingTag')) {
            heading.scrollIntoView()
            if (!(window.innerHeight + window.scrollY >= document.body.offsetHeight))
              window.scrollTo({
                top: window.scrollY - this.headerHeight,
              })
          }
        })
      })
    })
    document.addEventListener('scroll', () => {
      this.handleScroll($headings, $links)
    })
  }

  beforeDestroy() {
    document.removeEventListener('scroll', () => this.handleScroll)
  }

  get wrapperClass() {
    return this.$vuetify.breakpoint.mdAndUp ? 'markdown-wrapper-desktop' : 'markdown-wrapper-mobile'
  }

  get headerHeight() {
    return this.$vuetify.breakpoint.width < 1050 ? 66 : 92
  }
}
</script>

<style lang="scss">
#markdown-aside {
  grid-area: aside;
}
#markdown-content {
  grid-area: content;
  overflow-x: hidden;
  overflow-wrap: break-word;
  /* white-space: pre-wrap !important; */
}
#markdown-content ::v-deep pre code.language-sh {
  white-space: pre-wrap !important;
}
#markdown-aside ::v-deep .custom-link-item {
  overflow: hidden;
  text-overflow: ellipsis;
  a {
    color: white !important;
  }
}
.custom-link-item {
  line-height: 35px;
}
#markdown-content p {
  max-width: 100% !important;
  overflow-x: hidden;
}
/* p {
  line-height: 200% !important;
} */
#markdown-content p img {
  max-width: 100% !important;
  margin: 10px 0;
}
#markdown-content ul li {
  line-height: 3;
  font-size: 16px !important;
}
#markdown-content p {
  font-size: 16px !important;
  margin-bottom: 0;
  line-height: 2;
}
#markdown-content h1 {
  padding-bottom: 15px;
  color: var(--v-blue-diversity-base); //TODO: check real md
}
#markdown-content h2 {
  color: var(--v-blue-diversity-base);
}
#markdown-content h1:not(:first-child) {
  padding-top: 15px;
}
.custom-link-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.custom-link-item .markdown-is-active {
  color: var(--v-blue-diversity-base) !important;
  font-weight: 700 !important;
}
.custom-link-item a:not(.markdown-is-active) {
  color: var(--v-neutral10--base) !important;
  font-size: 16px;
  font-weight: 600 !important;
}

//

//markdown
.markdown-container {
  display: flex;
  margin: auto;
  background-color: transparent;
  font-weight: 400;
  line-height: 1.65;
  color: white;
  font-size: 14px;
  text-align: left;
  padding: 0;
}

#markdown-content {
  overflow-x: auto;
}
.markdown-li a {
  text-decoration: none !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis !important;
}
.markdown-ul {
  padding-left: 0 !important;
  list-style-type: none !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis !important;
}
.markdown-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 100px;
}
#markdown-aside {
  padding: 0 !important;
}

.markdown-wrapper-desktop {
  margin: 0 auto;
  display: grid;
  grid-template-areas: 'aside content';
  grid-template-columns: 150px 1fr;
  grid-gap: 20px;
  align-items: flex-start;
}
.markdown-wrapper-mobile {
  margin: 0 auto;
  align-items: flex-start;
  overflow-x: auto;
}
.markdown-is-active {
  font-weight: 600;
  font-size: 20px !important;
}
</style>
