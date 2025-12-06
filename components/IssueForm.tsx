import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Loader2, AlertCircle, Check, Mic, Square, Play, Volume2, Thermometer, Gauge } from 'lucide-react';
import { analyzeCarIssue, AnalysisResult } from '../services/geminiService';
import { Issue, CarDetails } from '../types';

interface IssueFormProps {
  onIssueCreated: (issue: Issue) => void;
}

const IssueForm: React.FC<IssueFormProps> = ({ onIssueCreated }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // Form State
  const [carDetails, setCarDetails] = useState<CarDetails>({ 
    make: '', model: '', year: '', mileage: '', climate: 'Temperate', drivingStyle: 'City/Highway Mix' 
  });
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Could not access microphone. Please enable permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data url prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !carDetails.make) return;

    setLoading(true);
    setStep('analyzing');

    try {
      let imageBase64 = undefined;
      let audioBase64 = undefined;
      
      if (imageFile) {
        imageBase64 = await blobToBase64(imageFile);
      }
      
      if (audioBlob) {
        audioBase64 = await blobToBase64(audioBlob);
      }

      const result = await analyzeCarIssue(
        description,
        carDetails,
        imageBase64,
        audioBase64
      );

      setAnalysisResult(result);
      
      const newIssue: Issue = {
        id: Date.now().toString(),
        userId: 'current-user',
        user: { id: 'u1', name: 'Alex Mechanic', avatar: 'https://picsum.photos/40/40', isPro: true },
        car: carDetails,
        title: `${carDetails.make} ${carDetails.model} Issue`,
        description: description,
        imageUrl: previewUrl || undefined,
        audioUrl: audioUrl || undefined,
        status: 'Open',
        severity: result.urgency as 'Low'|'Medium'|'High',
        aiDiagnosis: result.diagnosis,
        confidenceScore: result.confidenceScore,
        identifiedParts: result.identifiedParts,
        maintenanceInsights: result.maintenanceInsights,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0
      };

      onIssueCreated(newIssue);
      setStep('result');
    } catch (error) {
      console.error(error);
      alert('Analysis failed. Please try again.');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('input');
    setDescription('');
    setImageFile(null);
    setPreviewUrl(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setAnalysisResult(null);
  };

  if (step === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-dark-800 rounded-2xl border border-dark-700 text-center p-8">
        <div className="relative">
          <div className="absolute inset-0 bg-neon-blue blur-xl opacity-20 animate-pulse"></div>
          <Loader2 size={64} className="text-neon-blue animate-spin relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-2">Analyzing Sensory Data...</h2>
        <p className="text-gray-400 max-w-md">Processing audio frequencies, visual components, and historical failure patterns for your {carDetails.make}.</p>
      </div>
    );
  }

  if (step === 'result' && analysisResult) {
    return (
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-dark-900 to-dark-800 p-6 border-b border-dark-600 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              analysisResult.urgency === 'High' ? 'bg-red-500/20 text-red-500' :
              analysisResult.urgency === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
              'bg-emerald-500/20 text-emerald-500'
            }`}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Diagnosis Complete</h2>
              <p className="text-sm text-gray-400">Confidence Score: <span className="text-neon-blue font-bold">{analysisResult.confidenceScore}%</span></p>
            </div>
          </div>
          <button 
            onClick={resetForm}
            className="text-sm text-gray-400 hover:text-white underline"
          >
            New Scan
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Diagnosis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-dark-900/50 p-5 rounded-xl border border-dark-600">
              <h3 className="text-lg font-bold text-white mb-3">Probable Cause</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{analysisResult.diagnosis}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-900/30 p-4 rounded-xl border border-dark-700">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Potential Causes</h4>
                <ul className="space-y-2">
                  {analysisResult.potentialCauses.map((cause, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 bg-neon-blue rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-dark-900/30 p-4 rounded-xl border border-dark-700">
                 <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Recommended Action</h4>
                 <p className="text-sm text-gray-300">{analysisResult.recommendedAction}</p>
              </div>
            </div>

             {/* RUL Section */}
             {analysisResult.maintenanceInsights && analysisResult.maintenanceInsights.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Component Lifespan (RUL)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.maintenanceInsights.map((insight, idx) => (
                    <div key={idx} className="bg-dark-700/30 p-4 rounded-xl border border-dark-600">
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-bold text-white">{insight.partName}</span>
                         <span className="text-xs bg-dark-900 px-2 py-1 rounded text-gray-400">Est. Cost: {insight.replacementCost}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-neon-green">
                         <Gauge size={16} />
                         <span className="font-mono font-bold">{insight.estimatedRUL} remaining</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Visuals & Audio */}
          <div className="space-y-6">
             {previewUrl && (
              <div className="bg-dark-900 rounded-xl overflow-hidden border border-dark-600">
                <div className="p-3 border-b border-dark-700">
                   <h4 className="text-xs font-bold text-gray-400 uppercase">Visual Identification</h4>
                </div>
                <div className="relative">
                  <img src={previewUrl} alt="Analyzed" className="w-full h-auto" />
                  {/* Overlay simulating part identification highlights */}
                  {analysisResult.identifiedParts.length > 0 && (
                     <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 backdrop-blur-sm">
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.identifiedParts.map((part, i) => (
                            <span key={i} className="text-xs text-white bg-neon-blue/20 border border-neon-blue/50 px-2 py-1 rounded-full">
                              {part.name}
                            </span>
                          ))}
                        </div>
                     </div>
                  )}
                </div>
              </div>
            )}
            
            {audioUrl && (
               <div className="bg-dark-900 rounded-xl p-4 border border-dark-600">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center">
                    <Volume2 size={14} className="mr-2" /> Acoustic Sample
                  </h4>
                  <audio controls src={audioUrl} className="w-full h-8 opacity-80" />
               </div>
            )}

            <div className="bg-gradient-to-br from-neon-blue/10 to-transparent p-4 rounded-xl border border-neon-blue/20">
               <h4 className="font-bold text-white mb-2 text-sm">Need Parts?</h4>
               <p className="text-xs text-gray-400 mb-3">Order compatible parts directly based on this diagnosis.</p>
               <button className="w-full py-2 bg-dark-800 hover:bg-dark-700 text-neon-blue text-xs font-bold border border-dark-600 rounded-lg transition-colors">
                 Find Parts for {carDetails.year} {carDetails.model}
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 md:p-8">
        <div className="mb-8">
           <h2 className="text-2xl font-bold text-white mb-2">AI Mechanic Diagnostics</h2>
           <p className="text-gray-400 text-sm">Enter details, upload photos, or record engine sounds for a comprehensive analysis.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Vehicle Context */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neon-blue uppercase tracking-wider flex items-center">
              <span className="bg-neon-blue/10 p-1 rounded mr-2"><Gauge size={14} /></span>
              Vehicle Context
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Make & Model</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Toyota"
                    required
                    className="w-1/2 bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                    value={carDetails.make}
                    onChange={e => setCarDetails({...carDetails, make: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Camry"
                    required
                    className="w-1/2 bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                    value={carDetails.model}
                    onChange={e => setCarDetails({...carDetails, model: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Year</label>
                <input 
                  type="number" 
                  placeholder="2018"
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                  value={carDetails.year}
                  onChange={e => setCarDetails({...carDetails, year: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Mileage</label>
                <input 
                  type="text" 
                  placeholder="85,000"
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                  value={carDetails.mileage}
                  onChange={e => setCarDetails({...carDetails, mileage: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Climate / Region</label>
                <select 
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
                  value={carDetails.climate}
                  onChange={e => setCarDetails({...carDetails, climate: e.target.value})}
                >
                  <option>Temperate</option>
                  <option>Hot & Dry</option>
                  <option>Cold & Snowy</option>
                  <option>Coastal / Salty</option>
                  <option>Tropical / Humid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Driving Style</label>
                <select 
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
                  value={carDetails.drivingStyle}
                  onChange={e => setCarDetails({...carDetails, drivingStyle: e.target.value})}
                >
                  <option>City/Highway Mix</option>
                  <option>Mostly City (Stop & Go)</option>
                  <option>Mostly Highway</option>
                  <option>Aggressive / Sport</option>
                  <option>Off-road / Towing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Symptoms */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neon-blue uppercase tracking-wider flex items-center">
              <span className="bg-neon-blue/10 p-1 rounded mr-2"><AlertCircle size={14} /></span>
              Symptoms & Sensory Data
            </h3>
            
            <textarea 
              rows={3}
              placeholder="Describe what's wrong (e.g., 'Squealing noise when turning left', 'Smells like burnt rubber', 'Vibration at 60mph')"
              required
              className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors resize-none"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Audio Recorder */}
              <div className="border border-dark-600 rounded-xl p-4 bg-dark-900/30">
                <label className="block text-xs font-medium text-gray-400 mb-3 flex items-center justify-between">
                  <span>Record Engine/Noise</span>
                  {isRecording && <span className="text-red-500 animate-pulse text-[10px] uppercase font-bold">● Recording</span>}
                </label>
                
                {!audioUrl ? (
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all ${
                        isRecording 
                          ? 'bg-red-500/20 text-red-500 border border-red-500/50' 
                          : 'bg-dark-800 text-white border border-dark-600 hover:bg-dark-700'
                      }`}
                    >
                      {isRecording ? <Square size={18} /> : <Mic size={18} />}
                      <span>{isRecording ? 'Stop Recording' : 'Record Sound'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 bg-dark-800 p-2 rounded-lg border border-dark-600">
                    <button 
                      type="button" 
                      onClick={() => { setAudioBlob(null); setAudioUrl(null); }}
                      className="p-2 text-gray-400 hover:text-red-400"
                    >
                      <Square size={16} />
                    </button>
                    <audio src={audioUrl} controls className="h-8 w-full" />
                  </div>
                )}
                <p className="text-[10px] text-gray-500 mt-2">Record near the engine bay or source of noise (approx. 10-15s).</p>
              </div>

              {/* Photo Upload */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-dark-900/30 ${
                  previewUrl ? 'border-neon-blue' : 'border-dark-600 hover:border-gray-400 hover:bg-dark-700'
                }`}
              >
                {previewUrl ? (
                  <div className="relative w-full h-24 flex items-center justify-center">
                    <img src={previewUrl} alt="Preview" className="h-full object-contain rounded" />
                    <div className="absolute top-0 right-0 bg-black/70 p-1 rounded-full">
                       <Check size={12} className="text-neon-green" />
                    </div>
                  </div>
                ) : (
                  <>
                    <Camera size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-300 font-medium">Upload Photo</span>
                  </>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
             <button 
               type="submit"
               disabled={loading}
               className="w-full bg-neon-blue hover:bg-white text-dark-900 font-bold text-lg py-4 rounded-xl shadow-lg shadow-neon-blue/10 transition-all flex items-center justify-center space-x-2"
             >
               {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
               <span>{loading ? 'Analyzing...' : 'Diagnose with AI'}</span>
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueForm;