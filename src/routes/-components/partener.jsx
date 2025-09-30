import { partnerData } from './partenerData';

const Partners = () => {
  return (
    <div className="grid md:grid-cols-6 grid-cols-2 justify-center gap-6">
      {partnerData.map((item, index) => (
        <div key={index} className="mx-auto py-4">
          <img src={item} className="h-6" alt="Partner logo" />
        </div>
      ))}
    </div>
  );
};

export default Partners;
