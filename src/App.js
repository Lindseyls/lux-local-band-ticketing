import { useEffect, useState } from "react";
import BandTicketForm from "./components/BandTicketForm";
import { supabase } from "./supabaseClient";

function App() {
  const [bands, setBands] = useState([]);
  const [selectedBandIndex, setSelectedBandIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBandData = async () => {
      try {
        const { data, error } = await supabase
          .from("bands")
          .select("*, ticket_types(*)");

        if (error) throw error;

        // Transform snake_case from Supabase to camelCase for React components
        const transformed = data.map((band) => ({
          ...band,
          ticketTypes: band.ticket_types,
          imgUrl: band.image_url,
        }));

        setBands(transformed);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBandData();
  }, []);

  if (loading) return <p>Loading bands...</p>;
  if (bands.length === 0) return <p>No bands available</p>;

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header-content">
          <h1 className="site-logo">LUX</h1>
          <p className="site-tagline">
            Local User Experience — Supporting local venues & independent
            artists
          </p>
        </div>
      </header>
      <BandTicketForm
        band={bands[selectedBandIndex]}
        bandOptions={bands}
        selectedIndex={selectedBandIndex}
        onBandChange={setSelectedBandIndex}
      />
    </div>
  );
}

export default App;
