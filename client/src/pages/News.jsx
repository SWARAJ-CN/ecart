import { ArrowRight, ChevronRight, Globe } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const COUNTRIES = [
  { code: '', name: 'All Countries' },
  { code: 'us', name: 'United States' },
  { code: 'in', name: 'India' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'it', name: 'Italy' },
  { code: 'es', name: 'Spain' },
  { code: 'jp', name: 'Japan' },
  { code: 'cn', name: 'China' },
  { code: 'kr', name: 'South Korea' },
  { code: 'ru', name: 'Russia' },
  { code: 'br', name: 'Brazil' },
  { code: 'mx', name: 'Mexico' },
  { code: 'za', name: 'South Africa' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'sg', name: 'Singapore' },
  { code: 'my', name: 'Malaysia' },
  { code: 'id', name: 'Indonesia' },
  { code: 'pk', name: 'Pakistan' },
  { code: 'bd', name: 'Bangladesh' },
  { code: 'lk', name: 'Sri Lanka' },
  { code: 'np', name: 'Nepal' },
];

export const STATES = [
  { code: '', name: 'All States' },
  { code: 'andhra-pradesh', name: 'Andhra Pradesh' },
  { code: 'arunachal-pradesh', name: 'Arunachal Pradesh' },
  { code: 'assam', name: 'Assam' },
  { code: 'bihar', name: 'Bihar' },
  { code: 'chhattisgarh', name: 'Chhattisgarh' },
  { code: 'goa', name: 'Goa' },
  { code: 'gujarat', name: 'Gujarat' },
  { code: 'haryana', name: 'Haryana' },
  { code: 'himachal-pradesh', name: 'Himachal Pradesh' },
  { code: 'jharkhand', name: 'Jharkhand' },
  { code: 'karnataka', name: 'Karnataka' },
  { code: 'kerala', name: 'Kerala' },
  { code: 'madhya-pradesh', name: 'Madhya Pradesh' },
  { code: 'maharashtra', name: 'Maharashtra' },
  { code: 'manipur', name: 'Manipur' },
  { code: 'meghalaya', name: 'Meghalaya' },
  { code: 'mizoram', name: 'Mizoram' },
  { code: 'nagaland', name: 'Nagaland' },
  { code: 'odisha', name: 'Odisha' },
  { code: 'punjab', name: 'Punjab' },
  { code: 'rajasthan', name: 'Rajasthan' },
  { code: 'sikkim', name: 'Sikkim' },
  { code: 'tamil-nadu', name: 'Tamil Nadu' },
  { code: 'telangana', name: 'Telangana' },
  { code: 'tripura', name: 'Tripura' },
  { code: 'uttar-pradesh', name: 'Uttar Pradesh' },
  { code: 'uttarakhand', name: 'Uttarakhand' },
  { code: 'west-bengal', name: 'West Bengal' },

  // Union Territories
  { code: 'andaman-and-nicobar', name: 'Andaman and Nicobar Islands' },
  { code: 'chandigarh', name: 'Chandigarh' },
  { code: 'dadra-and-nagar-haveli', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { code: 'delhi', name: 'Delhi' },
  { code: 'jammu-and-kashmir', name: 'Jammu and Kashmir' },
  { code: 'ladakh', name: 'Ladakh' },
  { code: 'lakshadweep', name: 'Lakshadweep' },
  { code: 'puducherry', name: 'Puducherry' },
];

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [nextPageToken, setNextPageToken] = useState(null);

  const fetchNews = useCallback(async (pageToken = null) => {
    setLoading(true);
    try {
      let url = `https://newsdata.io/api/1/latest?apikey=pub_5757258c5ca84715b2eeaf507a18d576&country=${selectedCountry}`;
      
      if (selectedRegion) {
        url += `&region=${selectedRegion}`;
      }
      if (pageToken) {
        url += `&page=${pageToken}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success' && data.results) {
        setNews(data.results);
        setNextPageToken(data.nextPage || null);
      } else {
        toast.error(data.results?.message || 'Failed to grab articles');
      }
    } catch (error) {
      console.error(error);
      toast.error('Unstable network connection');
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, selectedRegion]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleNextPage = () => {
    if (nextPageToken) {
      fetchNews(nextPageToken);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen md:py-24 bg-gray-100 text-gray-800 font-sans px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Header & Filter Row */}
      <div className="max-w-7xl mx-auto mb-10 border-b border-gray-200/80 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl flex flex-row gap-2 items-center font-bold tracking-tight text-gray-800 sm:text-4xl">
            <Globe size={35}/>
            Latest News Updates
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Stay informed with real-time news articles from around the world.
          </p>
        </div>

        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-gray-50 text-gray-800 text-sm font-medium rounded-2xl px-4 py-3 outline-none transition-all border border-gray-200/40 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.03),3px_3px_6px_#cacaca,-3px_-3px_6px_#ffffff] focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)] cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">State / Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-gray-50 text-gray-800 text-sm font-medium rounded-2xl px-4 py-3 outline-none transition-all border border-gray-200/40 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.03),3px_3px_6px_#cacaca,-3px_-3px_6px_#ffffff] focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)] cursor-pointer"
            >
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-3xl h-115 w-full border border-gray-100 shadow-[6px_6px_12px_#e6e6e6]" />
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-20 bg-gray-50/50 border border-dashed border-gray-300 rounded-3xl shadow-[inset_4px_4px_8px_#e0e0e0]">
          <p className="text-gray-400 font-medium text-lg">No news found matching these location targets.</p>
        </div>
      ) : (
        
        
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <div
              key={item.article_id}
              className="flex flex-col h-115 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[6px_6px_12px_#e6e6e6,-6px_-6px_12px_#ffffff] hover:shadow-[10px_10px_20px_#cfcfcf] transition-all duration-300 group"
            >
             
              <div className="relative w-full h-48 bg-gray-200 overflow-hidden shrink-0">
                <img
                  src={
                    item.image_url ||
                    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop';
                  }}
                />
               
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full border border-gray-100 text-gray-700 shadow-sm">
                  {item.source_name || 'Global News'}
                </span>
              </div>

            
              <div className="flex flex-col flex-1 p-6 justify-between overflow-hidden">
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-200 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-4 leading-relaxed font-normal">
                    {item.description || 'No description available for this article.'}
                  </p>
                </div>

                
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-medium">
                    {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : ''}
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group/link"
                  >
                    Read Article
                    <ArrowRight/>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      
      {!loading && nextPageToken && (
        <div className="max-w-7xl mx-auto flex justify-center pt-14">
          <button
            onClick={handleNextPage}
            className="flex cursor-pointer items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm tracking-wide transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-[4px_4px_12px_rgba(37,99,235,0.3)] group"
            >
              Load Next Page
              <ChevronRight/>
          </button>
        </div>
      )}
    </div>
  );
};

export default News;