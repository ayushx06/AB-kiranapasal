import { useEffect, useState } from 'react';
import { classNames } from '../../utils/helpers';

export const BannerSlider = ({ images = [], title, subtitle }) => {
  const [index, setIndex] = useState(0);
  const safeImages = images.length ? images : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80'];

  useEffect(() => {
    const timer = setInterval(() => setIndex((current) => (current + 1) % safeImages.length), 4000);
    return () => clearInterval(timer);
  }, [safeImages.length]);

  return (
    <section className="relative min-h-[340px] overflow-hidden bg-slate-900 md:min-h-[430px]">
      {safeImages.map((image, imageIndex) => (
        <img
          key={image}
          className={classNames('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', imageIndex === index ? 'opacity-70' : 'opacity-0')}
          src={image}
          alt=""
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent" />
      <div className="relative mx-auto flex min-h-[340px] max-w-7xl flex-col justify-center px-4 pb-16 pt-12 text-white md:min-h-[430px] md:px-6">
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-normal md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-xl text-base font-medium text-white/90 md:text-lg">{subtitle}</p>
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {safeImages.map((image, dotIndex) => (
          <button
            key={image}
            className={classNames('h-2.5 rounded-full transition-all', dotIndex === index ? 'w-8 bg-white' : 'w-2.5 bg-white/50')}
            onClick={() => setIndex(dotIndex)}
            aria-label={`Show banner ${dotIndex + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
