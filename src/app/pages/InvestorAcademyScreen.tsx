import { ArrowLeft, Play, Award, BookOpen, TrendingUp, Home } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function InvestorAcademyScreen() {
  const navigate = useNavigate();

  const featuredCourse = {
    title: 'Caribbean Real Estate Investment 101',
    description: 'Learn the fundamentals of property investment in the Caribbean diaspora',
    duration: '2h 45m',
    lessons: 12,
    progress: 35,
    thumbnail: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
    badge: 'Property Expert',
  };

  const categories = [
    {
      name: 'Business Basics',
      icon: TrendingUp,
      color: '#0A5C7A',
      courses: [
        {
          title: 'Starting Your First Business',
          duration: '1h 30m',
          progress: 60,
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
          badge: 'Entrepreneur',
        },
        {
          title: 'Financial Planning Fundamentals',
          duration: '2h 15m',
          progress: 0,
          thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
          badge: 'Money Master',
        },
        {
          title: 'Marketing for Small Businesses',
          duration: '1h 45m',
          progress: 25,
          thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400',
          badge: 'Brand Builder',
        },
      ],
    },
    {
      name: 'Real Estate in the Caribbean',
      icon: Home,
      color: '#D4AF37',
      courses: [
        {
          title: 'Property Investment Guide',
          duration: '2h 30m',
          progress: 0,
          thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
          badge: 'Property Pro',
        },
        {
          title: 'Tourism Real Estate Opportunities',
          duration: '1h 50m',
          progress: 0,
          thumbnail: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
          badge: 'Tourism Expert',
        },
      ],
    },
    {
      name: 'Understanding Dividends',
      icon: Award,
      color: '#475569',
      courses: [
        {
          title: 'Dividend Investing Basics',
          duration: '1h 20m',
          progress: 80,
          thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400',
          badge: 'Dividend Master',
        },
        {
          title: 'Building Passive Income',
          duration: '2h 00m',
          progress: 15,
          thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400',
          badge: 'Income Builder',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="relative h-[400px]">
        <ImageWithFallback
          src={featuredCourse.thumbnail}
          alt={featuredCourse.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent"></div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-8 left-6 right-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm uppercase tracking-wide">Featured Course</span>
          </div>
          <h1 className="text-white text-2xl mb-2">{featuredCourse.title}</h1>
          <p className="text-white/80 text-sm mb-4">{featuredCourse.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-white/80 text-sm">{featuredCourse.lessons} lessons</span>
            <span className="text-white/80">•</span>
            <span className="text-white/80 text-sm">{featuredCourse.duration}</span>
          </div>

          {featuredCourse.progress > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/80">{featuredCourse.progress}% Complete</span>
                <span className="text-[#D4AF37]">Continue watching</span>
              </div>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B]"
                  style={{ width: `${featuredCourse.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button className="w-full bg-white text-[#0F172A] py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl">
            <Play className="w-5 h-5" />
            <span>{featuredCourse.progress > 0 ? 'Continue Learning' : 'Start Course'}</span>
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <category.icon className="w-5 h-5" style={{ color: category.color }} />
              </div>
              <h3 className="text-white text-lg">{category.name}</h3>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
              {category.courses.map((course, courseIndex) => (
                <div
                  key={courseIndex}
                  className="flex-shrink-0 w-[280px] bg-[#1E293B] rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="relative h-40">
                    <ImageWithFallback
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                        <Play className="w-6 h-6 text-[#0F172A] ml-1" />
                      </div>
                    </div>
                    {course.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div
                          className="h-full bg-[#D4AF37]"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="text-white mb-2 line-clamp-2">{course.title}</h4>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/60 text-sm">{course.duration}</span>
                      {course.progress > 0 && (
                        <span className="text-[#D4AF37] text-xs">{course.progress}%</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <Award className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-white/80 text-xs">Earn: {course.badge}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-br from-[#0A5C7A] to-[#0D9488] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white mb-1">Your Learning Path</h3>
              <p className="text-white/80 text-sm">3 badges earned • 5 courses in progress</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['Entrepreneur', 'Money Master', 'Dividend Master'].map((badge, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20"
              >
                <Award className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                <p className="text-white text-xs">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
