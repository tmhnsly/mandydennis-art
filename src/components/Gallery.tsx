import React, { useState } from "react";
import Masonry from "react-masonry-css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "../App.css";

interface Item {
  url: string;
  title: string;
  tags: string[];
}

interface Props {
  items: Item[];
}

export const Gallery: React.FC<Props> = ({ items }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const breakpointCols = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextIndex = () =>
    lightboxIndex !== null ? (lightboxIndex + 1) % items.length : 0;

  const prevIndex = () =>
    lightboxIndex !== null
      ? (lightboxIndex + items.length - 1) % items.length
      : 0;

  return (
    <>
      <Masonry
        breakpointCols={breakpointCols}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {items.map((item, i) => (
          <div key={i} className="card" onClick={() => openLightbox(i)}>
            <img src={item.url} alt="" />
          </div>
        ))}
      </Masonry>

      {lightboxIndex !== null && (
        <Lightbox
          mainSrc={items[lightboxIndex].url}
          nextSrc={items[nextIndex()].url}
          prevSrc={items[prevIndex()].url}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() => setLightboxIndex(prevIndex())}
          onMoveNextRequest={() => setLightboxIndex(nextIndex())}
          enableZoom={true}
          imageTitle={"Image"}
          imageCaption={"description"}
        />
      )}
    </>
  );
};
