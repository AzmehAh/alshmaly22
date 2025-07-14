import React from 'react';
import { Package, Truck, FileText, Users } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Package,
      title: 'Packaging & Filling',
      description: 'Professional packaging solutions with custom labeling options'
    },
    {
      icon: Truck,
      title: 'Shipping & Export',
      description: 'Worldwide shipping with reliable logistics partners'
    },
    {
      icon: FileText,
      title: 'Customs Supply',
      description: 'Complete documentation and customs clearance support'
    },
    {
      icon: Users,
      title: 'Agricultural Consulting',
      description: 'Expert consulting services for traders and distributors'
    }
  ];
 
  return (
    <section id="services" className="py-20 bg-[#054239]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#F7F7F7]  mb-4">
            Our Services
          </h2>
          <p className="text-[#edebe0] text-lg max-w-2xl mx-auto">
            From packaging to delivery, we provide comprehensive solutions for your agricultural product needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-[#F7F7F7]  border-2 border-transparent rounded-2xl p-8 text-center hover:border-[#b9a779] transition-all duration-500 group shadow-md h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-[#054239] text-[#F7F7F7] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg- [#edebe0] group-hover:text-[#edebe0] transition-all duration-300">
                  <service.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#054239] mb-4 group-hover:text-[#b9a779] transition-colors duration-300 min-h-[64px]">
                  {service.title}
                </h3>
              </div>
              <p className="text-gray-600  transition-colors duration-300 min-h-[96px]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
 
        <div className="text-center mt-12">
          <button className="bg-[#b9a779] hover:bg-[#054239] hover:text-[#b9a779] border-2 border-transparent rounded-2xl p-8 hover:border-[#b9a779] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg">
            Contact Us Today 
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
