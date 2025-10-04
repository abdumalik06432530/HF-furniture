import React from 'react';

// Single hardcoded tutorial video ID (kept inside code only)
const TUTORIAL_VIDEO_ID = 'ysz5S6PUM-U'; // replace with your preferred video id

const HowToUse = () => {
  const openYouTube = () => {
    const url = `https://www.youtube.com/watch?v=tcbAexGV1_w`;
    window.open(url, '_blank');
  };

  return (
    <div className="py-12 px-4 sm:px-8 lg:px-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">How to use Hamad Furniture</h2>
      <p className="text-gray-700 mb-6">Watch the quick tutorial below to learn how to navigate the site and use its features.</p>

      <div className="max-w-3xl">
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            title="Tutorial video"
            src={`https://www.youtube.com/embed/tcbAexGV1_w`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-64 md:h-96 rounded-md border"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={openYouTube} className="px-4 py-2 bg-blue-700 text-white rounded-md">Open on YouTube</button>
        </div>

        <hr className="my-8" />

        <div>
          <h3 className="font-semibold mb-2">Quick Tutorial</h3>
          <p className="text-gray-700 mb-2">This short video explains how to browse collections, view products, and place orders. For server-side YouTube integrations (uploading or managing videos), you&apos;ll need to implement OAuth and use the YouTube Data API.</p>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
