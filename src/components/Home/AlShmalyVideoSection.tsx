import React from 'react';

const AlShmalyVideoSection = () => {
  return (
    <section className="py-20 bg-[#054239]" id="alshmaly-video">
      <div className="container mx-auto px-4 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">من هنا بدأ الحكاية</h2>
        <p className="text-lg mb-12">
          مؤسسة الشمالي التجارية من أرضنا الطيبة إلى أسواق العالم
        </p>

        <div className="flex justify-center">
          <a
            href="https://youtu.be/wb-Cm7t08zg?si=A51qw-FXXKWTRqZx"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-full max-w-3xl h-96 group"
          >
            <img
              src="https://img.youtube.com/vi/wb-Cm7t08zg/hqdefault.jpg"
              alt="Al-Shmaly Video"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover group-hover:opacity-80 transition duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-80 rounded-full p-4 shadow-lg group-hover:scale-110 transition duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 16.5l6-4.5-6-4.5v9z" />
                </svg>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AlShmalyVideoSection;
