
import WelcomeAnimation from "@/components/WelcomeAnimation";
import useFectchData from "@/hooks/useFetchData";
import Head from "next/head";
import { FaTelegramPlane } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "swiper/swiper-bundle.css";

import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import Loader from "@/components/Loader";
import Link from "next/link";
import { FaAngleDoubleUp, FaCheck, FaDownload, FaEye, FaFilm, FaHeart, FaPhotoVideo, FaPlus, FaStar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaClapperboard } from "react-icons/fa6";
import genres from "./genre/[genre]";
import category from "./genre";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { IoClose } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { FaHome, FaSearch, FaTv, FaPlay, FaBars } from "react-icons/fa";




export default function Home() {

  // fetch data with usehook
  const { alldata, loading } = useFectchData("/api/getmovies");

  const [wloading, setWLoading] = useState(true);


  // filter for published movies required
  const publishedData = alldata.filter(ab => ab.status === "publish");
  const seriesData = publishedData.filter((ab) => ab.titlecategory === 'series');
  const animeData = publishedData.filter((ab) => ab.titlecategory === "anime");
  const hollywoodData = publishedData.filter((ab) => ab.category === 'telugu');
  // function for filter by genre 
  const [selectedGenre, setSelectGenre] = useState('all movies');

  const genres = ['all movies', 'action', 'adventure', 'animation', 'comedy', 'drama', 'crime', 'fantasy', 'horror', 'romance', 'thriller', 'science_fiction'];

  const categories = ["bollywood", "telugu", "south", "gujarati", "marvel_studio", "tv_Shows", "web_series"];

  const handleGenreClick = (genre) => {
    setSelectGenre(genre);
  }
  const filmsData = publishedData.filter((ab) => ab.titlecategory === "films");

  const filteredData = publishedData.filter(movie => {
    if (selectedGenre === 'all movies') return true;
    if (categories.includes(selectedGenre)) {
      return movie.category === selectedGenre;
    } else {
      return movie.genre.includes(selectedGenre);
    }

  })

  const [updatedData, setUpdatedData] = useState([]);

  useEffect(() => {
    if (!loading) {
      // Filter only published films (you can modify this filter if needed)
      const publishedData = (alldata || []).filter((ab) => ab.status === "publish");

      // Sort the data by updatedAt in descending order
      const sortedData = publishedData.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      // Set the sorted data
      setUpdatedData(sortedData);
    }
  }, [alldata, loading]);
  const recentlyAddedData = (alldata || [])
    .filter((film) => film.status === "publish") // Only show published films
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by `createdAt` date descending

  // Navbar header component scroll sticky
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("nav");
      header.classList.toggle("sticky", window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Functions for navlist item page routing active status
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [searchbar, setSearchbar] = useState(false);

  const [activeLink, setActiveLink] = useState("/");

  // Search function by title of the movie
  const [movieshortname, setMovieshortname] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);



  // Function to handle search
  useEffect(() => {
    if (!movieshortname.trim()) {
      setSearchResult([]);
      return;
    }

    const filteredMovies = publishedData.filter((movie) =>
      movie.title.toLowerCase().includes(movieshortname.toLowerCase())
    );

    setSearchResult(filteredMovies);
  }, [movieshortname]);

  const handleMovieClick = () => {
    setMovieshortname("");
  };

  const searchRef = useRef(null);

  // Function to close search bar when clicking outside
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setMovieshortname("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setClicked(false);
  };

  useEffect(() => {
    // Update active link state when the page is reloaded
    setActiveLink(router.pathname);
  }, [router.pathname]);

  // Navbar
  const handleNavbarOpen = () => {
    setNavbar(!navbar);
  };

  const handleNavbarClose = () => {
    setNavbar(false);
  };

  // Search bar
  const handleSearchbarClose = () => {
    setSearchbar(false);
  };

  const searchInputRef = useRef(null);

  const handleSearchbarOpen = () => setSearchbar(true);
  const scrollContainerRef = useRef(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const scroll = scrollLeft - (x - startX);
    scrollContainerRef.current.scrollLeft = scroll;
  };

  const handleTouchStart = (e) => {
    setIsMouseDown(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isMouseDown) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const scroll = scrollLeft - (x - startX);
    scrollContainerRef.current.scrollLeft = scroll;
  };

  const handleTouchEnd = () => {
    setIsMouseDown(false);
  };


  return (


    <>
      <Head>
        <title>Cinema Talkiez</title>
        <meta name="description" content="Next Js Movie App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="header">
        <h1 className="logo1">
          <a>Cinema Talkiez</a>
        </h1>







        {/* Bottom Navigation Bar */}
        <div className="bottom-navigation">
          <ul>
            <li>
              <Link href="/" onClick={handleSearchbarClose}>
                <FaHome />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/Anime" onClick={handleSearchbarClose}>
                <FaTv />
                <span>Anime</span>
              </Link>
            </li>
            <li>
              <Link href="/search">
                <FaSearch />
                <span>Search</span>
              </Link>
            </li>
            <li>
              <Link href="/all" onClick={handleSearchbarClose}>
                <FaFilm />
                <span>All content</span>
              </Link>
            </li>
            <li>
              <a
                href="https://t.me/AniMovieRulz"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSearchbarClose}
              >
                <FaTelegramPlane />
                <span>Updates</span>
              </a>
            </li>

          </ul>
        </div>
      </nav>
      <div>


        <div className="swiper_top_main1">
          <Swiper
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            loop={true}
            speed={1200}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay, Navigation]}
            onSwiper={(swiper) => {
              // Ensure autoplay starts immediately
              if (!swiper.autoplay.running) {
                swiper.autoplay.start();
              }
            }}
          >
            {publishedData.slice(0, 3).map((movie) => (
              <SwiperSlide key={movie._id}>
                <div className="slideimagebx1">
                  <img
                    src={movie.bgposter}
                    alt="movie"
                    loading="lazy"
                    className="bgposter"
                  />
                  <div className="content1">
                    <div className="contentflex1">
                      <div className="smposter1">
                        <img
                          src={movie.smposter}
                          alt="movie poster"
                          loading="lazy"
                        />
                      </div>
                      <div className="details1">
                        <h1>{movie.title}</h1>
                        <Link href={`/movies/${movie.slug}`}>
                          <button className="btn_download1">
                            <FaDownload className="faDownload" /> DOWNLOAD
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>




        <h1 className="logo4">Genres</h1>
        <div className="category-icons-scroll">
          <Swiper
            slidesPerView={5} // Default visible slides for categories
            spaceBetween={30} // Space between the slides
            loop={true} // Enable looping
            //autoplay={{ delay: 3000, disableOnInteraction: false }} // Autoplay every 3 seconds
            modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
            breakpoints={{
              1587: {
                slidesPerView: 8,
              },
              1500: {
                slidesPerView: 7,
              },
              1200: {
                slidesPerView: 6,
              },
              1040: {
                slidesPerView: 5,
              },
              768: {
                slidesPerView: 4,
              },
              650: {
                slidesPerView: 3,
              },
              480: {
                slidesPerView: 2,
              },
            }}
          >
            <ul className="category-list">


              <SwiperSlide className="category-item">
                <Link href="/action" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/series-icon.png" alt="action" />
                  </div>
                  <span>Action</span>
                </Link>
              </SwiperSlide>

              <SwiperSlide className="category-item">
                <Link href="/adventure" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/action.jpg" alt="adventure" />
                  </div>
                  <span>Adventure</span>
                </Link>
              </SwiperSlide>

              <SwiperSlide className="category-item">
                <Link href="/comedy" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/anime-icon.png" alt="comedy" />
                  </div>
                  <span>Comedy</span>
                </Link>
              </SwiperSlide>

              <SwiperSlide className="category-item">
                <Link href="/romance" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/series-icon.png" alt="romance" />
                  </div>
                  <span>Romance</span>
                </Link>
              </SwiperSlide>

              <SwiperSlide className="category-item">
                <Link href="/horror" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/series-icon.png" alt="horror" />
                  </div>
                  <span>Horror</span>
                </Link>
              </SwiperSlide>

              <SwiperSlide className="category-item">
                <Link href="/crime" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/series-icon.png" alt="crime" />
                  </div>
                  <span>Crime</span>
                </Link>
              </SwiperSlide>

              <SwiperSlide className="category-item">
                <Link href="/drama" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/series-icon.png" alt="drama" />
                  </div>
                  <span>Drama</span>
                </Link>
              </SwiperSlide>

              <SwiperSlide className="category-item">
                <Link href="/fantasy" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/series-icon.png" alt="fantasy" />
                  </div>
                  <span>Fantasy</span>
                </Link>
              </SwiperSlide>

              <SwiperSlide className="category-item">
                <Link href="/sci_fi" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/series-icon.png" alt="sci-fi" />
                  </div>
                  <span>Sci_Fi</span>
                </Link>
              </SwiperSlide>

              <SwiperSlide className="category-item">
                <Link href="/science_fiction" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/series-icon.png" alt="science-fiction" />
                  </div>
                  <span>Science_Fiction</span>
                </Link>
              </SwiperSlide>

              <SwiperSlide className="category-item">
                <Link href="/all" onClick={handleSearchbarClose}>
                  <div className="icon">
                    <img src="/img/all-icon.png" alt="All" />
                  </div>
                  <span>All</span>
                </Link>
              </SwiperSlide>

              {/* Additional categories can be added in the same format */}
            </ul>
          </Swiper>
        </div>

















        <h1 className="logo4">Newly Released</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Enable looping
              //autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter((movie) => movie.status === "publish") // Only show published movies
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <h6>{movie.language}</h6>
                            <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>




        <h1 className="logo3">Adventure Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Disable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter(
                  (movie) =>
                    movie.status === "publish" && // Only published movies
                    movie.genre.includes("adventure") // Check if the genre includes "action"
                )
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <span>{movie.language}</span> - <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>



        <h1 className="logo3">Action Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Disable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter(
                  (movie) =>
                    movie.status === "publish" && // Only published movies
                    movie.genre.includes("action") // Check if the genre includes "action"
                )
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <span>{movie.language}</span> - <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>



        <h1 className="logo3">Comedy Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Disable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter(
                  (movie) =>
                    movie.status === "publish" && // Only published movies
                    movie.genre.includes("comedy") // Check if the genre includes "action"
                )
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <span>{movie.language}</span> - <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>



        <h1 className="logo3">Drama Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Disable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter(
                  (movie) =>
                    movie.status === "publish" && // Only published movies
                    movie.genre.includes("drama") // Check if the genre includes "action"
                )
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <span>{movie.language}</span> - <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>



        <h1 className="logo3">Crime Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Disable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter(
                  (movie) =>
                    movie.status === "publish" && // Only published movies
                    movie.genre.includes("crime") // Check if the genre includes "action"
                )
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <span>{movie.language}</span> - <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>



        <h1 className="logo3">Horror Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Disable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter(
                  (movie) =>
                    movie.status === "publish" && // Only published movies
                    movie.genre.includes("horror") // Check if the genre includes "action"
                )
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <span>{movie.language}</span> - <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>


        <h1 className="logo3">Romantic Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Disable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter(
                  (movie) =>
                    movie.status === "publish" && // Only published movies
                    movie.genre.includes("romance") // Check if the genre includes "action"
                )
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <span>{movie.language}</span> - <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>


        <h1 className="logo3">Thriller Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Disable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter(
                  (movie) =>
                    movie.status === "publish" && // Only published movies
                    movie.genre.includes("thriller") // Check if the genre includes "action"
                )
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <span>{movie.language}</span> - <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>

        <h1 className="logo3">Fantasy Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Disable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter(
                  (movie) =>
                    movie.status === "publish" && // Only published movies
                    movie.genre.includes("fantasy") // Check if the genre includes "action"
                )
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <span>{movie.language}</span> - <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>


        <h1 className="logo3">Science-Fiction Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Disable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter(
                  (movie) =>
                    movie.status === "publish" && // Only published movies
                    movie.genre.includes("science_fiction") // Check if the genre includes "action"
                )
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <span>{movie.language}</span> - <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>





        <div className="line" ></div>
        <h1 className="logo3">All Content</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default number of visible slides
              spaceBetween={50} // Space between the slides
              loop={true} // Enable infinite looping
              modules={[Pagination, Navigation]} // Required Swiper modules without autoplay
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {filteredData.length === 0 ? (
                <div className="nodatafound">No Movie Found</div>
              ) : (
                filteredData.map((movie) => (
                  <SwiperSlide key={movie._id}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img
                            src={movie.smposter}
                            alt="movie"
                            loading="lazy"
                          />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <h6>{movie.language}</h6>
                            <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          )}
        </div>



        <div className="nextpagelink">
          <Link href='/all'>
            <button className="cssbuttons_io_button">All
              <div className="icon">
                <FaArrowRight />
              </div>
            </button>
          </Link>
        </div>

      </div>

    </>
  );
}
