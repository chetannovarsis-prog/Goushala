import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Utensils, GraduationCap, ArrowRight, Star, Award, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../utils/api';

const AnimatedCounter = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = React.useState(0);
  const countRef = React.useRef(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeOutProgress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const formatCount = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return num;
  };

  return <span ref={countRef}>{formatCount(count)}{suffix}</span>;
};

const RecentActivity = ({ language }) => {
  const [activities, setActivities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get('/home/recent-activity');
        setActivities(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const getEntryText = (act) => {
    if (act.type === 'donation') {
      if (act.donationType.includes('cow')) {
        return language === 'en' 
          ? `Adopted ${act.quantity} cow(s) for 1 year` 
          : `${act.quantity} गायों को 1 साल के लिए गोद लिया`;
      }
      return language === 'en'
        ? `Sponsored Bhandara Seva`
        : `भंडारा सेवा प्रायोजित की`;
    } else {
      return language === 'en'
        ? `Joined as ${act.planName} Member`
        : `${act.planName} सदस्य के रूप में शामिल हुए`;
    }
  };

  const getTierColor = (plan) => {
    const p = plan.toLowerCase();
    if (p.includes('gold')) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    if (p.includes('silver')) return 'text-gray-500 bg-gray-50 border-gray-100';
    if (p.includes('legacy') || p.includes('lifetime')) return 'text-purple-600 bg-purple-50 border-purple-100';
    return 'text-orange-600 bg-orange-50 border-orange-100';
  };

  if (loading) return null;
  if (activities.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes blessingBorderTravel {
          0% { background-position: 0% 50%; }
          33% { background-position: 100% 50%; }
          66% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        @keyframes blessingGlowSweep {
          0% {
            transform: translate3d(-20%, -28%, 0) scale(0.92);
            opacity: 0.2;
          }
          38% {
            transform: translate3d(18%, -6%, 0) scale(1.05);
            opacity: 0.34;
          }
          68% {
            transform: translate3d(12%, 24%, 0) scale(1.08);
            opacity: 0.28;
          }
          100% {
            transform: translate3d(-18%, 44%, 0) scale(0.94);
            opacity: 0.16;
          }
        }

        @keyframes blessingGlowSweepReverse {
          0% {
            transform: translate3d(18%, -24%, 0) scale(0.9);
            opacity: 0.18;
          }
          38% {
            transform: translate3d(-16%, -2%, 0) scale(1.06);
            opacity: 0.33;
          }
          68% {
            transform: translate3d(-12%, 22%, 0) scale(1.04);
            opacity: 0.27;
          }
          100% {
            transform: translate3d(16%, 40%, 0) scale(0.95);
            opacity: 0.15;
          }
        }

        .blessing-grid > div:nth-child(3n + 1) .blessing-border {
          animation: blessingBorderTravel 8s linear infinite;
        }

        .blessing-grid > div:nth-child(3n + 2) .blessing-border {
          animation: blessingBorderTravel 8s linear infinite reverse;
        }

        .blessing-grid > div:nth-child(3n + 3) .blessing-border {
          animation: blessingBorderTravel 10s linear infinite;
        }

        .blessing-border {
          background-size: 220% 220%;
        }

        .blessing-card::before {
          content: "";
          position: absolute;
          inset: -20%;
          border-radius: 999px;
          background:
            radial-gradient(circle at center, rgba(249, 115, 22, 0.2), transparent 58%),
            radial-gradient(circle at center, rgba(16, 185, 129, 0.14), transparent 62%),
            radial-gradient(circle at center, rgba(139, 92, 246, 0.14), transparent 64%);
          filter: blur(24px);
          pointer-events: none;
          animation: blessingGlowSweep 9s ease-in-out infinite;
        }

        .blessing-grid > div:nth-child(even) .blessing-card::before {
          animation-name: blessingGlowSweepReverse;
        }
      `}</style>
      <section className="py-24 bg-white border-y border-orange-50">
        <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#4D2D0E] mb-4">
            {language === 'en' ? 'Wall of Blessings' : 'आशीर्वाद की दीवार'}
          </h2>
          <p className="text-gray-500 font-medium">
            {language === 'en' ? 'Recognizing our recent divine contributors' : 'हमारे हाल के दिव्य योगदानकर्ताओं की पहचान'}
          </p>
          <div className="w-24 h-1 bg-[#FF9933] mx-auto mt-6"></div>
        </div>

        <div className="blessing-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => (
            <div key={act.id} className="blessing-border rounded-[32px] p-[2px]" style={{ backgroundImage: 'linear-gradient(135deg, #f97316, #10b981, #8b5cf6, #f97316)' }}>
              <div className="blessing-card bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform rotate-12">
                  {act.type === 'donation' ? <Heart size={60} /> : <Award size={60} />}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {act.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#4D2D0E] truncate max-w-[150px]">{act.name}</h4>
                    <p className="text-xs text-gray-400 font-medium">{new Date(act.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600 font-medium text-sm">
                    {getEntryText(act)}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    {act.profession && (
                      <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 px-2 py-1 bg-gray-50 rounded-lg">
                        {act.profession}
                      </span>
                    )}
                    {act.type === 'membership' && (
                      <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border ${getTierColor(act.planName)}`}>
                        {act.planName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

const ServiceJourney = ({ language }) => {
  const items = [
    {
      title: language === 'en' ? 'Gausewa' : 'गौसेवा',
      subtitle: language === 'en' ? 'Reviving India\'s Sacred Legacy' : 'भारत की पवित्र परंपरा का पुनर्जागरण',
      image: '/Images/home2.png',
      link: '/donate-cow',
    },
    {
      title: language === 'en' ? 'Anna Daan' : 'अन्न दान',
      subtitle: language === 'en' ? 'Nourishing Lives, Blessing Souls' : 'जीवन पोषण, आत्मा का आशीर्वाद',
      image: '/Images/home3.png',
      link: '/bhandara',
    },
    {
      title: language === 'en' ? 'Arogya Dham' : 'आरोग्य धाम',
      subtitle: language === 'en' ? 'Health, Harmony, Holistic Living' : 'स्वास्थ्य, संतुलन और समग्र जीवन',
      image: '/Images/home1.png',
      link: '/gurukul',
    },
    {
      title: language === 'en' ? 'Vedic' : 'वैदिक',
      subtitle: language === 'en' ? 'Timeless Wisdom, Divine Living' : 'सनातन ज्ञान, दिव्य जीवन',
      image: '/Images/home4.png',
      link: '/gurukul',
    },
  ];

  return (
    <>
      <style>{`
        @keyframes serviceTokenFlip {
          0% {
            transform: rotateY(0deg) ;
          }
          22% {
            transform: rotateY(90deg);
          }
          50% {
            transform: rotateY(0deg) ;
          }
          72% {
            transform: rotateY(-90deg) ;
          }
          100% {
            transform: rotateY(0deg) ;
          }
        }

        .service-journey-bg {
          background:
            radial-gradient(circle at top, rgba(255, 210, 199, 0.65), transparent 36%),
            linear-gradient(90deg, #fff3ef 0%, #ffe7df 48%, #ffd8ce 100%);
        }

        .service-pill {
          box-shadow: 0 22px 50px rgba(139, 56, 18, 0.12);
        }

        .service-token-wrap {
          perspective: 1200px;
        }

        .service-token {
          clip-path: polygon(50% 0%, 92% 24%, 92% 76%, 50% 100%, 8% 76%, 8% 24%);
          transform-style: preserve-3d;
          animation: serviceTokenFlip 7.5s ease-in-out infinite;
          backface-visibility: hidden;
          box-shadow: 0 24px 36px rgba(146, 63, 18, 0.2);
        }

        .service-connector path {
          stroke: #8b1e16;
          stroke-width: 3;
          fill: none;
          stroke-linecap: round;
        }
      `}</style>
      <section className="service-journey-bg py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center animate-bounce transition-all duration-700 ease-out">
            <div className="service-pill inline-flex items-center justify-center rounded-full bg-white px-8 py-5 min-w-[280px] md:min-w-[360px]">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#8B1E16]">
                  {language === 'en' ? 'Krishna Pathways' : 'कृष्ण मार्ग'}
                </h2>
                <p className="text-sm md:text-base text-[#8B1E16]/80 font-medium">
                  {language === 'en' ? 'Sacred service flowing into every home' : 'पावन सेवा जो हर घर तक पहुंचे'}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block mt-6 px-8">
            <svg className="service-connector w-full h-[120px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M600 0 C600 40, 300 30, 150 90" />
              <path d="M600 0 C600 40, 500 40, 450 90" />
              <path d="M600 0 C600 40, 700 40, 750 90" />
              <path d="M600 0 C600 40, 900 30, 1050 90" />
            </svg>
          </div>

          <div className="service-journey-grid mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12 xl:gap-8 place-items-center">
            {items.map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="group w-full max-w-[280px] text-center"
              >
                <div className="service-token-wrap mx-auto w-[160px] h-[190px] md:w-[180px] md:h-[215px]">
                  <div className="service-token w-full h-full border-[6px] border-[#f3d08a] bg-[#f8e4bc] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 "
                    />
                  </div>
                </div>
                <div className="mt-5 rounded-2xl bg-[#8B0000] px-5 py-4 text-white shadow-xl shadow-[#8B0000]/20 group-hover:-translate-y-1 transition-transform">
                  <h3 className="text-3xl font-semibold leading-none mb-2">{item.title}</h3>
                  <p className="text-[#FFCC66] text-sm font-medium">{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const Home = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;
  const ts = translations[language].nav;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('/Images/banner.png')" }}
        ></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {language === 'en' ? (
              <>Serve Gau Mata, <br /><span className="text-[#FF9933]">Earn Divine Blessings</span></>
            ) : (
              <>गौ माता की सेवा करें, <br /><span className="text-[#FF9933]">दिव्य आशीर्वाद प्राप्त करें</span></>
            )}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            {t.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/donate-cow" className="btn-primary text-xl px-12 py-4 shadow-xl shadow-orange-500/20">
              {t.cta}
            </Link>
            <Link to="/gurukul" className="btn-secondary text-xl px-12 py-4 shadow-xl shadow-green-900/20">
              {language === 'en' ? 'Join Gurukul' : 'गुरुकुल से जुड़ें'}
            </Link>
          </div>
        </div>
      </section>

      <ServiceJourney language={language} />

      {/* Quick Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#4D2D0E] mb-4">
              {language === 'en' ? 'Our Divine Services' : 'हमारी दिव्य सेवाएँ'}
            </h2>
            <div className="w-24 h-1 bg-[#FF9933] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="card group hover:-translate-y-2 transition-all p-8 text-center border-b-4 border-[#FF9933] shadow-orange-500/5">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#FF9933] transition-colors group-hover:rotate-0">
                <Heart className="w-10 h-10 text-[#FF9933] group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{translations[language].cowDonation.title}</h3>
              <p className="text-gray-600 mb-6">
                {language === 'en' ? 'Support the maintenance, fodder, and medical care of our sacred cows for a whole year.' : 'पूरे एक साल के लिए हमारी पवित्र गायों के रखरखाव, चारे और चिकित्सा देखभाल में सहायता करें।'}
              </p>
              <Link to="/donate-cow" className="inline-flex items-center text-[#FF9933] font-bold hover:underline">
                {language === 'en' ? 'Sponsor Now' : 'अभी प्रायोजित करें'} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <div className="card group hover:-translate-y-2 transition-all p-8 text-center border-b-4 border-orange-200">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#FF9933] transition-colors">
                <Utensils className="w-10 h-10 text-[#FF9933] group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{translations[language].bhandara.title}</h3>
              <p className="text-gray-600 mb-6">
                {language === 'en' ? 'Feed the needy and children with nutritious meals in our regular community kitchen programs.' : 'हमारे नियमित सामुदायिक रसोई कार्यक्रमों में जरूरतमंदों और बच्चों को पौष्टिक भोजन खिलाएं।'}
              </p>
              <Link to="/bhandara" className="inline-flex items-center text-[#FF9933] font-bold hover:underline">
                {translations[language].bhandara.selectPlan} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <div className="card group hover:-translate-y-2 transition-all p-8 text-center border-b-4 border-[#2E7D32] shadow-green-500/5">
              <div className="w-20 h-20 bg-green-50 rounded-2xl -rotate-3 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#2E7D32] transition-colors group-hover:rotate-0">
                <GraduationCap className="w-10 h-10 text-[#2E7D32] group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{translations[language].gurukul.title}</h3>
              <p className="text-gray-600 mb-6">
                {language === 'en' ? 'Preserving our ancient wisdom and providing spiritual education to the next generation.' : 'हमारी प्राचीन विद्या को संरक्षित करना और अगली पीढ़ी को आध्यात्मिक शिक्षा प्रदान करना।'}
              </p>
              <Link to="/gurukul" className="inline-flex items-center text-[#2E7D32] font-bold hover:underline">
                {language === 'en' ? 'Apply Now' : 'अभी आवेदन करें'} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bhandara Seva Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-orange-100 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-0"></div>
              <img 
                src="/Images/bhandara.png" 
                alt="Bhandara Seva" 
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-8 -right-8 bg-[#4D2D0E] text-white p-8 rounded-2xl shadow-xl hidden md:block max-w-xs">
                <Utensils className="w-10 h-10 text-[#FF9933] mb-4" />
                <p className="font-medium italic">
                  {language === 'en' ? '"No one should go hungry in the presence of Gau Mata."' : '"गौ माता की उपस्थिति में कोई भी भूखा नहीं रहना चाहिए।"'}
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-[#4D2D0E] leading-tight">
                {translations[language].homeContent.bhandaraTitle}
              </h2>
              <div className="w-24 h-1.5 bg-[#FF9933]"></div>
              <p className="text-xl text-gray-600 leading-relaxed">
                {translations[language].homeContent.bhandaraText}
              </p>
              <Link to="/bhandara" className="btn-primary inline-flex items-center text-xl px-10 py-4">
                {language === 'en' ? 'Sponsor a Bhandara' : 'भंडारा प्रायोजित करें'} <ArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-[#4D2D0E] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-br from-[#FF9933]/10 to-[#2E7D32]/10 -skew-x-12 transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              {translations[language].homeContent.missionTitle}
            </h2>
            <div className="flex gap-2 mb-10">
              <div className="w-20 h-1.5 bg-[#FF9933]"></div>
              <div className="w-10 h-1.5 bg-[#2E7D32]"></div>
            </div>
            <p className="text-2xl text-orange-50 leading-relaxed mb-12 opacity-90">
              {translations[language].homeContent.missionText}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-orange-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FF9933] rounded-2xl rotate-3 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                  <Heart size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{language === 'en' ? 'Compassion' : 'करुणा'}</h4>
                  <p className="text-sm opacity-80">{language === 'en' ? 'Serving every soul with love' : 'हर जीव की प्रेम से सेवा'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2E7D32] rounded-2xl -rotate-3 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-900/20">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{language === 'en' ? 'Preservation' : 'संरक्षण'}</h4>
                  <p className="text-sm opacity-80">{language === 'en' ? 'Keeping Vedic wisdom alive' : 'वैदिक ज्ञान को जीवित रखना'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wall of Blessings */}
      <RecentActivity language={language} />

      {/* Trust Indicators */}
      <section className="py-16 bg-[#EDDDC7]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#FF9933] mb-2"><AnimatedCounter end={500} suffix="+" /></div>
            <div className="text-[#4D2D0E] font-medium">{language === 'en' ? 'Cows Protected' : 'गौ रक्षा'}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#FF9933] mb-2"><AnimatedCounter end={10000} suffix="+" /></div>
            <div className="text-[#4D2D0E] font-medium">{language === 'en' ? 'Happy Donors' : 'प्रसन्न दानदाता'}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#FF9933] mb-2"><AnimatedCounter end={50000} suffix="+" /></div>
            <div className="text-[#4D2D0E] font-medium">{language === 'en' ? 'Meals Served' : 'परोसा गया भोजन'}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#FF9933] mb-2"><AnimatedCounter end={100} suffix="+" /></div>
            <div className="text-[#4D2D0E] font-medium">{language === 'en' ? 'Gurukul Students' : 'गुरुकुल छात्र'}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
