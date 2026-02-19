
const LOGOS = [
  { name: 'Paystack', src: '/logo/paystack.png' },
  { name: 'Flutterwave', src: '/logo/flutterwave.png' },
  { name: 'Andela', src: '/logo/andela.png' },
  { name: 'Interswitch', src: '/logo/interswitch.png' },
  { name: 'Kuda', src: '/logo/kuda.png' },
  { name: 'PiggyVest', src: '/logo/piggyvest.png' },
  { name: 'Bamboo', src: '/logo/image.png' }, 
  { name: 'Moniepoint', src: '/logo/moniepoint.png' },
];

export const LogoTicker = () => {
  return (
    <div className="py-12 bg-white border-y border-gray-100 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
      <div className="flex w-full overflow-hidden mask-linear-gradient">
        <div className="flex animate-marquee whitespace-nowrap gap-24">
          <div className="flex items-center gap-24 px-12 flex-shrink-0">
            {LOGOS.map((logo, index) => (
              <img 
                key={`l1-${index}`} 
                src={logo.src} 
                alt={`${logo.name} Logo`} 
                className="h-12 w-auto object-contain"
              />
            ))}
          </div>
          <div className="flex items-center gap-24 px-12 flex-shrink-0">
            {LOGOS.map((logo, index) => (
              <img 
                key={`l2-${index}`} 
                src={logo.src} 
                alt={`${logo.name} Logo`} 
                className="h-12 w-auto object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
