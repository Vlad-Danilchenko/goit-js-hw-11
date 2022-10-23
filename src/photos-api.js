import axios from 'axios';
import Notiflix from 'notiflix';

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.pageNum = 1;
  }
  async getPhoto() {
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?key=29444023-fe7d4e5e60b2e765be0bef471&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.pageNum}&per_page=40`
      );

      this.nextPage();
      this.totalHits = response.data.totalHits;
      const photos = response.data.hits;

      return photos;
    } catch (error) {
      if (error) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
    }
  }
  nextPage() {
    this.pageNum += 1;
  }
  resetPage() {
    this.pageNum = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
