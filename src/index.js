import './css/styles.css';
import ImgApiService from './photos-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
searchForm.addEventListener('submit', onFormSubmit);

const imgApiService = new ImgApiService();
const options = {
  threshold: 0.2,
};

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const newObserver = new IntersectionObserver(newObserverCallback, options);

function onFormSubmit(e) {
  e.preventDefault();

  imgApiService.query = e.currentTarget.elements.searchQuery.value;
  gallery.innerHTML = '';
  if (imgApiService.query === '') {
    return;
  }
  imgApiService.resetPage();
  imgApiService.getPhoto().then(data => {
    if (data.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    createMarkup(data);

    if (imgApiService.pageNum === 2) {
      Notiflix.Notify.success(
        `Hooray! We found ${imgApiService.totalHits} images.`
      );
    }
  });
}

function createMarkup(photos) {
  const markup = photos
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}"><div class="img-card"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="250" /></div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div></a>
</div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  const lastCard = document.querySelector('.photo-card:last-child');
  if (lastCard) {
    newObserver.observe(lastCard);
  }
}

function newObserverCallback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      newObserver.unobserve(entry.target);

      imgApiService.getPhoto().then(data => {
        createMarkup(data);

        if (data.length < 40) {
          newObserver.disconnect(entry.target);
          return Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        }
      });
    }
  });
}
