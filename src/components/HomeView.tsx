import { useEffect, useState } from 'react';
import PeerCard from '../components/PeerCard.tsx';
import GroupCard from './GroupCard.tsx';

// Mock function to fetch data from the database
const fetchData = async () => {
  return [
    { type: 'peer', id: 1, name: 'Joseph Schmo', profilePicture: '/JohnPork.png' },
    { type: 'peer', id: 2, name: 'Jane Doe', profilePicture: '/JohnPork.png' },
    { type: 'peer', id: 3, name: 'John Smith', profilePicture: '/JohnPork.png' },
    { type: 'peer', id: 4, name: 'Alice Johnson', profilePicture: '/JohnPork.png' },
    { type: 'peer', id: 5, name: 'Bob Brown', profilePicture: '/JohnPork.png' },
    { type: 'group', id: 6, name: 'Group A', description: 'This is Group A. It is a great group with many interesting activities and members.', profilePicture: '/JohnPork.png' },
    { type: 'peer', id: 7, name: 'Charlie Davis', profilePicture: '/JohnPork.png' },
    { type: 'group', id: 8, name: 'Group B', description: 'This is Group B. It is known for its collaborative projects and friendly environment.', profilePicture: '/JohnPork.png' },
    { type: 'peer', id: 9, name: 'David Evans', profilePicture: '/JohnPork.png' },
    { type: 'peer', id: 10, name: 'Eve Foster', profilePicture: '/JohnPork.png' },
    { type: 'group', id: 11, name: 'Group C', description: 'This is Group C. Members of this group are very active and participate in various events.', profilePicture: '/JohnPork.png' },
    { type: 'group', id: 12, name: 'Group D', description: 'This is Group D. It is a diverse group with members from different backgrounds and interests.', profilePicture: '/JohnPork.png' },
  ];
};

function HomeView() {
  const [data, setData] = useState<{ type: string; id: number; name: string; profilePicture?: string; description?: string }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };
    loadData();
  }, []);

  return (
    <div id="HomeViewGrid" className="max-w-7xl mx-auto p-4">
      <div className="w-[812px] mx-auto grid grid-cols-4 gap-x-6 gap-y-4">
        {data.map((item) => {
          if (item.type === 'peer') {
            return (
              <div key={item.id} className="col-span-1">
                <PeerCard name={item.name} profilePicture={item.profilePicture || '/JohnPork.png'} />
              </div>
            );
          } else if (item.type === 'group') {
            return (
              <div key={item.id} className="col-span-2">
                <GroupCard name={item.name} description={item.description || 'error'} profilePicture={item.profilePicture || '/JohnPork.png'} />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default HomeView;