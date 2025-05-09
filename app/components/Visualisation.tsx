import { SocialLink } from "@prisma/client";
import React from "react";
import Avatar from "./Avatar";
import LinkComponent from "./LinkComponent";
import EmptyState from "./EmptyState";

interface VisualisationProps {
  socialLinks: SocialLink[];
  pseudo: string;
  theme: string;
}

const Visualisation: React.FC<VisualisationProps> = ({
  socialLinks,
  pseudo,
  theme,
}) => {
  const activeLinks = socialLinks.filter((link) => link.active);

  return (
    <div className="mockup-browser bg-base-200 hidden md:block">
      <div className="mockup-browser-toolbar">
        <div className="input">
          <span className="text-sm">http://localhost:3000/page/{pseudo}</span>
        </div>
      </div>

      <div
        data-theme={`${theme}`}
        className="h-full bg-base-100 flex flex-col items-center justify-center space-y-2 p-5"
      >
        <Avatar pseudo={pseudo} />
        <div className="w-full">
          {activeLinks.length > 0 ? (
            <div className="w-full space-y-2">
              {activeLinks.map((link) => (
                <LinkComponent
                  key={link.id}
                  socialLink={link}
                  readOnly={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center w-full">
              <EmptyState
                IconComponent={"AudioLines"}
                message={"Aucuns liens disponible"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualisation;
