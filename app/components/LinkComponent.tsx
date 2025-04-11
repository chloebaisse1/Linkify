import { SocialLink } from "@prisma/client";
import { ChartColumnIncreasing, PencilIcon, Trash } from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";
import { SocialIcon } from "react-social-icons";
import { toggleSocialLinkActive } from "../server";
import { toast } from "react-toastify";

interface LinkComponentProps {
  socialLink: SocialLink;
  onRemove?: (id: string) => void;
  readOnly?: boolean;
  fetchLinks?: () => void;
}

const truncateLink = (url: string, maxLength: number) => {
  return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
};

const LinkComponent: FC<LinkComponentProps> = ({
  socialLink,
  onRemove,
  readOnly,
  fetchLinks,
}) => {
  const [isActive, setIsActive] = useState(socialLink.active);

  const handleToggleActive = async () => {
    try {
      await toggleSocialLinkActive(socialLink.id);
      setIsActive(!isActive);
      fetchLinks?.();
      toast.success("Lien activé");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {readOnly ? (
        <div>user</div>
      ) : (
        <div className="flex flex-col space-y-2 w-full bg-base-200 p-6 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="badge">@{socialLink.pseudo}</span>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={isActive}
              onChange={handleToggleActive}
            />
          </div>

          <>
            <div className="flex items-center gap-2">
              <SocialIcon
                url={socialLink.url}
                style={{ width: 30, height: 30 }}
              />
              <span className="badge badge-accent">{socialLink.title}</span>
              <Link className="link md:hidden" href={socialLink.url}>
                {truncateLink(socialLink.url, 30)}
              </Link>
              <Link className="link hidden md:flex" href={socialLink.url}>
                {socialLink.url}
              </Link>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center">
                <ChartColumnIncreasing className="w-4 h-4" strokeWidth={1} />
                <span className="ml-2">0 clics</span>
              </div>

              <div>
                <button className="btn btn-sm btn-ghost">
                  <PencilIcon className="w-4 h-4" strokeWidth={1} />
                </button>

                <button className="btn btn-sm btn-ghost">
                  <Trash className="w-4 h-4" strokeWidth={1} />
                </button>
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default LinkComponent;
