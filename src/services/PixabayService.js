import axios from 'axios';

export class PixabayApiService {
  constructor() {
    this.page = 1;
    this.perPage = 12;
  }

  async axiosImages(query) {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '28948295-d76f7bbfd37371e36a905586f';
    const searchParams = new URLSearchParams({
      key: KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
      page: this.page,
    });

    const response = await axios.get(BASE_URL, { params: searchParams });
    this.incrementPage();
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
