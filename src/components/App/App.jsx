import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { repeatRequest, emptyRequest } from 'services/toasts';
import { scrollToTop, scrollHandler } from 'services/Scroll';
import { LoaderMore, LoaderGallery } from 'services/Loader';
import { PixabayApiService } from 'services/PixabayService';
import { Title, Wrapper, Load } from './App.styled';
import { GlobalStyle } from './GlobalStyles';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { LoadMore } from 'components/LoadMore/LoadMore';
import { Modal } from 'components/Modal/Modal';

const fetchPixabay = new PixabayApiService();

export const App = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const savedQuery = sessionStorage.getItem('pictures');
    savedQuery !== null && setSearchQuery(savedQuery);
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    scrollToTop();
    setStatus('pending');
    async function getImages() {
      try {
        const data = await fetchPixabay.axiosImages(searchQuery);
        if (data.totalHits > 0) {
          setImages(data.hits);
          setStatus('resolved');
          setTotal(data.totalHits);
        } else {
          setStatus('rejected');
          setError(`Nothing was found for your request "${searchQuery}"`);
        }
      } catch {
        setStatus('rejected');
        setError(`Something went wrong. Please reload the page`);
      }
    }
    getImages();
  }, [searchQuery]);

  useEffect(() => {
    if (page === 1) {
      return;
    }

    async function getImages() {
      try {
        const data = await fetchPixabay.axiosImages(searchQuery);
        setImages(prevState => [...prevState, ...data.hits]);
        setStatus('resolved');
        setButtonLoader(false);
        scrollHandler();
      } catch {
        setButtonLoader(false);
        setStatus('rejected');
        setError(`Something went wrong. Please reload the page`);
      }
    }
    getImages();
  }, [page, searchQuery]);

  const clickLoadMore = () => {
    setButtonLoader(true);
    setPage(prevState => prevState + 1);
  };

  const formSubmit = query => {
    if (query.searchQuery.trim() === '') {
      emptyRequest();
      return;
    }

    if (query.searchQuery.trim() === searchQuery.trim()) {
      repeatRequest();
      return;
    }

    sessionStorage.setItem('pictures', query.searchQuery);

    fetchPixabay.resetPage();

    setPage(1);
    setSearchQuery(query.searchQuery);
    setImages([]);
    setTotal(null);
    setError(null);
    setButtonLoader(false);
  };

  const handleBigImage = link => {
    setSelectedImage(link);
    setShowModal(true);
  };

  return (
    <>
      <Wrapper>
        <Searchbar onSubmit={formSubmit} />
        {status === 'idle' && <Title>Make a request to display images</Title>}
        {status === 'pending' && <Load>{LoaderGallery}</Load>}
        {status === 'rejected' && (
          <Title style={{ color: 'red' }}>{error}</Title>
        )}
        {status === 'resolved' && (
          <>
            <Title>The result of your request "{searchQuery}"</Title>
            <ImageGallery images={images} onSelect={handleBigImage} />
            {images.length < total && (
              <LoadMore
                onClick={clickLoadMore}
                children={buttonLoader ? LoaderMore : 'Load more'}
              />
            )}
          </>
        )}
        <GlobalStyle />
        <Toaster />
      </Wrapper>
      {showModal && <Modal onClose={setShowModal(false)} url={selectedImage} />}
    </>
  );
};
