import { Issue } from './types';

export const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    userId: 'u2',
    user: { id: 'u2', name: 'Sarah Driver', avatar: 'https://picsum.photos/40/40?random=1', isPro: false },
    car: { make: 'Honda', model: 'Civic', year: '2019', mileage: '45000' },
    title: 'Weird rattling noise from engine',
    description: 'There is a consistent rattling noise coming from the passenger side of the engine bay when idling. It goes away when I accelerate.',
    status: 'Solved',
    severity: 'Medium',
    aiDiagnosis: 'Likely a loose heat shield or serpentine belt tensioner pulley based on the "rattling at idle" description.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    likes: 12,
    comments: 4,
    imageUrl: 'https://picsum.photos/600/400?random=1'
  },
  {
    id: '2',
    userId: 'u3',
    user: { id: 'u3', name: 'Mike Fixit', avatar: 'https://picsum.photos/40/40?random=2', isPro: true },
    car: { make: 'Ford', model: 'F-150', year: '2015', mileage: '120000' },
    title: 'Check Engine Light - Code P0300',
    description: 'Got a random misfire code. Truck feels sluggish going uphill.',
    status: 'Open',
    severity: 'High',
    aiDiagnosis: 'P0300 indicates random/multiple cylinder misfire. Common causes for F-150s of this year include worn spark plugs, ignition coils, or vacuum leaks.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    likes: 5,
    comments: 8
  }
];