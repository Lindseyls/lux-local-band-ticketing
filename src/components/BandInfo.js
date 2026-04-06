import parse from "html-react-parser";
import DOMPurify from "dompurify";

/**
 * Functional component that renders the band's image and description.
 * Displayed as the left column on the page.
 */
function BandInfo({ band = {} }) {
  const {
    description = "<p>Description not available</p>",
    imgUrl = "https://placehold.co/600x400/f66b97/000000",
    name = "Unknown band",
  } = band;

  let descriptionContent;

  // Sanitize and parse through the description JSON data which includes raw HTML.
  try {
    const cleanHtml = DOMPurify.sanitize(description);
    descriptionContent = parse(cleanHtml);
  } catch (error) {
    console.error("Error parsing band description: ", error);
    descriptionContent = "Invalid description format.";
  }

  return (
    <div className="band-info">
      <img src={imgUrl} alt={`Band: ${name}`} className="band-image" />
      <div className="band-description">{descriptionContent}</div>
    </div>
  );
}

export default BandInfo;
