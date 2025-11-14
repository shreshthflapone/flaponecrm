import { HiExternalLink } from "react-icons/hi";
import { Link } from "react-router-dom";
const WebsiteUrl= ({url}) =>{

return (
<div class="link-sticky box-center br50 fs18 fc3 bg1">
  <Link
    to={url}
    target="_blank"
  >
    <HiExternalLink className="fc3" />
  </Link>
</div>);
};
export default WebsiteUrl;
