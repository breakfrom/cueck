import React from 'react';
import { getNextMinuteTime } from '../utils/time';

export const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        {props.children}
      </div>
    </div>
  );
});

export function renderPageContent(pageData, index) {
  switch (pageData.type) {
    case 'cover':
      return (
        <div className="page-cover">
          <h1>{pageData.title}</h1>
          <p>{pageData.subtitle}</p>
        </div>
      );
    case 'text-only':
      return (
        <div className="page-text-center">
          <h2>{pageData.content}</h2>
        </div>
      );
    case 'dynamic-time':
      return (
        <div className="page-text-center">
          <h2>{pageData.prefix} {getNextMinuteTime()}{pageData.suffix}</h2>
        </div>
      );
    case 'full-image':
      return (
        <div className="page-full-image" style={{ backgroundImage: `url(${pageData.imageUrl})` }}>
        </div>
      );
    case 'collage-interactive':
      return (
        <div className="page-collage">
          {pageData.images.map((img, i) => (
             <div key={i} className={`collage-item collage-${i}`}>
               <img src={img} alt="collage" />
             </div>
          ))}
        </div>
      );
    case 'polaroid-strip':
      return (
        <div className="page-polaroid-container">
          {pageData.images.map((img, i) => (
             <div key={i} className="polaroid">
               <img src={img.url} alt="polaroid" />
               <p>{img.caption}</p>
             </div>
          ))}
        </div>
      );
    default:
      return <div>Contenido no soportado</div>;
  }
}
