import PeerCard from '../components/PeerCard.tsx';
import GroupCard from './GroupCard.tsx';

function HomeView() {
  return (
    <div id="HomeViewGrid" className="max-w-7xl mx-auto p-4">
      <div className="w-[812px] mx-auto grid grid-cols-4 gap-x-6 gap-y-4">
        {/* Row 1: 4 peer cards */}
        <div className="col-span-1">
          <PeerCard />
        </div>
        <div className="col-span-1">
          <PeerCard />
        </div>
        <div className="col-span-1">
          <PeerCard />
        </div>
        <div className="col-span-1">
          <PeerCard />
        </div>

        {/* Row 2: 1 peer card, 1 group card, 1 peer card */}
        <div className="col-span-1">
          <PeerCard />
        </div>
        {/* Make the group card span two columns (columns 2-3) */}
        <div className="col-span-2">
          <GroupCard />
        </div>
        <div className="col-span-1">
          <PeerCard />
        </div>

        {/* Row 3: 1 group card, 2 peer cards */}
        {/* Group card spanning two columns (columns 1-2) */}
        <div className="col-span-2">
          <GroupCard />
        </div>
        <div className="col-span-1">
          <PeerCard />
        </div>
        <div className="col-span-1">
          <PeerCard />
        </div>

        {/* Row 4: 2 group cards */}
        {/* First group card spans columns 1-2 */}
        <div className="col-span-2">
          <GroupCard />
        </div>
        {/* Second group card spans columns 3-4 */}
        <div className="col-span-2">
          <GroupCard />
        </div>
      </div>
    </div>
  );
}

export default HomeView;