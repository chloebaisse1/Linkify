/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import Wrapper from "./components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addSocialLink,
  getSocialLinks,
  getUserInfo,
  removeSocialLink,
} from "./server";
import { Copy, Plus } from "lucide-react";
import socialLinksData from "./socialLinksData";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import { SocialLink } from "@prisma/client";
import EmptyState from "./components/EmptyState";
import LinkComponent from "./components/LinkComponent";

const truncateLink = (url: string, maxLength: number) => {
  return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
};

export default function Home() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const [pseudo, setPseudo] = useState<string | null | undefined>(null);
  const [theme, setTheme] = useState<string | null | undefined>(null);
  const [link, setLink] = useState<string>("");
  const [socialPseudo, setSocialPseudo] = useState<string>("");
  const [title, setTitle] = useState<string>(socialLinksData[0].name);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchLinks() {
    try {
      const userInfo = await getUserInfo(email);
      if (userInfo) {
        setPseudo(userInfo?.pseudo);
        setTheme(userInfo?.theme);
      }

      const fetchedLinks = await getSocialLinks(email);
      if (fetchedLinks) {
        setLinks(fetchedLinks);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors de la récupération des informations");
    }
  }

  useEffect(() => {
    if (email) {
      fetchLinks();
    }
  }, [email]);

  const copyToClickBoard = () => {
    const url = `http://localhost:3000/page/${pseudo}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("URL copiée dans le presse papier"))
      .catch((err) => console.error("Erreur lors de la copie", err));
  };

  const isValidURL = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return (
        parseUrl(url).protocol === "http:" ||
        parseUrl(url).protocol === "https:"
      );
    } catch {
      return false;
    }
  };

  const handleAddLink = async () => {
    if (!isValidURL(link)) {
      toast.info("L'URL n'est pas valide");
      return;
    }
    if (!socialPseudo) {
      toast.info("Le pseudo n'est pas valide");
      return;
    }

    const selectedtitle = socialLinksData.find((l) => l.name === title);
    if (selectedtitle?.root && selectedtitle?.altRoot) {
      if (
        !link.startsWith(selectedtitle?.root) &&
        !link.startsWith(selectedtitle?.altRoot)
      ) {
        toast.info(
          `L'URL doit commencer par ${selectedtitle.root} ou par ${selectedtitle.altRoot}`
        );
        return;
      }
    }
    try {
      const newLink = await addSocialLink(email, title, link, socialPseudo);
      const modal = document.getElementById(
        "social_link_form"
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
      if (newLink) {
        setLinks([...links, newLink]);
      }

      setLink("");
      setSocialPseudo("");
      setTitle(socialLinksData[0].name);
      toast.success("Lien ajouté avec succès");
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveLink = async (linkId: string) => {
    try {
      await removeSocialLink(email, linkId);
      setLinks(links.filter((link) => link.id !== linkId));
      toast.success("Lien supprimé avec succès");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3">
          <div className="flex justify-between items-center bg-base-200 p-5 rounded-3xl">
            <div>
              <span>Ta page est prête 🔥 </span>
              <Link
                className="link hidden md:flex font-bold"
                href={`http://localhost:3000/page/${pseudo}`}
              >
                http://localhost:3000/page/{pseudo}
              </Link>

              <Link
                className="link flex md:hidden font-bold"
                href={`http://localhost:3000/page/${pseudo}`}
              >
                {truncateLink(`http://localhost:3000/page/`, 20)}
                {pseudo}
              </Link>
            </div>

            <button className="btn btn-sm btn-ghost" onClick={copyToClickBoard}>
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* You can open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn btn-sm w-full my-4"
            onClick={() =>
              (
                document.getElementById("social_link_form") as HTMLDialogElement
              ).showModal()
            }
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>

          <dialog id="social_link_form" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Nouveau lien</h3>
              <p className="py-4">
                Ajoutez vos liens publics pour les partager facilement
              </p>

              <div className="grid grid-cols-2 gap-2">
                <select
                  className="select select-bordered"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                >
                  {socialLinksData.map(({ name }) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Entrez votre pseudo social"
                  className="input input-bordered w-full"
                  value={socialPseudo}
                  onChange={(e) => setSocialPseudo(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Entrez l'URL social"
                  className="input input-bordered w-full"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />

                <button className="btn btn-accent" onClick={handleAddLink}>
                  Ajouter
                </button>
              </div>
            </div>
          </dialog>

          {loading ? (
            <div className="my-30 flex justify-center items-center w-full">
              <span className="loading loading-spinner loading-xl text-accent"></span>
            </div>
          ) : links.length === 0 ? (
            <div className="flex justify-center items-center w-full">
              <EmptyState
                IconComponent={"AudioLines"}
                message={"Aucuns liens disponible"}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <LinkComponent
                  key={link.id}
                  socialLink={link}
                  onRemove={handleRemoveLink}
                  readOnly={false}
                  fetchLinks={fetchLinks}
                />
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/3 ml-4"></div>
      </div>
    </Wrapper>
  );
}
