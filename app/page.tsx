/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import Wrapper from "./components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserInfo } from "./server";
import { Copy, Plus } from "lucide-react";
import socialLinksData from "./socialLinksData";

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

  async function fetchLinks() {
    try {
      const userInfo = await getUserInfo(email);
      if (userInfo) {
        setPseudo(userInfo?.pseudo);
        setTheme(userInfo?.theme);
      }
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
                  name=""
                  onChange={(e) => setSocialPseudo(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Entrez l'URL social"
                  className="input input-bordered w-full"
                  value={link}
                  name=""
                  onChange={(e) => setLink(e.target.value)}
                />

                <button className="btn btn-accent">Ajouter</button>
              </div>
            </div>
          </dialog>
        </div>

        <div className="md:w-1/3 ml-4"></div>
      </div>
    </Wrapper>
  );
}
