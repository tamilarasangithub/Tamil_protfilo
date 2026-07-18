const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'AdminDashboard.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Remove mockAnalyticsData array
content = content.replace(/const mockAnalyticsData = \[\s*\{ name: 'Mon'[\s\S]*?\];\s*/, '');

// Import getDoc from firestore if not there
if (!content.includes('getDoc')) {
  content = content.replace(/import \{ doc, setDoc \} from 'firebase\/firestore';/, "import { doc, setDoc, getDoc } from 'firebase/firestore';");
}

// Add state and useEffect for analyticsData inside AdminDashboard function
const analyticsStateHook = `
  const [analyticsData, setAnalyticsData] = useState([
    { name: 'Mon', visitors: 0 },
    { name: 'Tue', visitors: 0 },
    { name: 'Wed', visitors: 0 },
    { name: 'Thu', visitors: 0 },
    { name: 'Fri', visitors: 0 },
    { name: 'Sat', visitors: 0 },
    { name: 'Sun', visitors: 0 }
  ]);

  useEffect(() => {
    if (!state.loggedIn) return;
    
    const fetchAnalytics = async () => {
      try {
        const analyticsDoc = await getDoc(doc(db, 'portfolio', 'analytics'));
        const data = analyticsDoc.exists() ? analyticsDoc.data() : {};
        
        const dates = Array.from({length: 7}).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split('T')[0];
        });
        
        const chartData = dates.map(dateStr => {
          const dateObj = new Date(dateStr);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          return {
            name: dayName,
            visitors: data[dateStr] || 0
          };
        });
        
        setAnalyticsData(chartData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };
    
    fetchAnalytics();
  }, [state.loggedIn]);
`;

// Insert after const [feedback, setFeedback] = useState('');
content = content.replace(
  /const \[feedback, setFeedback\] = useState\(''\);/,
  `const [feedback, setFeedback] = useState('');${analyticsStateHook}`
);

// Update AreaChart data prop
content = content.replace(
  /<AreaChart data=\{mockAnalyticsData\}/g,
  `<AreaChart data={analyticsData}`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully replaced mock analytics with real analytics.');
