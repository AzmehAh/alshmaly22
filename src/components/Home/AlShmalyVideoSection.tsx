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
          <iframe width="560" height="315" src="https://www.youtube.com/embed/wb-Cm7t08zg?si=H08yd5Nl-x4Xa1YZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
      </div>
    </section>
  );
};

export default AlShmalyVideoSection;
