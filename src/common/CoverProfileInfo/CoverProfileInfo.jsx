import { SocialIconLinks } from "@/common/CoverProfileInfo/SocialIconLinks";
import { useFetchCoverInfo } from "@/src/hooks/useFetchCoverInfo";
import { ProjectImage } from "./ProjectImage";
import { ProjectName } from "./ProjectName";
import { ProjectStatusIndicator } from "./ProjectStatusIndicator";
import { ProjectWebsiteLink } from "./ProjectWebsiteLink";

export const CoverProfileInfo = ({ imgSrc, projectName, links, coverKey }) => {
  const { status, activeIncidentDate } = useFetchCoverInfo({ coverKey });

  return (
    <div className="flex">
      <div>
        <ProjectImage imgSrc={imgSrc} name={projectName} />
      </div>
      <div className="p-3"></div>
      <div>
        <div className="flex items-center">
          <ProjectName name={projectName} />
          <ProjectStatusIndicator
            coverKey={coverKey}
            status={status}
            incidentDate={activeIncidentDate}
          />
        </div>
        <ProjectWebsiteLink website={links?.website} />
        <SocialIconLinks links={links} />
      </div>
    </div>
  );
};
