import React, { useEffect, useState } from 'react'
import { Nav } from 'react-bootstrap';
import Playing11Selection from '../Playing11Selection';
import PlayerPerformance from '../PlayerPerformance';
import HeadToHead from '../HeadToHead';

const ReportsAndManagement = () => {
  const [activeTab, setActiveTab] = useState('playing11');
  return (
    <div>
      <Nav className="justify-content-center" activeKey={activeTab} onSelect={(e)=>setActiveTab(e)}>
        <Nav.Item>
          <Nav.Link eventKey="playing11">Playing11 Selection</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="PlayerPerfo">Player performance</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="HeadToHead">Head To Head</Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === 'playing11' && <Playing11Selection />}
      {activeTab === 'PlayerPerfo' && <PlayerPerformance />}
      {activeTab === 'HeadToHead' && <HeadToHead />}
      
    </div>
  )
}

export default ReportsAndManagement;
