import React from 'react';
import { MessageSquare, ThumbsUp, MapPin } from 'lucide-react';
import { Issue } from '../types';

interface CommunityFeedProps {
  issues: Issue[];
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ issues }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Community Garage</h2>
        <div className="flex space-x-2">
           <select className="bg-dark-800 text-white text-sm border border-dark-600 rounded-lg px-3 py-2 outline-none">
             <option>Latest</option>
             <option>Top Rated</option>
             <option>Unsolved</option>
           </select>
        </div>
      </div>

      <div className="space-y-4">
        {issues.map((issue) => (
          <div key={issue.id} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 transition-all hover:border-dark-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img src={issue.user.avatar} alt={issue.user.name} className="w-10 h-10 rounded-full border border-dark-600" />
                <div>
                  <h4 className="text-sm font-bold text-white">{issue.user.name}</h4>
                  <p className="text-xs text-gray-500">{issue.car.year} {issue.car.make} {issue.car.model} • {new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border ${
                issue.status === 'Solved' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
              }`}>
                {issue.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{issue.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{issue.description}</p>

            {issue.aiDiagnosis && (
              <div className="bg-dark-900/50 p-4 rounded-xl border-l-4 border-neon-blue mb-4">
                <p className="text-xs font-bold text-neon-blue mb-1">AI INSIGHT</p>
                <p className="text-sm text-gray-300 line-clamp-2">
                   {issue.aiDiagnosis.split('\n')[0].replace('## Diagnosis', '').trim() || "See details for diagnosis..."}
                </p>
              </div>
            )}

            {issue.imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden h-48 w-full bg-dark-900">
                <img src={issue.imageUrl} alt="Car Part" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-dark-700">
               <div className="flex space-x-4">
                 <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                   <ThumbsUp size={16} />
                   <span className="text-xs">{issue.likes}</span>
                 </button>
                 <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                   <MessageSquare size={16} />
                   <span className="text-xs">{issue.comments} Comments</span>
                 </button>
               </div>
               <div className="flex items-center text-gray-500 text-xs">
                 <MapPin size={12} className="mr-1" />
                 <span>Global</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;