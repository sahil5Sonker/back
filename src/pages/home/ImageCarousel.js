import React, { useEffect, useContext, useState } from "react";
import { Box, IconButton, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { AppContext } from "../../context/AppState";
import axios from "../../api/Axios";

// Styled components
const CarouselContainer = styled(Box)({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "600px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
  borderRadius: "12px",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "5px",
    background: "linear-gradient(90deg, #febd2f 0%, #173334 100%)",
    zIndex: 11,
  },
});

const Slide = styled(Box)({
  position: "absolute",
  width: "100%",
  height: "100%",
  transition: "transform 0.8s ease, opacity 0.6s ease",
});

const NavButton = styled(IconButton)({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
  backgroundColor: "rgba(254, 189, 47, 0.8)",
  padding: "12px",
  color: "#173334",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#173334",
    color: "#febd2f",
    transform: "translateY(-50%) scale(1.1)",
  },
});

const SlideIndicators = styled(Box)({
  position: "absolute",
  bottom: "25px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  zIndex: 10,
});

const Indicator = styled(Box)(({ active }) => ({
  width: active ? "30px" : "10px",
  height: "10px",
  borderRadius: active ? "10px" : "50%",
  backgroundColor: active ? "#febd2f" : "rgba(254, 189, 47, 0.5)",
  transition: "all 0.4s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.2)",
    backgroundColor: active ? "#febd2f" : "rgba(254, 189, 47, 0.8)",
  },
}));

const OverlayText = styled(Box)({
  position: "absolute",
  bottom: 0,
  width: "100%",
  padding: "30px",
  background:
    "linear-gradient(to top, rgba(23, 51, 52, 0.9) 0%, rgba(23, 51, 52, 0.7) 60%, rgba(0, 0, 0, 0) 100%)",
  color: "#ffffff",
});

const PlaybackControl = styled(IconButton)({
  position: "absolute",
  bottom: "25px",
  right: "25px",
  zIndex: 10,
  backgroundColor: "rgba(23, 51, 52, 0.7)",
  color: "#febd2f",
  "&:hover": {
    backgroundColor: "#173334",
  },
});

const ProgressBar = styled(Box)(({ progress }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  height: "4px",
  width: `${progress}%`,
  backgroundColor: "#febd2f",
  transition: "width 0.1s linear",
  zIndex: 11,
}));

const LoadingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  gap: "20px",
  color: "#173334",
});

const ImageCarousel = () => {
  const { carouselImages, setCarouselImages } = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const autoPlayDuration = 6000;

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/images/get");
      console.log("Fetched image response:", response.data);

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.images)
      ) {
        setCarouselImages(response.data.images);
      } else {
        console.error("Invalid image data structure", response.data);
        setCarouselImages([]);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error.message);
      setCarouselImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []); // ✅ Fixed infinite reload issue

  useEffect(() => {
    let interval;
    let progressInterval;

    if (isAutoPlaying && carouselImages.length > 0) {
      setProgress(0);

      progressInterval = setInterval(() => {
        setProgress((prev) =>
          prev >= 100 ? 0 : prev + 100 / (autoPlayDuration / 100)
        );
      }, 100);

      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        setProgress(0);
      }, autoPlayDuration);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isAutoPlaying, carouselImages.length, currentIndex]);

  const pauseAutoPlay = () => setIsAutoPlaying(false);
  const resumeAutoPlay = () => setIsAutoPlaying(true);
  const toggleAutoPlay = () => setIsAutoPlaying((prev) => !prev);

  const goToNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    pauseAutoPlay();
    setProgress(0);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
    pauseAutoPlay();
    setProgress(0);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    pauseAutoPlay();
    setProgress(0);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setIsSwipeActive(true);
    pauseAutoPlay();
  };

  const handleTouchEnd = (e) => {
    if (!isSwipeActive) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      diff > 0 ? goToNextSlide() : goToPrevSlide();
    }

    setIsSwipeActive(false);
    setTimeout(resumeAutoPlay, 8000);
  };

  return (
    <Box sx={{ marginBottom: 4, position: "relative" }}>
      <CarouselContainer
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={resumeAutoPlay}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading ? (
          <LoadingContainer>
            <CircularProgress size={60} sx={{ color: "#febd2f" }} />
            <Typography variant="h6">Loading Amazing Content...</Typography>
          </LoadingContainer>
        ) : carouselImages.length > 0 ? (
          carouselImages.map((slide, index) => {
            const isActive = index === currentIndex;

            return (
              <Slide
                key={index}
                style={{
                  transform: `translateX(${(index - currentIndex) * 100}%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: isActive ? 1 : 0.5,
                  zIndex: isActive ? 2 : 1,
                }}
              >
                <img
                  src={`${
                    window.location.origin.includes("localhost")
                      ? "http://localhost:5000"
                      : "https://back-5-g7tj.onrender.com"
                  }/uploads/images/${slide.imageUrl}`}
                  alt={slide.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
                {isActive && (
                  <OverlayText>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: 1,
                        textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                      }}
                    >
                      {slide.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        maxWidth: "70%",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      {slide.description}
                    </Typography>
                  </OverlayText>
                )}
              </Slide>
            );
          })
        ) : (
          <Typography>No images available</Typography>
        )}

        {!isLoading && carouselImages.length > 0 && (
          <>
            <NavButton onClick={goToPrevSlide} sx={{ left: 15 }}>
              <ArrowBackIosNewIcon />
            </NavButton>
            <NavButton onClick={goToNextSlide} sx={{ right: 15 }}>
              <ArrowForwardIosIcon />
            </NavButton>

            <SlideIndicators>
              {carouselImages.map((_, index) => (
                <Indicator
                  key={index}
                  active={index === currentIndex}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </SlideIndicators>

            <PlaybackControl onClick={toggleAutoPlay}>
              {isAutoPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </PlaybackControl>

            {isAutoPlaying && <ProgressBar progress={progress} />}
          </>
        )}
      </CarouselContainer>
    </Box>
  );
};

export default ImageCarousel;
