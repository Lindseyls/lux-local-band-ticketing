import BandInfo from "./BandInfo";
import TicketForm from "./TicketForm";
import { RiCalendar2Fill } from "react-icons/ri";
import { MdLocationOn } from "react-icons/md";

/**
 * Functional component that includes the current band's
 * header along with two panels with the band's information (left)
 * and the purchase ticket form (right).
 */
function BandTicketForm({
  band = {},
  bandOptions = [],
  selectedIndex = 0,
  onBandChange = () => {},
}) {
  const {
    id,
    date = "Date TBD",
    location = "Unknown location",
    name = "Unknown band",
    ticketTypes = [],
  } = band;

  // Gracefully handle any invalid dates.
  let formattedDate = "Date TBD";
  const eventDate = new Date(date);
  // Options requesting a weekday along with a long date (e.g. Monday, February 11th).
  if (eventDate instanceof Date && !isNaN(eventDate.getTime())) {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    formattedDate = eventDate.toLocaleDateString(
      navigator.language || "en-US",
      options,
    );
  }

  return (
    <div className="band-ticket-form-container">
      <header className="band-header">
        <select
          className="band-title-select"
          value={selectedIndex}
          onChange={(e) => onBandChange(parseInt(e.target.value, 10))}
          title="Select a band"
          aria-label="Select a band"
        >
          {bandOptions.map((band, idx) => (
            <option key={band.id ?? band.name ?? `band-${idx}`} value={idx}>
              {band.name || "Unknown band"}
            </option>
          ))}
        </select>

        <div className="date">
          <RiCalendar2Fill className="date-icon" />
          <p>{formattedDate}</p>
        </div>

        <div className="location">
          <MdLocationOn className="location-icon" />
          <p>{location}</p>
        </div>
      </header>

      <div className="band-columns">
        {/* Left Column */}
        <div className="band-info-column">
          <BandInfo band={band} />
        </div>
        {/* Right Column */}
        <div className="ticket-form-column">
          <TicketForm
            bandId={id}
            bandName={name}
            ticketTypes={ticketTypes ?? []}
          />
        </div>
      </div>
    </div>
  );
}

export default BandTicketForm;
