import React, { useState, useEffect, useCallback } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import { fetchImages } from './services/gallery.service.js';
import './App.css';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [imageTags, setImageTags] = useState('');
  const [error, setError] = useState(null);
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const getImages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchImages(searchQuery, page);
        const newImages = data.hits.map(
          ({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          })
        );
        setImages(prevImages =>
          page === 1 ? newImages : [...prevImages, ...newImages]
        );
        setTotalHits(data.totalHits);

        if (page > 1) {
          window.scrollBy({
            top: 500,
            behavior: 'smooth',
          });
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getImages();
  }, [searchQuery, page]);

  const handleSearchSubmit = useCallback(query => {
    if (query.trim() === '') {
      alert('Please enter a search query.');
      return;
    }
    setSearchQuery(query);
    setPage(1);
    setImages([]);
    setTotalHits(0);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const handleImageClick = useCallback((url, tags) => {
    setShowModal(true);
    setLargeImageURL(url);
    setImageTags(tags);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setLargeImageURL('');
    setImageTags('');
  }, []);

  const showLoadMoreButton =
    images.length > 0 && images.length < totalHits && !isLoading;

  return (
    <div className="App">
      React homework template
      <Searchbar onSubmit={handleSearchSubmit} />
      {error && (
        <p className="errorMessage">
          Whoops, something went wrong: {error.message}
        </p>
      )}
      {images.length > 0 && (
        <ImageGallery images={images} onImageClick={handleImageClick} />
      )}
      {isLoading && <Loader />}
      {showLoadMoreButton && <Button onClick={handleLoadMore} />}
      {showModal && (
        <Modal
          imageURL={largeImageURL}
          imageTags={imageTags}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default App;

//  import React, { Component } from 'react';
// import Searchbar from './Searchbar/Searchbar';
// import ImageGallery from './ImageGallery/ImageGallery';
// import Loader from './Loader/Loader';
// import Button from './Button/Button';
// import Modal from './Modal/Modal';
// import { fetchImages } from './services/gallery.service.js';

// export class App extends Component {
//   state = {
//     searchQuery: '',
//     images: [],
//     page: 1,
//     isLoading: false,
//     showModal: false,
//     largeImageURL: '',
//     imageTags: '',
//     error: null,
//     totalHits: 0,
//   };

//   componentDidUpdate(prevProps, prevState) {
//     if (
//       prevState.searchQuery !== this.state.searchQuery ||
//       prevState.page !== this.state.page
//     ) {
//       this.getImages();
//     }
//   }

//   getImages = async () => {
//     const { searchQuery, page } = this.state;
//     this.setState({ isLoading: true, error: null });

//     try {
//       const data = await fetchImages(searchQuery, page);
//       const newImages = data.hits.map(
//         ({ id, webformatURL, largeImageURL, tags }) => ({
//           id,
//           webformatURL,
//           largeImageURL,
//           tags,
//         })
//       );

//       this.setState(prevState => ({
//         images: [...prevState.images, ...newImages],
//         totalHits: data.totalHits,
//       }));

//       if (page > 1) {
//         window.scrollBy({
//           top: 500,
//           behavior: 'smooth',
//         });
//       }
//     } catch (error) {
//       this.setState({ error });
//     } finally {
//       this.setState({ isLoading: false });
//     }
//   };

//   handleSearchSubmit = query => {
//     this.setState({
//       searchQuery: query,
//       page: 1,
//       images: [],
//       totalHits: 0,
//     });
//   };

//   handleLoadMore = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//   };

//   handleImageClick = (largeImageURL, tags) => {
//     this.setState({ showModal: true, largeImageURL, imageTags: tags });
//   };

//   handleModalClose = () => {
//     this.setState({ showModal: false, largeImageURL: '', imageTags: '' });
//   };

//   render() {
//     const {
//       images,
//       isLoading,
//       showModal,
//       largeImageURL,
//       imageTags,
//       error,
//       totalHits,
//     } = this.state;
//     const showLoadMoreButton =
//       images.length > 0 && images.length < totalHits && !isLoading;

//     return (
//       <div className="App">
//         React homework template
//         <Searchbar onSubmit={this.handleSearchSubmit} />
//         {error && (
//           <p className="errorMessage">
//             Whoops, something went wrong: {error.message}
//           </p>
//         )}
//         {images.length > 0 && (
//           <ImageGallery images={images} onImageClick={this.handleImageClick} />
//         )}
//         {isLoading && <Loader />}
//         {showLoadMoreButton && <Button onClick={this.handleLoadMore} />}
//         {showModal && (
//           <Modal
//             imageURL={largeImageURL}
//             imageTags={imageTags}
//             onClose={this.handleModalClose}
//           />
//         )}
//       </div>
//     );
//   }
// }

// export default App;
